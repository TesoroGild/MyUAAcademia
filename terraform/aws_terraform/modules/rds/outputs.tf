# modules/rds/outputs.tf
output "endpoint" {
  value = aws_db_instance.this.endpoint   # ← l'adresse pour te connecter depuis ton backend .NET
}