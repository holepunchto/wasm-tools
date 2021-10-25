const SYNC_SIZE_LIMIT = 4 * 1024

module.exports = (options = {}) => {
  return {
    name: 'wasm',
    setup (build) {
      const { readWASM } = require('../lib/read-wasm.js')
      const { readWAT } = require('../lib/read-wat.js')

      build.onResolve({ filter: /\.wa(sm|t)$/ }, args => {
        if (args.namespace === 'wasm-module') {
          return {
            path: args.path,
            namespace: 'wasm-binary'
          }
        }

        return {
          path: args.path,
          namespace: 'wasm-module'
        }
      })

      build.onLoad({ filter: /.*/, namespace: 'wasm-module' }, async (args) => {
        return {
          contents: `
            const bytes = require(${JSON.stringify(args.path)})
            ${options.sync
              ? `
                const compiled = new WebAssembly.Module(bytes)
                module.exports = (imports) => {
                  const instance = new WebAssembly.Instance(compiled, imports)
                  return instance.exports
                }
                `
              : `
                const compiled = WebAssembly.compile(bytes)
                module.exports = async (imports) => {
                  const instance = await WebAssembly.instantiate(await compiled, imports)
                  return instance.exports
                }
                `
            }
          `
        }
      })

      build.onLoad({ filter: /\.wasm$/, namespace: 'wasm-binary' }, async (args) => {
        const module = await readWASM(args.path)
        const contents = module.toBinary({}).buffer
        checkSize(contents)
        return {
          contents,
          loader: 'binary'
        }
      })

      build.onLoad({ filter: /\.wat$/, namespace: 'wasm-binary' }, async (args) => {
        const module = await readWAT(args.path)
        const contents = module.toBinary({}).buffer
        checkSize(contents)
        return {
          contents,
          loader: 'binary'
        }
      })

      function checkSize (buffer) {
        if (!options.sync) {
          return
        }

        if (!options.force && buffer.byteLength > SYNC_SIZE_LIMIT) {
          throw new Error(
            `Modules larger than ${SYNC_SIZE_LIMIT / 1024} KiB should not be loaded synchronously`
          )
        }
      }
    }
  }
}
