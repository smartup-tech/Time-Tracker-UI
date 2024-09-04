#!/usr/bin/env bash

ARTIFACT_VERSION="${ARTIFACT_VERSION:-latest}"
REPOSITORY="time-tracker-frontend"

# Option 1: With .env file
cat << EOF > .env
TIMETRACKER_API_URL=http://localhost:8080/
EOF

docker run --rm -it -p 8082:80/tcp --env-file ".env" ${REPOSITORY}:${ARTIFACT_VERSION}

# Option 2: With env params
#docker run --rm -it -p 8082:80/tcp \
#    --env "TIMETRACKER_API_URL=http://localhost:8080/" \
#    ${REPOSITORY}:${ARTIFACT_VERSION}