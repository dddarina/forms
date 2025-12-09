import moment from 'moment';
import 'moment/locale/ru'; 

export default class Calendar {
    constructor(options = {}) {
        this.currentDate = moment();
        this.selectedDates = {
            start: null,
            end: null
        };
        this.minDate = options.minDate || moment().startOf('day');
        this.onDateSelect = options.onDateSelect || (() => { });
        this.locale = 'ru';

        this.init();
    }

    init() {
        moment.locale(this.locale);
    }

    getMonthDates() {
        const startOfMonth = this.currentDate.clone().startOf('month');
        const endOfMonth = this.currentDate.clone().endOf('month');
        const startDate = startOfMonth.clone().startOf('week');
        const endDate = endOfMonth.clone().endOf('week');

        const dates = [];
        let currentDate = startDate.clone();

        while (currentDate.isSameOrBefore(endDate, 'day')) {
            const dayOfWeek = currentDate.day();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            dates.push({
                date: currentDate.clone(),
                isCurrentMonth: currentDate.isSame(this.currentDate, 'month'),
                isToday: currentDate.isSame(moment(), 'day'),
                isDisabled: currentDate.isBefore(this.minDate, 'day'),
                isSelected: this.isDateSelected(currentDate),
                isInRange: this.isDateInRange(currentDate),
                isWeekend: isWeekend,
                isStartOfRange: this.isStartOfRange(currentDate),
                isEndOfRange: this.isEndOfRange(currentDate),
                tooltip: this.getDateTooltip(currentDate)
            });
            currentDate.add(1, 'day');
        }

        return dates;
    }

    isDateSelected(date) {
        return (
            (this.selectedDates.start && date.isSame(this.selectedDates.start, 'day')) ||
            (this.selectedDates.end && date.isSame(this.selectedDates.end, 'day'))
        );
    }

    isDateInRange(date) {
        if (!this.selectedDates.start || !this.selectedDates.end) return false;

        return date.isBetween(
            this.selectedDates.start,
            this.selectedDates.end,
            'day',
            '[]'
        );
    }

    isStartOfRange(date) {
        return !!(this.selectedDates.start && date.isSame(this.selectedDates.start, 'day'));
    }

    isEndOfRange(date) {
        return !!(this.selectedDates.end && date.isSame(this.selectedDates.end, 'day'));
    }

    getDateTooltip(date) {
        if (date.isBefore(this.minDate, 'day')) return 'Недоступно';
        if (date.isSame(moment(), 'day')) return 'Сегодня';

        const formattedDate = date.format('D MMMM YYYY');
        const dayName = date.format('dddd');

        return `${dayName}, ${formattedDate}`;
    }

selectDate(date) {
    if (date.isBefore(this.minDate, 'day')) return;

    this.selectedDates.start = date;
    this.selectedDates.end = null;

    this.onDateSelect({ ...this.selectedDates });
}
    prevMonth() {
        this.currentDate.subtract(1, 'month');
    }

    nextMonth() {
        this.currentDate.add(1, 'month');
    }

    setSelectedDates(start, end) {
        this.selectedDates.start = start ? moment(start) : null;
        this.selectedDates.end = end ? moment(end) : null;
    }

    getCurrentMonthYear() {
        return this.currentDate.format('MMMM YYYY');
    }

    getSelectedDates() {
        return {
            start: this.selectedDates.start ? this.selectedDates.start.toDate() : null,
            end: this.selectedDates.end ? this.selectedDates.end.toDate() : null
        };
    }

    reset() {
        this.selectedDates.start = null;
        this.selectedDates.end = null;
    }
}