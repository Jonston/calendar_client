<template>
  <div class="month">
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
            v-for="day in week"
            :key="day"
            :month="date.month()"
            :day="day"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { onMounted, ref } from 'vue';
import EventCalendarDay from './EventCalendarDay.vue';
export default {
  name: 'EventCalendarMonth',
  components: {
    EventCalendarDay
  },
  props: {
    month: {
      type: Number,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    events: {
      type: Array,
      required: true
    }
  },
  setup(props) {

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

    onMounted(() => {
      weeks.value = getWeeks();
    });

    return {
      date,
      daysOFWeek,
      weeks,
    }
  }
}
</script>

<style lang="scss" scoped>
.month {
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
        /* Да простит меня дизайнер.Обещаю на проде так не делать.*/
        color: #d2d0b7;
      }
    }
  }

  &__days {
    width: 100%;
  }
}

</style>
