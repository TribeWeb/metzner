// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@nuxt/image',
    'nuxt-og-image',
    '@nuxthub/core',
    '@nuxt/scripts',
    '@vueuse/nuxt',
    'nuxt-schema-org'
  ],

  devtools: {
    enabled: false,

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
  runtimeConfig: {
    // Private keys are only available on the server
    googleApiKey: ''
    // spreadsheetId: '',
    // googleServiceAccountEmail: '',
    // googlePrivateKey: ''
  },

  alias: {
    '#types': '/<rootDir>/types'
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
      prefix: 'c',
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
