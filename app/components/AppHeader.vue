<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const { header } = useAppConfig()
const menu = computed(() => header.menu || [])
const menuWithoutIcons = computed(() => menu.value.map(({ icon, ...menu }) => menu))


const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

// , root: 'bg-[var(--ui-primary)]/75', title: 'text-[var(--ui-text-highlighted)]'
</script>

<template>
  <UHeader :ui="{ center: 'flex-1', title: 'font-display text-2xl text-[var(--ui-primary)]' }">
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

    <UNavigationMenu :ui="{ viewportWrapper: 'w-[150%] -left-1/2 -right-1/2 mx-auto' }"
      v-if="menu"
      :items="menuWithoutIcons"
      highlight
    />

    <template #title>
      <!-- <template v-if="header?.logo?.dark || header?.logo?.light">
        <UColorModeImage
          v-bind="header?.logo"
          class="h-6 w-auto"
        />
      </template> -->
      Metzner
      <UBadge
        :ui="{ base: 'mb-1.5', label: 'text-xs font-bold font-sans' }"
        color="primary"
        label="UK"
        variant="solid"
      />
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
          v-bind="{ color: 'primary', variant: 'solid', size: 'sm', ...link }"
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

    <template #content>
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
    </template>
  </UHeader>
</template>
