#!/usr/bin/env bash
set -euo pipefail

config_dir="${SIGNAL_CLI_CONFIG_DIR:-/home/.local/share/signal-cli}"
device_name="${SIGNAL_DEVICE_NAME:-HermesAgent}"

mkdir -p "$config_dir"

if [[ -z "${SIGNAL_ACCOUNT:-}" ]]; then
  echo "SIGNAL_ACCOUNT is required." >&2
  exit 1
fi

if [[ ! -d "$config_dir/data" ]] || [[ -z "$(find "$config_dir/data" -mindepth 1 -maxdepth 1 2>/dev/null)" ]]; then
  echo "No linked Signal account found in $config_dir."
  echo "Run this once, scan the QR code, then restart the service:"
  echo "  docker compose exec signal-cli signal-cli --config \"$config_dir\" -u \"$SIGNAL_ACCOUNT\" link -n \"$device_name\""
  exec sleep infinity
fi

exec signal-cli --config "$config_dir" -u "$SIGNAL_ACCOUNT" daemon \
  --http "${SIGNAL_CLI_HTTP_HOST}:${SIGNAL_CLI_HTTP_PORT}" \
  "$@"
