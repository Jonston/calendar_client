<template>
  <div class="spinner" v-if="loading">
    <loading :active="isLoading"
             :can-cancel="false"
             :is-full-page="false"
             :color="'#fff'"
             :background-color="'#000'"
             :opacity="0.4"
    ></loading>
  </div>
</template>

<script>
import { toRef } from 'vue';
import Loading from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
export default {
  name: 'Spinner',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Loading
  },
  setup(props) {
    const isLoading = toRef(props, 'loading');

    return {
      isLoading
    }
  }
}
</script>

<style lang="scss" scoped>
.spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(1px);
}
</style>
