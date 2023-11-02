<template>
  <div :class="getClass()" class="day">
    <span class="day__number">{{ day.format("D") }}</span>
    <div class="day__events">
      <div class="day__event day__event--red"></div>
      <div class="day__event day__event--green"></div>
      <div class="day__event day__event--orange"></div>
      <div class="day__event day__event--blue"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventCalendarDay',
  props: {
    month: {
      type: Number,
      required: true
    },
    day: {
      type: Object,
      required: true
    },
    events: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const day = props.day;

    const isMonthDay = () => {
      return day.month() === props.month;
    }
    const getClass = () => {
      return {
        'inactive': ! isMonthDay(),
      }
    }

    return {
      day,
      getClass
    }
  }
}
</script>

<style lang="scss" scoped>
.day {
  position: relative;
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
.inactive {
  color: #8c8c8c;
  cursor: default;
}
</style>
