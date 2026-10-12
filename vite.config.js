import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap', 'gsap/ScrollTrigger'],
          scroll: ['locomotive-scroll'],
          three: ['three'],
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.match(/^(\d+)\.webp$/)) {
            return 'lookbook-frames/[name][extname]'
          }
          if (assetInfo.name.match(/\.(woff2?|ttf|otf|eot)$/)) {
            return 'fonts/[name][extname]'
          }
          if (assetInfo.name.match(/\.(mp4|webm|ogg)$/)) {
            return 'videos/[name][extname]'
          }
          if (assetInfo.name.match(/\.(webp|jpg|jpeg|png|gif|svg)$/)) {
            return 'assets/[name][extname]'
          }
          return 'assets/[name][extname]'
        },
      },
    },
  },
})
