# CookScan Terraform

Vercel上のCookScanプロジェクトをTerraformで管理するための設定ファイルです。

## 構成

| リソース | 内容 |
|---|---|
| `vercel_project` | Vercel上のNext.jsプロジェクト (`cook-scan`) |
| `vercel_project_domain` | カスタムドメイン (`cookscan.aberyouta.jp`) |
| `vercel_project_domain` (redirect) | `cook-scan.vercel.app` からカスタムドメインへの307リダイレクト |

## 環境構築

### 1. Terraform Cloudにログイン

```bash
terraform login
```

### 2. 初期化

初回:

```bash
terraform init
```

すでに初期化済みの場合（プロバイダーのアップグレード時など）:

```bash
terraform init --upgrade
```

### 3. 変数の設定

`terraform.tfvars.example` をコピーして `terraform.tfvars` を作成し、値を設定します。

```bash
cp terraform.tfvars.example terraform.tfvars
```

| 変数 | 説明 |
|---|---|
| `vercel_api_token` | Vercel APIトークン |
| `team_id` | Vercel チームID |

## 主なコマンド

```bash
# 変更内容の確認
terraform plan

# 変更の適用
terraform apply

# リソースの削除
terraform destroy
```
