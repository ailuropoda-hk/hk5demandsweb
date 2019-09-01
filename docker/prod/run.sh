#!/bin/sh

PROJECT_NAME=hk5demandsweb
LAST_COMMIT=$(git rev-parse --short HEAD 2> /dev/null | sed "s/\(.*\)/\1/")
# IMAGE_TAG=${PROJECT_NAME}:${LAST_COMMIT}
IMAGE_TAG=${PROJECT_NAME}:001

cd ../..

docker container rm $PROJECT_NAME
docker run --name $PROJECT_NAME -v $(pwd)/data:/usr/app/hk5demandsweb/data \
  -e SERVERURL=http://host.docker.internal:8080 -p 9091:9091 -it $IMAGE_TAG  /bin/bash