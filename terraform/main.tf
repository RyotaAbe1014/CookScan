terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 4.0"
    }
  }
}

provider "vercel" {
  api_token = var.vercel_api_token
  team = var.team_id
}

resource "vercel_project" "cook-scan" {
  name      = "cook-scan"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "RyotaAbe1014/CookScan"
  }
}