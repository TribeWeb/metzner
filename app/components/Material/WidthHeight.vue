<script setup>
const { machines } = defineProps({
  machines: {
    type: Array,
    default: () => []
  }
})

const cutWidth = defineModel('cutWidth', {
  type: Number,
  default: 0
})
const cutHeight = defineModel('cutHeight', {
  type: Number,
  default: 0
})

const sliderWidth = ref(0)
const sliderHeight = ref(0)

const elDisplay = useTemplateRef('elDisplay')
const elSliderX = useTemplateRef('elSliderX')
const elSliderY = useTemplateRef('elSliderY')
const { height: displayHeight } = useElementSize(elDisplay)
const { height: sliderXHeight } = useElementSize(elSliderX)

const displayAspectRatio = ref(2.4)
const viewBoxOffset = ref(5)

const machinesWithWidthHeight = computed(() =>
  machines.filter(m => m.cutWidth && m.cutHeight)
)

const machinesWithAspectRatio = computed(() => {
  return machinesWithWidthHeight.value.map(m => ({
    cutWidth: m.cutWidth,
    cutHeight: m.cutHeight,
    viewBoxWidth: m.cutWidth / m.cutHeight < displayAspectRatio.value ? m.cutHeight * displayAspectRatio.value : m.cutWidth,
    viewBoxHeight: m.cutWidth / m.cutHeight > displayAspectRatio.value ? m.cutWidth / displayAspectRatio.value : m.cutHeight,
    widthHeight: `${m.cutWidth}x${m.cutHeight}`
  }))
})

const uniqueXY = computed(() =>
  machinesWithAspectRatio.value.filter((obj, index, self) =>
    index === self.findIndex(t => t.widthHeight === obj.widthHeight)
  ).sort((a, b) => a.cutWidth - b.cutWidth)
)

const containingXY = computed(() => uniqueXY.value.find(d => d.cutHeight >= sliderHeight.value && d.cutWidth >= sliderWidth.value))

const widthMax = computed(() => Math.max(...uniqueXY.value.map(o => o.cutWidth)))
const widthMin = computed(() => Math.min(...uniqueXY.value.map(o => o.cutWidth)))
const heightMax = computed(() => Math.max(...uniqueXY.value.map(o => o.cutHeight)))
const heightMin = computed(() => Math.min(...uniqueXY.value.map(o => o.cutHeight)))

const viewBox = useAnimateViewBox(containingXY)

const debouncedFn = useDebounceFn(() => {
  cutWidth.value = sliderWidth.value
  cutHeight.value = sliderHeight.value
}, 500)

onMounted(() => {
  nextTick(() => {
    sliderWidth.value = cutWidth.value || widthMin.value
    sliderHeight.value = cutHeight.value || heightMin.value
    updateWidth(sliderWidth.value)
    updateHeight(sliderHeight.value)
  })
})

function updateHeight(value) {
  sliderHeight.value = value
  debouncedFn()
}

function updateWidth(value) {
  sliderWidth.value = value
  debouncedFn()
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-row">
      <div
        ref="elSliderY"
        :style="`height: ${displayHeight - sliderXHeight + 2}px`"
        class="flex-none w-20 py-3 border border-r-0 border-muted rounded-tl-lg"
      >
        <USlider
          v-model="sliderHeight"
          orientation="vertical"
          :tooltip="{ text: `${sliderHeight} mm`,
                      open: true,
                      arrow: false,
                      content: { side: 'top', avoidCollisions: true, collisionBoundary: [elSliderY], positionStrategy: 'absolute', alignOffset: 3 } }"
          :min="1"
          :max="heightMax"
          :default-value="heightMin"
          @update:model-value="updateHeight"
        />
      </div>
      <div class="flex flex-col flex-1">
        <div
          ref="elDisplay"
          class="flex-1 bg-primary/10 border border-primary/50 rounded-tr-lg"
        >
          <svg
            v-if="containingXY"
            :viewBox="`-1 ${viewBox.y + 1} ${viewBox.width + viewBoxOffset} ${viewBox.height + viewBoxOffset}`"
            class="size-full"
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
              v-for="m in uniqueXY"
              :key="m.widthHeight"
              :x="0"
              :y="containingXY.viewBoxHeight - m.cutHeight + viewBoxOffset"
              :width="m.cutWidth"
              :height="m.cutHeight"
              :fill="(m.cutWidth === containingXY.cutWidth && m.cutHeight === containingXY.cutHeight) ? 'var(--ui-bg)' : 'none'"
              stroke="var(--ui-primary)"
              stroke-width="0.5"
              stroke-dasharray="1, 1"
            />
            <rect
              x="0"
              :y="containingXY.viewBoxHeight - sliderHeight + viewBoxOffset"
              :width="sliderWidth"
              :height="sliderHeight"
              stroke="var(--ui-primary)"
              :stroke-width="(viewBox.width / containingXY.viewBoxWidth) / 2"
              fill="url(#diagonalHatchWidthHeight)"
            />
          </svg>
        </div>
        <div
          ref="elSliderX"
          class="flex-none h-12 px-3 pb-6 pt-14 border border-t-0 border-muted rounded-br-lg"
        >
          <USlider
            v-model="sliderWidth"
            :tooltip="{ text: `${sliderWidth} mm`,
                        open: true,
                        arrow: true,
                        content: { side: 'top', avoidCollisions: true, collisionBoundary: [elSliderX], positionStrategy: 'absolute' } }"
            :min="1"
            :max="widthMax"
            :default-value="widthMin"
            @update:model-value="updateWidth"
          />
        </div>
      </div>
    </div>
  </div>
</template>
