<script setup lang="ts">
const { color } = defineProps({
  color: {
    type: String,
    default: 'currentColor'
  },
  core: {
    type: Array
  },
  reinforced: {
    type: Boolean
  }
})
const width = ref(64)
const height = ref(32)
const margin = computed(() => {
  return width.value / 16
})
const offsetLineSmall = computed(() => {
  return (width.value - margin.value * 2) / 5
})

const svg = {
  width: width.value,
  height: height.value,
  margin: margin.value,
  offsetLineSmall: offsetLineSmall.value
}
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    viewBox="0 0 64 32"
    :color="color"
  >
    <g>
      <g>
        <circle
          :cx="width/2"
          :cy="height/2"
          :r="height/2-margin"
          class="transition duration-500 ease-in-out"
          stroke="currentColor"
          stroke-width="4"
          :fill="core?.includes('solid') ? 'currentColor' : 'background'"
        />
      </g>
      <g
        stroke-dasharray="6 6"
        fill="none"
        stroke-width="1"
        stroke-linecap="round"
        :class="[reinforced ? 'opacity-100' : 'opacity-0']"
        class="steel transition duration-500 ease-in-out"
      ><MaterialSvgCircle :svg />
      </g>
    </g>
  </svg>
</template>

<style>
.steel {
  stroke: var(--color-neutral-200);
}
.dark .steel  {
  stroke: var(--color-neutral-800);
}
.background {
  fill: var(--color-neutral-100);
  opacity: 0;
  stroke: var(--color-neutral-200);
}
.dark .background {
  fill: var(--color-neutral-800);
  stroke: var(--color-neutral-700);
}
</style>
