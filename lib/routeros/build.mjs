import { build } from "bun"
import dts from "bun-plugin-dts"

await build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "node",
  sourcemap: "linked",
  minify: true,
  plugins: [dts()],
})
