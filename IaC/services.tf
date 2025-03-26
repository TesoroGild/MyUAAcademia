resource "azurerm_resource_group" "rg-sandbox" {
  name     = var.RESOURCE_GROUP_NAME
  location = var.LOCATION
}

resource "azurerm_log_analytics_workspace" "workspace" {
  name                = "workspace-uaacademia"
  location            = azurerm_resource_group.rg-sandbox.location
  resource_group_name = azurerm_resource_group.rg-sandbox.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_app_environment" "example" {
  name                       = "uaacademia-env"
  location                   = azurerm_resource_group.rg-sandbox.location
  resource_group_name        = var.RESOURCE_GROUP_NAME
  logs_destination           = "log-analytics"
  log_analytics_workspace_id = azurerm_log_analytics_workspace.workspace.id
}