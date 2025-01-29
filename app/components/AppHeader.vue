<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const { header } = useAppConfig()
const menu = computed(() => header.menu || [])
const menuWithoutIcons = computed(() => menu.value.map(({ icon, ...menu }) => menu))

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
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
      v-if="menu"
      :ui="{ viewportWrapper: 'w-[150%] -left-1/2 -right-1/2 mx-auto' }"
      :items="menuWithoutIcons"
      highlight
    />

    <template #title>
      <div class="flex flex-row gap-2">
        <div class="flex flex-col">
          Metzner
          <div class="text-[var(--ui-text)] text-xs font-light font-sans tracking-[0.56em]">
            MACHINES
          </div>
        </div>
        <UBadge
          :ui="{ base: 'h-full items-start rounded-none', label: 'text-xs font-bold font-sans' }"
          color="primary"
          label="UK"
          variant="solid"
          size="sm"
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
