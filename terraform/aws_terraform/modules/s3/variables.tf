variable "bucket_name" {
    type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}

# variable "cloudfront_distribution_arn" {
#   type = string
#   default = null
# }