<script setup lang="ts">
interface Props {
  svg: {
    width: number
    height: number
    margin: number
    offsetLineSmall: number
  }
}
const { svg } = defineProps<Props>()
const { width, height, margin } = svg
</script>

<template>
  <circle
    :cx="width/2"
    :cy="height/2"
    :r="height/2-margin"
  />
</template>
