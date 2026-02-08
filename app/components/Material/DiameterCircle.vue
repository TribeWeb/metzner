<script setup lang="ts">
const props = defineProps({
  cutDiameter: {
    type: Number,
    default: 20
  }
})

const viewBox = computed(() => {
  return {
    y: 0,
    width: props.cutDiameter,
    height: props.cutDiameter
  }
})
const coordinates = computed(() =>
  calculateCircleCoordinates(props.cutDiameter, viewBox.value.height)
)
const strokeWidth = computed(() => props.cutDiameter / 25)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="`-${strokeWidth / 2} -${strokeWidth / 2} ${viewBox.width + strokeWidth} ${viewBox.height + strokeWidth}`"
    class="size-16"
  >
    <pattern
      id="diagonalHatchDiameter"
      width="16"
      height="16"
      patternUnits="userSpaceOnUse"
      :patternTransform="`scale(${strokeWidth / 2}, ${strokeWidth / 2})`"
    >
      <rect width="16" height="16" fill="var(--ui-bg-muted)" />
      <path
        d="M 12 -4 l 8 8 M -0 0 l 16 16 M -4 12 l 8 8"
        stroke="var(--ui-bg-accented)"
        stroke-width="5"
      />
    </pattern>
    <slot />
    <circle
      :cx="coordinates.circleCentre.x"
      :cy="coordinates.circleCentre.y"
      :r="cutDiameter / 2"
      fill="url(#diagonalHatchDiameter)"
      stroke="var(--ui-primary)"
      :stroke-width="strokeWidth / 4"
      stroke-align="inset"
    />
    <line
      :x1="coordinates.bottomLeft.perimeter.x"
      :y1="coordinates.bottomLeft.perimeter.y"
      :x2="coordinates.topRight.perimeter.x"
      :y2="coordinates.topRight.perimeter.y"
      stroke="var(--ui-bg-inverted)"
      :stroke-width="strokeWidth / 4"
      :stroke-dasharray="`${strokeWidth * 2}, ${strokeWidth * 2}`"
    />
    <line
      :x1="coordinates.bottomLeft.perimeter.x"
      :y1="coordinates.bottomLeft.perimeter.y"
      :x2="coordinates.bottomLeft.corner.x"
      :y2="coordinates.bottomLeft.corner.y"
      stroke="var(--ui-bg-inverted)"
      :stroke-width="strokeWidth / 4"
    />
    <line
      :x1="coordinates.bottomLeft.perimeter.x"
      :y1="coordinates.bottomLeft.perimeter.y"
      :x2="coordinates.bottomLeft.perimeter.x"
      :y2="coordinates.bottomLeft.corner.y"
      stroke="var(--ui-bg-inverted)"
      :stroke-width="strokeWidth / 4"
    />
    <line
      :x1="coordinates.bottomLeft.perimeter.x"
      :y1="coordinates.bottomLeft.perimeter.y"
      :x2="coordinates.bottomLeft.corner.x"
      :y2="coordinates.bottomLeft.perimeter.y"
      stroke="var(--ui-bg-inverted)"
      :stroke-width="strokeWidth / 4"
    />
    <line
      :x1="coordinates.topRight.perimeter.x"
      :y1="coordinates.topRight.perimeter.y"
      :x2="coordinates.topRight.corner.x"
      :y2="coordinates.topRight.corner.y"
      stroke="var(--ui-bg-inverted)"
      :stroke-width="strokeWidth / 4"
    />
    <line
      :x1="coordinates.topRight.perimeter.x"
      :y1="coordinates.topRight.perimeter.y"
      :x2="coordinates.topRight.corner.x"
      :y2="coordinates.topRight.perimeter.y"
      stroke="var(--ui-bg-inverted)"
      :stroke-width="strokeWidth / 4"
    />
    <line
      :x1="coordinates.topRight.perimeter.x"
      :y1="coordinates.topRight.perimeter.y"
      :x2="coordinates.topRight.perimeter.x"
      :y2="coordinates.topRight.corner.y"
      stroke="var(--ui-bg-inverted)"
      :stroke-width="strokeWidth / 4"
    />
  </svg>
</template>
