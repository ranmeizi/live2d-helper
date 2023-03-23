import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";

const plugin = [
  typescript(),
  terser()
];
const config = [
  {
    input: "src/worker/index.ts",
    plugins: plugin,
    output: [
      {
        file: "dist/l2d.worker.js",
        format: "es",
      },
    ],
  },
  {
    input: "src/index.ts",
    plugins: plugin,
    output: [{ file: "dist/index.js", format: "es" }],
  },
  {
    input: "src/index.ts",
    plugins: [dts()],
    output: [{ file: "dist/types.d.ts" }],
  },
];

export default config;
