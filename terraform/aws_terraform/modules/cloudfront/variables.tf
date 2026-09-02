# modules/cloudfront/variables.tf
variable "name_prefix" {
  type = string
}

variable "s3_bucket_regional_domain_name" {
  type = string
}

variable "eb_cname" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}