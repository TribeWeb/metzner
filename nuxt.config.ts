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
      // '@type': '...', // Choose from https://schema.org/LocalBusiness#subtypes

      // Basic Information (Required)
      name: 'The Coastal Kitchen',
      description: 'Farm-to-table restaurant specializing in sustainable seafood and seasonal ingredients',
      url: 'https://thecoastalkitchen.com',

      // Location (Required)
      address: {
        streetAddress: '742 Oceanview Boulevard, Suite 100',
        addressLocality: 'Santa Cruz',
        addressRegion: 'CA',
        postalCode: '95060',
        addressCountry: 'US'
      },

      // Precise Geographic Location, if applicable
      geo: {
        '@type': 'GeoCoordinates',
        'latitude': '36.9741',
        'longitude': '-122.0308'
      },

      // Contact Information, if applicable
      telephone: '+1-831-555-0123',
      email: 'hello@thecoastalkitchen.com',

      // Hours of Operation, if applicable
      openingHoursSpecification: [
        {
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '11:30:00',
          closes: '22:00:00'
        },
        {
          dayOfWeek: ['Friday', 'Saturday'],
          opens: '11:30:00',
          closes: '23:00:00'
        },
        {
          dayOfWeek: 'Sunday',
          opens: '10:00:00', // Sunday Brunch
          closes: '21:00:00'
        }
      ],

      // Business Details, if applicable
      priceRange: '$$$', // $, $$, $$$, or $$$$
      servesCuisine: [
        'Seafood',
        'California',
        'Farm-to-table'
      ],

      // Menu (for restaurants)
      menu: 'https://thecoastalkitchen.com/menu',

      // Images, if applicable
      image: [
        'https://thecoastalkitchen.com/images/storefront.jpg',
        'https://thecoastalkitchen.com/images/interior.jpg',
        'https://thecoastalkitchen.com/images/food.jpg'
      ],
      logo: '/logo.png',

      // Payment Options, if applicable
      paymentAccepted: [
        'Cash',
        'Credit Card',
        'Cryptocurrency'
      ],
      currenciesAccepted: 'USD',

      // Additional Business Details, if applicable
      isAccessibleForDisabled: true,
      amenityFeature: [
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'Parking',
          'value': true
        },
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'Wheelchair Accessible',
          'value': true
        },
        {
          '@type': 'LocationFeatureSpecification',
          'name': 'Outdoor Seating',
          'value': true
        }
      ],

      // Social Links, if applicable
      sameAs: [
        'https://www.facebook.com/coastalkitchen',
        'https://instagram.com/thecoastalkitchen',
        'https://twitter.com/coastalkitchen'
      ]
    })
  }
})
