# locals.tf (racine)
locals {
  project     = "myua"
  environment = "prod"

  name_prefix = "${local.project}-${local.environment}"

  common_tags = {
    Project     = local.project
    Environment = local.environment
  }

  db_creds = jsondecode(data.aws_secretsmanager_secret_version.db_credentials.secret_string)
}