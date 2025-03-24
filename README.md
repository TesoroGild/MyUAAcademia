# MyUAAcademia
Projet React Javascript C#

# Application wrapping
Dockerfile is added. It builds the a docker image based on the app and allows the user to run the app in a container. You need to have docker already installed on your device. Follow the following steps:

1. Build and tag the app docker image
```bash
$ docker build -t <APP_DOCKER_IMAGE_NAME> .
```

2. Run the app in a docker container
```bash
$ docker run -p <EXTERNAL_PORT>:8080 --name <CONTAINER_NAME> <APP_DOCKER_IMAGE_NAME>
```

Example: With: <br/>
**APP_DOCKER_IMAGE_NAME**=`myapp`, <br/>
**EXTERNAL_PORT**=`3000` <br/>
**CONTAINER_NAME**=`myapp-container`

```bash
$ docker build -t myapp .
$ docker run -p 3000:8080 --name myapp-container myapp
```