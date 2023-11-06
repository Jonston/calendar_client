<template>
 <!-- Дядя Бобби сначала хотел сверстать с нуля компонент модального окна, но время поджимает.Поэтому костыльная кастомизация -->
  <div class="calendar-modal modal fade" role="dialog" id="calendar-modal" tabindex="-1" aria-hidden="true" @click.stop>
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <slot name="title"></slot>
          <button type="button" class="calendar-modal-btn-close" data-bs-dismiss="modal" aria-label="Close">
            &#x2715
          </button>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { Modal } from 'bootstrap';
import { onMounted, ref } from "vue";
export default {
  name: 'CalendarModal',
  setup() {
    const modal = ref(null);

    const show = () => {
      modal.value.show();
    };

    const hide = () => {
      modal.value.hide();
    };

    const init = () => {
      const element = document.getElementById('calendar-modal');
      modal.value = new Modal(element);
    };

    onMounted(() => {
      init();
    });

    return {
      modal,
      show,
      hide
    }
  }
}
</script>

<style lang="scss">

</style>
