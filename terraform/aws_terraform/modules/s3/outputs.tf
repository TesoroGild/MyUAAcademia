output "bucket_id" {
    value = aws_s3_bucket.s3.id
}

output "bucket_arn" {
  value = aws_s3_bucket.s3.arn
}

output "bucket_regional_domain_name" {
  value = aws_s3_bucket.s3.bucket_regional_domain_name
}