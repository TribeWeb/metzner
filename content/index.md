---
seo:
  title: Welcome
  description: Nuxt UI Pro is a collection of premium Vue components built on top
    of Nuxt UI to create beautiful & responsive Nuxt applications in minutes.
---

::material-picker
---
headerCopy:
  title: Material Picker
  description: Specify the material you need to cut, and we'll identify the most suitable cutting machines from our range.
formItemsCopy:
  shape:
    category: Cross section
    legend: Shape
    description: Is the material a pipe, hose, conduit - or cord with a round cross section or does it have a more complex profile?
  core:
    category: Cross section
    legend: Core
    description: Is the core of the material solid or hollow? Complex profiles may have both solid and hollow portions.
  reinforced:
    category: Cross section
    legend: Reinforced
    description: Is there steel reinforcement running along the length of the material?
  stiffness:
    category: Longitudinal section
    legend: Stiffness
    description: Is the material a flexible hose, cord or profile - or a rigid pipe or extrusion?
  cutDiameter:
    category: Dimensions
    legend: Diameter
    description: What is the outer diameter of the material cross section?
  cutWidthHeight:
    category: Dimensions
    legend: Width & height
    description: What is the width and height of the material cross section?
---
::

::u-page-hero
---
orientation: vertical
---
  :::u-page-marquee{:overlay='false' pause-on-hover}
    ::::u-page-card
    ---
    description: bob
    icon: i-simple-icons-nuxtdotjs
    title: Nuxt UI Pro
    variant: subtle
    ---
    :nuxt-img{alt="undefined" src="/machines/st-ob.webp" width="250px"}
    ::::
  
    ::::u-page-card
    ---
    description: bobina
    icon: i-simple-icons-nuxtdotjs
    title: Nuxt UI Ama
    ---
    :nuxt-img{alt="undefined" src="/machines/st-ob.webp" width="250px"}
    ::::
  :::

#title
Machines that cut stuff really well

#description
Thery're excellent

#headline
  :::u-button
  ---
  class: rounded-full
  size: sm
  to: https://ui.nuxt.com/pro
  variant: subtle
  ---
  Made with German engineering
  :::

#links
  :::u-button{:to='null' size="xl" trailing-icon="i-lucide-arrow-down"}
  Get started
  :::
::

::u-page-section
#title
Precision cutting.

#description
Perfectly repeated. Again and again…

#links
  :::u-button
  ---
  color: neutral
  size: lg
  target: _blank
  to: /latest
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  Explore the Metzner range
  :::

#features
  :::u-page-feature
  ---
  icon: i-emojione-monotone:flag-for-germany
  target: _blank
  to: https://nuxt.com
  ---
  #title
  Engineered in Germany
  
  #description
  Maximise production uptime and enjoy reliable operation year after year.
  :::

  :::u-page-feature
  ---
  icon: i-tdesign:precise-monitor
  target: _blank
  to: https://content.nuxt.com
  ---
  #title
  Optimised for accurate, repeatable cuts
  
  #description
  Enhance the quality of your products while minimising wastage.
  :::

  :::u-page-feature
  ---
  icon: i-game-icons:spanner
  target: _blank
  to: https://ui.nuxt.com
  ---
  #title
  Serviceable with parts availablity
  
  #description
  Enjoy an assured and maximised return on investment.
  :::

  :::u-page-feature
  ---
  icon: i-streamline:user-protection-2-solid
  target: _blank
  to: https://www.typescriptlang.org
  ---
  #title
  Safety designed in
  
  #description
  Integrated guards and stop systems help operators work safely.
  :::

  :::u-page-feature
  ---
  icon: i-material-symbols:machine-image
  target: _blank
  to: https://content.nuxt.com/docs/studio
  ---
  #title
  Full range of peripherals
  
  #description
  Integrate with compatible peripherals and existing systems to automate whole sections of production.
  :::

  :::u-page-feature
  ---
  icon: i-ic:baseline-dashboard-customize
  target: _blank
  to: https://ui.nuxt.com/pro/components/docs/docs-search
  ---
  #title
  Customisation
  
  #description
  Specify special requirements. E.g. stainless steel for medical applications.
  :::
::
