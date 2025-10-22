export default defineAppConfig({
  ui: {
    colors: {
      primary: 'metzner',
      secondary: 'sky',
      neutral: 'zinc'
    },
    icons: {
      chevronDown: 'i-lucide-chevron-down',
      dark: 'i-lucide-moon',
      external: 'i-lucide-arrow-up-right',
      hash: 'i-lucide-hash',
      light: 'i-lucide-sun',
      search: 'i-lucide-search',
      minus: 'i-lucide-minus',
      plus: 'i-lucide-plus',
      check: 'i-lucide-check'
    },
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
      label: 'Machines',
      icon: 'i-lucide-pocket-knife',
      page: false,
      to: '/machines',
      name: 'machines-landing',
      children: [{
        label: 'Cutting machines',
        icon: 'i-lucide-star',
        description: 'Precision cutting of hoses, extrusions & gaskets.',
        to: '/machines'
      }, {
        label: 'Peripherals',
        icon: 'i-lucide-star',
        description: 'Bits and bobs.',
        to: '/peripherals'
      }, {
        label: 'Spare Parts & Service',
        icon: 'i-lucide-star',
        description: 'Advice and support for your Metzner machines.',
        to: '/spares'
      }]
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
  },
  toaster: {
    position: 'bottom-right' as const,
    expand: true,
    duration: 5000
  },
  schemaOrg: {},
  schemaOrg1: [
    {
      'name': 'Material Width Max',
      'value': 'cutWidth',
      'description': 'Maximum width of material that can be processed',
      'unitText': 'mm',
      'unitCode': 'MMT',
      '@type': 'QuantitativeValue',
      'schema': 'hasMeasurement'
    },
    {
      'name': 'Material Height Max',
      'value': 'cutHeight',
      'description': 'Maximum height of material that can be processed',
      'unitText': 'mm',
      'unitCode': 'MMT',
      '@type': 'QuantitativeValue',
      'schema': 'hasMeasurement'
    },
    {
      'name': 'Material Diameter Max',
      'value': 'cutDiameter',
      'description': 'Maximum diameter of material that can be processed',
      'unitText': 'mm',
      'unitCode': 'MMT',
      '@type': 'QuantitativeValue',
      'schema': 'hasMeasurement'
    },
    {
      'name': 'Length Interval',
      'value': 'lengthInterval',
      'description': 'Minimum length interval for cutting',
      'unitText': 'mm',
      'unitCode': 'MMT',
      '@type': 'QuantitativeValue',
      'schema': 'hasMeasurement'
    },
    {
      'name': 'Feeding Speed Max',
      'value': 'feedSpeed',
      'description': 'Maximum feeding speed',
      'unitText': 'm/min',
      'unitCode': '',
      '@type': 'QuantitativeValue',
      'schema': 'hasMeasurement'
    },
    {
      'name': 'Cutting Performance',
      'value': 'cutRate',
      'description': 'Maximum cutting performance',
      'unitText': 'cuts/min',
      'unitCode': 'CPM',
      '@type': 'QuantitativeValue',
      'schema': 'hasMeasurement'
    },
    {
      'name': 'Available Cutting Technologies',
      'value': 'Die cutting, Shear cutting, Draw cutting',
      'description': 'Types of cutting technologies supported',
      'unitText': '',
      'unitCode': '',
      '@type': 'PropertyValue',
      'schema': 'additionalProperty'
    },
    {
      'name': 'Cutting Accuracy',
      'value': 'cutAccuracy',
      'description': 'Positional and repeatable cutting accuracy',
      'unitText': '',
      'unitCode': '',
      '@type': 'PropertyValue',
      'schema': 'additionalProperty'
    },
    {
      'name': 'Dimensions (LxWxH)',
      'value': 'dimensions',
      'description': 'Length x Width x Height',
      'unitText': 'mm',
      'unitCode': '',
      '@type': 'PropertyValue',
      'schema': 'additionalProperty'
    },
    {
      'name': 'Electrical Input',
      'value': 'electricalInput',
      'description': 'Power supply requirements',
      'unitText': '',
      'unitCode': '',
      '@type': 'PropertyValue',
      'schema': 'additionalProperty'
    },
    {
      'name': 'Compressed Air Input',
      'value': 'compressedAirInput',
      'description': 'Required compressed air connection',
      'unitText': '',
      'unitCode': '',
      '@type': 'PropertyValue',
      'schema': 'additionalProperty'
    },
    {
      'name': 'Consumption kVA | bar',
      'value': 'consumption',
      'description': 'Power and air consumption',
      'unitText': '',
      'unitCode': '',
      '@type': 'PropertyValue',
      'schema': 'additionalProperty'
    },
    {
      'name': 'Noise (idle)',
      'value': 'idleNoise',
      'description': 'Noise level during idle operation',
      'unitText': 'dB',
      'unitCode': '',
      '@type': 'PropertyValue',
      'schema': 'additionalProperty'
    }
  ]
})
