import DatePicker from '../DatePicker.js';

jest.mock('../Calendar.js', () => {
  return jest.fn().mockImplementation(() => ({
    currentDate: {
      format: jest.fn(() => 'январь 2024'),
      subtract: jest.fn(),
      add: jest.fn(),
      clone: jest.fn(() => ({
        startOf: jest.fn(() => ({})),
        endOf: jest.fn(() => ({}))
      }))
    },
    selectedDates: { start: null, end: null },
    minDate: null,
    getMonthDates: jest.fn(() => [
      { 
        date: { 
          date: jest.fn(() => 1),
          isSame: jest.fn(() => false),
          clone: jest.fn(function() { return this; })
        },
        isCurrentMonth: true,
        isToday: false,
        isDisabled: false,
        isSelected: false,
        isWeekend: false,
        tooltip: 'понедельник, 1 января 2024'
      }
    ]),
    selectDate: jest.fn(),
    prevMonth: jest.fn(),
    nextMonth: jest.fn(),
    getCurrentMonthYear: jest.fn(() => 'январь 2024'),
    setSelectedDates: jest.fn(),
    getSelectedDates: jest.fn(() => ({ start: null, end: null })),
    render: jest.fn()
  }));
});

describe('DatePicker - DOM взаимодействие', () => {
  let container;
  let datePicker;
  let mockCallback;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    
    mockCallback = jest.fn();
    
    datePicker = new DatePicker(container, {
      minDate: new Date('2024-01-01'),
      onDatesChange: mockCallback,
      calendarLabel: 'Тестовый календарь'
    });
  });

  afterEach(() => {
    if (datePicker) {
      datePicker.destroy();
    }
    document.body.innerHTML = '';
  });

  describe('Инициализация', () => {
    test('должен создавать DOM элементы', () => {
      expect(container.querySelector('.date-picker')).not.toBeNull();
      expect(container.querySelector('.date-picker-header')).not.toBeNull();
      expect(container.querySelector('.date-picker-weekdays')).not.toBeNull();
      expect(container.querySelector('.date-picker-dates')).not.toBeNull();
    });
  });

  describe('Рендеринг различных состояний дат', () => {
    test('должен рендерить выбранные даты с классом selected', () => {
      const mockDate = {
        date: jest.fn(() => 1),
        isSame: jest.fn(() => false),
        clone: jest.fn(function() { return this; })
      };
      
      datePicker.calendar.getMonthDates = jest.fn(() => [
        {
          date: mockDate,
          isCurrentMonth: true,
          isToday: false,
          isDisabled: false,
          isSelected: true,
          isWeekend: false,
          tooltip: 'тестовый тултип'
        }
      ]);
      
      datePicker.render();
      
      const dateCell = container.querySelector('.date-cell');
      expect(dateCell.classList.contains('selected')).toBe(true);
    });

    test('должен рендерить недоступные даты с классом disabled', () => {
      const mockDate = {
        date: jest.fn(() => 1),
        isSame: jest.fn(() => false),
        clone: jest.fn(function() { return this; })
      };
      
      datePicker.calendar.getMonthDates = jest.fn(() => [
        {
          date: mockDate,
          isCurrentMonth: true,
          isToday: false,
          isDisabled: true,
          isSelected: false,
          isWeekend: false,
          tooltip: 'Недоступно'
        }
      ]);
      
      datePicker.render();
      
      const dateCell = container.querySelector('.date-cell');
      expect(dateCell.classList.contains('disabled')).toBe(true);
    });
  });

  describe('Обработка edge cases', () => {
    test('не должен ломаться при отсутствии callback', () => {
      const container2 = document.createElement('div');
      document.body.appendChild(container2);
      
      expect(() => {
        const datePickerWithoutCallback = new DatePicker(container2, {});
        datePickerWithoutCallback.render();
      }).not.toThrow();
      
      document.body.removeChild(container2);
    });
  });
});