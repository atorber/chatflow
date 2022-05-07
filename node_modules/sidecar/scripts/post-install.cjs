#!/usr/bin/env node
/**
 * Huan(202108): Frida using `prebuild` NPM module to publish artifacts to GitHub Release,
 *  and using `prebuild-install` to download the binary at installation.
 *
 * In China, the internet has been blocked to visit some of the AWS S3,
 *  which might block the user to `npm install frida`.
 *
 * https://github.com/wechaty/wechaty-puppet-xp/issues/3
 *
 */
 const spawn   = require('cross-spawn')
 const path    = require('path')
 const fs      = require('fs')
 const pkgDir  = require('pkg-dir')

 async function needReinstall () {
   try {
     await import('frida')
     return false
   } catch (_) {
     return true
   }
 }

 async function reinstall () {
   console.error('Sidecar: checking frida installation (frida_binding.node) failed, try to reinstall with cdn mirror...')

   const pkgRoot = await pkgDir(__dirname)
   if (!pkgRoot) {
     throw new Error('no package.json found')
   }

   const innerCwd = path.resolve(pkgRoot, 'node_modules/frida')
   const outerCwd = path.resolve(pkgRoot, '../frida')

   const cwd = fs.existsSync(innerCwd) ? innerCwd
     : fs.existsSync(outerCwd) ? outerCwd
       : undefined

   if (!cwd) {
     throw new Error('can not find "node_modules/frida"')
   }

   const args = [
     'prebuild-install',
     '--tag-prefix',
     '',
   ]

   const env = {
     ...process.env,
     npm_config_frida_binary_host_mirror: 'https://cdn.chatie.io/mirrors/github.com/frida/frida/releases/download',
   }

   const ret = spawn.sync(
     'npx',
     [...args],
     {
       cwd,
       env,
     },
   )

   // console.log(ret)
   if (ret.status === 0) {
     console.log('Sidecar: install frida_binding.node successed.')
   } else {
     const message = ret.error || ret.stdout.toString() || ret.stderr.toString()
     console.error('Sidecar: install failed:', message)
   }
 }

 async function main () {
   if (await needReinstall()) {
     await reinstall()
   }
 }

 main()
   .catch(console.error)
