#!/usr/bin/env bash
#
# hackathon_github_fetch.sh — recupera il file tree e i contenuti di una repo
# GitHub pubblica per la skill hackathon-evaluator.
#
# Uso:
#   ./hackathon_github_fetch.sh auto <repo_url> [ref]
#
# Parametri:
#   auto        modalità (riservato; al momento solo "auto")
#   repo_url    URL repo GitHub pubblica (es. https://github.com/owner/repo)
#   ref         branch/tag/commit (default: HEAD del default branch)
#
# Variabili d'ambiente:
#   MAX_FILES   numero massimo di file da scaricare (default 25; usare 40 per repo >60 file)
#   MAX_CHARS   caratteri massimi per file (default 3000)
#   GITHUB_TOKEN  opzionale, per evitare il rate limit dell'API pubblica
#
# Output: testo strutturato — prima il file tree, poi i contenuti dei file
# prioritari (troncati a MAX_CHARS), pronto per l'analisi dell'agente.

set -euo pipefail

MAX_FILES="${MAX_FILES:-25}"
MAX_CHARS="${MAX_CHARS:-3000}"

err() { printf '%s\n' "$*" >&2; }
die() { err "ERROR: $*"; exit 1; }

command -v curl >/dev/null 2>&1 || die "curl non disponibile"
command -v jq   >/dev/null 2>&1 || die "jq non disponibile"

MODE="${1:-auto}"
REPO_URL="${2:-}"
REF="${3:-}"

[ "$MODE" = "auto" ] || err "Modalità '$MODE' non riconosciuta, uso 'auto'."
[ -n "$REPO_URL" ] || die "repo_url mancante. Uso: $0 auto <repo_url> [ref]"

# --- Parse owner/repo dall'URL -------------------------------------------------
clean="${REPO_URL%/}"
clean="${clean%.git}"
# accetta https://github.com/owner/repo, git@github.com:owner/repo, owner/repo
clean="${clean#https://github.com/}"
clean="${clean#http://github.com/}"
clean="${clean#git@github.com:}"
OWNER="${clean%%/*}"
rest="${clean#*/}"
REPO="${rest%%/*}"

[ -n "$OWNER" ] && [ -n "$REPO" ] && [ "$OWNER" != "$REPO" ] \
  || die "Impossibile estrarre owner/repo da: $REPO_URL"

API="https://api.github.com"
AUTH_HEADER=()
[ -n "${GITHUB_TOKEN:-}" ] && AUTH_HEADER=(-H "Authorization: Bearer ${GITHUB_TOKEN}")

gh_get() {
  # $1 = path API completo
  local url="$1" body http
  body="$(curl -sS ${AUTH_HEADER[@]+"${AUTH_HEADER[@]}"} \
            -H "Accept: application/vnd.github+json" \
            -H "X-GitHub-Api-Version: 2022-11-28" \
            -w $'\n%{http_code}' "$url")" || die "richiesta fallita: $url"
  http="${body##*$'\n'}"
  body="${body%$'\n'*}"
  if [ "$http" = "404" ]; then
    die "repo o ref non trovati / repository privata (HTTP 404): $url"
  elif [ "$http" = "403" ]; then
    die "accesso negato o rate limit superato (HTTP 403). Imposta GITHUB_TOKEN."
  elif [ "$http" -ge 400 ]; then
    die "HTTP $http su $url"
  fi
  printf '%s' "$body"
}

# --- Risolvi il ref (default branch se non specificato) ------------------------
if [ -z "$REF" ]; then
  REF="$(gh_get "$API/repos/$OWNER/$REPO" | jq -r '.default_branch // "HEAD"')"
fi

# --- Recupera il tree ricorsivo ------------------------------------------------
TREE_JSON="$(gh_get "$API/repos/$OWNER/$REPO/git/trees/$REF?recursive=1")"

TRUNCATED="$(printf '%s' "$TREE_JSON" | jq -r '.truncated // false')"

# Tutti i path di tipo blob (file)
ALL_PATHS=()
while IFS= read -r _line; do
  ALL_PATHS+=("$_line")
done < <(printf '%s' "$TREE_JSON" | jq -r '.tree[] | select(.type=="blob") | .path')

TOTAL_FILES="${#ALL_PATHS[@]}"

# --- Prioritizzazione dei file -------------------------------------------------
# Punteggio più alto = priorità maggiore. README/OVERVIEW > istruzioni/agente >
# config workflow/MCP > codice. Esclude file binari/pesanti irrilevanti.
priority_of() {
  local p="$1" lower
  lower="$(printf '%s' "$p" | tr '[:upper:]' '[:lower:]')"
  case "$lower" in
    */node_modules/*|node_modules/*|*/.git/*|*/dist/*|*/build/*|*/vendor/*) echo -1; return;;
    *.png|*.jpg|*.jpeg|*.gif|*.svg|*.ico|*.pdf|*.zip|*.tar|*.gz|*.lock|*.min.js|*.map) echo -1; return;;
    *.pptx|*.docx|*.xlsx|*.woff|*.woff2|*.ttf|*.mp4|*.mp3|*.wav) echo -1; return;;
    *package-lock.json|*pnpm-lock.yaml|*poetry.lock|*composer.lock|*go.sum) echo -1; return;;
    */__pycache__/*|*.pyc|*/.venv/*|*/venv/*|*/target/*|*/.next/*|*/coverage/*) echo -1; return;;
  esac
  case "$lower" in
    *readme*|*overview*)                                   echo 100;;
    *claude.md|*agents.md|*agent.md|*.cursorrules|*system*prompt*) echo 90;;
    */skills/*|*skill.md|*/prompts/*|*instructions*)        echo 85;;
    *.mcp.json|*mcp*.json|*mcp*.yaml|*mcp*.yml|*workflow*)  echo 80;;
    */.claude/*|*claude*)                                   echo 75;;
    *.md)                                                   echo 60;;
    *.yaml|*.yml|*.json|*.toml)                             echo 50;;
    *.py|*.ts|*.tsx|*.js|*.jsx|*.go|*.rs|*.java|*.rb|*.sh)  echo 40;;
    *)                                                      echo 20;;
  esac
}

# Ordina i path per priorità (decrescente), stabile sull'ordine originale.
declare -a SCORED=()
i=0
for p in "${ALL_PATHS[@]}"; do
  s="$(priority_of "$p")"
  [ "$s" -lt 0 ] && continue
  SCORED+=("$(printf '%06d\t%06d\t%s' "$((1000 - s))" "$i" "$p")")
  i=$((i + 1))
done

SORTED=()
while IFS= read -r _line; do
  SORTED+=("$_line")
done < <(printf '%s\n' "${SCORED[@]+"${SCORED[@]}"}" | sort | cut -f3-)

# --- Output: header + tree -----------------------------------------------------
printf '=== REPO: %s/%s (ref: %s) ===\n' "$OWNER" "$REPO" "$REF"
printf 'File totali (blob): %s\n' "$TOTAL_FILES"
[ "$TRUNCATED" = "true" ] && printf 'AVVISO: tree GitHub troncato (repo molto grande).\n'
if [ "$TOTAL_FILES" -gt 60 ] && [ "$MAX_FILES" -le 25 ]; then
  printf 'NOTA: repo >60 file. Rilancia una volta con MAX_FILES=40 per copertura maggiore.\n'
fi
printf 'Limiti: MAX_FILES=%s, MAX_CHARS=%s per file.\n\n' "$MAX_FILES" "$MAX_CHARS"

printf '=== FILE TREE ===\n'
printf '%s\n' "${ALL_PATHS[@]}"
printf '\n'

# --- Output: contenuti dei file prioritari ------------------------------------
printf '=== CONTENUTI (max %s file, troncati a %s char) ===\n\n' "$MAX_FILES" "$MAX_CHARS"

RAW_BASE="https://raw.githubusercontent.com/$OWNER/$REPO/$REF"
count=0
for p in "${SORTED[@]}"; do
  [ "$count" -ge "$MAX_FILES" ] && break
  content="$(curl -sS ${AUTH_HEADER[@]+"${AUTH_HEADER[@]}"} "$RAW_BASE/$p" 2>/dev/null || true)"
  [ -z "$content" ] && continue
  printf -- '----- FILE: %s -----\n' "$p"
  total_chars="$(printf '%s' "$content" | wc -c | tr -d ' ')"
  if [ "$total_chars" -gt "$MAX_CHARS" ]; then
    printf '%s' "$content" | head -c "$MAX_CHARS"
    printf '\n[... TRONCATO: %s char totali, mostrati %s ...]\n' "$total_chars" "$MAX_CHARS"
  else
    printf '%s\n' "$content"
  fi
  printf '\n'
  count=$((count + 1))
done

printf '=== FINE (%s file scaricati su %s totali) ===\n' "$count" "$TOTAL_FILES"
