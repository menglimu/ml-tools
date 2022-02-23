import { defineConfig } from "rollup";

import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import clear from "rollup-plugin-clear";
import appendBin from "./rollup-plugin-bin";

export default defineConfig({
  input: {
    "ml-version": "src/version/index.ts",
    "ml-api": "src/api/index.ts",
    "ml-clone": "src/clone/index.ts",
  },
  // external: (name) => /.*excel-export.*/.test(name), // ['excel-export']
  external: ["inquirer", "excel-export"],
  output: {
    dir: "bin",
    format: "esm",
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
    // console.log(1),
    // console.log(2),
    // banner("#!/usr/bin/env node"),
    appendBin(),
  ],
  watch: false,
});
