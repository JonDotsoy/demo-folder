import rollupTypescript from "@rollup/plugin-typescript";
import { RollupOptions } from "rollup";

const config: RollupOptions = {
  input: "src/demo-workspace.mts",
  external: ["node:fs", "node:path"],
  plugins: [rollupTypescript()],
  output: {
    format: "cjs",
    file: "cjs/demo-workspace.cjs",
    sourcemap: true,
  },
};

export default config;
