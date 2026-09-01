# modules/eb/outputs.tf (fichier à créer ou compléter s'il est vide)
output "environment_name" {
  value = aws_elastic_beanstalk_environment.this.name
}

output "cname" {
  value = aws_elastic_beanstalk_environment.this.cname
}

output "endpoint_url" {
  value = aws_elastic_beanstalk_environment.this.endpoint_url
}