import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import clear from "rollup-plugin-clear";
import { defineConfig } from "rollup";

export default defineConfig({
  input: {
    "ml-version": "src/version/index.ts",
    "ml-api": "src/api/index.ts",
  },
  // external: (name) => /.*excel-export.*/.test(name), // ['excel-export']
  output: {
    dir: "bin",
    format: "cjs",
    // file: ["ml-version.js", "ml-api.js"],
    sourcemap: false,
  },
  plugins: [commonjs(), typescript(), clear({ targets: ["bin"] })],
  watch: false,
});
