resource "aws_s3_bucket" "s3" {
  bucket  = var.bucket_name
  tags    = var.tags
}

resource "aws_s3_bucket_public_access_block" "s3" {
  bucket                  = aws_s3_bucket.s3.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# resource "aws_s3_bucket_policy" "this" {
#   count = var.cloudfront_distribution_arn != null ? 1 : 0
#   bucket = aws_s3_bucket.s3.id
#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [{
#       Effect    = "Allow"
#       Principal = { Service = "cloudfront.amazonaws.com" }
#       Action    = "s3:GetObject"
#       Resource  = "${aws_s3_bucket.s3.arn}/*"
#       Condition = {
#         StringEquals = {
#           "AWS:SourceArn" = var.cloudfront_distribution_arn
#         }
#       }
#     }]
#   })
# }