<script setup lang="ts">
const { footer } = useAppConfig()
</script>

<template>
  <UFooter>
    <template #top>
      <UContainer>
        <UFooterColumns :columns="footer?.links">
          <template #right>
            <UFormField name="email" label="Subscribe to our newsletter" size="lg">
              <UInput type="email" class="w-full">
                <template #trailing>
                  <UButton type="submit" size="xs" color="neutral" label="Subscribe" />
                </template>
              </UInput>
            </UFormField>
          </template>
        </UFooterColumns>
      </UContainer>
    </template>
    <template #left>
      {{ footer.credits }}
    </template>

    <template #right>
      <UColorModeButton v-if="footer?.colorMode" />
      <UButton
        color="neutral"
        variant="ghost"
        to="https://tribeweb.co.uk/"
      >
        Website by TribeWeb
      </UButton>
    </template>
  </UFooter>
</template>
