#DOCKER_DEFAULT_PLATFORM=linux/amd64 docker build -t shivinagarwal/dataminingfe . && docker push shivinagarwal/datamining:latest

#DOCKER_DEFAULT_PLATFORM=linux/amd64 docker build -t shivinagarwal/dataminingfe

docker build -f Dockerfile_local_M3 -t shivinagarwal/dataminingfe .