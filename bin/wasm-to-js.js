#!/usr/bin/env node

const { program, createArgument, createOption } = require('commander')
const { version } = require('../package.json')

program
  .version(version)
  .addArgument(
    createArgument('<input>', 'the WASM or WAT module to convert to a JavaScript module')
  )
  .addOption(
    createOption('-f, --format <format>', 'the module format to use')
      .choices(['esm', 'cjs', 'iife'])
      .default('esm')
  )
  .addOption(
    createOption('-p, --platform <platform>', 'the platform to bundle for')
      .choices(['browser', 'node', 'neutral'])
      .default('browser')
  )
  .addOption(
    createOption('-s, --sync', 'synchronously load the WASM in the resulting module')
  )
  .addOption(
    createOption('-m, --minify', 'minify the the resulting module')
  )
  .addOption(
    createOption('--force', 'bypass size limit checks')
  )
  .action(action)
  .parseAsync()
  .catch(err => {
    console.error(`error: ${err.message}`)
    process.exitCode = 1
  })

async function action (file, options) {
  const esbuild = require('esbuild')
  const wasm = require('../plugins/wasm')

  await esbuild.build({
    logLevel: 'silent',
    entryPoints: [file],
    bundle: true,
    platform: options.platform,
    format: options.format,
    minify: options.minify,
    plugins: [wasm({ sync: options.sync, force: options.force })]
  })
}
