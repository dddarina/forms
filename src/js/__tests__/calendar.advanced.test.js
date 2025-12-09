import Calendar from '../Calendar.js';
import moment from 'moment';

jest.mock('moment', () => {
  const actualMoment = jest.requireActual('moment');
  let fixedDate = actualMoment('2024-01-15');
  
  const mockMoment = (input) => {
    if (input === undefined) return fixedDate.clone();
    return actualMoment(input);
  };
  
  Object.assign(mockMoment, actualMoment);
  mockMoment.locale = jest.fn(() => 'ru');
  return mockMoment;
});

describe('Calendar - Расширенные тесты', () => {
  let calendar;
  let mockCallback;

  beforeEach(() => {
    mockCallback = jest.fn();
    calendar = new Calendar({
      minDate: moment('2024-01-01'),
      onDateSelect: mockCallback
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Метод getDateTooltip', () => {
    test('должен возвращать "Недоступно" для дат раньше minDate', () => {
      const pastDate = calendar.minDate.clone().subtract(1, 'day');
      const tooltip = calendar.getDateTooltip(pastDate);
      
      expect(tooltip).toBe('Недоступно');
    });

    test('должен возвращать "Сегодня" для текущей даты', () => {
      const today = calendar.currentDate.clone();
      const tooltip = calendar.getDateTooltip(today);
      
      expect(tooltip).toBe('Сегодня');
    });

    test('должен возвращать форматированную строку для обычных дат', () => {
      const futureDate = calendar.currentDate.clone().add(10, 'days');
      const tooltip = calendar.getDateTooltip(futureDate);
      
      expect(tooltip).toContain('2024');
      expect(typeof tooltip).toBe('string');
    });
  });
});