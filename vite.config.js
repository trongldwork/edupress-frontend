import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  server: {
    port: 3001,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // Tự động thêm đuôi
  },
});
