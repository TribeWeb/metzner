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
    '@nuxt/scripts',
    '@vueuse/nuxt',
    'nuxt-schema-org',
    'nuxt-studio',
    '@nuxtjs/mdc'
  ],

  devtools: {
    enabled: true,

    timeline: {
      enabled: false
    }
  },
  css: ['~/assets/css/main.css'],

  site: {
    url: 'metzner.netlify.app',
    name: 'Metzner UK'
  },

  runtimeConfig: {
    // Private keys are only available on the server
    googleApiKey: '',
    public: {
      scripts: {
        googleRecaptcha: {
          // NUXT_PUBLIC_SCRIPTS_GOOGLE_RECAPTCHA_SITE_KEY=<your-key>
          siteKey: ''
        }
      },
      prospectFormOrgId: ''
    }
    // spreadsheetId: '',
    // googleServiceAccountEmail: '',
    // googlePrivateKey: ''
  },

  alias: {
    '#types': '/<rootDir>/types'
  },

  compatibilityDate: '2026-01-27',

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

  ogImage: {
    zeroRuntime: true
  },

  studio: {
    repository: {
      provider: 'github',
      owner: 'tribeweb',
      repo: 'metzner',
      branch: 'main' // Optional, defaults to 'main'
    },
    ai: {
      context: {
        title: 'Metzner UK',
        description: 'German-engineered cutting machines and peripherals for repeatable, accurate cuts across hose, profile, tubing and cable applications.',
        style: 'Technical and detailed, with practical examples',
        tone: 'Professional yet approachable'
      },
      experimental: {
        collectionContext: true // Enable AI Tab
      }
    }
  }

})
