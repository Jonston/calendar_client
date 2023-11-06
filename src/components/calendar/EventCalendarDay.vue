<template>
  <div :class="getClass()" class="day" ref="element" @click.stop="selectDate">
    <span class="day__number">{{ day.format("D") }}</span>
    <div class="day__events" v-if="isMonthDay()">
      <div class="day__event day__event--red"
           v-if="eventTypes.expert_meeting > 0"
      ></div>
      <div class="day__event day__event--green"
           v-if="eventTypes.question_answer > 0"
      ></div>
      <div class="day__event day__event--orange"
           v-if="eventTypes.conference > 0"
      ></div>
      <div class="day__event day__event--blue"
           v-if="eventTypes.webinar > 0"
      ></div>
    </div>
  </div>
</template>

<script>

import moment from 'moment';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'EventCalendarDay',
  props: {
    year: {
      type: Number,
      required: true
    },
    month: {
      type: Number,
      required: true
    },
    day: {
      type: Object,
      required: true
    },
  },
  setup(props, { emit }) {
    const element = ref(null);

    const store = useStore();

    const year = props.year;
    const month = props.month;
    const day = props.day;

    const selectedDate = computed(() => {
      return store.getters.getSelectedDate;
    });

    const events = computed(() => {
      return store.getters.getEvents(day);
    });

    const eventTypes = computed(() => {

      const defaultTypes = {
        'expert_meeting': 0,
        'question_answer': 0,
        'conference': 0,
        'webinar': 0,
      };

      const types = events.value.reduce((types, event) => {
        if ( ! types[event.type]) {
          types[event.type] = 0;
        }

        types[event.type]++;

        return types;
      }, defaultTypes);

      return types;
    });

    const isMonthDay = () => {
      return day.month() + 1 === month && day.year() === year;
    }
    const getClass = () => {
      return {
        'inactive': ! isMonthDay(),
        'selected': isSelected()
      }
    }

    const isSelected = () => {
      if ( ! selectedDate.value) {
        return false;
      }

      return selectedDate.value.isSame(day, 'day');
    }

    const selectDate = () => {
      if ( ! isMonthDay()) {
        return;
      }

      store.commit('setSelectedDate', day);

      emit('select-date', {
        day,
        dayElement: element.value
      });
    }

    return {
      getClass,
      isMonthDay,
      selectDate,
      day,
      element,
      events,
      eventTypes,
      isSelected
    }
  }
}
</script>

<style lang="scss" scoped>
.day {
  position: relative;
  cursor: pointer;
  user-select: none;
  &__number {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  &__events {
    width: 100%;
    height: 6px;
    position: absolute;
    bottom: 0px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
  }
  &__event {
    width: 6px;
    height: 6px;
    border-radius: 4px;
    margin: 0 1px;
    &--red {
      background-color: #FF4E6B;
    }
    &--green {
      background-color: #00CC66;
    }
    &--orange {
      background-color: #FFBB33;
    }
    &--blue {
      background-color: #4DB4FF;
    }
  }
}
.selected {
  color: #FF4E6B;
}
.inactive {
  color: #8c8c8c;
  cursor: default;
}
</style>
