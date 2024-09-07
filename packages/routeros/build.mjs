import dts from 'bun-plugin-dts'


await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: "node",
  sourcemap: "linked",
  minify: true,
  plugins: [dts()]
})
