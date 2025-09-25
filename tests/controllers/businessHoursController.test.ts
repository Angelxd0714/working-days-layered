import { businessHoursController } from '../../src/controllers/businessHoursController';
import { BusinessHoursRequest } from '../../src/types/api-types';

jest.mock('../../src/services/businessHoursService', () => ({
  calculateBusinessHours: jest.fn().mockResolvedValue(new Date('2025-08-01T14:00:00.000Z'))
}));

describe('businessHoursController - Parameter Validation', () => {
  
  describe('Missing parameters', () => {
    it('should return error when no parameters provided', async () => {
      const req = { query: {} as BusinessHoursRequest };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        error: 'InvalidParameters',
        message: "At least one of 'days' or 'hours' parameters is required"
      });
    });
  });

  describe('Days parameter validation', () => {
    it('should accept valid positive integer for days', async () => {
      const req = { query: { days: '5' } as BusinessHoursRequest };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        date: '2025-08-01T14:00:00.000Z'
      });
    });

    it('should accept zero for days', async () => {
      const req = { query: { days: '0', hours: '1' } as BusinessHoursRequest };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        date: '2025-08-01T14:00:00.000Z'
      });
    });

    it('should reject negative days', async () => {
      const req = { query: { days: '-1' } as BusinessHoursRequest };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        error: 'InvalidParameters',
        message: "Parameter 'days' must be a positive integer"
      });
    });

    it('should reject non-numeric days', async () => {
      const req = { query: { days: 'abc' } as BusinessHoursRequest };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        error: 'InvalidParameters',
        message: "Parameter 'days' must be a positive integer"
      });
    });

    it('should reject decimal days', async () => {
      const req = { query: { days: '1.5' } as BusinessHoursRequest };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        error: 'InvalidParameters',
        message: "Parameter 'days' must be a positive integer"
      });
    });
  });

  describe('Hours parameter validation', () => {
    it('should accept valid positive integer for hours', async () => {
      const req = { query: { hours: '8' } as BusinessHoursRequest };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        date: '2025-08-01T14:00:00.000Z'
      });
    });

    it('should accept zero for hours', async () => {
      const req = { query: { hours: '0', days: '1' } as BusinessHoursRequest };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        date: '2025-08-01T14:00:00.000Z'
      });
    });

    it('should reject negative hours', async () => {
      const req = { query: { hours: '-5' } as BusinessHoursRequest };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        error: 'InvalidParameters',
        message: "Parameter 'hours' must be a positive integer"
      });
    });

    it('should reject non-numeric hours', async () => {
      const req = { query: { hours: 'xyz' } as BusinessHoursRequest };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        error: 'InvalidParameters',
        message: "Parameter 'hours' must be a positive integer"
      });
    });
  });

  describe('Date parameter validation', () => {
    it('should accept valid UTC ISO 8601 date with Z suffix', async () => {
      const req = { 
        query: { 
          days: '1', 
          date: '2025-04-10T15:00:00.000Z' 
        } as BusinessHoursRequest 
      };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        date: '2025-08-01T14:00:00.000Z'
      });
    });

    it('should accept valid UTC ISO 8601 date without milliseconds', async () => {
      const req = { 
        query: { 
          hours: '1', 
          date: '2025-04-10T15:00:00Z' 
        } as BusinessHoursRequest 
      };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        date: '2025-08-01T14:00:00.000Z'
      });
    });

    it('should reject date without Z suffix', async () => {
      const req = { 
        query: { 
          days: '1', 
          date: '2025-04-10T15:00:00.000' 
        } as BusinessHoursRequest 
      };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        error: 'InvalidParameters',
        message: "Parameter 'date' must be a valid UTC ISO 8601 format with Z suffix"
      });
    });

    it('should reject invalid date format', async () => {
      const req = { 
        query: { 
          days: '1', 
          date: '2025-04-10 15:00:00Z' 
        } as BusinessHoursRequest 
      };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        error: 'InvalidParameters',
        message: "Parameter 'date' must be a valid UTC ISO 8601 format with Z suffix"
      });
    });

    it('should reject invalid date values', async () => {
      const req = { 
        query: { 
          days: '1', 
          date: '2025-13-40T25:70:70.000Z' 
        } as BusinessHoursRequest 
      };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        error: 'InvalidParameters',
        message: "Parameter 'date' must be a valid UTC ISO 8601 format with Z suffix"
      });
    });
  });

  describe('Combined parameters', () => {
    it('should accept both days and hours', async () => {
      const req = { 
        query: { 
          days: '2', 
          hours: '4' 
        } as BusinessHoursRequest 
      };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        date: '2025-08-01T14:00:00.000Z'
      });
    });

    it('should accept all three parameters', async () => {
      const req = { 
        query: { 
          days: '1', 
          hours: '3',
          date: '2025-04-10T15:00:00.000Z'
        } as BusinessHoursRequest 
      };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        date: '2025-08-01T14:00:00.000Z'
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string parameters', async () => {
      const req = { 
        query: { 
          days: '', 
          hours: '1' 
        } as BusinessHoursRequest 
      };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        error: 'InvalidParameters',
        message: "Parameter 'days' must be a positive integer"
      });
    });

    it('should handle whitespace in parameters', async () => {
      const req = { 
        query: { 
          days: ' 1 ', 
          hours: '2' 
        } as BusinessHoursRequest 
      };
      const result = await businessHoursController(req);
      
      expect(result).toEqual({
        date: '2025-08-01T14:00:00.000Z'
      });
    });
  });
});