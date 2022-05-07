#!/usr/bin/env bash
set -e

npm run dist
npm run pack

TMPDIR="/tmp/npm-pack-testing.$$"
mkdir "$TMPDIR"
mv *-*.*.*.tgz "$TMPDIR"
cp tests/fixtures/smoke-testing.ts "$TMPDIR"

cd $TMPDIR
npm init -y
npm install --production \
  *-*.*.*.tgz \
  @chatie/tsconfig \
  tstest \
  shelljs \
  @types/shelljs

./node_modules/.bin/tsc \
  --lib esnext \
  --strict \
  --esModuleInterop \
  --noEmitOnError \
  --noImplicitAny \
  --skipLibCheck \
  smoke-testing.ts

node smoke-testing.js
