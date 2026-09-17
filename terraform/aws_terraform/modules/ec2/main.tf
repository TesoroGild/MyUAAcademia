# METHODE 1
# data "aws_security_group" "sg" {
#     id = "sg-04c3f33ddde913d9b"
#     # filter {
#     #     name = "groupe-name"
#     #     values = [ "default" ]
#     # }
# }

# resource "aws_instance" "ec2" {
#     instance_type = "t3.micro"
#     ami = "ami-0332d564d76dbd8d6"

#     tags = {
#         "Name" = "Myua ec2 backend instance"
#         "Project" = "myua"
#         "Service" = "back"
#         "Resource" = "ec2"
#     }

#     aws_security_group = [ data.aws_security_group.sg.id ]
#     subnet_id = "subnet-02c7d191071c9accb"
# }

# METHODE 2
# data "aws_ami" "ubuntu" {
#     most_recent = true
#     owners = ["099720109477 "]
#     filter {
#         name = "name"
#         values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-resolute-26.04-amd64-server-*"]
#     }
# }

# resource "aws_instance" "ec2" {
#     ami                    = data.aws_ami.ubuntu.id
#     instance_type          = var.instance_type
#     subnet_id              = var.subnet_id
#     vpc_security_group_ids = var.security_group_ids
#     tags                   = merge(var.tags, { Name = var.instance_name })
# }