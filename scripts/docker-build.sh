#!/bin/bash
$IMG_ID="cypress/base:10"
docker login registry.gitlab.com
# docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
echo "vision: docker images"
docker images

echo "vision: docker build -t registry.gitlab.com/vis-ion/slides ."
docker build -t registry.gitlab.com/vis-ion/slides .

docker images

echo "vision: docker tag $IMG_ID vision/base:10"
docker tag $IMG_ID vision/base:10

# docker tag vision:dev vision/base:10
# docker push registry.gitlab.com/vis-ion/slides

echo "
visino: docker image has been built
To deploy to gitlab, run:

$ docker push registry.gitlab.com/vis-ion/slides

"
