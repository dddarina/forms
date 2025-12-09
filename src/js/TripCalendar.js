import DatePicker from './DatePicker.js';

export default class TripCalendar {
  constructor() {
    this.passengerCounts = {
      adults: 1,
      children: 0,
      infants: 0
    };

    this.selectedDates = {
      departure: null,
      return: null
    };

    this.isRoundTrip = true;
  }

  init() {
    this.cacheElements();
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    }

    this.bindEvents();
    this.createDatePickers();
    this.updatePassengerCount();
  }

  cacheElements() {
    this.adultsCountEl = document.getElementById('adultsCount');
    this.childrenCountEl = document.getElementById('childrenCount');
    this.infantsCountEl = document.getElementById('infantsCount');
    this.totalPassengersEl = document.getElementById('totalPassengers');

    this.departureDateInput = document.getElementById('departureDate');
    this.returnDateInput = document.getElementById('returnDate');
    this.departureCalendarContainer = document.getElementById('departureCalendar');
    this.returnCalendarContainer = document.getElementById('returnCalendar');

    this.oneWayRadio = document.getElementById('oneWay');
    this.roundTripRadio = document.getElementById('roundTrip');

    this.selectedDepartureDateEl = document.getElementById('selectedDepartureDate');
    this.selectedReturnDateEl = document.getElementById('selectedReturnDate');

    this.searchBtn = document.getElementById('searchBtn');
    this.swapRoutesBtn = document.getElementById('swapRoutes');
  }

  bindEvents() {
    document.querySelectorAll('.counter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const type = e.target.dataset.type;
        const isPlus = e.target.classList.contains('plus');
        this.updatePassengerCount(type, isPlus);
      });
    });

    this.oneWayRadio.addEventListener('change', (e) => {
      e.preventDefault();
      this.isRoundTrip = false;
      this.returnDateInput.disabled = true;
      this.returnDateInput.placeholder = 'Не требуется';
      this.selectedDates.return = null;
      this.returnDateInput.value = '';
      this.updateSelectedInfo();
    });

    this.roundTripRadio.addEventListener('change', (e) => {
      e.preventDefault();
      this.isRoundTrip = true;
      this.returnDateInput.disabled = false;
      this.returnDateInput.placeholder = 'Выберите дату';
      this.updateSelectedInfo();
    });

    this.swapRoutesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const fromInput = document.getElementById('from');
      const toInput = document.getElementById('to');
      const temp = fromInput.value;
      fromInput.value = toInput.value;
      toInput.value = temp;
    });

    this.departureDateInput.addEventListener('click', () => {
      this.toggleCalendar(this.departureCalendarContainer);
      this.hideCalendar(this.returnCalendarContainer);
    });

    this.returnDateInput.addEventListener('click', () => {
      if (this.isRoundTrip) {
        this.toggleCalendar(this.returnCalendarContainer);
        this.hideCalendar(this.departureCalendarContainer);
      }
    });

    this.searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.performSearch();
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.date-input-container') &&
        !e.target.closest('.calendar-container')) {
        this.hideCalendar(this.departureCalendarContainer);
        this.hideCalendar(this.returnCalendarContainer);
      }
    });
  }

  createDatePickers() {
    this.departureDatePicker = new DatePicker(this.departureCalendarContainer, {
      minDate: new Date(),
      calendarLabel: 'Дата отправления',
      onDatesChange: (dates) => {
        if (dates.start) {
          this.selectedDates.departure = dates.start;
          this.departureDateInput.value = this.formatDate(dates.start);
          this.updateSelectedInfo();

          if (this.returnDatePicker) {
            this.returnDatePicker.calendar.minDate = dates.start;
            this.returnDatePicker.render();
          }
        }
        this.hideCalendar(this.departureCalendarContainer);
      }
    });

    this.returnDatePicker = new DatePicker(this.returnCalendarContainer, {
      minDate: new Date(),
      calendarLabel: 'Дата возвращения',
      onDatesChange: (dates) => {
        if (dates.start) {
          this.selectedDates.return = dates.start;
          this.returnDateInput.value = this.formatDate(dates.start);
          this.updateSelectedInfo();
        }
        this.hideCalendar(this.returnCalendarContainer);
      }
    });

    this.hideCalendar(this.departureCalendarContainer);
    this.hideCalendar(this.returnCalendarContainer);
  }

  updatePassengerCount(type, isPlus) {
    let current = this.passengerCounts[type];

    if (isPlus) {
      if (type === 'adults' && current < 10) current++;
      else if (type === 'children' && current < 10) current++;
      else if (type === 'infants' && current < 10) current++;
    } else {
      if (current > 0) current--;
      if (type === 'adults' && current === 0) current = 1; 
    }

    this.passengerCounts[type] = current;

    this.adultsCountEl.textContent = this.passengerCounts.adults;
    this.childrenCountEl.textContent = this.passengerCounts.children;
    this.infantsCountEl.textContent = this.passengerCounts.infants;

    this.updateSelectedInfo();
  }

  updateSelectedInfo() {
    if (this.selectedDates.departure) {
      this.selectedDepartureDateEl.textContent = this.formatDate(this.selectedDates.departure, true);
      this.selectedDepartureDateEl.classList.add('selected');
    } else {
      this.selectedDepartureDateEl.textContent = 'не выбрана';
      this.selectedDepartureDateEl.classList.remove('selected');
    }

    if (this.selectedDates.return && this.isRoundTrip) {
      this.selectedReturnDateEl.textContent = this.formatDate(this.selectedDates.return, true);
      this.selectedReturnDateEl.classList.add('selected');
    } else {
      this.selectedReturnDateEl.textContent = this.isRoundTrip ? 'не выбрана' : 'не требуется';
      this.selectedReturnDateEl.classList.remove('selected');
    }

    const total = this.passengerCounts.adults + this.passengerCounts.children + this.passengerCounts.infants;
    this.totalPassengersEl.textContent = total;
  }

  formatDate(date, fullFormat = false) {
    if (!date) return '';

    const d = new Date(date);

    if (fullFormat) {
      return d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long'
      });
    }

    return d.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  toggleCalendar(container) {
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  }

  hideCalendar(container) {
    container.style.display = 'none';
  }

  performSearch() {
    const from = document.getElementById('from').value.trim();
    const to = document.getElementById('to').value.trim();

    if (!from || !to) {
      this.showNotification('Пожалуйста, укажите города отправления и назначения', 'error');
      return;
    }

    if (!this.selectedDates.departure) {
      this.showNotification('Пожалуйста, выберите дату отправления', 'error');
      return;
    }

    if (this.isRoundTrip && !this.selectedDates.return) {
      this.showNotification('Пожалуйста, выберите дату возвращения', 'error');
      return;
    }

    if (this.selectedDates.return && this.selectedDates.departure > this.selectedDates.return) {
      this.showNotification('Дата возвращения не может быть раньше даты отправления', 'error');
      return;
    }

    const searchResults = {
      route: `${from} → ${to}`,
      passengers: this.passengerCounts,
      dates: {
        departure: this.selectedDates.departure,
        return: this.selectedDates.return
      },
      tripType: this.isRoundTrip ? 'Туда и обратно' : 'Только туда'
    };

    console.log('Начинаем поиск билетов:', searchResults);

    this.showNotification('Поиск билетов начался! Скоро покажем результаты.', 'success');
    
    this.showSearchNotification(searchResults);
  }
showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    let icon = 'info-circle';
    
    if (type === 'error') {
        icon = 'exclamation-circle';
    } else if (type === 'success') {
        icon = 'check-circle';
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        </div>
    `;

    document.body.appendChild(notification);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        this.closeNotification(notification);
    });

    setTimeout(() => {
        if (document.body.contains(notification)) {
            this.closeNotification(notification);
        }
    }, 5000);
}

showSearchNotification(results) {
    const notification = document.createElement('div');
    notification.className = 'search-notification';
    
    notification.innerHTML = `
        <div class="notification-content">
            <h3><i class="fas fa-search"></i> Поиск начат!</h3>
            <p>Ищем билеты по маршруту: <strong>${results.route}</strong></p>
            <p>Дата отправления: <strong>${this.formatDate(results.dates.departure, true)}</strong></p>
            ${results.dates.return ?
            `<p>Дата возвращения: <strong>${this.formatDate(results.dates.return, true)}</strong></p>` :
            ''}
            <p>Пассажиров: <strong>${this.passengerCounts.adults + this.passengerCounts.children + this.passengerCounts.infants}</strong></p>
            <div class="notification-actions">
                <button class="notification-btn ok-btn">OK</button>
                <button class="notification-btn details-btn">Подробнее</button>
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    const okBtn = notification.querySelector('.ok-btn');
    const detailsBtn = notification.querySelector('.details-btn');

    okBtn.addEventListener('click', () => {
        notification.classList.add('notification-closing');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 300);
    });

    detailsBtn.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-info-circle"></i> Детали поиска</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <pre>${JSON.stringify(results, null, 2)}</pre>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn close-modal-btn">Закрыть</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeModal = () => {
            modal.classList.add('modal-closing');
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    modal.remove();
                }
            }, 300);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.close-modal-btn').addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    });

    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.add('notification-closing');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }
    }, 10000);
}

  closeNotification(notification) {
    notification.classList.add('notification-closing');
    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.remove();
      }
    }, 300);
  }
}