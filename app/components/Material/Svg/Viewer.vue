<script setup lang="ts">
interface props {
  shapes: {
    shape: string | undefined
    reinforced: string | undefined
    core: string[] | undefined
    stiffness: string | undefined
    material: string | undefined
    type: string | undefined
  }
}
const { shapes } = defineProps<props>()

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

const colors = ref({
  complex: 'var(--ui-primary)',
  round: 'var(--ui-secondary)'
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    viewBox="0 0 64 32"
  >
    <g :color="colors.complex">
      <g
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
        :class="[shapes.shape === 'complex' ? 'opacity-100' : 'opacity-10']"
        class="transition duration-500 ease-in-out"
      ><MaterialSvgProfile :svg />
      </g>
      <g
        stroke-dasharray="6 6"
        fill="none"
        stroke-width="1"
        stroke-linecap="round"
        :class="[shapes.reinforced === 'steel' && shapes.shape === 'complex' ? 'opacity-100' : 'opacity-0']"
        class="steel transition duration-500 ease-in-out -z-10"
      ><MaterialSvgProfile :svg />
      </g>
      <g
        color="currentColor"
        :class="[shapes.core?.includes('solid') && shapes.shape === 'complex' ? 'opacity-100' : 'opacity-0']"
        class="transition duration-500 ease-in-out -z-10"
      >
        <path
          fill="currentColor"
          d="M 22 26 A 1 1 0 0 1 28 26 Z"
          :class="[shapes.core?.includes('solid') && !shapes.core?.includes('hollow') && shapes.shape === 'complex' ? 'opacity-100' : 'opacity-0']"
          class="transition duration-500 ease-in-out"
        />
        <path d="M 44 26 C 45 17 49 13 58 12 V 26 Z" />
      </g>
    </g>
    <g :color="colors.round">
      <g>
        <circle
          :cx="width/2"
          :cy="height/2"
          :r="height/2-margin"
          class="transition duration-500 ease-in-out"
          stroke="currentColor"
          stroke-width="4"
          :class="[shapes.shape === 'round' ? 'opacity-100' : 'opacity-10', shapes.shape === 'round' ? 'opacity-100' : 'opacity-10']"
          :fill="shapes.core?.includes('solid') ? 'currentColor' : 'background'"
        />
      </g>
      <g
        stroke-dasharray="6 6"
        fill="none"
        stroke-width="1"
        stroke-linecap="round"
        :class="[shapes.reinforced === 'steel' && shapes.shape === 'round' ? 'opacity-100' : 'opacity-0']"
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
