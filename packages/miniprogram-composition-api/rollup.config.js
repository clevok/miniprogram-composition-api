const typescript = require("rollup-plugin-typescript2")
const resolve = require("rollup-plugin-node-resolve")
const commonjs = require("rollup-plugin-commonjs")


module.exports = {
    input: './src/index.ts',
    output: {
        file: './lib/index.js',
        name: 'People',
        format: 'umd'
    },
    plugins: [
        typescript(),
        commonjs(),
        resolve(),
    ]
}