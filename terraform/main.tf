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

resource "aws_iam_role_policy" "s3_presigned_url" {
  name = "cookscan-s3-presigned-url"
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
      }
    ]
  })
}
