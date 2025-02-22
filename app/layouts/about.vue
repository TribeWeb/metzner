<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const aboutLinks = inject<Ref<ContentNavigationItem[]>>('aboutLinks')
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <UContentNavigation
            type="single"
            highlight
            :navigation="aboutLinks"
          />
        </UPageAside>
      </template>

      <slot />
    </UPage>
  </UContainer>
</template>
