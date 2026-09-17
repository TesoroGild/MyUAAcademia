terraform {
  backend "s3" {
    bucket         = "myua-prod-tfstate-bucket"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    #dynamodb_table = "terraform-locks" deprecated
    use_lockfile = true
  }
}