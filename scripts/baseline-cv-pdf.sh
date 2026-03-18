#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PDF_PATH="$ROOT_DIR/../output/pdf/Steven_Sternberg_CV_modern_slate.pdf"
BASELINE_DIR="$ROOT_DIR/../output/pdf/baseline"
BASELINE_IMG="$BASELINE_DIR/modern_slate_cv_page1.png"
TMP_PREFIX="$ROOT_DIR/../tmp/pdfs/current_cv"

if [[ ! -f "$PDF_PATH" ]]; then
  echo "Missing PDF: $PDF_PATH"
  echo "Run: npm run export:cv-pdf"
  exit 1
fi

mkdir -p "$BASELINE_DIR" "$ROOT_DIR/../tmp/pdfs"
pdftoppm -f 1 -singlefile -png "$PDF_PATH" "$TMP_PREFIX"
cp "$TMP_PREFIX.png" "$BASELINE_IMG"

echo "Baseline updated: $BASELINE_IMG"
