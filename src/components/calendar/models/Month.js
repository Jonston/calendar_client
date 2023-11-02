import moment  from "moment";
import Day from "./Day";
export default class Month {
    constructor(year, month) {
        this.date = moment({year, month});
        this.days = [];
        this.weeks = [];

        this.init();
    }

    init() {
        const startOfMonth = this.date.startOf('month');
        const endOfMonth = this.date.endOf('month');

        for (let i = 0; i < endOfMonth.date(); i++) {
            let day = new Day(startOfMonth.year(), startOfMonth.month(), startOfMonth.date());
            this.days.push(day);
            startOfMonth.add(1, 'days');
        }
    }

    toWeeks() {
        const startOfFirstWeek = this.date.startOf('month').startOf('week');
        const endOfLastWeek = this.date.endOf('month').endOf('week');

        let week = [];

        for (let i = 0; i < this.days.length; i++) {
            week.push(this.days[i]);
            if (week.length === 7) {
                this.weeks.push(week);
                week = [];
            }
        }

        console.log(this.date.week())
    }
}
