// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";

export default {
  input: 'src/ExampleJS.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    generatedCode: {
      preset: 'es5',
      arrowFunctions: false
    }
  },
  plugins: [commonjs(), typescript(), nodeResolve(), babel({ babelHelpers: 'bundled' })]
};
