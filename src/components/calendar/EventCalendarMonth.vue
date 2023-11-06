<template>
  <div class="month" ref="element">
    <div class="month__header">
      {{ date.format("MMMM") }}
    </div>
    <div class="month__body">
      <div class="month__week">
        <div class="month__week__day month__week__day--named" v-for="day in daysOFWeek" :key="day">
          {{ day }}
        </div>
      </div>
      <div class="month__days">
        <div class="month__week month__week--large" v-for="(week, index) in weeks" :key="index">
          <EventCalendarDay
            class="month__week__day"
            @select-date="onSelectDate"
            v-for="day in week"
            :key="day"
            :year="date.year()"
            :month="date.month() + 1"
            :day="day"
          />
        </div>
      </div>
    </div>
    <Spinner :loading="isLoading" />
  </div>
</template>

<script>
import moment from 'moment';
import { onMounted, ref, toRef } from 'vue';
import EventCalendarDay from './EventCalendarDay.vue';
import Spinner from "@/components/spinner/Spinner.vue";
export default {
  name: 'EventCalendarMonth',
  components: {
    Spinner,
    EventCalendarDay
  },
  props: {
    year: {
      type: Number,
      required: true
    },
    month: {
      type: Number,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {

    const element = ref(null);

    const isLoading = toRef(props, 'isLoading');

    const date = moment().set({
      year: props.year,
      month: props.month
    });

    const weeks = ref([]);

    const daysOFWeek = moment.weekdaysShort(true);

    const getWeeks = () => {
      const firstDayOfMonth = date.clone().startOf('month').startOf('week');
      const lastDayOfMonth = date.clone().endOf('month').endOf('week');

      const weeks = [];

      while (firstDayOfMonth.isBefore(lastDayOfMonth)) {
        const week = [];

        for (let i = 0; i < 7; i++) {
          week.push(firstDayOfMonth.clone());
          firstDayOfMonth.add(1, 'day');
        }

        weeks.push(week);
      }

      return weeks;
    }

    const onSelectDate = ({day, dayElement}) => {
      const monthElement = element.value;

      emit('select-date', {
        day,
        monthElement,
        dayElement
      });
    }

    onMounted(async () => {
      weeks.value = getWeeks();
    });

    return {
      onSelectDate,
      element,
      isLoading,
      date,
      daysOFWeek,
      weeks,
    }
  }
}
</script>

<style lang="scss" scoped>
.month {
  position: relative;
  width: 360px;
  padding: 15px 0;
  &__header {
    font-weight: 200;
    font-size: 32px;
    padding-bottom: 25px;
  }

  &__body {
    font-weight: 300;
  }

  &__week {
    display: flex;
    width: 100%;
    height: 32px;
    &--large {
      margin-top: 10px;
      height: 40px;
    }
    &__day {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      &--named {
        margin-top: 0;
        /* Да простит меня дядя Бобби за столь дерзкий поступок. */
        color: #d2d0b7;
      }
    }
  }

  &__days {
    width: 100%;
  }
}

</style>
