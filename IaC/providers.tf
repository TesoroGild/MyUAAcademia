terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "4.24.0"
    }
  }
}

provider "azurerm" {
  # Configuration options
  subscription_id = var.SUBSCRIPTION_ID
  features {}
}