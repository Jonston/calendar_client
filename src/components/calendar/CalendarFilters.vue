<template>
  <div class="filters">
    <button class="filters__button filters__button--red"
            :disabled="disabled"
            :class="getFilterClass(EXPERT_MEETING)"
            @click="toggleFilter(EXPERT_MEETING)"
    >Meeting with an expert</button>
    <button class="filters__button filters__button--green"
            :disabled="disabled"
            :class="getFilterClass(QUESTION_ANSWER)"
            @click="toggleFilter(QUESTION_ANSWER)"
    >Question-answer</button>
    <button class="filters__button filters__button--orange"
            :disabled="disabled"
            :class="getFilterClass(CONFERENCE)"
            @click="toggleFilter(CONFERENCE)"
    >Conference</button>
    <button class="filters__button filters__button--blue"
            :disabled="disabled"
            :class="getFilterClass(WEBINAR)"
            @click="toggleFilter(WEBINAR)"
    >Webinar</button>
  </div>
</template>

<script>
import {ref, toRef, computed} from "vue";
import {useStore} from "vuex";
import {
  EXPERT_MEETING,
  QUESTION_ANSWER,
  CONFERENCE,
  WEBINAR
} from "@/components/calendar/filters";

export default {
  name: 'CalendarFilters',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const disabled = toRef(props, 'disabled');
    const store = useStore();

    const activeFilters = computed(() => {
        return store.getters.getFilters;
    });

    const getFilterClass = (filter) => {
      return {
        'active': activeFilters.value[filter]
      }
    }

    const toggleFilter = (filter) => {
      store.dispatch('toggleFilter', filter);
    }

    return {
      disabled,
      activeFilters,
      EXPERT_MEETING,
      QUESTION_ANSWER,
      CONFERENCE,
      WEBINAR,
      getFilterClass,
      toggleFilter,
    }
  }
}
</script>

<style lang="scss" scoped>
$color-red: rgb(255, 78, 107);
$color-green: rgb(0, 204, 102);
$color-orange: rgb(255, 187, 51);
$color-blue: rgb(77, 180, 255);

.filters {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  &__button {
    border: none;
    border-radius: 18px;
    padding: 4px 16px;
    color: #fff;
    font-size: 16px;
    line-height: 20px;
    font-weight: 400;
    cursor: pointer;
    &:not(:last-child) {
      margin-right: 30px;
    }
    &--red {
      background-color: rgba($color-red, 0.2);
      color: $color-red;
      &.active {
        background-color: $color-red;
        color: #131315;
      }
    }
    &--green {
      background-color: rgba($color-green, 0.2);
      color: $color-green;
      &.active {
        background-color: $color-green;
        color: #131315;
      }
    }
    &--orange {
      background-color: rgba($color-orange, 0.2);
      color: $color-orange;
      &.active {
        background-color: $color-orange;
        color: #131315;
      }
    }
    &--blue {
      background-color: rgba($color-blue, 0.2);
      color: $color-blue;
      &.active {
        background-color: $color-blue;
        color: #131315;
      }
    }
    &.disabled, &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }
}
</style>
