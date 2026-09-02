# modules/security-group/outputs.tf
output "id" {
  value = aws_security_group.this.id
}