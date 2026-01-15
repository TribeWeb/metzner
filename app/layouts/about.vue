<script setup lang="ts">
const navigation = useAboutCategories()
</script>

<template>
  <UContainer>
    <UPage>
      <template #left>
        <UPageAside>
          <UContentNavigation
            highlight
            :navigation="navigation"
            :collapsible="false"
            :ui="{ linkLeadingIcon: 'group-data-[state=open]:text-dimmed' }"
          />
        </UPageAside>
      </template>

      <slot />
    </UPage>
  </UContainer>
</template>
