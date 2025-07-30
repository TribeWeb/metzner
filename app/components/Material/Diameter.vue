<script setup>
import { useDebounceFn, useElementSize } from '@vueuse/core'

const { machines } = defineProps({
  machines: {
    type: Array,
    default: () => []
  }
})

const cutDiameter = defineModel({
  type: Number,
  default: 0
})

const slider = ref(0)

const elSliderX = useTemplateRef('elSliderX')
const elDisplay = useTemplateRef('elDisplay')
const { width: displayWidth, height: displayHeight } = useElementSize(elDisplay)

const displayAspectRatio = ref(2)
// const displayAspectRatio = computed(() => displayWidth.value / displayHeight.value)

const machinesWithDiameter = computed(() =>
  machines.filter(m => m.cutDiameter)
)

const machinesWithAspectRatio = computed(() => {
  return machinesWithDiameter.value.map(m => ({
    cutDiameter: m.cutDiameter,
    viewBoxWidth: m.cutDiameter * displayAspectRatio.value,
    viewBoxHeight: m.cutDiameter,
    widthHeight: `${m.cutDiameter}`
  }))
})

const uniqueXY = computed(() =>
  machinesWithAspectRatio.value.filter((obj, index, self) =>
    index === self.findIndex(t => t.widthHeight === obj.widthHeight)
  ).sort((a, b) => a.cutDiameter - b.cutDiameter)
)

const containingXY = computed(() => uniqueXY.value.find(d => d.cutDiameter >= slider.value))

const diameterMax = computed(() => Math.max(...uniqueXY.value.map(o => o.cutDiameter)))
const diameterMin = computed(() => Math.min(...uniqueXY.value.map(o => o.cutDiameter)))

const viewBox = useAnimateViewBox(containingXY)

const coordinates = computed(() =>
  calculateCircleCoordinates(slider.value, viewBox.value.height)
)

const strokeWidth = computed(() => containingXY.value.cutDiameter / 50)

const debouncedFn = useDebounceFn(() => {
  cutDiameter.value = slider.value
}, 500)

onMounted(() => {
  nextTick(() => {
    slider.value = cutDiameter.value || diameterMin.value
    updateDiameter(slider.value)
  })
})

function updateDiameter(value) {
  slider.value = value
  debouncedFn()
}
</script>

<template>
  <div class="sm:w-96 flex flex-col">
    <div ref="elDisplay" class="flex flex-col flex-1 h-full">
      <div class="flex-1 bg-primary/10 border border-primary/50 rounded-t-lg">
        <svg v-if="cutDiameter" :viewBox="`-${strokeWidth} ${strokeWidth / 2} ${viewBox.width + strokeWidth} ${viewBox.height + strokeWidth}`" class="size-full">
          <pattern id="diagonalHatchDiameter" width="16" height="16" patternUnits="userSpaceOnUse" :patternTransform="`scale(${strokeWidth / 2}, ${strokeWidth / 2})`">
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
                :r="slider / 2"
              />
            </clipPath>
          </defs>

          <!-- Reference circles -->
          <circle
            v-for="d in uniqueXY"
            :key="d.widthHeight"
            :cx="d.cutDiameter / 2"
            :cy="viewBox.height - (d.cutDiameter / 2) + strokeWidth"
            :r="d.cutDiameter / 2"
            :fill="d.cutDiameter === containingXY.cutDiameter ? 'var(--ui-bg)' : 'none'"
            stroke="var(--ui-primary)"
            :stroke-width="strokeWidth / 6"
            :stroke-dasharray="`${strokeWidth / 2}, ${strokeWidth / 2}`"
          />

          <!-- Main circle -->
          <circle
            :cx="coordinates.circleCentre.x"
            :cy="coordinates.circleCentre.y + strokeWidth"
            :r="slider / 2"
            fill="url(#diagonalHatchDiameter)"
            stroke="var(--ui-primary)"
            :stroke-width="strokeWidth"
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

          <!-- Bottom left corner -->
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

          <!-- Top right corner -->
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
      </div>
      <div ref="elSliderX" class="flex-none h-12 px-3 pb-6 pt-14 border border-t-0 border-muted rounded-b-lg">
        <USlider
          v-model="slider"
          :tooltip="{ text: `⌀${slider} mm`,
                      open: true,
                      arrow: true,
                      content: { side: 'top', avoidCollisions: true, collisionBoundary: [elSliderX], positionStrategy: 'absolute' } }"
          :min="1"
          :max="diameterMax"
          :default-value="diameterMin"
          @update:model-value="updateDiameter"
        />
      </div>
    </div>
  </div>
</template>
