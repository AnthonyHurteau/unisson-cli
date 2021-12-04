// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  css: {
    modules: {
      scopeBehaviour: "local",
      generateScopedName: "[hash:base64:5]",
    },
  },
  esbuild: {
    jsxFactory: "_jsx",
    jsxFragment: "_jsxFrag",
    jsxInject: "import { createElement as _jsx, createFragment as _jsxFrag }  from 'unisson'",
  },
  server: {
    open: true,
  },
});
