<script setup lang="ts">
// import type { ContentNavigationItem } from '@nuxt/content'

const route = useRoute()

const { header } = useAppConfig()

const menu = computed(() => header.menu || [])

const menuItemsWithActiveProp = computed(() => {
  // add a `name` property to each menu item so that it that it can be matched to the route `name` property to show when active
  return menu.value.map((menuItem) => {
    const isActive = route.name === menuItem.name
    return { ...menuItem, active: isActive }
  })
})

const menuItemsWithRemovedProps = computed(() =>
// remove any unecessary properties. E.g. `name` is no longer required as we don't want to display one, `icon` is also not needed
  menuItemsWithActiveProp.value.map(({ icon, match, ...menu }) => menu)
)

// const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
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
      v-if="menuItemsWithRemovedProps"
      :ui="{ viewportWrapper: 'w-[150%] -left-1/2 -right-1/2 mx-auto' }"
      :items="menuItemsWithRemovedProps"
      highlight
    />

    <template #title>
      <div class="flex flex-row gap-1.5">
        <div class="flex flex-col">
          Metzner
          <div class="text-[var(--ui-text)] text-xs font-light font-sans tracking-[0.56em]">
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

    <!-- <template #content>
      <UNavigationMenu
        orientation="vertical"
        :items="menu"
        class="-mx-2.5"
      />
      <USeparator
        type="dashed"
        class="my-4"
      />
      <UContentNavigation
        highlight
        :navigation="navigation"
      />
    </template> -->
  </UHeader>
</template>
