export default defineAppConfig({
  ui: {
    colors: {
      primary: 'teal',
      secondary: 'indigo',
      neutral: 'zinc',
    },
    icons: {
      chevronDown: 'i-lucide-chevron-down',
      dark: 'i-lucide-moon',
      external: 'i-lucide-arrow-up-right',
      hash: 'i-lucide-hash',
      light: 'i-lucide-sun',
      search: 'i-lucide-search'
    },
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
        to: '/',
      },
      {
        label: 'Guide',
        icon: 'i-lucide-book-open',
        to: '/guide',
        children: [
          {
            label: 'Introduction',
            description: 'Fully styled and customizable components for Nuxt.',
            icon: 'i-lucide-house'
          },
          {
            label: 'Installation',
            description: 'Learn how to install and configure Nuxt UI in your application.',
            icon: 'i-lucide-cloud-download'
          },
          {
            label: 'Icons',
            icon: 'i-lucide-smile',
            description: 'You have nothing to do, @nuxt/icon will handle it automatically.'
          },
          {
            label: 'Colors',
            icon: 'i-lucide-swatch-book',
            description: 'Choose a primary and a neutral color from your Tailwind CSS theme.'
          },
          {
            label: 'Theme',
            icon: 'i-lucide-cog',
            description: 'You can customize components by using the `class` / `ui` props or in your app.config.ts.'
          }
        ]
      },
      {
        label: 'Components',
        icon: 'i-lucide-box',
        to: '/components',
        children: [
          {
            label: 'Link',
            icon: 'i-lucide-file-text',
            description: 'Use NuxtLink with superpowers.',
            to: '/components/link'
          },
          {
            label: 'Modal',
            icon: 'i-lucide-file-text',
            description: 'Display a modal within your application.',
            to: '/components/modal'
          },
          {
            label: 'NavigationMenu',
            icon: 'i-lucide-file-text',
            description: 'Display a list of links.',
            to: '/components/navigation-menu'
          },
          {
            label: 'Pagination',
            icon: 'i-lucide-file-text',
            description: 'Display a list of pages.',
            to: '/components/pagination'
          },
          {
            label: 'Popover',
            icon: 'i-lucide-file-text',
            description: 'Display a non-modal dialog that floats around a trigger element.',
            to: '/components/popover'
          },
          {
            label: 'Progress',
            icon: 'i-lucide-file-text',
            description: 'Show a horizontal bar to indicate task progression.',
            to: '/components/progress'
          }
        ]
      },
      {
        label: 'Blog',
        icon: 'i-lucide-file-text',
        to: '/blog',
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
  }
})