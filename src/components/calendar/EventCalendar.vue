<template>
  <div class="app-container">
    <h2 class="page-title">Calendar</h2>
    <CalendarFilters class="calendar-filters"
                     @filter="filter"
                     :disabled="isLoading"
    />
    <div class="divider"></div>
    <div class="months-row">
      <div class="month-wrapper"
           v-for="(month, index) in firstQuarter"
           :key="index"
      >
        <CalendarMonth
            @select-date="setDropdownPosition"
            :isLoading="month.isLoading"
            :month="month.date.month()"
            :year="month.date.year()"
        />
      </div>
    </div>
    <div class="divider"></div>
    <div class="months-row">
      <div class="month-wrapper"
           v-for="(month, index) in secondQuarter"
           :key="index"
      >
        <!--
        Дядя Бобби хотел бы напомнить тебе о DRY принципе.
        Но дядя Бобби тебя прощает так, как если бы мы были идеальны, нам не к чему было бы стремиться
        -->
        <CalendarMonth
            @select-date="setDropdownPosition"
            :isLoading="month.isLoading"
            :month="month.date.month()"
            :year="month.date.year()"
        />
      </div>
    </div>
    <div class="divider"></div>
    <CalendarEventList :position="dropDownBoundedRect"
                       @add-event="showModal"
                       @edit-event="showModal"
    />
    <CalendarModal :show="isModalShow" ref="modal">
      <template #title>
        <h5 class="modal-title" id="calendar-modal">Add Event</h5>
      </template>
      <template #body>
        <CalendarEventForm @save-event="hideModal" @delete-event="hideModal"/>
      </template>
    </CalendarModal>
    <notifications :group="'notify'" :duration="5000"></notifications>
  </div>
</template>

<script>
import CalendarMonth from "./EventCalendarMonth.vue";
import CalendarFilters  from "./CalendarFilters.vue";
import CalendarModal  from "./CalendarModal.vue";
import CalendarEventForm from "./CalendarEventForm.vue";
import CalendarEventList from "./CalendarEventList.vue";

import { useNotification } from "@kyvg/vue3-notification";

import moment from 'moment';
import { onMounted, ref} from "vue";
import { useStore } from "vuex";

export default {
  name: 'EventCalendar',
  components: {
    CalendarEventList,
    CalendarEventForm,
    CalendarModal,
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

    moment.updateLocale(props.locale, {
      week: {
        dow: 1
      }
    });

    const store = useStore();
    const isLoading = ref(false);
    const months = ref([]);
    const firstQuarter = ref([]);
    const secondQuarter = ref([]);

    const isModalShow = ref(true);
    const dropDownBoundedRect = ref({
      x: 0,
      y: 0,
      width: 0,
      height: 'auto'
    });

    const { notify } = useNotification();

    setTimeout(() => {
      notify({
        group: 'notify',
        type: 'success',
        title: 'Event saved successfully!',
      });
    }, 2000);

    const modal = ref(null);

    const init = () => {
      initMonths();
      initEventHandlers();
    }

    const initMonths = async (year, month) => {
      const currentMonth = moment();

      for (let i = 0; i < 6; i++) {
        const date = currentMonth.clone().add(i, 'month');

        const month = {
          isLoading: true,
          date: date,
        }

        months.value.push(month);
      }

      firstQuarter.value = months.value.slice(0, 3);
      secondQuarter.value = months.value.slice(3, 6);
    }

    const initEventHandlers = () => {
      document.addEventListener('click', (event) => {
        store.commit('setSelectedDate', null);
      });
    }

    init();

    const showModal = () => {
      modal.value.show();
      isModalShow.value = true;
    }

    const hideModal = () => {
      modal.value.hide();
      isModalShow.value = false;
    }

    const setDropdownPosition = ({ monthElement, dayElement }) => {
      const monthElementRect = {
        x: monthElement.offsetLeft,
        y: monthElement.offsetTop,
        width: monthElement.offsetWidth,
        height: monthElement.offsetHeight
      };
      const dayElementRect = {
        x: dayElement.offsetLeft,
        y: dayElement.offsetTop,
        width: dayElement.offsetWidth,
        height: dayElement.offsetHeight
      };

      dropDownBoundedRect.value = {
        x: monthElementRect.x,
        y: monthElementRect.y + dayElementRect.y + dayElementRect.height + 5,
        width: monthElementRect.width,
        height: 'auto'
      }
    }

    const filter = (filters) => {
      store.dispatch('filterEvents', filters);
    }

    const fetchEvents = async (year, month) => {
      await store.dispatch('fetchMonthEvents', {
        year: year,
        month: month + 1
      });
    }

    onMounted(async () => {
      isLoading.value = true;

      const promises = [];

      months.value.forEach(month => {
        const promise = fetchEvents(month.date.year(), month.date.month()).then(() => {
          month.isLoading = false;
        });

        promises.push(promise);
      });

      //Не расстраивай дядю Бобби костылями. Пожалуйста! Дядя Бобби не очень любит костыли.
      await Promise.all(promises);

      isLoading.value = false;
    });

    return {
      modal,
      isLoading,
      isModalShow,
      firstQuarter,
      secondQuarter,
      dropDownBoundedRect,
      filter,
      setDropdownPosition,
      showModal,
      hideModal
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
