import moment  from "moment";
import _ from 'lodash';
import filters  from "@/components/calendar/filters";

//Дядя Бобби позаботился о том, чтобы вам было удобно работать с данными.
const getDateEvents = (state, date, useFilters = true) => {
    const year = date.year();
    const month = date.month();
    const day = date.date();

    if ( ! state.events[year]) {
        return [];
    }

    if ( ! state.events[year][month]) {
        return [];
    }

    if ( ! state.events[year][month][day]) {
        return [];
    }

    let events = state.events[year][month][day];

    if ( ! useFilters) {
        return events;
    }

    events = sortEvents(events);

    const filters = state.filters;

    //Дядя Бобби доволен как слон. Дядя Бобби любит когда делают по красоте.
    return filterEvents(events, filters);
}

const sortEvents = (events) => {
    return _.sortBy(events, function(event) {
        return moment(event.start).format('HH:mm');
    });
}

const filterEvents = (events, filters) => {
    if (Object.values(filters).every(value => value === false)) {
        return events;
    }

    return events.filter(event => {
        return filters[event.type];
    });
}

const checkOrCreateDate = (state, date) => {
    const year = date.year();
    const month = date.month();
    const day = date.date();

    if ( ! state.events[year]) {
        state.events[year] = {};
    }

    if ( ! state.events[year][month]) {
        state.events[year][month] = {};
    }

    if ( ! state.events[year][month][day]) {
        state.events[year][month][day] = [];
    }

    return state.events[year][month][day];
}

export default {
    state: {
        events: {},
        filters: filters,
        selectedDate: null,
        selectedEvent: null
    },
    getters: {
        getEvents: (state) => (date) => {
            return getDateEvents(state, date);
        },
        getFilters: (state) => {
            return state.filters;
        },
        getSelectedDate: (state) => {
            return state.selectedDate;
        },
        getSelectedEvent: (state) => {
            return state.selectedEvent;
        },
        getSelectedDateEvents: (state) => {
            const date = state.selectedDate;

            if ( ! date) {
                return [];
            }

            return getDateEvents(state, date);
        }
    },
    actions: {
        //This method is not over engineering, it's just show another way to fetch data from API
        async fetchEvents ({ commit }, {from, to}) {
            const params = {};

            if ( ! from) {
                params.from = moment().startOf('month').format('YYYY-MM-DD');
            }

            if ( ! to) {
                params.to = moment().endOf('month').format('YYYY-MM-DD');
            }

            const response = await axios.get(`api/calendar`, {
                params: params
            });

            const events = response.data.data;

            commit('setEvents', events);
        },
        async fetchMonthEvents ({ commit }, {year, month}) {

            const params = {};

            if ( ! year) {
                params.year = moment().year();
            }

            if ( ! month) {
                params.month = moment().month();
            }

            const response = await axios.get(`/api/calendar/${year}/${month}`, {
                params: params
            });

            const events = response.data.data;

            const dates = _.groupBy(events, function(event) {
                return moment(event.date).format('YYYY-MM-DD');
            });

            commit('setMonthEvents', dates);
        },
        async createEvent ({ commit }, data) {
            const response = await axios.post(`/api/calendar`, data);

            const event = response.data.data;

            commit('addEvent', event);
        },
        async updateEvent ({ commit }, {id, data}) {
            const response = await axios.put(`/api/calendar/${id}`, data);

            const event = response.data.data;

            commit('updateEvent', event);
        },
        async deleteEvent ({ commit }, id) {
            const response = await axios.delete(`/api/calendar/${id}`);

            const event = response.data.data;

            commit('deleteEvent', event);
        },
        toggleFilter: ({ commit }, filter) => {
            commit('toggleFilter', filter);
        },
    },
    mutations: {
        addEvent (state, event) {
            const events = checkOrCreateDate(state, moment(event.date));

            events.push(event);
        },
        updateEvent (state, event) {
            const events = checkOrCreateDate(state, moment(event.date));

            const index = events.findIndex(item => item.id === event.id);

            if (index === -1) {
                events.push(event);
            } else {
                events[index] = event;
            }
        },
        deleteEvent (state, event) {
            const events = checkOrCreateDate(state, moment(event.date));

            const index = events.findIndex(item => item.id === event.id);

            if (index !== -1) {
                events.splice(index, 1);
            }
        },
        setMonthEvents (state, dates) {
            const events = state.events;

            _.forEach(dates, function(value, key) {
                const date = moment(key);

                if ( ! events[date.year()]) {
                    events[date.year()] = {};
                }

                if ( ! events[date.year()][date.month()]) {
                    events[date.year()][date.month()] = {};
                }

                events[date.year()][date.month()][date.date()] = value;
            });

            state.events = events;
        },
        toggleFilter (state, filter) {
            if ( ! state.filters.hasOwnProperty(filter)) {
                return;
            }

            state.filters[filter] = ! state.filters[filter];
        },
        setSelectedDate (state, date) {
            state.selectedDate = date;
        },
        setSelectedEvent (state, event) {
            state.selectedEvent = event;
        }
    },
};
