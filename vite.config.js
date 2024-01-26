/** @type {import('vite').UserConfig} */
export default {
  base: '/',
  assetsDir: 'assets',
  outDir: 'end',
  entry: 'engine/n0.js',
  server: {
    host: 'n0', // Set the server host to 0.0.0.0
    port: 5123 // Or whatever port you want to use
 }
}