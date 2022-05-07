#!/usr/bin/env node

'use strict'

const binBuild = require('bin-build')
const path = require('path')
const tempfile = require('tempfile')
const fs = require('fs')
const download = require('download')

const platform = process.platform
const arch = process.arch

const JQ_INFO = {
  name: 'jq',
  url: 'https://github.com/stedolan/jq/releases/download/',
  version: 'jq-1.6'
}

const JQ_NAME_MAP = {
  def: 'jq',
  win32: 'jq.exe'
}
const JQ_NAME =
  platform in JQ_NAME_MAP ? JQ_NAME_MAP[platform] : JQ_NAME_MAP.def

const OUTPUT_DIR = path.join(__dirname, '..', 'bin')

const fileExist = (path) => {
  try {
    return fs.existsSync(path)
  } catch (err) {
    return false
  }
}

if (fileExist(path.join(OUTPUT_DIR, JQ_NAME))) {
  console.log('jq is already installed')
  process.exit(0)
}

if (process.env.NODE_JQ_SKIP_INSTALL_BINARY === 'true') {
  console.log('node-jq is skipping the download of jq binary')
  process.exit(0)
}

// if platform is missing, download source instead of executable
const DOWNLOAD_MAP = {
  win32: {
    def: 'jq-win32.exe',
    x64: 'jq-win64.exe'
  },
  darwin: {
    def: 'jq-osx-amd64',
    x64: 'jq-osx-amd64'
  },
  linux: {
    def: 'jq-linux32',
    x64: 'jq-linux64'
  }
}

if (platform in DOWNLOAD_MAP) {
  // download the executable

  const filename =
    arch in DOWNLOAD_MAP[platform]
      ? DOWNLOAD_MAP[platform][arch]
      : DOWNLOAD_MAP[platform].def

  const url = `${JQ_INFO.url}${JQ_INFO.version}/${filename}`

  console.log(`Downloading jq from ${url}`)
  download(url, OUTPUT_DIR)
    .then(() => {
      const distPath = path.join(OUTPUT_DIR, JQ_NAME)
      fs.renameSync(path.join(OUTPUT_DIR, filename), distPath)
      if (fileExist(distPath)) {
        fs.chmodSync(distPath, fs.constants.S_IXUSR || 0o100)
      }
      console.log(`Downloaded in ${OUTPUT_DIR}`)
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
} else {
  // download source and build

  const url = `${JQ_INFO.url}/${JQ_INFO.version}/${JQ_INFO.version}.tar.gz`

  console.log(`Building jq from ${url}`)
  binBuild
    .url(url, [
      'autoreconf -fi',
      `./configure --disable-maintainer-mode --with-oniguruma=builtin --prefix=${tempfile()} --bindir=${OUTPUT_DIR}`,
      'make -j8',
      'make install'
    ])
    .then(() => {
      console.log(`jq installed successfully on ${OUTPUT_DIR}`)
    })
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
}
