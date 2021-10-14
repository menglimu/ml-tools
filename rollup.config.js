import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: ['src/api/generate.ts'],
  external: name => /.*excel-export.*/.test(name),
  output: {
    dir: 'output',
    format: 'cjs'
  },
  plugins: [commonjs(), typescript()]
};