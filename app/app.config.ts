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
        label: 'About',
        description: 'UK distributer for Metzner',
        icon: 'lucide-person-standing',
        to: '/about'
      }, {
        label: 'Contact',
        description: 'Talk to our team of experts',
        icon: 'lucide-megaphone',
        to: '/about/contact'
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
    credits: 'Copyright CP Power & Automation © 2025',
    colorMode: true,
    links: [
      {
        label: 'Website',
        children: [
          {
            'label': 'Terms & conditions',
            'to': 'https://cppowerautomation.com/terms.aspx',
            'target': '_blank',
            'aria-label': 'Terms and conditions'
          },
          {
            'label': 'Privacy policy',
            'to': 'https://cppowerautomation.com/security-privacy.aspx',
            'target': '_blank',
            'aria-label': 'Privacy policy'
          },
          {
            'label': 'Sitemap',
            // 'to': '/sitemap.xml',
            'to': '/',
            'aria-label': 'Metzner UK sitemap'
          }
        ]
      },
      {
        label: 'Company',
        children: [
          {
            'label': 'Contact us',
            'to': '/about/contact',
            'aria-label': 'Contact details'
          },
          {
            'label': 'Metzner, Germany',
            'to': 'https://www.metzner.com',
            'target': '_blank',
            'aria-label': 'Metzner, Germany'
          },
          {
            'label': 'CP Power & Automation',
            'to': 'https://cppowerautomation.com',
            'target': '_blank',
            'aria-label': 'CP Power & Automation main site'
          }
        ]
      }
    ]
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
