import TripCalendar from '../TripCalendar.js';

jest.mock('../DatePicker.js', () => {
  return jest.fn().mockImplementation((container, options) => ({
    container,
    options,
    calendar: {
      minDate: null,
      render: jest.fn()
    },
    render: jest.fn(),
    destroy: jest.fn()
  }));
});

describe('TripCalendar - Интеграция', () => {
  let tripCalendar;

  beforeEach(() => {
    document.body.innerHTML = `
      <form id="searchForm">
        <div class="route-inputs">
          <input id="from" type="text" placeholder="Откуда">
          <button id="swapRoutes" type="button">↔</button>
          <input id="to" type="text" placeholder="Куда">
        </div>
        
        <div class="date-inputs">
          <div class="date-input-container">
            <input id="departureDate" type="text" placeholder="Туда" readonly>
            <div id="departureCalendar" class="calendar-container"></div>
          </div>
          <div class="date-input-container">
            <input id="returnDate" type="text" placeholder="Обратно" readonly>
            <div id="returnCalendar" class="calendar-container"></div>
          </div>
        </div>
        
        <div class="trip-type">
          <label>
            <input type="radio" id="roundTrip" name="tripType" checked>
            Туда и обратно
          </label>
          <label>
            <input type="radio" id="oneWay" name="tripType">
            В одну сторону
          </label>
        </div>
        
        <div class="passengers">
          <div class="passenger-counter">
            <span>Взрослые</span>
            <button class="counter-btn minus" data-type="adults">-</button>
            <span id="adultsCount">1</span>
            <button class="counter-btn plus" data-type="adults">+</button>
          </div>
          <div class="passenger-counter">
            <span>Дети</span>
            <button class="counter-btn minus" data-type="children">-</button>
            <span id="childrenCount">0</span>
            <button class="counter-btn plus" data-type="children">+</button>
          </div>
          <div class="passenger-counter">
            <span>Младенцы</span>
            <button class="counter-btn minus" data-type="infants">-</button>
            <span id="infantsCount">0</span>
            <button class="counter-btn plus" data-type="infants">+</button>
          </div>
        </div>
        
        <div class="selected-info">
          <div>Дата вылета: <span id="selectedDepartureDate">не выбрана</span></div>
          <div>Дата возвращения: <span id="selectedReturnDate">не выбрана</span></div>
          <div>Пассажиров: <span id="totalPassengers">1</span></div>
        </div>
        
        <button id="searchBtn" type="submit">Найти билеты</button>
      </form>
    `;

    tripCalendar = new TripCalendar();
    tripCalendar.init();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('Крайние случаи', () => {
    test('должен корректно обрабатывать максимальное количество пассажиров', () => {
      const plusButton = document.querySelector('[data-type="adults"].plus');
      
      for (let i = 0; i < 9; i++) {
        plusButton.click();
      }
      
      expect(tripCalendar.passengerCounts.adults).toBe(10);
      
      plusButton.click();
      expect(tripCalendar.passengerCounts.adults).toBe(10);
    });

    test('должен правильно считать общее количество пассажиров', () => {
      document.querySelector('[data-type="adults"].plus').click();
      document.querySelector('[data-type="children"].plus').click();
      document.querySelector('[data-type="infants"].plus').click();
      
      expect(tripCalendar.passengerCounts.adults).toBe(2);
      expect(tripCalendar.passengerCounts.children).toBe(1);
      expect(tripCalendar.passengerCounts.infants).toBe(1);
      expect(document.getElementById('totalPassengers').textContent).toBe('4');
    });
  });

  describe('Форматирование дат', () => {
    test('должен правильно форматировать даты для разных месяцев', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-12-25');
      
      expect(tripCalendar.formatDate(date1)).toBe('15.01.2024');
      expect(tripCalendar.formatDate(date2)).toBe('25.12.2024');
    });
  });
});