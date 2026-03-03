terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 4.6.0"
    }

    aws = {
      source  = "hashicorp/aws"
      version = "6.33.0"
    }
  }

  cloud {
    organization = "ryota-abe-terraform"
    workspaces {
      name = "cook-scan"
    }
  }
}

# Vercel
provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.team_id
}

resource "vercel_project" "cook-scan" {
  name      = "cook-scan"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "RyotaAbe1014/CookScan"
  }
  team_id          = var.team_id
  build_command    = "npm run db:generate && next build"
  output_directory = ".next"
  install_command  = "npm install"
  dev_command      = "npm run dev"
  root_directory   = "cook-scan"
  node_version     = "22.x"
  resource_config = {
    function_default_regions = ["hnd1"]
  }
  oidc_token_config = {
    enabled = true
  }
}

resource "vercel_project_domain" "cook-scan" {
  project_id = vercel_project.cook-scan.id
  domain     = "cookscan.aberyouta.jp"
}

resource "vercel_project_domain" "cook-scan-redirect" {
  project_id = vercel_project.cook-scan.id
  domain     = "cook-scan.vercel.app"

  redirect             = vercel_project_domain.cook-scan.id
  redirect_status_code = 307
}

# AWS
provider "aws" {
  region = "ap-northeast-1"
}

# S3バケットの作成
resource "aws_s3_bucket" "s3_bucket" {
  bucket = var.s3_bucket_name

  tags = {
    Name = var.s3_bucket_name
  }

  # 削除するときはtrueにする
  force_destroy = false
}

# S3 CORS設定（ブラウザからのPresigned URLアップロード用）
resource "aws_s3_bucket_cors_configuration" "s3_cors" {
  bucket = aws_s3_bucket.s3_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT"]
    allowed_origins = [
      "https://cookscan.aberyouta.jp",
      "https://*.vercel.app",
      "http://localhost:3000",
    ]
    max_age_seconds = 3600
  }
}

# Lambda
data "archive_file" "cookscan_ocr" {
  type        = "zip"
  source_file = "${path.module}/../lambda/dist/handler.mjs"
  output_path = "${path.module}/../lambda/lambda.zip"
}

resource "aws_iam_role" "lambda_execution_role" {
  name = "cookscan-lambda-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy" "lambda_execution_role_policy" {
  name = "cookscan-lambda-execution-role-policy"
  role = aws_iam_role.lambda_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
        ]
        Resource = "${aws_s3_bucket.s3_bucket.arn}/*"
      },
      {
        Effect   = "Allow"
        Action   = "s3:ListBucket"
        Resource = aws_s3_bucket.s3_bucket.arn
      },
      {
        Effect = "Allow"
        Action = [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes",
        ]
        Resource = aws_sqs_queue.cookscan_sqs_queue.arn
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ]
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_lambda_function" "cookscan_lambda_function" {
  filename      = data.archive_file.cookscan_ocr.output_path
  function_name = var.aws_lambda_function_name
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "handler.handler"
  code_sha256   = data.archive_file.cookscan_ocr.output_base64sha256

  runtime     = "nodejs22.x"
  timeout     = 300
  memory_size = 256

  tags = {
    Name = var.aws_lambda_function_name
  }
}

# SQS
resource "aws_sqs_queue" "cookscan_sqs_queue" {
  name = var.sqs_name

  tags = {
    Name = var.sqs_name
  }
}

resource "aws_sqs_queue_policy" "cookscan_sqs_queue_policy" {
  queue_url = aws_sqs_queue.cookscan_sqs_queue.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "AllowVercelOIDCRole"
      Effect = "Allow"
      Principal = {
        AWS = aws_iam_role.vercel_oidc_role.arn
      }
      Action   = "SQS:SendMessage"
      Resource = aws_sqs_queue.cookscan_sqs_queue.arn
    }]
  })
}

resource "aws_lambda_event_source_mapping" "cookscan_event_source_mapping" {
  event_source_arn = aws_sqs_queue.cookscan_sqs_queue.arn
  function_name    = aws_lambda_function.cookscan_lambda_function.arn
  batch_size       = 10

  scaling_config {
    maximum_concurrency = 50
  }
}

# Vercel　OIDC
resource "aws_iam_openid_connect_provider" "default" {
  # プロバイダの URL
  url = "https://oidc.vercel.com/${var.vercel_team_slug}"

  # 対象者
  client_id_list = [
    "https://vercel.com/${var.vercel_team_slug}",
  ]
}

# IAM ロールの作成
resource "aws_iam_role" "vercel_oidc_role" {
  name = "cookscan-vercel-oidc-role"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Federated" : aws_iam_openid_connect_provider.default.arn
        },
        "Action" : "sts:AssumeRoleWithWebIdentity",
        "Condition" : {
          "StringEquals" : {
            "oidc.vercel.com/${var.vercel_team_slug}:aud" : "https://vercel.com/${var.vercel_team_slug}"
          }
        }
      }
    ]
  })

  tags = {
    Name = "cookscan-vercel-oidc-role"
  }
}

resource "aws_iam_role_policy" "vercel_oidc_role_policy" {
  name = "cookscan-vercel-oidc-role-policy"
  role = aws_iam_role.vercel_oidc_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
        ]
        Resource = "${aws_s3_bucket.s3_bucket.arn}/*"
      },
      {
        Effect   = "Allow"
        Action   = "s3:ListBucket"
        Resource = aws_s3_bucket.s3_bucket.arn
      },
      {
        Effect   = "Allow"
        Action   = "sqs:SendMessage"
        Resource = aws_sqs_queue.cookscan_sqs_queue.arn
      }
    ]
  })
}
