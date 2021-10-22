# WASM Tools

WASM Tools is a collection of useful tools for working with WASM and its accompanying text format, WAT, in JavaScript. The tools are based on [esbuild](https://esbuild.github.io) and [wabt](https://github.com/WebAssembly/wabt).

## Installation

```sh
npm install wasm-tools
```

## Tools

### `wasm-to-js` (alias `wat-to-js`)

Convert a WASM or WAT module to a JavaScript module.

#### Usage

```sh
Usage: wasm-to-js [options] <input>

Arguments:
  input                      the WASM or WAT module to convert to a JavaScript
                             module

Options:
  -V, --version              output the version number
  -f, --format <format>      the module format to use (choices: "esm", "cjs",
                             "iife", default: "esm")
  -p, --platform <platform>  the platform to bundle for (choices: "browser",
                             "node", "neutral", default: "browser")
  -s, --sync                 synchronously load the WASM in the resulting
                             module
  -m, --minify               minify the the resulting module
  -h, --help                 display help for command
```

### `wasm-to-wat`

Convert a WASM module to a WAT module.

#### Usage

```sh
Usage: wasm-to-wat [options] <input>

Arguments:
  input          the WASM module to convert to a WAT module

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```

### `wat-to-wasm`

Convert a WAT module to a WASM module.

#### Usage

```sh
Usage: wat-to-wasm [options] <input>

Arguments:
  input          the WAT module to convert to WASM module

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```
