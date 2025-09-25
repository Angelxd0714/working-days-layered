import { calculateBusinessHours } from '../businessHoursService';
import { getHolidays } from '../../utils/holidays';


jest.mock('../../utils/holidays');
const mockGetHolidays = getHolidays as jest.MockedFunction<typeof getHolidays>;

describe('BusinessHoursService', () => {
  beforeEach(() => {
    mockGetHolidays.mockResolvedValue([
      '2025-04-17', 
      '2025-04-18', 
      '2025-01-01',
      '2025-12-25',
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Example test cases from requirements', () => {
    test('Example 5: hours=8 from business day at 8:00 AM should return same day at 5:00 PM', async () => {
      const startDate = new Date('2025-04-08T13:00:00.000Z');
      const result = await calculateBusinessHours(0, 8, startDate);
      
      expect(result.toISOString()).toBe('2025-04-08T22:00:00.000Z');
    });

    test('Example 6: days=1 from business day at 8:00 AM should return next business day at 8:00 AM', async () => {
      const startDate = new Date('2025-04-08T13:00:00.000Z');
      const result = await calculateBusinessHours(1, 0, startDate);
      
      expect(result.toISOString()).toBe('2025-04-09T13:00:00.000Z');
    });

    test('Example 7: days=1 from business day at 12:30 PM should return next business day at 12:00 PM', async () => {
      const startDate = new Date('2025-04-08T17:30:00.000Z');
      const result = await calculateBusinessHours(1, 0, startDate);
      
      
      expect(result.toISOString()).toBe('2025-04-09T18:00:00.000Z');
    });

    test('Example 8: hours=3 from business day at 11:30 PM should normalize and add 3 hours', async () => {
      const startDate = new Date('2025-04-09T04:30:00.000Z');
      const result = await calculateBusinessHours(0, 3, startDate);

      expect(result.toISOString()).toBe('2025-04-09T16:00:00.000Z');
    });

    test('Example 9: Complex case with holidays - date=2025-04-10T15:00:00.000Z, days=5, hours=4', async () => {
      const startDate = new Date('2025-04-10T15:00:00.000Z');
      const result = await calculateBusinessHours(5, 4, startDate);
      
     
      expect(result.toISOString()).toBe('2025-04-21T20:00:00.000Z');
    });
  });

  describe('Weekend and holiday handling', () => {
    test('Should normalize Saturday to previous Friday end of business', async () => {
      const startDate = new Date('2025-04-12T19:00:00.000Z');
      const result = await calculateBusinessHours(0, 1, startDate);
      
      expect(result.toISOString()).toBe('2025-04-14T14:00:00.000Z'); // Monday 9:00 AM
    });

    test('Should skip holidays when adding business days', async () => {
      const startDate = new Date('2025-04-16T13:00:00.000Z'); // 8:00 AM Colombia
      const result = await calculateBusinessHours(1, 0, startDate);
      
      expect(result.toISOString()).toBe('2025-04-21T13:00:00.000Z');
    });
  });

  describe('Lunch break handling', () => {
    test('Should skip lunch break when adding hours', async () => {
      const startDate = new Date('2025-04-08T16:00:00.000Z');
      const result = await calculateBusinessHours(0, 2, startDate);
      
      expect(result.toISOString()).toBe('2025-04-08T19:00:00.000Z');
    });

    test('Should normalize lunch time to 1:00 PM', async () => {
      const startDate = new Date('2025-04-08T17:30:00.000Z');
      const result = await calculateBusinessHours(0, 1, startDate);
      
      expect(result.toISOString()).toBe('2025-04-08T19:00:00.000Z');
    });
  });

  describe('Edge cases', () => {
    test('Should handle zero days and hours', async () => {
      const startDate = new Date('2025-04-08T16:00:00.000Z'); // Tuesday 11:00 AM
      const result = await calculateBusinessHours(0, 0, startDate);
      
      expect(result.toISOString()).toBe('2025-04-08T16:00:00.000Z');
    });

    test('Should handle end of business day correctly', async () => {
      const startDate = new Date('2025-04-08T21:00:00.000Z');
      const result = await calculateBusinessHours(0, 2, startDate);
      
      expect(result.toISOString()).toBe('2025-04-09T14:00:00.000Z'); // Wednesday 9:00 AM
    });
  });
});