<script setup>
import { useElementSize } from '@vueuse/core'

const { machines } = defineProps({
  machines: {
    type: Array,
    default: () => []
  }
})

const diameter = defineModel({
  type: Number,
  default: 0
})

const el = useTemplateRef('el')
const { width, height } = useElementSize(el)

const uniqueDiameters = computed(() =>
  [...new Set(machines?.map(m => m?.cutDiameter))].sort((a, b) => a - b)
)

const machineMax = computed(() => Math.max(...uniqueDiameters.value))
const machineMin = computed(() => Math.min(...uniqueDiameters.value))
const minimumSpecDiameter = computed(() =>
  Math.min(...uniqueDiameters.value.filter(d => d > diameter.value))
)

const coordinates = computed(() =>
  calculateCoordinates(diameter.value, machineMax.value, width.value, height.value)
)

onMounted(() => {
  if (diameter.value === 0) {
    diameter.value = machineMin.value
  }
})

function updateDiameter(value) {
  diameter.value = value
}
</script>

<template>
  <div class="sm:w-96 flex flex-col">
    <div
      ref="el"
      class="p-3 bg-primary/10 border border-primary/50 rounded-t-lg z-1 relative inline-flex items-center justify-start"
    >
      <svg v-if="diameter" :width="width" :height="machineMax">
        <pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="16" height="16">
          <rect width="16" height="16" fill="var(--ui-bg-muted)" />
          <path
            d="M 12 -4 l 8 8 M -0 0 l 16 16 M -4 12 l 8 8"
            stroke="var(--ui-bg-accented)"
            stroke-width="5"
          />
        </pattern>
        <defs>
          <clipPath id="insideCircleOnly">
            <circle
              :cx="coordinates.circleCentre.x"
              :cy="coordinates.circleCentre.y"
              :r="diameter / 2"
            />
          </clipPath>
        </defs>

        <!-- Reference circles -->
        <circle
          v-for="d in uniqueDiameters"
          :key="d"
          :cx="(d / machineMax) * (width - (machineMax / 2))"
          :cy="height - (d / 2)"
          :r="d / 2"
          :fill="d === minimumSpecDiameter ? 'var(--ui-bg)' : 'none'"
          stroke="var(--ui-primary)"
          stroke-width="0.5"
          stroke-dasharray="2, 2.5"
        />

        <!-- Main circle -->
        <circle
          :cx="coordinates.circleCentre.x"
          :cy="coordinates.circleCentre.y"
          :r="diameter / 2"
          fill="url(#diagonalHatch)"
          stroke="var(--ui-primary)"
          stroke-width="4"
          clip-path="url(#insideCircleOnly)"
        />

        <line
          :x1="coordinates.bottomLeft.perimeter.x"
          :y1="coordinates.bottomLeft.perimeter.y"
          :x2="coordinates.topRight.perimeter.x"
          :y2="coordinates.topRight.perimeter.y"
          stroke="var(--ui-bg-inverted)"
          stroke-width="1"
          stroke-dasharray="3, 2"
        />

        <!-- Bottom left corner -->

        <line
          :x1="coordinates.bottomLeft.perimeter.x"
          :y1="coordinates.bottomLeft.perimeter.y"
          :x2="coordinates.bottomLeft.corner.x"
          :y2="coordinates.bottomLeft.corner.y"
          stroke="var(--ui-bg-inverted)"
          stroke-width="1"
        />
        <line
          :x1="coordinates.bottomLeft.perimeter.x"
          :y1="coordinates.bottomLeft.perimeter.y"
          :x2="coordinates.bottomLeft.perimeter.x"
          :y2="coordinates.bottomLeft.corner.y"
          stroke="var(--ui-bg-inverted)"
          stroke-width="1"
        />
        <line
          :x1="coordinates.bottomLeft.perimeter.x"
          :y1="coordinates.bottomLeft.perimeter.y"
          :x2="coordinates.bottomLeft.corner.x"
          :y2="coordinates.bottomLeft.perimeter.y"
          stroke="var(--ui-bg-inverted)"
          stroke-width="1"
        />

        <!-- Top right corner -->
        <line
          :x1="coordinates.topRight.perimeter.x"
          :y1="coordinates.topRight.perimeter.y"
          :x2="coordinates.topRight.corner.x"
          :y2="coordinates.topRight.corner.y"
          stroke="var(--ui-bg-inverted)"
          stroke-width="1"
        />
        <line
          :x1="coordinates.topRight.perimeter.x"
          :y1="coordinates.topRight.perimeter.y"
          :x2="coordinates.topRight.corner.x"
          :y2="coordinates.topRight.perimeter.y"
          stroke="var(--ui-bg-inverted)"
          stroke-width="1"
        />
        <line
          :x1="coordinates.topRight.perimeter.x"
          :y1="coordinates.topRight.perimeter.y"
          :x2="coordinates.topRight.perimeter.x"
          :y2="coordinates.topRight.corner.y"
          stroke="var(--ui-bg-inverted)"
          stroke-width="1"
        />

      </svg>
    </div>
    <div class="px-3 pb-6 pt-14 border border-t-0 border-muted rounded-b-lg">
      <USlider
        :tooltip="{ text: `⌀${diameter} mm`, open: true, arrow: true, content: { side: 'top', avoidCollisions: true, collisionBoundary: [el] } }"
        :min="1"
        :max="machineMax"
        :default-value="machineMin"
        @update:model-value="updateDiameter"
      />
    </div>
  </div>
</template>
