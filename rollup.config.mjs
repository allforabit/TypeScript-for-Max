import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import pkg from './package.json' assert {type: 'json'}

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

export default {
  input: './src/index.ts',
  plugins: [
    // Allows node_modules resolution
    resolve({extensions}),
    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),
    // Compile TypeScript/JavaScript files
    babel({
      extensions,
      babelHelpers: 'bundled',
      include: ['src/**/*'],
    }),
  ],
  output: [{
    file: pkg.main,
    format: 'cjs',
  }],
};
