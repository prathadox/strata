#!/usr/bin/env bash
# One command to start/stop/tail the 3 bus-listener daemons (Architect, Sentinel, Operator).
# Scout is NOT in here - it's the cron, not a listener.
#
# Usage:
#   ./agents/scripts/listeners.sh start    # boot all 3 in background, logs to /tmp/strata-*.log
#   ./agents/scripts/listeners.sh stop     # kill them
#   ./agents/scripts/listeners.sh restart  # stop then start
#   ./agents/scripts/listeners.sh status   # show pids + last log line per daemon
#   ./agents/scripts/listeners.sh tail     # tail -f all 3 logs in one stream
#   ./agents/scripts/listeners.sh logs     # cat all 3 logs and exit
#
# Run from anywhere - the script always cd's to the repo root before booting daemons
# because they read methodology files via paths like agents/sentinel/docs/...

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PID_DIR="/tmp/strata-listeners"
LOG_DIR="/tmp/strata-listeners"
AGENTS=(architect sentinel operator)

mkdir -p "$PID_DIR" "$LOG_DIR"

pid_file() { echo "$PID_DIR/$1.pid"; }
log_file() { echo "$LOG_DIR/$1.log"; }

is_running() {
  local pid_f
  pid_f="$(pid_file "$1")"
  [ -f "$pid_f" ] || return 1
  local pid
  pid="$(cat "$pid_f")"
  kill -0 "$pid" 2>/dev/null
}

start_one() {
  local a="$1"
  if is_running "$a"; then
    echo "  $a already running (pid $(cat "$(pid_file "$a")"))"
    return
  fi
  cd "$REPO_ROOT"
  local env_file="agents/$a/.env"
  if [ ! -f "$env_file" ]; then
    echo "  $a SKIPPED: missing $env_file"
    return
  fi
  : > "$(log_file "$a")"
  # Load that agent's .env into the spawned process via env(1).
  (
    set -a
    # shellcheck disable=SC1090
    . "$env_file"
    set +a
    nohup npx tsx "agents/$a/src/index.ts" \
      >> "$(log_file "$a")" 2>&1 &
    echo $! > "$(pid_file "$a")"
  )
  echo "  $a started (pid $(cat "$(pid_file "$a")"), log $(log_file "$a"))"
}

stop_one() {
  local a="$1"
  local pid_f
  pid_f="$(pid_file "$a")"
  if [ ! -f "$pid_f" ]; then
    echo "  $a not running (no pid file)"
    return
  fi
  local pid
  pid="$(cat "$pid_f")"
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid"
    echo "  $a killed (pid $pid)"
  else
    echo "  $a not running (stale pid $pid)"
  fi
  rm -f "$pid_f"
}

cmd_start() {
  echo "starting listeners (repo: $REPO_ROOT)..."
  for a in "${AGENTS[@]}"; do start_one "$a"; done
  echo ""
  echo "tail logs with: $0 tail"
  echo "stop with:      $0 stop"
}

cmd_stop() {
  echo "stopping listeners..."
  for a in "${AGENTS[@]}"; do stop_one "$a"; done
}

cmd_status() {
  for a in "${AGENTS[@]}"; do
    if is_running "$a"; then
      local pid
      pid="$(cat "$(pid_file "$a")")"
      local last
      last="$(tail -n 1 "$(log_file "$a")" 2>/dev/null || echo '(empty)')"
      echo "  $a UP   pid=$pid  last: $last"
    else
      echo "  $a DOWN"
    fi
  done
}

cmd_tail() {
  for a in "${AGENTS[@]}"; do
    if [ ! -f "$(log_file "$a")" ]; then
      : > "$(log_file "$a")"
    fi
  done
  echo "tailing 3 logs (Ctrl+C to stop tailing; daemons stay running)..."
  exec tail -F "$(log_file architect)" "$(log_file sentinel)" "$(log_file operator)"
}

cmd_logs() {
  for a in "${AGENTS[@]}"; do
    echo "===== $a ====="
    cat "$(log_file "$a")" 2>/dev/null || echo "(no log)"
    echo ""
  done
}

case "${1:-}" in
  start)   cmd_start ;;
  stop)    cmd_stop ;;
  restart) cmd_stop; sleep 1; cmd_start ;;
  status)  cmd_status ;;
  tail)    cmd_tail ;;
  logs)    cmd_logs ;;
  *)
    echo "usage: $0 {start|stop|restart|status|tail|logs}"
    exit 2
    ;;
esac
