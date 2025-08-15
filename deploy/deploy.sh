#!/usr/bin/env bash
#deploy ALL=(root) NOPASSWD: /usr/local/bin/deploy.sh *
set -Eeuo pipefail

TAG="${1:?missing tag}"
export TAG

cd /home/deploy/app

mkdir -p ~/app/secrets
umask 177
printf '%s' '${{ secrets.GEMINI_API_KEY }}' > ~/app/secrets/gemini_api_key


# optional: login to GHCR if private
if [[ -n "${GHCR_TOKEN:-}" ]]; then
  echo "$GHCR_TOKEN" | docker login ghcr.io -u "${GHCR_USER:-}" --password-stdin >/dev/null
fi

docker compose pull
docker compose up -d --remove-orphans --force-recreate
