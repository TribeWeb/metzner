<script setup lang="ts">
const { color, core, reinforced } = defineProps({
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
      <g
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
      ><MaterialSvgShape :svg />
      </g>
      <g
        stroke-dasharray="6 6"
        fill="none"
        stroke-width="1"
        stroke-linecap="round"
        :class="[reinforced? 'opacity-100' : 'opacity-0']"
        class="steel transition duration-500 ease-in-out -z-10"
      ><MaterialSvgShape :svg />
      </g>
      <g
        color="currentColor"
        :class="[core?.includes('solid') ? 'opacity-100' : 'opacity-0']"
        class="transition duration-500 ease-in-out -z-10"
      >
        <path
          fill="currentColor"
          d="M 22 26 A 1 1 0 0 1 28 26 Z"
          :class="[core?.includes('solid') && core?.includes('hollow') ? 'opacity-100' : 'opacity-0']"
          class="transition duration-500 ease-in-out"
        />
        <path d="M 44 26 C 45 17 49 13 58 12 V 26 Z" />
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
