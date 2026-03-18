#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/../output/pdf"
OUT_PDF="$OUT_DIR/Steven_Sternberg_CV_modern_slate.pdf"

CHROME_BIN="${CHROME_BIN:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

mkdir -p "$OUT_DIR"

if [[ ! -x "$CHROME_BIN" ]]; then
  echo "Chrome binary not found or not executable: $CHROME_BIN"
  echo "Set CHROME_BIN to your local Chrome/Chromium executable path."
  exit 1
fi

cd "$ROOT_DIR"
VITE_THEME=modern-slate npx vite build --base ./

"$CHROME_BIN" \
  --headless=new \
  --no-sandbox \
  --disable-gpu \
  --allow-file-access-from-files \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=12000 \
  --no-pdf-header-footer \
  --print-to-pdf="$OUT_PDF" \
  "file://$ROOT_DIR/dist/index.html"

echo "PDF exported: $OUT_PDF"
