import moment from "moment";

export default class Day {
    constructor(year, month, day) {
        this.date = moment([year, month, day]);
        this.events = [];
    }
}
