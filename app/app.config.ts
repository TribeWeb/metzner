export default defineAppConfig({
  ui: {
    colors: {
      primary: 'teal',
      secondary: 'indigo',
      neutral: 'zinc'
    },
    icons: {
      chevronDown: 'i-lucide-chevron-down',
      dark: 'i-lucide-moon',
      external: 'i-lucide-arrow-up-right',
      hash: 'i-lucide-hash',
      light: 'i-lucide-sun',
      search: 'i-lucide-search'
    }
  },

  uiPro: {
    footer: {
      slots: {
        root: 'border-t border-(--ui-border)',
        left: 'text-sm text-(--ui-text-muted)'
      }
    }
  },

  seo: {
    siteName: 'Metzner UK'
  },

  header: {
    logo: {
      alt: '',
      light: '',
      dark: ''
    },
    search: false,
    colorMode: true,
    links: [{
      'label': '02476 1231234',
      'icon': 'i-lucide-phone',
      'to': 'tel:+4424761231234',
      'target': '_blank',
      'aria-label': 'Call our friendly team'
    }],
    menu: [
      {
        label: 'Home',
        icon: 'i-lucide-home',
        to: '/'
      },
      {
        label: 'About us',
        icon: 'lucide-smile-plus',
        to: '/about-us',
        children: [
          {
            label: 'About us',
            description: 'We are lovely.',
            icon: 'lucide-person-standing',
            to: '/about-us'
          },
          {
            label: 'Contact us',
            description: 'Talk to our team.',
            icon: 'lucide-megaphone',
            to: '/about-us/contact-us'
          }
        ]
      },
      {
        label: 'Products',
        icon: 'i-lucide-pocket-knife',
        to: '/products/corrugated-tube-cutting',
        children: [
          {
            label: 'Corrugated tube cutting',
            icon: 'gravity-ui-pipeline',
            description: 'Cut and slit corrugated rubber tubes.',
            to: '/products/corrugated-tube-cutting'
          },
          {
            label: 'Tube cutting',
            icon: 'guidance-fire-hose',
            description: 'Rubber and plastic tubes, hoses & profiles.',
            to: '/products/tube-cutting'
          },
          {
            label: 'Reinforced tube cutting',
            icon: 'icon-park-outline-muscle',
            description: 'Process reinforced rubber profiles & hoses.',
            to: '/products/reinforced-tube-cutting'
          }
        ]
      },
      {
        label: 'Latest',
        icon: 'i-lucide-file-text',
        to: '/latest'
      }
    ]
  },

  footer: {
    credits: 'Copyright © 2025',
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-nuxtdotjs',
      'to': 'https://nuxt.com',
      'target': '_blank',
      'aria-label': 'Nuxt Website'
    }, {
      'icon': 'i-simple-icons-discord',
      'to': 'https://discord.com/invite/ps2h6QT',
      'target': '_blank',
      'aria-label': 'Nuxt UI on Discord'
    }, {
      'icon': 'i-simple-icons-x',
      'to': 'https://x.com/nuxt_js',
      'target': '_blank',
      'aria-label': 'Nuxt on X'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/nuxt/ui',
      'target': '_blank',
      'aria-label': 'Nuxt UI on GitHub'
    }]
  },

  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/nuxt-ui-pro/docs/edit/v3/content',
      links: [{
        icon: 'i-lucide-star',
        label: 'Star on GitHub',
        to: 'https://github.com/nuxt/ui',
        target: '_blank'
      }, {
        icon: 'i-lucide-book-open',
        label: 'Nuxt UI Pro docs',
        to: 'https://ui.nuxt.com/pro/guide',
        target: '_blank'
      }, {
        icon: 'i-simple-icons-nuxtdotjs',
        label: 'Purchase a license',
        to: 'https://ui.nuxt.com/pro/purchase',
        target: '_blank'
      }]
    }
  },

  icon: {
    provider: 'server',
    iconifyApiEndpoint: 'https://api.iconify.design',
    size: '20',
    customCollections: null,
    customize: ''
  }
})
