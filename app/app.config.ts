export default defineAppConfig({
  ui: {
    colors: {
      primary: 'metzner',
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

  fonts: {
    experimental: {
      processCSSVariables: true
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
    colorMode: false,
    links: [{
      'label': '02476 214799',
      'icon': 'i-lucide-phone',
      'to': 'tel:+442476214799',
      'target': '_blank',
      'aria-label': 'Call our friendly team'
    }],
    menu: [{
      label: 'Home',
      icon: 'i-lucide-home',
      to: '/',
      name: 'index'
    }, {
      label: 'About',
      icon: 'lucide-smile-plus',
      to: '/about',
      name: 'about-slug',

      children: [{
        label: 'About us',
        description: 'UK distributer for Metzner',
        icon: 'lucide-person-standing',
        to: '/about'
      }, {
        label: 'Contact us',
        description: 'Talk to our team of experts',
        icon: 'lucide-megaphone',
        to: '/contact'
      }]
    }, {
      label: 'Machines',
      icon: 'i-lucide-pocket-knife',
      page: false,
      name: 'machines-landing',
      children: [{
        label: 'Profile, Plastic & Rubber Cutting',
        icon: 'i-lucide-star',
        description: 'Full solutions for cutting hoses, extrusions & gaskets.',
        to: '/machines/profile-plastic-rubber-cutting-machines'
      }, {
        label: 'Cable & Wire Processing',
        icon: 'i-lucide-star',
        description: 'Cutting, stripping and marking cables and wires.',
        to: '/machines/cable-and-wire-processing-machines'
      }, {
        label: 'Corrugated Conduit',
        icon: 'i-lucide-star',
        description: 'Precision cutting of corrugated hoses, pipes and conduit.',
        to: '/machines/corrugated-conduit'
      }, {
        label: 'Spare Parts & Service',
        icon: 'i-lucide-star',
        description: 'Advice and support for your Metzner machines.',
        to: '/machines/spare-parts-and-service'
      }]
    }, {
      label: 'Latest',
      icon: 'i-lucide-file-text',
      to: '/latest',
      name: 'latest-slug'
    }]
  },

  footer: {
    copyright: `Copyright CP Power & Automation © ${new Date().getFullYear()}`,
    credits: 'Website by TribeWeb',
    creditsLink: 'https://tribeweb.co.uk',
    colorMode: true,
    columnHeaders: [{
      id: 'company',
      title: 'Company',
      label: 'Company',
      icon: 'i-lucide-building'
    }, {
      id: 'website',
      title: 'Website',
      label: 'Website',
      icon: 'i-lucide-globe'
    }]
  },

  toc: {
    title: 'On this page',
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
  }
})
