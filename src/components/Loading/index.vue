<template>
  <div class="canvas-box" id="canvas-box">
    <canvas ref="canvas" id="canvas"></canvas>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { Rive } from '@rive-app/canvas'

export default defineComponent({
  name: 'RiveComponent',
  props: {
    src: String
  },
  mounted() {
    new Rive({
      canvas: this.$refs.canvas,
      // Load a local riv `loading.riv` or upload your own!
      // src: 'https://cdn.rive.app/animations/vehicles.riv',
      src: '/loadingDark.riv',
      // Be sure to specify the correct state machine (or animation) name
      // stateMachines: 'bumpy', // Name of the State Machine to play
      autoplay: true
    })
  }
})
</script>
<style scoped lang="scss">
.canvas-box {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: var(--bg-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
