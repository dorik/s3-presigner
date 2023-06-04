import resolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

const config = {
  input: "src/index.ts",
  output: {
    file: "./dist/index.esm.js",
    format: "esm",
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    babel({ babelHelpers: "bundled" }),
  ],
  // indicate which modules should be treated as external
  external: ["react", "react-dom"],
};

export default config;
