bun build index.ts \
  --target=node \
  --outdir=dist \
  --minify  \
  --minify-whitespace \
  --minify-identifiers \
  --minify-syntax

echo '#!/usr/bin/env bun' | cat - dist/index.js > dist/tmp.js \
  && mv dist/tmp.js dist/index.js \
  && chmod +x dist/index.js
