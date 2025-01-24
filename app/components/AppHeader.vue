<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { header } = useAppConfig()
// , root: 'bg-[var(--ui-primary)]/75', title: 'text-[var(--ui-text-highlighted)]'
</script>

<template>
  <UHeader :ui="{ center: 'flex-1', title: 'text-3xl' }">
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
      v-if="header?.menu"
      :items="header.menu"
      highlight
      orientation="horizontal"
      class="data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48"
    />

    <template #title>
      <template v-if="header?.logo?.dark || header?.logo?.light">
        <UColorModeImage
          v-bind="header?.logo"
          class="h-6 w-auto"
        />
      </template>
      <template v-else>
        Metzner
        <UBadge
          :ui="{ base: 'mb-1.5' }"
          color="primary"
          label="UK"
          variant="solid"
        />
      </template>
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
      <UContentNavigation
        highlight
        :navigation="header.menu"
      />
    </template>
  </UHeader>
</template>
