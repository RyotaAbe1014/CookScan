terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 4.2.0"
    }
  }

  cloud {
    organization = "ryota-abe-terraform"
    workspaces {
      name = "cook-scan"
    }
  }
}

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
  node_version = "22.x"
  resource_config = {
    function_default_regions = ["hnd1"]
  }
}

resource "vercel_project_domain" "cook-scan" {
  project_id = vercel_project.cook-scan.id
  domain = "cookscan.aberyouta.jp"
}

resource "vercel_project_domain" "cook-scan-redirect" {
  project_id = vercel_project.cook-scan.id
  domain = "cook-scan.vercel.app"

  redirect = vercel_project_domain.cook-scan.id
  redirect_status_code = 307
}