# Network
module "network" {
  source                    = "./modules/network"
  name                      = "${local.name_prefix}-back-vpc"
  availability_zone         = "us-east-1a"
  second_availability_zone  = "us-east-1b"

  tags = merge(local.common_tags, { 
        Service = "back", 
        Resource = "vpc" 
  })
}

# SG
## EC2/EB
module "full_prod_ec2eb_sg" {
    source = "./modules/sg"
    name   = "${local.name_prefix}-back-e2-sg"
    vpc_id = module.network.vpc_id

    ingress_rules = [
        {
            description = "SSH from my IP"
            from_port   = 22
            to_port     = 22
            protocol    = "tcp"
            cidr_blocks = [var.my_ip]
        },
        {
            description = "HTTP from CloudFront"
            from_port   = 80
            to_port     = 80
            protocol    = "tcp"
            cidr_blocks = ["0.0.0.0/0"]
        }
    ]

    tags = merge(local.common_tags, { 
        Service = "back", 
        Resource = "e2-sg" 
    })
}

## RDS
module "full_prod_rds_sg" {
  source = "./modules/sg"
  name   = "${local.name_prefix}-back-rds-sg"
  vpc_id = module.network.vpc_id

  ingress_rules = [
    {
      description               = "PostgreSQL from EB security group"
      from_port                 = 5432
      to_port                   = 5432
      protocol                  = "tcp"
      source_security_group_id  = module.full_prod_ec2eb_sg.id
    }
  ]

  tags = merge(local.common_tags, { 
    Service = "back", 
    Resource = "rds-sg" 
  })
}

# S3
## Frontend
module "front_static_bucket" {
    source      = "./modules/s3"
    bucket_name = "${local.name_prefix}-front-static-bucket"
    tags = merge(local.common_tags, {
        Service  = "front"
        Resource = "s3"
    })
}

## Backend
module "back_eb_bucket" {
    source      = "./modules/s3"
    bucket_name = "${local.name_prefix}-eb-deploy-bucket"

    tags = merge(local.common_tags, {
        Service  = "eb"
        Resource = "s3"
    })
}

resource "aws_s3_bucket_policy" "front_cloudfront_access" {
  bucket = module.front_static_bucket.bucket_id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action    = "s3:GetObject"
      Resource  = "${module.front_static_bucket.bucket_arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = module.myua_cloudfront.distribution_arn
        }
      }
    }]
  })
}

# EC2
# module "back_prod_instance" {
#     source              = "./modules/ec2"
#     instance_name       = "${local.name_prefix}-back-ec2"
#     instance_type       = "t3.micro"
#     subnet_id           = module.network.public_subnet_id
#     security_group_ids  = [module.full_prod_ec2eb_sg.id]

#     tags = merge(local.common_tags, {
#         Service  = "back"
#         Resource = "ec2"
#     })
# }

# ECR
module "back_prod_ecr" {
  source          = "./modules/ecr"
  repository_name = "${local.name_prefix}-back-ecr"
  tags            = merge(local.common_tags, { 
    Service = "back", 
    Resource = "ecr" 
  })
}

# EB
module "back_eb" {
  source               = "./modules/eb"
  app_name             = "${local.name_prefix}"
  solution_stack_name  = "64bit Amazon Linux 2023 v4.13.7 running Docker"
  vpc_id               = module.network.vpc_id
  subnet_id            = module.network.public_subnet_id
  security_group_id    = module.full_prod_ec2eb_sg.id
  instance_type        = "t3.micro"

  rds_endpoint = module.back_prod_rds.endpoint
  rds_db_name  = "myuaacademia_db"
  rds_username = local.db_creds.username
  rds_password = local.db_creds.password

  tags = merge(local.common_tags, { 
    Service = "back", 
    Resource = "eb" 
  })
}

# RDS
module "back_prod_rds" {
  source             = "./modules/rds"
  identifier         = "${local.name_prefix}-back-rds"
  db_name            = "myuaacademia_db"
  username           = local.db_creds.username
  password           = local.db_creds.password
  subnet_ids         = [module.network.public_subnet_id, module.network.private_subnet_id]
  security_group_id  = module.full_prod_rds_sg.id

  tags = merge(local.common_tags, { 
    Service = "back", 
    Resource = "rds" 
  })
}

data "aws_secretsmanager_secret" "db_credentials" {
  name = "myua/prod/rds-credentials"   
}

data "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = data.aws_secretsmanager_secret.db_credentials.id
}

# CloudFront
module "myua_cloudfront" {
  source                           = "./modules/cloudfront"
  name_prefix                      = local.name_prefix
  s3_bucket_regional_domain_name   = module.front_static_bucket.bucket_regional_domain_name
  eb_cname                         = module.back_eb.cname
  tags                              = merge(local.common_tags, { 
    Service = "full",
    Resource = "cloudfront" 
  })
}