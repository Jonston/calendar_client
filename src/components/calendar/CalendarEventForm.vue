<template>
  <form class="calendar-event-form" @submit.prevent="saveEvent">
    <div class="form-field">
      <input type="text"
             class="form-control"
             placeholder="Enter Title..."
             v-model="data.title"
             required
      >
    </div>
    <div class="form-field">
      <textarea class="form-control"
                rows="5"
                placeholder="Enter Description..."
                v-model="data.description"
                required
      ></textarea>
    </div>
    <div class="form-field">
      <input type="text"
             class="form-control"
             placeholder="Location..."
             v-model="data.location"
             required
      />
    </div>
    <div class="form-field">
      <div class="input-group">
        <div class="input-group-text">{{ getFormattedDate(selectedDate) }}</div>
        <select class="form-select" v-model="data.time" name="time" required>
          <option :value="key" v-for="(timeInterval, key) in timeIntervals">{{ key }}</option>
        </select>
      </div>
    </div>
    <div class="form-field">
      <select class="form-select" v-model="data.type" required>
        <option :value="null">--select type--</option>
        <option :value="key" v-for="(type, key) in types">{{ type }}</option>
      </select>
    </div>
    <div class="form-actions">
      <button class="form-button button-cancel"
              data-bs-dismiss="modal"
              type="button"
      >Cancel</button>
      <button class="form-button button-delete"
              type="button"
              v-if="selectedEvent"
              @click="deleteEvent"
      >Delete</button>
      <button class="form-button button-confirm"
              type="submit"
      >
        <span v-if="selectedEvent">Save</span>
        <span v-else>Add</span>
      </button>
    </div>
  </form>
</template>

<script>
import moment from "moment";
import {computed, ref, watch} from "vue";
import { useStore } from "vuex";
import { useNotification } from "@kyvg/vue3-notification";

import {
  TYPES
} from "@/components/calendar/filters";

export default {
  name: 'CalendarEventForm',
  setup(props, { emit }) {
    const store = useStore();
    const notification = useNotification();

    const selectedEvent = computed(() => {
      return store.getters.getSelectedEvent;
    });

    const selectedDate = computed(() => {
      return store.getters.getSelectedDate;
    });

    const defaultData = {
      title: '',
      description: '',
      location: '',
      type: null,
      time: '00:00',
    }

    const data = ref(defaultData);

    const findNearestTime = (datetime) => {
      let previousTime = '00:00';

      const time = moment(datetime).format('HH:mm');

      for(let key in timeIntervals.value) {
        if (key > time) {
          return previousTime;
        }

        previousTime = key;
      }

      return '00:00';
    }

    watch(selectedEvent, (event) => {
      if (event) {
        const time = findNearestTime(event.datetime);

        data.value = {
          title: event.title,
          description: event.description,
          location: event.location,
          type: event.type,
          time: time,
        }
      } else {
        data.value = defaultData;
      }
    });

    const timeIntervals = ref({});

    const init = () => {
      // Заполнить timeIntervals 00 - 23 часа с интервалом 30 минут
      const time = moment().startOf('day');

      for (let i = 0; i < 48; i++) {
        const timeInterval = time.format('HH:mm');

        timeIntervals.value[timeInterval] = time.clone();

        time.add(30, 'minutes');
      }
    }

    init();

    const getFormattedDate = (date, format = 'DD MMM YYYY') => {
      return moment(date).format(format);
    }

    const saveEvent = () => {
      const start = moment(selectedDate.value).format('YYYY-MM-DD') + ' ' + data.value.time;
      const end = moment(start).add(60, 'minutes').format('YYYY-MM-DD HH:mm');

      const event = {
        title: data.value.title,
        description: data.value.description,
        location: data.value.location,
        type: data.value.type,
        start: start,
        end: end,
      }

      if (selectedEvent.value) {
        event.id = selectedEvent.value.id;
      }

      if (selectedEvent.value) {
        store.dispatch('updateEvent', {
          id: selectedEvent.value.id,
          data: event
        });
      } else {
        store.dispatch('createEvent', event);
      }

      emit('save-event', event);

      notification.notify({
        group: 'notify',
        type: 'success',
        title: 'Event saved successfully!',
      });
    }

    const deleteEvent = () => {
      store.dispatch('deleteEvent', selectedEvent.value.id);
      emit('delete-event');
    }

    return {
      selectedEvent,
      selectedDate,
      timeIntervals,
      data,
      types: TYPES,
      getFormattedDate,
      saveEvent,
      deleteEvent,
    }
  }
}
</script>

<style lang="scss" scoped>
/* Дядя Бобби любит Pixel Perfect, но по-моему эта любовь безответна */
.calendar-event-form {
  .form-field {
    margin-top: 20px;
  }
  .input-group-text, select, input[type="text"] {
    height: 40px;
    fornt-size: 20px;
    border: none;
    color: #FFFAFB;
  }
  .input-group-text {
    background-color: transparent;
  }
  input[type="text"], textarea, select {
    background-color: rgba(255, 255, 255, 0.04);
    font-weight: 100;
    border: none;
    border-radius: 0;
    font-size: 16px;
    color: #FFFAFB;
    &::placeholder {
      color: #FFFAFB;
      font-size: 16px;
    }
  }
  textarea {
    resize: none;
    line-height: 18px;
  }
  select {
    option {
      background-color: #1c1c1e;
    }
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path fill='none' stroke='%23aaaaaa' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 8 8 8-8'/></svg>");
    &:focus {
      outline: none !important;
    }
  }
  .form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
    .form-button {
      font-weight: 500;
      font-size: 20px;
      line-height: 24px;
      padding: 8px 18px;
      border: none;
      &.button-cancel {
        color: rgba(255, 78, 107);
        background: transparent;
        margin-right: 2px;
      }
      &.button-delete {
        color: rgba(255, 78, 107);
        background-color: rgba(255, 78, 107, 0.16);
        margin-right: 20px;
      }
      &.button-confirm {
        color: rgba(19, 19, 21, 1);
        background: rgba(255, 78, 107);
      }
    }
  }
}
</style>
