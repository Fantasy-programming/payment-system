import dts from "bun-plugin-dts"

await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  target: "bun",
  sourcemap: "linked",
  minify: true,
  plugins: [dts()],
})
