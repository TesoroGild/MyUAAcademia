# modules/ecr/outputs.tf
output "repository_url" {
  value = aws_ecr_repository.this.repository_url   # ← tu en auras besoin pour ton CI/CD (push l'image ici)
}