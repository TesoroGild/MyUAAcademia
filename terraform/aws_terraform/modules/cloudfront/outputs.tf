# modules/cloudfront/outputs.tf
output "distribution_id" {
  value = aws_cloudfront_distribution.this.id
}

output "distribution_arn" {
  value = aws_cloudfront_distribution.this.arn
}

output "domain_name" {
  value = aws_cloudfront_distribution.this.domain_name   # ← l'URL finale à utiliser, ex: d123abc.cloudfront.net
}