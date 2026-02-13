#!/bin/sh
set -eux

: "${REPO_URL:=git@github.com:Dispelk9/vho-handbook.git}"
: "${BRANCH:=master}"
: "${SYNC_SECONDS:=300}"

# Prepare SSH
mkdir -p /root/.ssh
chmod 700 /root/.ssh

cp /run/secrets/handbook_deploy_key /root/.ssh/id_ed25519
chmod 600 /root/.ssh/id_ed25519

cp /run/secrets/handbook_known_hosts /root/.ssh/known_hosts
chmod 600 /root/.ssh/known_hosts

# Force non-interactive SSH + timeouts (prevents hangs)
SSH_OPTS="-i /root/.ssh/id_ed25519 -o UserKnownHostsFile=/root/.ssh/known_hosts -o StrictHostKeyChecking=yes -o BatchMode=yes -o ConnectTimeout=10 -o ConnectionAttempts=1 -o ServerAliveInterval=5 -o ServerAliveCountMax=1"
export GIT_SSH_COMMAND="ssh $SSH_OPTS"

echo "Repo: $REPO_URL branch: $BRANCH interval: ${SYNC_SECONDS}s"

if [ ! -d /data/.git ]; then
  echo "Cloning vho-handbook..."
  git clone --depth=1 --branch "$BRANCH" "$REPO_URL" /data
fi

while true; do
  echo "Syncing vho-handbook..."
  cd /data
  git fetch origin "$BRANCH"
  git reset --hard "origin/$BRANCH"
  git clean -fd
  sleep "$SYNC_SECONDS"
done
