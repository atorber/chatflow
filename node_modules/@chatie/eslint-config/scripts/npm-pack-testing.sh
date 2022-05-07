#!/usr/bin/env bash
set -e

npm run dist
npm pack

TMPDIR="/tmp/npm-pack-testing.$$"
mkdir "$TMPDIR"
mv *-*.*.*.tgz "$TMPDIR"
cp -R tests/fixtures/* "$TMPDIR"

cd $TMPDIR
npm init -y
npm install --production \
  *-*.*.*.tgz \
  @types/blue-tape \
  @types/eslint \
  @types/glob \
  @types/node \
  @chatie/tsconfig \
  blue-tape \
  eslint \
  eslint-plugin-promise \
  glob \
  typescript

./node_modules/.bin/tsc \
  --lib esnext \
  --strict \
  --esModuleInterop \
  --noEmitOnError \
  --noImplicitAny \
  --skipLibCheck \
  smoke-testing.ts

mv eslintrc.yaml .eslintrc.yaml

node smoke-testing.js
