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
const { width, height, margin, offsetLineSmall } = svg
</script>

<template>
  <line
    :x1="margin"
    :y1="height-margin"
    :x2="width-margin"
    :y2="height-margin"
  />
  <line
    :x1="offsetLineSmall"
    :y1="height-margin"
    :x2="offsetLineSmall"
    :y2="height-offsetLineSmall"
  />
  <line
    :x1="width-margin"
    :y1="margin"
    :x2="width-margin"
    :y2="height-margin"
  />
  <path d="M 20 26 A 1 1 0 0 1 30 26 V 28 H 20 Z" />
  <path d="M 42 28 C 42 17 49 10 60 10 V 28 Z" />
</template>
