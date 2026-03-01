output "iam_role_arn" {
  value = aws_iam_role.vercel_oidc_role.arn
}

output "sqs_url" {
  value = aws_sqs_queue.cookscan_sqs_queue.url
}
