// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui-pro',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    'nuxt-og-image',
    '@nuxthub/core',
    '@nuxt/scripts'
  ],

  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },

  css: ['~/assets/css/main.css'],

  site: { url: 'metzner.nuxt.dev' },

  content: {
    database: {
      type: 'd1',
      bindingName: 'DB'
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
        '/',
        '/sitemap.xml'
      ],
      crawlLinks: true
    }
  },

  hub: {
    database: true
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    provider: 'iconify',
    serverBundle: false,
    customCollections: [{
      prefix: 'custom',
      dir: './app/assets/icons'
    }]
  },

  image: {
    provider: 'ipx'
  },

  ogImage: {
    zeroRuntime: true
  }
})