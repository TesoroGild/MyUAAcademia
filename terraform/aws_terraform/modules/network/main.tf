resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(var.tags, { Name = "${var.name}-vpc" })
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags   = merge(var.tags, { Name = "${var.name}-igw" })
}

resource "aws_subnet" "public_sub" {
  vpc_id                    = aws_vpc.this.id
  cidr_block                = var.public_subnet_cidr
  availability_zone         = var.availability_zone
  map_public_ip_on_launch   = true   # ← important pour qu'une instance dedans ait une IP publique

  tags = merge(var.tags, { Name = "${var.name}-public-subnet" })
}

resource "aws_subnet" "private_sub" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.private_subnet_cidr
  availability_zone = var.second_availability_zone

  tags = merge(var.tags, { Name = "${var.name}-private-subnet" })
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  tags = merge(var.tags, { Name = "${var.name}-public-rt" })
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public_sub.id
  route_table_id = aws_route_table.public_rt .id
}