<template>
  <div class="app-container">
    <h2 class="page-title">Calendar</h2>
    <CalendarFilters class="calendar-filters" />
    <div class="divider"></div>
    <div class="months-row">
      <div class="month-wrapper"
           v-for="(month, index) in firstQuarter"
           :key="index"
      >
        <Month
            :month="month.month()"
            :year="month.year()"
        />
      </div>
    </div>
    <div class="divider"></div>
    <div class="months-row">
      <div class="month-wrapper"
           v-for="(month, index) in secondQuarter"
           :key="index"
      >
        <CalendarMonth
            :month="month.month()"
            :year="month.year()"
        />
      </div>
    </div>
    <div class="divider"></div>
  </div>
</template>

<script>
import CalendarMonth from "./EventCalendarMonth.vue";
import CalendarFilters  from "./CalendarFilters.vue";
import moment from 'moment';

export default {
  name: 'EventCalendar',
  components: {
    CalendarMonth,
    CalendarFilters
  },
  props: {
    locale: {
      type: String,
      default: 'en'
    }
  },
  setup(props) {
    moment().locale(props.locale);

    //Set than first day of week is Monday
    moment.updateLocale(props.locale, {
      week: {
        dow: 1
      }
    });

    const currentMonth = moment();
    const firstQuarter = [];
    const secondQuarter = [];

    for (let i = 0; i < 3; i++) {
      firstQuarter.push(moment(currentMonth).add(i, 'month'));
    }

    for (let i = 3; i < 6; i++) {
      secondQuarter.push(moment(currentMonth).add(i, 'month'));
    }

    return {
      firstQuarter,
      secondQuarter
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 1128px;
  margin: 50px auto;
}

.page-title {
  font-size: 40px;
  font-weight: 200;
  margin-bottom: 15px;
}

.calendar-filters {
  margin-bottom: 40px;
}
/* Дизайнер, прости.Я постараюсь больше так не делать =).*/
$divider-color: rgba(255, 78, 107, 0.25);

.months-row {
  display: flex;
  justify-content: space-between;
  .month-wrapper {
    display: flex;
    justify-content: center;
    &:before, &:after {
      content: '';
      width: 1px;
      height: 100%;
      background-color: $divider-color;
      margin: 0 10px;
    }
    &:first-child:before,
    &:first-child:after,
    &:last-child:before,
    &:last-child:after
    {
      display: none;
    }
  }
}

.divider {
  width: 100%;
  height: 1px;
  margin: 15px 0;
  background-color: $divider-color;
}

</style>
