import Calendar from './Calendar.js';

export default class DatePicker {
  constructor(container, options = {}) {
    this.container = container;
    this.isRoundTrip = options.isRoundTrip || false;
    this.onDatesChange = options.onDatesChange || (() => {});
    this.calendarLabel = options.calendarLabel || 'Календарь';
    
    this.calendar = new Calendar({
      minDate: options.minDate,
      onDateSelect: this.handleDateSelect.bind(this)
    });
    
    this.init();
    this.render();
  }

  init() {
    this.createElements();
    this.bindEvents();
  }

  createElements() {
    this.element = document.createElement('div');
    this.element.className = 'date-picker';
    
    this.element.innerHTML = `
      <div class="date-picker-header">
        <button type="button" class="prev-month-btn" title="Предыдущий месяц">
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="current-month"></span>
        <button type="button" class="next-month-btn" title="Следующий месяц">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <div class="date-picker-weekdays">
        <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div class="weekend">Сб</div><div class="weekend">Вс</div>
      </div>
      <div class="date-picker-dates"></div>
    `;
    
    this.container.appendChild(this.element);
    
    this.prevBtn = this.element.querySelector('.prev-month-btn');
    this.nextBtn = this.element.querySelector('.next-month-btn');
    this.currentMonthEl = this.element.querySelector('.current-month');
    this.datesContainer = this.element.querySelector('.date-picker-dates');
  }

  bindEvents() {
    this.prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.calendar.prevMonth();
      this.render();
    });
    
    this.nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.calendar.nextMonth();
      this.render();
    });
  }
render() {
    this.currentMonthEl.textContent = this.calendar.getCurrentMonthYear();
    this.datesContainer.innerHTML = '';
    
    const dates = this.calendar.getMonthDates();
    
    dates.forEach(dateInfo => {
        const dateEl = document.createElement('div');
        dateEl.className = 'date-cell';
        dateEl.textContent = dateInfo.date.date();
        
        if (dateInfo.tooltip) {
            dateEl.dataset.tooltip = dateInfo.tooltip;
        }
        
        if (!dateInfo.isCurrentMonth) {
            dateEl.classList.add('other-month');
        }
        
        if (dateInfo.isToday) {
            dateEl.classList.add('today');
        }
        
        if (dateInfo.isDisabled) {
            dateEl.classList.add('disabled');
        } else {
            dateEl.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.calendar.selectDate(dateInfo.date);
                this.render();
            });
        }
        
        if (dateInfo.isSelected) {
            dateEl.classList.add('selected');
        }
        
        if (dateInfo.isWeekend) {
            dateEl.classList.add('weekend');
        }

        this.datesContainer.appendChild(dateEl);
    });
}
  handleDateSelect(dates) {
    this.onDatesChange(dates);
  }

  setRoundTrip(isRoundTrip) {
    this.isRoundTrip = isRoundTrip;
    if (!isRoundTrip) {
      this.calendar.selectedDates.end = null;
      this.render();
    }
  }

  setDates(startDate, endDate) {
    this.calendar.setSelectedDates(startDate, endDate);
    this.render();
  }

  getDates() {
    return this.calendar.getSelectedDates();
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}