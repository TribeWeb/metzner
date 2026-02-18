<script setup lang="ts">
import type { Reactive } from 'vue'

const state = inject<Reactive<Partial<Schema>>>('state')!

const materialMatcher = useCompatibleMachines(state)
provide('materialMatcher', materialMatcher)
</script>

<template>
  <MaterialMatcherAlert />
</template>
