<script setup lang="ts">
const props = defineProps({
  cutDiameter: {
    type: Number,
    default: 20
  },
  viewBoxHeight: {
    type: Number,
    default: undefined
  },
  strokeWidth: {
    type: Number,
    default: undefined
  },
  circleStrokeWidth: {
    type: Number,
    default: undefined
  },
  patternScale: {
    type: Number,
    default: undefined
  },
  dashScale: {
    type: Number,
    default: 1
  },
  circleYOffset: {
    type: Number,
    default: 0
  },
  inline: {
    type: Boolean,
    default: false
  },
  svgClass: {
    type: String,
    default: 'size-16'
  }
})

const svgId = useId()

const diameter = computed(() => props.cutDiameter)
const resolvedViewBoxHeight = computed(() => props.viewBoxHeight ?? diameter.value)
const resolvedStrokeWidth = computed(() => props.strokeWidth ?? (diameter.value / 10))
const resolvedCircleStrokeWidth = computed(() => props.circleStrokeWidth ?? (resolvedStrokeWidth.value / 4))
const resolvedPatternScale = computed(() => props.patternScale ?? (diameter.value / 50))
const hatchPatternId = computed(() => `diagonalHatchDiameter-${svgId}`)
const dashArray = computed(() => `${resolvedStrokeWidth.value * props.dashScale}, ${resolvedStrokeWidth.value * props.dashScale}`)

const viewBox = computed(() => {
  return {
    y: 0,
    width: diameter.value,
    height: resolvedViewBoxHeight.value
  }
})
const coordinates = computed(() =>
  calculateCircleCoordinates(diameter.value, viewBox.value.height)
)
const svgViewBox = computed(() => {
  const stroke = resolvedStrokeWidth.value
  return `-${stroke / 2} -${stroke / 2} ${viewBox.value.width + stroke} ${viewBox.value.height + stroke}`
})

const rootElement = computed(() => props.inline ? 'g' : 'svg')
const rootAttrs = computed(() => {
  if (props.inline) {
    return {}
  }

  return {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: svgViewBox.value,
    class: props.svgClass
  }
})
</script>

<template>
  <component :is="rootElement" v-bind="rootAttrs">
    <slot />
    <pattern
      :id="hatchPatternId"
      width="16"
      height="16"
      patternUnits="userSpaceOnUse"
      :patternTransform="`scale(${resolvedPatternScale})`"
    >
      <rect width="16" height="16" fill="var(--ui-bg-muted)" />
      <path
        d="M 12 -4 l 8 8 M -0 0 l 16 16 M -4 12 l 8 8"
        stroke="var(--ui-bg-accented)"
        stroke-width="5"
      />
    </pattern>
    <circle
      :cx="coordinates.circleCentre.x"
      :cy="coordinates.circleCentre.y + circleYOffset"
      :r="diameter / 2"
      :fill="`url(#${hatchPatternId})`"
      stroke="var(--ui-primary)"
      :stroke-width="resolvedCircleStrokeWidth"
      stroke-align="inset"
    />
    <line
      :x1="coordinates.bottomLeft.perimeter.x"
      :y1="coordinates.bottomLeft.perimeter.y"
      :x2="coordinates.topRight.perimeter.x"
      :y2="coordinates.topRight.perimeter.y"
      stroke="var(--ui-bg-inverted)"
      :stroke-width="resolvedStrokeWidth / 4"
      :stroke-dasharray="dashArray"
    />
    <line
      :x1="coordinates.bottomLeft.perimeter.x"
      :y1="coordinates.bottomLeft.perimeter.y"
      :x2="coordinates.bottomLeft.corner.x"
      :y2="coordinates.bottomLeft.corner.y"
      stroke="var(--ui-bg-inverted)"
      :stroke-width="resolvedStrokeWidth / 4"
    />
    <line
      :x1="coordinates.bottomLeft.perimeter.x"
      :y1="coordinates.bottomLeft.perimeter.y"
      :x2="coordinates.bottomLeft.perimeter.x"
      :y2="coordinates.bottomLeft.corner.y"
      stroke="var(--ui-bg-inverted)"
      :stroke-width="resolvedStrokeWidth / 4"
    />
    <line
      :x1="coordinates.bottomLeft.perimeter.x"
      :y1="coordinates.bottomLeft.perimeter.y"
      :x2="coordinates.bottomLeft.corner.x"
      :y2="coordinates.bottomLeft.perimeter.y"
      stroke="var(--ui-bg-inverted)"
      :stroke-width="resolvedStrokeWidth / 4"
    />
    <line
      :x1="coordinates.topRight.perimeter.x"
      :y1="coordinates.topRight.perimeter.y"
      :x2="coordinates.topRight.corner.x"
      :y2="coordinates.topRight.corner.y"
      stroke="var(--ui-bg-inverted)"
      :stroke-width="resolvedStrokeWidth / 4"
    />
    <line
      :x1="coordinates.topRight.perimeter.x"
      :y1="coordinates.topRight.perimeter.y"
      :x2="coordinates.topRight.corner.x"
      :y2="coordinates.topRight.perimeter.y"
      stroke="var(--ui-bg-inverted)"
      :stroke-width="resolvedStrokeWidth / 4"
    />
    <line
      :x1="coordinates.topRight.perimeter.x"
      :y1="coordinates.topRight.perimeter.y"
      :x2="coordinates.topRight.perimeter.x"
      :y2="coordinates.topRight.corner.y"
      stroke="var(--ui-bg-inverted)"
      :stroke-width="resolvedStrokeWidth / 4"
    />
  </component>
</template>
