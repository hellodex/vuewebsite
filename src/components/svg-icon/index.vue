<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <svg class="icon-class" aria-hidden="true">
    <use :xlink:href="`#${name}`" :fill="color" />
  </svg>
</template>
<script setup lang="ts">
defineProps({
  name: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#1d1d1f'
  }
})
</script>
