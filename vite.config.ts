import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default (async () => {
  const tsconfigPaths = (await import('vite-tsconfig-paths')).default;
  
  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    esbuild: {
      loader: "tsx",
      include: [/src\/.*\.[tj]sx?$/], 
      jsx: "automatic", 
    },
    define: {
      global: "globalThis", 
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          ".js": "jsx",
          ".ts": "tsx",
        },
      },
    },
    server: {
      port: 3001,
      open: true,
    },
    build: {
      outDir: 'build',
    },
  });
})();