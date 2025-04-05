<script setup lang="ts">
const { color } = defineProps({
  color: {
    type: String,
    default: 'currentColor'
  }
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    viewBox="0 0 64 32"
    :color="color"
  >
    <g>
      <path
        d="m 53 15 q 0 22 -24 6 q -6 -4 -15 0 q -3 1 -6 0"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <animate
          repeatCount="indefinite"
          attributeName="d"
          dur="1.5s"
          values="m 53 15 q 0 22 -24 6 q -6 -4 -15 0 q -3 1 -6 0;
          m 53 15 q 0 6 -24 6 q -6 0 -15 0 q -3 0 -6 0;
          m 53 15 q 0 22 -24 6 q -6 -4 -15 0 q -3 1 -6 0;"
        />
      </path>
    </g>
    <g transform="translate(48, 12)">
      <g class="animate-[spin_3000ms_linear_infinite]">
        <circle
          fill="currentColor"
          r="8"
        />
        <path
          id="reelHole"
          d="m -0.5 2 q 0.5 -1.5 1 0 l 1.5 4 c 0 1 -4 1 -4 0 z"
          fill="background"
        />
        <use href="#reelHole" transform="rotate(+72)" />
        <use href="#reelHole" transform="rotate(+144)" />
        <use href="#reelHole" transform="rotate(+216)" />
        <use href="#reelHole" transform="rotate(+288)" />
      </g>
    </g>
  </svg>
</template>
