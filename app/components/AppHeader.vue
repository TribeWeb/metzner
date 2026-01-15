<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const { header } = useAppConfig()

const menu = header.menu || []

const desktopMenuItems = computed<NavigationMenuItem[]>(() => {
  // add `name` property so that it can be matched to the route `name` property to show when active
  // remove icons for desktop menu
  return menu.map(({ icon, ...menuItem }) => {
    const isActive = route.path === menuItem.path
    return { ...menuItem, active: isActive, name: menuItem.name || menuItem.title }
  })
})

const mobileMenuItems = computed<NavigationMenuItem[]>(() => {
  // add `name` propertyso that it can be matched to the route `name` property to show when active
  // add open-default to true for mobile menu items with children
  return menu.map((menuItem) => {
    const isActive = route.path === menuItem.path
    return { ...menuItem, active: isActive, name: menuItem.name || menuItem.title, defaultOpen: true }
  })
})

const machines = inject<Ref<ContentNavigationItem[]>>('machines')
const about = useAboutCategories()
const peripherals = inject<Ref<ContentNavigationItem[]>>('peripherals')

const mobileContentItems = computed<ContentNavigationItem[]>(() => {
  if (route.meta.layout === 'about') {
    return about?.value || []
  } else if (route.meta.layout === 'peripherals') {
    return peripherals?.value || []
  }
  return machines?.value || []
})
</script>

<template>
  <UHeader :ui="{ center: 'flex-1', title: 'font-display text-xl/7 md:text-2xl/7 text-[var(--ui-primary)]' }">
    <UContentSearchButton
      v-if="header?.search"
      label="Search..."
      variant="outline"
      class="w-full"
    >
      <template #trailing>
        <div class="flex items-center gap-0.5 ms-auto">
          <UKbd value="meta" />
          <UKbd value="k" />
        </div>
      </template>
    </UContentSearchButton>

    <UNavigationMenu
      v-if="desktopMenuItems"
      :ui="{ viewportWrapper: 'w-[150%] -left-1/2 -right-1/2 mx-auto' }"
      :items="desktopMenuItems"
      highlight
    />

    <template #title>
      <div class="flex flex-row gap-1.5">
        <div class="flex flex-col">
          Metzner
          <div class="text-default text-xs font-light font-sans tracking-[0.56em]">
            MACHINES
          </div>
        </div>
        <UBadge
          :ui="{ base: 'h-full items-start rounded-none mt-0.5 md:text-[10px]/3 md:px-1.5 md:py-1 md:mt-0', label: 'text-xs font-bold font-sans' }"
          color="primary"
          label="UK"
          variant="solid"
          size="xs"
        />
      </div>
    </template>

    <template #right>
      <UContentSearchButton
        v-if="header?.search"
        class="lg:hidden"
      />

      <UColorModeButton v-if="header?.colorMode" />

      <template v-if="header?.links">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'primary', variant: 'outline', size: 'sm', ...link }"
        >
          {{ link.label }}
          <UBadge
            v-if="link.badge"
            size="md"
            :label="link.badge"
          />
        </UButton>
      </template>
    </template>

    <template #body>
      <UNavigationMenu
        orientation="vertical"
        highlight
        :items="mobileMenuItems"
        class="-mx-2.5"
      />
      <USeparator
        type="dashed"
        class="my-4"
      />
      <UContentNavigation
        highlight
        :navigation="mobileContentItems"
        :ui="{ linkLeadingIcon: 'group-data-[state=open]:text-dimmed' }"
      />
    </template>
  </UHeader>
</template>
