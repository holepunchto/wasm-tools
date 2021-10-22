const fs = require('fs')
const path = require('path')
const wabt = require('wabt')()

async function readWAT (file) {
  const contents = await fs.promises.readFile(file)
  return (await wabt).parseWat(path.basename(file), contents, {})
}

module.exports = {
  readWAT
}
