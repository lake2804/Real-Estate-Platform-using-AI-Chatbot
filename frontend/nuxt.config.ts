// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-06-07",
  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      // ✅ CRITICAL: Make sure this includes /api
      apiBase: "http://localhost:4000/api",
    },
  },

  modules: ["@pinia/nuxt"],

  vite: {
    plugins: [tailwindcss()],
  },

  pages: true,
  ssr: false, // ✅ CHANGED: Disable SSR to avoid hydration issues

  imports: {
    dirs: [
      "composables",
      "composables/*/index.{ts,js,mjs,mts}",
      "composables/**",
    ],
  },

  pinia: {
    autoImports: [
      "defineStore",
      ["defineStore", "definePiniaStore"],
      "storeToRefs",
    ],
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  build: {
    transpile: ["@headlessui/vue"],
  },

  app: {
    head: {
      title: "Real Estate Platform",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },
});
