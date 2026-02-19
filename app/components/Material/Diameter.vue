<script setup>
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

const displayAspectRatio = ref(2.4)

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
const hatchScale = computed(() => containingXY.value.cutDiameter / 100)
const svgViewBox = computed(() => `-${strokeWidth.value / 2} ${strokeWidth.value / 2} ${viewBox.value.width + strokeWidth.value} ${viewBox.value.height + strokeWidth.value}`)

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
  <div class="flex flex-col">
    <div class="flex-1 bg-primary/10 border border-primary/50 rounded-t-lg">
      <svg
        v-if="cutDiameter"
        :viewBox="svgViewBox"
        class="size-full"
      >
        <MaterialDiameterCircle
          inline
          :cut-diameter="slider"
          :view-box-height="viewBox.height"
          :stroke-width="strokeWidth"
          :circle-stroke-width="strokeWidth"
          :pattern-scale="hatchScale"
          :dash-scale="2"
          :circle-y-offset="strokeWidth"
        >
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
        </MaterialDiameterCircle>
      </svg>
    </div>
    <div
      ref="elSliderX"
      class="flex-none h-12 px-3 pb-6 pt-14 border border-t-0 border-muted rounded-b-lg"
    >
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
</template>
