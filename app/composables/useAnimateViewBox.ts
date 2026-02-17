import { transition, TransitionPresets } from '@vueuse/core'

interface Box {
  viewBoxWidth: number
  viewBoxHeight: number
}

interface ViewBox {
  y: number
  width: number
  height: number
}

interface Options {
  duration?: number
  transitionPreset?: keyof typeof TransitionPresets
}

export function useAnimateViewBox(container: Box, options: Options = {}): ComputedRef<ViewBox> {
  const {
    duration = 1000,
    transitionPreset = 'easeOutCubic'
  } = options

  const box = ref(container)
  const viewBoxArray = shallowRef<[number, number, number]>([0, 0, 0])

  const viewBox = computed<ViewBox>(() => {
    const [y, width, height] = viewBoxArray.value
    return {
      y: y,
      width: width,
      height: height
    }
  })

  function animateViewBox(to: [number, number, number], from: [number, number, number] = [0, 0, 0]): void {
    transition(viewBoxArray, from, to, {
      duration,
      transition: TransitionPresets[transitionPreset] || TransitionPresets.easeOutCubic
    })
  }

  onMounted(() => {
    nextTick(() => {
      animateViewBox([0, box.value.viewBoxWidth, box.value.viewBoxHeight])
    })
  })

  watch(box, (newVals: Box, oldVals: Box | undefined) => {
    const fromY = oldVals && newVals.viewBoxHeight === oldVals.viewBoxHeight ? 0 : oldVals ? newVals.viewBoxHeight - oldVals.viewBoxHeight : newVals.viewBoxHeight
    animateViewBox(
      [0, newVals.viewBoxWidth, newVals.viewBoxHeight],
      oldVals ? [fromY, oldVals.viewBoxWidth, oldVals.viewBoxHeight] : [0, 0, 0]
    )
  })

  return viewBox
}
