import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
  {
    input: "./src/init.ts",
    output: {
      file: "./krohnkite.js",
      format: "esm",
      name: "krohnkite",
    },
    plugins: [typescript(), nodeResolve(), commonjs()],
  },
];
