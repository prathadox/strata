#!/usr/bin/env bash
# Push every KEY=VALUE pair from an agent's .env into the matching Railway service.
# Values go through `railway variable set --stdin` so private keys never appear
# on the command line / shell history.
#
# Usage: ./railway-set-env.sh <service-name> <env-file> [EXTRA_KEY=EXTRA_VAL ...]

set -euo pipefail
service="${1:?service name required}"
envfile="${2:?env file required}"
shift 2

if [[ ! -r "$envfile" ]]; then
  echo "cannot read $envfile" >&2; exit 1
fi

while IFS= read -r raw; do
  line="${raw%%#*}"
  line="${line## }"
  line="${line%% }"
  [[ -z "$line" ]] && continue
  [[ "$line" != *=* ]] && continue
  key="${line%%=*}"
  val="${line#*=}"
  case "$key" in
    *_HEALTH_PORT|LOG_LEVEL|CYCLE_INTERVAL_MS|*_DRY_RUN|*_IDENTITY_NFT)
      continue ;;
  esac
  printf "%s" "$val" | railway variable set "$key" --service "$service" --stdin --skip-deploys >/dev/null
  printf "  ✓ %s\n" "$key"
done < "$envfile"

for kv in "$@"; do
  key="${kv%%=*}"
  val="${kv#*=}"
  printf "%s" "$val" | railway variable set "$key" --service "$service" --stdin --skip-deploys >/dev/null
  printf "  ✓ %s\n" "$key"
done

echo "→ $service env synced"
