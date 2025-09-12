// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineLocalBusiness } from 'nuxt-schema-org/schema'

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui-pro',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@nuxt/eslint',
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
      prefix: 'c',
      dir: './app/assets/icons'
    }]
  },

  image: {
    provider: 'ipx'
  },

  ogImage: {
    zeroRuntime: true
  },

  schemaOrg: {
    identity: defineLocalBusiness({
      '@type': 'Store',
      'name': 'Metzner UK',
      'description': 'The UK distributor for Metzner Maschinenbau GmbH, a German company manufacturing high quality and bespoke cutting machines.',
      'url': 'https://metzner.co.uk',

      // Location (Required)
      'address': {
        streetAddress: '3 Fairfield Court, Seven Stars Industrial Estate',
        addressLocality: 'Coventry',
        postalCode: 'CV3 4LJ',
        addressCountry: 'UK'
      },

      // Precise Geographic Location, if applicable
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '52.393691',
        'longitude': '-1.480252'
      },

      // Contact Information, if applicable
      'telephone': '+44-2476-214799',
      'email': 'sales@metzner.co.uk',

      // Hours of Operation, if applicable
      'openingHoursSpecification': [
        {
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '09:00',
          closes: '17:00'
        },
        {
          dayOfWeek: ['Friday'],
          opens: '09:00',
          closes: '16:30'
        }
      ],
      // Images, if applicable
      'image': [
        'https://thecoastalkitchen.com/images/storefront.jpg'
      ],
      'logo': '/logo.png',

      // Payment Options, if applicable
      'paymentAccepted': [
        'Credit Card'
      ],
      'currenciesAccepted': 'GBP,EUR,USD',

      // Social Links, if applicable
      'sameAs': [
        'https://www.metzner.com/support/sales-partners-worldwide/'
      ]
    })
  }
})
