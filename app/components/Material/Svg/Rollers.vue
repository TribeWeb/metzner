<script setup lang="ts">
interface Props {
  shape: string
}
const { shape } = defineProps<Props>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="200"
    height="100"
    viewbox="0 0 64 32"
    :color="shape === 'complex' ? 'var(--ui-primary)' : 'var(--ui-secondary)'"
    class="w-full"
  >
    <!-- <rect width="100%" height="100%" stroke="green" fill="none" /> -->
    <g>
      <path
        :d="`m 8 16 l 48 0`"
        stroke-dasharray="21 4"
        stroke-dashoffset="4"
        stroke="currentColor"
        stroke-width="1.5"
        fill="none"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;50"
          dur="3s"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </path>
    </g>
    <g transform="translate(32, 10)">
      <g class="animate-[spin_3000ms_linear_infinite]">
        <g id="roller">
          <circle
            fill="currentColor"
            r="6"
          />
          <circle
            fill="currentColor"
            stroke-width="0.25"
            stroke="background"
            r="3"
          />
          <circle
            fill="currentColor"
            stroke-width="0.25"
            stroke="background"
            r="2"
          />
          <!-- <path
            id="rollerHole"
            d="m -0.25 2 q 0.25 -0.75 0.5 0 l 0.25 3 c 0 0.25 -1 0.25 -1 0 z"
            fill="background"
          /> -->
          <circle
            id="rollerHole"
            r="0.5"
            :cx="2.5"
            :cy="0"
            fill="background"
          />
          <use href="#rollerHole" transform="rotate(+72)" />
          <use href="#rollerHole" transform="rotate(+144)" />
          <use href="#rollerHole" transform="rotate(+216)" />
          <use href="#rollerHole" transform="rotate(+288)" />
        </g>
      </g>
    </g>
    <g transform="translate(32, 22)">
      <g class="animate-[revspin_3000ms_linear_infinite]">
        <use href="#roller" />
      </g>
    </g>
  </svg>
</template>
