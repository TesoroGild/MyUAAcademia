# MyUAAcademia
Projet React Javascript C#

![Deploy badge](https://github.com/adotri-frimpong/MyUAAcademia/actions/workflows/azure-container-deploiement.yaml/badge.svg?event=push)    [<img src="https://img.shields.io/badge/Vite-6.0.8-purple.svg?logo=vite">](https://hub.docker.com/r/hadolint/hadolint) 
[<img src="https://img.shields.io/badge/ESLint-^8.57.0-white.svg?logo=eslint">]()   [<img src="https://img.shields.io/badge/Docker-v20.10.22-blue.svg?logo=docker">](https://www.docker.com/)           [<img src="https://img.shields.io/badge/Tailwind CSS-^3.4.3-turquoise.svg?logo=tailwindcss">](https://www.docker.com/)
[<img src="https://img.shields.io/badge/React-^18.2.0-blue.svg?logo=react">](https://hub.docker.com/r/prom/prometheus/tags)
[<img src="https://img.shields.io/badge/npm-8.19.4-red.svg?logo=npm">](https://hub.docker.com/r/grafana/grafana/tags)

## Content

- [Pre-requisites](#prerequisites)
- [Run the application locally](#run-the-application-locally)
- [Run the application on the cloud (Azure Container Apps)](#run-the-application-on-the-cloud-azure-container-apps)
- [Troubleshooting](#troubleshooting)


## Prerequisites
- Docker
- Azure CLI
- Terraform


## Run the application locally
The Dockerfile wraps the whole application in a docker image. Docker builds the a docker image based on the app and allows the user to run the app in a container. You need to have docker already installed on your device. Follow the following steps:

1. Build and tag the app docker image 
```bash
$ docker build -t <APP_DOCKER_IMAGE_NAME> .
```
2. Run the app in a docker container
```bash
$ docker run -p <EXTERNAL_PORT>:8080 --name <CONTAINER_NAME> <APP_DOCKER_IMAGE_NAME>
```
To stop the app container, run:
```bash
$ docker stop <CONTAINER_NAME>
```

> 3. Visualize the app in your web navigator by entering the URL `localhost:<EXTERNAL_PORT>`

Example: With: <br/>
**APP_DOCKER_IMAGE_NAME**=`myapp`, <br/>
**EXTERNAL_PORT**=`3000` <br/>
**CONTAINER_NAME**=`myapp-container`

```bash
$ docker build -t myapp .
$ docker run -p 3000:8080 --name myapp-container myapp
```
> Run on `localhost:3000`

## Run the application on the cloud (Azure Container Apps)

> - Application deployment
>
>For the wrapped app deployment, we need to use the Azure Container App deployment. The CI/CD worflow for this deployment is configured via the [`.github/worflows/azure-container-deploiement.yaml`](.github/workflows/azure-container-deploiement.yaml) file.

First of all, it's mandatory to set up your Azure services (the `resource-group` and the `azure-container-app-environment`). Terraform is used to create these resources. Follow these steps :

Create the `variable.tf` file in the `IaC/` directory:
```bash
$ touch IaC/variable.tf
```
Add the following content to the `variable.tf` file (replace the default values with your own):
```bash
variable "RESOURCE_GROUP_NAME" {
  type = string
  default = "******"
}
variable "SUBSCRIPTION_ID" {
  type = string
  default = "******"
}
variable "LOCATION" {
  type = string
  default = "******"
}
```

Then, run in your local terminal:
```bash
$ az login
```
```bash
$ terraform init
```
```bash
$ terraform apply
```
Once the resources created, you need to set up Azure credentials via GitHub secrets:
- **AZURE_CREDENTIALS**: which may contains the following information:
```json
{
    "clientSecret":  "******",
    "subscriptionId":  "******",
    "tenantId":  "******",
    "clientId":  "******"
}
```

- **RESOURCE_GROUP**: which contains the Azure resource group name
- **DOCKERHUB_USERNAME**: which contains the Docker registry username
- **DOCKERHUB_PASSWORD**: which contains the Docker registry password

Finally, run the GitHub Actions workflow `.github/workflows/azure-container-deploiement.yaml` to pull the app docker image hosted on dockerhub registry.

You can then visualize the app in your web navigator by entering the URL of your Azure container App.

> **Removal and stopping**:<br/>
First of all, remove the azure container app manually on Azure portal.<br/>
Then, run in your local terminal:
```bash
$ terraform destroy
```

## Troubleshooting

> How to get Azure credentials:<br/>
```bash
$ az ad sp create-for-rbac --name "github-action-sp" --role contributor \
   --scopes /subscriptions/<YOUR_SUBSCRIPTION_ID> --sdk-auth
```
You have a generated JSON file following this pattern:
```json
{
  "clientId": "********",
  "clientSecret": "********",
  "subscriptionId": "********",
  "tenantId": "********",
  "activeDirectoryEndpointUrl": "********",
  "resourceManagerEndpointUrl": "********",
  "activeDirectoryGraphResourceId": "********",
  "sqlManagementEndpointUrl": "********",
  "galleryEndpointUrl": "********",
  "managementEndpointUrl": "********"
}
```
Just keep those fields and store them in GitHub secrets as `AZURE_CREDENTIALS`:
```json
{
    "clientSecret":  "******",
    "subscriptionId":  "******",
    "tenantId":  "******",
    "clientId":  "******"
}
```

> Errors:<br/>
If you ecounter the following error:
```bash
ERROR: Subscription <YOUR_SUBSCRIPTION_ID> is not registered for the Microsoft.OperationalInsights resource provider. Please run "az provider register -n Microsoft.OperationalInsights --wait" to register your subscription.
```
Just run the following command (in your local terminal or the termminal in the terminal of your Azure portal):
```bash
az provider register -n Microsoft.OperationalInsights --wait
```

> Install Azure CLI locally before running the command `terrform apply`
> Make sure to check the right version of vitejs ($6.0.8$) package in the [`package.json`](./frontend/package.json#L46) file.