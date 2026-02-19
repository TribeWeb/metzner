<script setup>
const props = defineProps({
  cutWidth: {
    type: Number,
    default: 20
  },
  cutHeight: {
    type: Number,
    default: 20
  }
})

const viewBox = computed(() => {
  return {
    y: 0,
    width: props.cutWidth,
    height: props.cutHeight
  }
})
</script>

<template>
  <svg
    :viewBox="`0 0 ${viewBox.width} ${viewBox.height}`"
    class="size-16"
  >
    <pattern
      id="diagonalHatchWidthHeight"
      patternUnits="userSpaceOnUse"
      width="16"
      height="16"
    >
      <rect
        width="16"
        height="16"
        fill="var(--ui-bg-muted)"
      />
      <path
        d="M 12 -4 l 8 8 M -0 0 l 16 16 M -4 12 l 8 8"
        stroke="var(--ui-bg-accented)"
        stroke-width="5"
      />
    </pattern>
    <rect
      x="0"
      y="0"
      :width="props.cutWidth"
      :height="props.cutHeight"
      stroke="var(--ui-primary)"
      :stroke-width="(viewBox.width) / 35"
      fill="url(#diagonalHatchWidthHeight)"
    />
  </svg>
</template>
