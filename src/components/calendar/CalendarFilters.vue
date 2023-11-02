<template>
  <div class="filters">
    <button class="filters__button filters__button--red">Meeting with an expert</button>
    <button class="filters__button filters__button--green">Question-answer</button>
    <button class="filters__button filters__button--orange">Conference</button>
    <button class="filters__button filters__button--blue">Webinar</button>
  </div>
</template>

<script>
export default {
  name: 'CalendarFilters',
  props: {
    filters: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const filters = props.filters;

    const getFilterClass = (filter) => {
      return {
        'active': filter.active
      }
    }

    return {
      filters,
      getFilterClass
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
    }
    &--green {
      background-color: rgba($color-green, 0.2);
      color: $color-green;
    }
    &--orange {
      background-color: rgba($color-orange, 0.2);
      color: $color-orange;
    }
    &--blue {
      background-color: rgba($color-blue, 0.2);
      color: $color-blue;
    }
    &.active {
      opacity: 0.5;
    }
  }
}
</style>
