#!/usr/bin/env node

const { program, createArgument } = require('commander')
const { version } = require('../package.json')

program
  .version(version)
  .addArgument(
    createArgument('<input>', 'the WAT module to convert to WASM module')
  )
  .action(action)
  .parseAsync()
  .catch(err => {
    console.error(`error: ${err.message}`)
    process.exitCode = 1
  })

async function action (file, options) {
  const { readWAT } = require('../lib/read-wat')

  const module = await readWAT(file)

  process.stdout.write(module.toBinary({}).buffer)
}
