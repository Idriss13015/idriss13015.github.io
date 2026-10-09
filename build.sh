#!/bin/sh
# Prépare le dossier publié sur Firebase Hosting (_site).
# c/index.html devient c/page.html : /c/ est servi par la fonction
# `shareMeta` (aperçu propre à chaque collection partagée), qui part de
# cette page.
set -e
cd "$(dirname "$0")"
rm -rf _site
mkdir _site
rsync -a \
  --exclude '.git' --exclude '.github' --exclude '_site' --exclude '.DS_Store' \
  --exclude 'CNAME' --exclude 'README.md' --exclude 'build.sh' \
  --exclude 'firebase.json' --exclude '.firebaserc' --exclude '.gitignore' \
  --exclude '.firebase' --exclude '*.log' \
  ./ _site/
mv _site/c/index.html _site/c/page.html
