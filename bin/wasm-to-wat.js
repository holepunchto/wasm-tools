#!/usr/bin/env node

const { program, createArgument } = require('commander')
const { version } = require('../package.json')

program
  .version(version)
  .addArgument(
    createArgument('<input>', 'the WASM module to convert to a WAT module')
  )
  .action(action)
  .parseAsync()
  .catch(err => {
    console.error(`error: ${err.message}`)
    process.exitCode = 1
  })

async function action (file, options) {
  const { readWASM } = require('../lib/read-wasm')

  const module = await readWASM(file)

  process.stdout.write(module.toText({}))
}
