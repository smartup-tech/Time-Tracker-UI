#!/bin/bash

ARTIFACT_VERSION="${ARTIFACT_VERSION:-latest}"
REPOSITORY="time-tracker-frontend"
DOCKER_FILE="./ops-tools/docker/Dockerfile"

cd ..

# Build time-tracker image
docker build -f ${DOCKER_FILE} -t ${REPOSITORY}:${ARTIFACT_VERSION} .
docker tag ${REPOSITORY}:${ARTIFACT_VERSION} ${REPOSITORY}:latest
