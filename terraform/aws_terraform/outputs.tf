output "cloudfront_domain_name" {
  description = "URL publique de ton application (front + back via CloudFront)"
  value       = module.myua_cloudfront.domain_name
}

output "eb_environment_name" {
  description = "Nom de l'environnement Elastic Beanstalk"
  value       = module.back_eb.environment_name
}

output "eb_endpoint_url" {
  description = "URL directe de l'environnement EB (utile pour debug, contourne CloudFront)"
  value       = module.back_eb.endpoint_url
}

output "rds_endpoint" {
  description = "Endpoint de connexion à la base de données RDS"
  value       = module.back_prod_rds.endpoint
  sensitive   = true
}

output "ecr_repository_url" {
  description = "URL du repository ECR (pour ton CI/CD, pour pusher l'image Docker)"
  value       = module.back_prod_ecr.repository_url
}

output "aws_front_s3" {
    value = module.front_static_bucket.bucket_id
}

output "aws_back_s3" {
    value = module.back_eb_bucket.bucket_id
}

output "vpc_id" {
  description = "ID du VPC créé"
  value       = module.network.vpc_id
}