// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui-pro',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    'nuxt-og-image'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    database: {
      type: 'd1',
      binding: 'DB'
    },
    preview: {
      dev: true,
      api: 'https://api.nuxt.studio'
    }
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  // hub: {
  //   database: true
  // },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  image: {
    provider: 'ipx'
  },

  ogImage: {
    zeroRuntime: true
  }
})
