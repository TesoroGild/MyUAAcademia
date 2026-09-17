# modules/eb/variables.tf
variable "app_name" {
  type = string
}

variable "solution_stack_name" {
  type = string
  # ex: "64bit Amazon Linux 2023 v3.x.x running .NET 8" — à vérifier via AWS CLI (vu plus tôt)
}

variable "vpc_id" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "security_group_id" {
  type = string
}

variable "min_instances" {
  type    = string
  default = "1"
}

variable "max_instances" {
  type    = string
  default = "1"
}

variable "environment_type" {
  type    = string
  default = "SingleInstance"
}

variable "tags" {
  type    = map(string)
  default = {}
}

# modules/eb/variables.tf — ajoute ces 4 variables
variable "rds_endpoint" {
  type = string
}

variable "rds_db_name" {
  type = string
}

variable "rds_username" {
  type = string
}

variable "rds_password" {
  type      = string
  sensitive = true
}