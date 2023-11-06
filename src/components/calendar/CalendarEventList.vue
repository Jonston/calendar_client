<template>
  <div class="event-list"
       @click.stop
       :class="{ 'event-list--hidden': ! selectedDate }"
       :style="getStyle()"
  >
    <!-- Дядя Бобби попросил меня перенести меня кнопку снизу наверх ради usability -->
    <div class="event-list__actions">
      <h2 class="event-list__title">Events</h2>
      <button class="event-list__button event-list__button--button-add"
              @click="addEvent"
      >Add Event</button>
    </div>
    <div v-for="(event, index) in selectedDateEvents" :key="index">
      <div class="event-list__divider"></div>
      <CalendarEvent :event="event" @edit-event="editEvent(event)"/>
    </div>
  </div>
</template>

<script>
import CalendarEvent from "./CalendarEvent.vue";
import { computed, toRefs } from 'vue';

import { useStore } from "vuex";

export default {
  name: 'CalendarEventList',
  components: {
    CalendarEvent
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    position: {
      type: Object,
      default: () => {
        return {
          x: 0,
          y: 0
        }
      }
    }
  },
  setup(props, { emit }) {
    const {
      visible,
      position
    } = toRefs(props);

    const store = useStore();

    const selectedDate = computed(() => {
      return store.getters.getSelectedDate;
    });

    const selectedDateEvents = computed(() => {
      return store.getters.getSelectedDateEvents;
    });

    const getStyle = () => {
      return {
        left: `${position.value.x}px`,
        top: `${position.value.y}px`,
        width: `${position.value.width}px`,
      }
    }

    const getClass = () => {
      return {
        'event-list--hidden': ! visible.value
      }
    }

    const addEvent = () => {
      store.commit('setSelectedEvent', null);
      emit('add-event');
    }

    const editEvent = (event) => {
      emit('edit-event', event);
    }

    return {
      visible,
      position,
      selectedDate,
      selectedDateEvents,
      getClass,
      getStyle,
      addEvent,
      editEvent,
    }
  }
}

</script>

<style lang="scss" scoped>
.event-list {
  position: absolute;
  box-sizing: border-box;
  padding: 20px;
  max-width: 500px;
  max-height: 600px;
  overflow-y: auto;
  width: 100%;
  background-color: rgba(19, 19, 21, 1);
  border: 1px solid rgba(255, 78, 107, 0.25);
  &--hidden {
    display: none;
  }
  &__title {
    font-size: 32px;
    line-height: 32px;
    font-weight: 200;
    margin: 0;
  }
  &__divider {
    width: 100%;
    height: 1px;
    background-color: rgba(255, 78, 107, 0.25);
    margin: 20px 0;
  }
  &__actions {
    display: flex;
    justify-content: space-between;
  }
  &__button {
    border: none;
    padding: 8px 18px;
    color: #fff;
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    cursor: pointer;
    &:not(:last-child) {
      margin-right: 30px;
    }
    &--button-add {
      color: rgba(19, 19, 21, 1);
      background-color: rgba(255, 78, 107, 1);
    }
  }
}
</style>
