#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PDF_PATH="$ROOT_DIR/../output/pdf/Steven_Sternberg_CV_modern_slate.pdf"
BASELINE_IMG="$ROOT_DIR/../output/pdf/baseline/modern_slate_cv_page1.png"
TMP_PREFIX="$ROOT_DIR/../tmp/pdfs/current_cv"
CURRENT_IMG="$TMP_PREFIX.png"

if [[ ! -f "$PDF_PATH" ]]; then
  echo "Missing PDF: $PDF_PATH"
  echo "Run: npm run export:cv-pdf"
  exit 1
fi

if [[ ! -f "$BASELINE_IMG" ]]; then
  echo "Missing baseline image: $BASELINE_IMG"
  echo "Run: npm run baseline:cv-pdf"
  exit 1
fi

mkdir -p "$ROOT_DIR/../tmp/pdfs"
pdftoppm -f 1 -singlefile -png "$PDF_PATH" "$TMP_PREFIX"

if cmp -s "$CURRENT_IMG" "$BASELINE_IMG"; then
  echo "CV PDF check passed: page 1 matches baseline."
  exit 0
fi

echo "CV PDF check failed: page 1 differs from baseline."
echo "Inspect current image: $CURRENT_IMG"
echo "Baseline image: $BASELINE_IMG"
exit 1
