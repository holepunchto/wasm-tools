module.exports = (options = {}) => {
  return {
    name: 'wasm',
    setup (build) {
      const path = require('path')
      const { readWASM } = require('../lib/read-wasm.js')
      const { readWAT } = require('../lib/read-wat.js')

      build.onResolve({ filter: /\.wa(sm|t)$/ }, args => {
        if (args.namespace === 'wasm-module') {
          return {
            path: args.path,
            namespace: 'wasm-binary'
          }
        }

        if (args.resolveDir === '') {
          return
        }

        return {
          path: path.isAbsolute(args.path) ? args.path : path.join(args.resolveDir, args.path),
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
                module.exports = (imports) =>
                  new WebAssembly.Instance(compiled, imports)
                `
              : `
                const compiled = WebAssembly.compile(bytes)
                module.exports = async (imports) =>
                  WebAssembly.instantiate(await compiled, imports)
                `
            }
          `
        }
      })

      build.onLoad({ filter: /\.wasm$/, namespace: 'wasm-binary' }, async (args) => {
        const module = await readWASM(args.path)
        return {
          contents: module.toBinary({}).buffer,
          loader: 'binary'
        }
      })

      build.onLoad({ filter: /\.wat$/, namespace: 'wasm-binary' }, async (args) => {
        const module = await readWAT(args.path)
        return {
          contents: module.toBinary({}).buffer,
          loader: 'binary'
        }
      })
    }
  }
}