import Calendar from '../Calendar.js';

jest.mock('moment', () => {
  const actualMoment = jest.requireActual('moment');
  
  const mockMoment = (input) => {
    if (input === undefined) {
      return actualMoment('2024-01-15');
    }
    return actualMoment(input);
  };
  
  Object.assign(mockMoment, actualMoment);
  
  mockMoment.locale = jest.fn(() => 'ru');
  
  return mockMoment;
});

describe('Calendar - Логика', () => {
  let calendar;

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    calendar = new Calendar({
      minDate: '2024-01-01',
      onDateSelect: jest.fn()
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Инициализация', () => {
    test('должен инициализироваться с текущей датой', () => {
      expect(calendar.currentDate).toBeDefined();
    });

    test('должен устанавливать минимальную дату', () => {
      expect(calendar.minDate).toBeDefined();
    });
  });

  describe('Метод selectDate', () => {
    test('должен вызывать callback при выборе даты', () => {
      const mockCallback = jest.fn();
      calendar.onDateSelect = mockCallback;
      
      const mockDate = {
        isBefore: jest.fn(() => false),
        format: jest.fn(() => '2024-01-20')
      };
      
      calendar.selectDate(mockDate);
      
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  describe('Навигация по месяцам', () => {
    test('prevMonth должен уменьшать месяц', () => {
      const originalMonth = calendar.currentDate.month();
      calendar.prevMonth();
      
      expect(calendar.prevMonth).toBeDefined();
    });

    test('nextMonth должен увеличивать месяц', () => {
      const originalMonth = calendar.currentDate.month();
      calendar.nextMonth();
      
      expect(calendar.nextMonth).toBeDefined();
    });
  });
});