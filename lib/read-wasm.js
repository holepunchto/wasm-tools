const fs = require('fs')
const wabt = require('wabt')()

async function readWASM (file) {
  const contents = await fs.promises.readFile(file)
  return (await wabt).readWasm(contents, {})
}

module.exports = {
  readWASM
}
