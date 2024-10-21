// vite.config.ts
import { defineConfig } from "file:///home/benjamin/code/scenario-explorer-2/frontend/node_modules/.pnpm/vite@5.2.11_@types+node@20.16.10/node_modules/vite/dist/node/index.js";
import react from "file:///home/benjamin/code/scenario-explorer-2/frontend/node_modules/.pnpm/@vitejs+plugin-react@4.3.0_vite@5.2.11_@types+node@20.16.10_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { TanStackRouterVite } from "file:///home/benjamin/code/scenario-explorer-2/frontend/node_modules/.pnpm/@tanstack+router-vite-plugin@1.38.0_vite@5.2.11_@types+node@20.16.10_/node_modules/@tanstack/router-vite-plugin/dist/esm/index.js";
import path from "path";
var __vite_injected_original_dirname = "/home/benjamin/code/scenario-explorer-2/frontend";
var vite_config_default = defineConfig(() => ({
  base: "/",
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  preview: {
    port: 3001,
    strictPort: true
  },
  server: {
    port: 3e3,
    strictPort: true,
    host: true,
    origin: "http://localhost:3000"
  },
  define: {
    "import.meta.env.VITE_CI": JSON.stringify(process.env.CI)
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9iZW5qYW1pbi9jb2RlL3NjZW5hcmlvLWV4cGxvcmVyLTIvZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2JlbmphbWluL2NvZGUvc2NlbmFyaW8tZXhwbG9yZXItMi9mcm9udGVuZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9iZW5qYW1pbi9jb2RlL3NjZW5hcmlvLWV4cGxvcmVyLTIvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgVGFuU3RhY2tSb3V0ZXJWaXRlIH0gZnJvbSBcIkB0YW5zdGFjay9yb3V0ZXItdml0ZS1wbHVnaW5cIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoKSA9PiAoe1xuICBiYXNlOiBcIi9cIixcbiAgcGx1Z2luczogW3JlYWN0KCksIFRhblN0YWNrUm91dGVyVml0ZSgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICBwcmV2aWV3OiB7XG4gICAgcG9ydDogMzAwMSxcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgaG9zdDogdHJ1ZSxcbiAgICBvcmlnaW46IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCIsXG4gIH0sXG4gIGRlZmluZToge1xuICAgIFwiaW1wb3J0Lm1ldGEuZW52LlZJVEVfQ0lcIjogSlNPTi5zdHJpbmdpZnkocHJvY2Vzcy5lbnYuQ0kpLFxuICB9LFxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrVSxTQUFTLG9CQUFvQjtBQUMvVixPQUFPLFdBQVc7QUFDbEIsU0FBUywwQkFBMEI7QUFDbkMsT0FBTyxVQUFVO0FBSGpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYSxPQUFPO0FBQUEsRUFDakMsTUFBTTtBQUFBLEVBQ04sU0FBUyxDQUFDLE1BQU0sR0FBRyxtQkFBbUIsQ0FBQztBQUFBLEVBQ3ZDLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sMkJBQTJCLEtBQUssVUFBVSxRQUFRLElBQUksRUFBRTtBQUFBLEVBQzFEO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
