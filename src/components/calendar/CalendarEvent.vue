<template>
  <div class="calendar-event">
    <div class="calendar-event__header">
      <div class="calendar-event__header-title">
        {{ event.title }}
      </div>
      <button class="button-edit">
        <img :src="iconEdit" alt="edit" @click="editEvent"/>
      </button>
    </div>
    <div class="calendar-event__description">
      {{ event.description }}
    </div>
    <div class="calendar-event__location">
      {{ event.location }}
    </div>
    <div class="calendar-event__footer">
      <div class="calendar-event__date" :class="getDateClass(event.type)">
        {{ getFormattedDate(event.datetime) }}
      </div>
      <div class="calendar-event__label" :class="getLabelClass(event.type)">
        {{ types[event.type] }}
      </div>
    </div>
  </div>
</template>

<script>
import iconEdit from '@/assets/pencil.svg';
import moment from "moment";
import {
  EXPERT_MEETING,
  QUESTION_ANSWER,
  CONFERENCE,
  WEBINAR,
  TYPES
} from "@/components/calendar/filters";
import { toRefs } from "vue";
import { useStore } from "vuex";
export default {
  name: 'CalendarEvent',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const {
      event
    } = toRefs(props);

    const store = useStore();

    const getFormattedDate = (date, format = 'DD MMM YYYY HH:mm') => {
      return moment(date).format(format);
    }

    const getLabelClass = (type) => {
      const color = getColorByType(type);

      if ( ! color) {
        return null;
      }

      return 'calendar-event__label--' + color;
    }

    const getDateClass = (type) => {
      const color = getColorByType(type);

      if ( ! color) {
        return null;
      }

      return 'calendar-event__date--' + color;
    }

    const getColorByType = (type) => {
      switch (type) {
        case EXPERT_MEETING:
          return 'red';
        case QUESTION_ANSWER:
          return 'green';
        case CONFERENCE:
          return 'orange';
        case WEBINAR:
          return 'blue';
        default:
          return undefined;
      }
    }

    const editEvent = () => {
      store.commit('setSelectedEvent', event.value);
      emit('edit-event', event.value);
    }

    return {
      event,
      iconEdit,
      types: TYPES,
      getFormattedDate,
      getLabelClass,
      getDateClass,
      editEvent,
    }
  }
}
</script>

<style lang="scss" scoped>
$color-red: rgb(255, 78, 107);
$color-green: rgb(0, 204, 102);
$color-orange: rgb(255, 187, 51);
$color-blue: rgb(77, 180, 255);

.calendar-event {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      margin-right: 20px;
    }
    .button-edit {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      width: 24px;
      height: 24px;
    }
  }
  &__description {
    font-size: 14px;
    font-weight: 300;
    line-height: 20px;
    margin-top: 10px;
    color: rgb(175, 174, 174);
  }
  &__location {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    font-weight: 300;
    line-height: 20px;
    margin-top: 10px;
    color: rgba(121, 121, 121, 1);
  }
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  &__date {
    font-size: 14px;
    font-weight: 300;
    line-height: 20px;
    color: rgba(121, 121, 121, 1);
    &--red {
      color: $color-red;
    }
    &--green {
      color: $color-green;
    }
    &--orange {
      color: $color-orange;
    }
    &--blue {
      color: $color-blue;
    }
  }
  &__label {
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    padding: 2px 8px;
    color: rgba(121, 121, 121, 1);
    border: none !important;
    &--red {
      border: 1px solid $color-red;
      color: $color-red;
      background-color: rgba($color-red, 0.2)
    }
    &--green {
      border: 1px solid $color-green;
      color: $color-green;
      background-color: rgba($color-green, 0.2)
    }
    &--orange {
      border: 1px solid $color-orange;
      color: $color-orange;
      background-color: rgba($color-orange, 0.2)
    }
    &--blue {
      border: 1px solid $color-blue;
      color: $color-blue;
      background-color: rgba($color-blue, 0.2)
    }
  }
}
</style>
