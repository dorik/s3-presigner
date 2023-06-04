import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

const config = {
  input: "src/index.ts",
  output: [
    {
      file: "./dist/index.cjs.js",
      format: "cjs",
    },
    {
      file: "./dist/index.esm.js",
      format: "esm",
    },
  ],
  plugins: [resolve(), commonjs(), typescript()],

  external: ["@aws-sdk/client-s3", "@aws-sdk/s3-request-presigner"],
};

export default config;
