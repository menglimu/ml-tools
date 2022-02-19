import { defineConfig } from "rollup";

import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import clear from "rollup-plugin-clear";
import replace from "rollup-plugin-re";
import banner from "rollup-plugin-banner";

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
  plugins: [
    commonjs(),
    typescript(),
    clear({ targets: ["bin"] }),
    // replace({
    //   replaces: {
    //     "// bin": "#!/usr/bin/env node",
    //   },
    // }),
    console.log(1),
    console.log(2),
    banner("#!/usr/bin/env node"),
  ],
  watch: false,
});
