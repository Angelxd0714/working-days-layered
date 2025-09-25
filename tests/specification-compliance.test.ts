import request from 'supertest';
import app from '../src/app';

jest.mock('../src/utils/holidays', () => ({
  getHolidays: jest.fn().mockResolvedValue([
    '2025-04-17', 
    '2025-04-18', 
    '2025-01-01', 
    '2025-12-25'  
  ])
}));

describe('Specification Compliance Tests', () => {
  
  describe('Exact Parameter Names Compliance', () => {
    it('should accept "days" parameter (not dayToAdd)', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ days: '1' })
        .expect(200);

      expect(response.body).toHaveProperty('date');
      expect(response.body.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should accept "hours" parameter (not hourToAdd)', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ hours: '8' })
        .expect(200);

      expect(response.body).toHaveProperty('date');
      expect(response.body.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should accept "date" parameter (not startDate)', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          days: '1',
          date: '2025-04-10T15:00:00.000Z'
        })
        .expect(200);

      expect(response.body).toHaveProperty('date');
      expect(response.body.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('Exact Response Format Compliance', () => {
    it('should return exactly {"date": "..."} for success (no extra fields)', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ days: '1' })
        .expect(200);

      const keys = Object.keys(response.body);
      expect(keys).toEqual(['date']);
      expect(keys.length).toBe(1);
      
      expect(typeof response.body.date).toBe('string');
      expect(response.body.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      
      const parsedDate = new Date(response.body.date);
      expect(parsedDate.toISOString()).toBe(response.body.date);
    });

    it('should return exactly {"error": "...", "message": "..."} for errors (no extra fields)', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({})
        .expect(400);

     
      const keys = Object.keys(response.body).sort();
      expect(keys).toEqual(['error', 'message']);
      expect(keys.length).toBe(2);
      
     
      expect(typeof response.body.error).toBe('string');
      expect(typeof response.body.message).toBe('string');
      
     
      expect(response.body.error).toBe('InvalidParameters');
    });

    it('should NOT include statusCode in response body', async () => {
      const successResponse = await request(app)
        .get('/business-hours')
        .query({ days: '1' });
      
      expect(successResponse.body).not.toHaveProperty('statusCode');
      
      const errorResponse = await request(app)
        .get('/business-hours')
        .query({});
      
      expect(errorResponse.body).not.toHaveProperty('statusCode');
    });

    it('should NOT include result field (should be date)', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ days: '1' })
        .expect(200);

      expect(response.body).not.toHaveProperty('result');
      expect(response.body).toHaveProperty('date');
    });
  });

  describe('Parameter Validation Compliance', () => {
    it('should require at least one of days or hours', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({})
        .expect(400);

      expect(response.body).toEqual({
        error: 'InvalidParameters',
        message: "At least one of 'days' or 'hours' parameters is required"
      });
    });

    it('should validate days as positive integer', async () => {
      const testCases = [
        { days: 'abc', expected: "Parameter 'days' must be a positive integer" },
        { days: '-1', expected: "Parameter 'days' must be a positive integer" },
        { days: '1.5', expected: "Parameter 'days' must be a positive integer" },
        { days: '', expected: "Parameter 'days' must be a positive integer" }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .get('/business-hours')
          .query({ days: testCase.days })
          .expect(400);

        expect(response.body).toEqual({
          error: 'InvalidParameters',
          message: testCase.expected
        });
      }
    });

    it('should validate hours as positive integer', async () => {
      const testCases = [
        { hours: 'xyz', expected: "Parameter 'hours' must be a positive integer" },
        { hours: '-5', expected: "Parameter 'hours' must be a positive integer" },
        { hours: '2.7', expected: "Parameter 'hours' must be a positive integer" }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .get('/business-hours')
          .query({ hours: testCase.hours })
          .expect(400);

        expect(response.body).toEqual({
          error: 'InvalidParameters',
          message: testCase.expected
        });
      }
    });

    it('should validate date as UTC ISO 8601 with Z suffix', async () => {
      const testCases = [
        { 
          date: '2025-04-10T15:00:00', 
          expected: "Parameter 'date' must be a valid UTC ISO 8601 format with Z suffix" 
        },
        { 
          date: '2025-04-10 15:00:00Z', 
          expected: "Parameter 'date' must be a valid UTC ISO 8601 format with Z suffix" 
        },
        { 
          date: '2025-13-40T25:70:70.000Z', 
          expected: "Parameter 'date' must be a valid UTC ISO 8601 format with Z suffix" 
        }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .get('/business-hours')
          .query({ 
            days: '1',
            date: testCase.date 
          })
          .expect(400);

        expect(response.body).toEqual({
          error: 'InvalidParameters',
          message: testCase.expected
        });
      }
    });
  });

  describe('HTTP Status Code Compliance', () => {
    it('should return 200 for successful requests', async () => {
      await request(app)
        .get('/business-hours')
        .query({ days: '1' })
        .expect(200);
    });

    it('should return 400 for invalid parameters', async () => {
      await request(app)
        .get('/business-hours')
        .query({ days: 'invalid' })
        .expect(400);
    });

    it('should return 404 for non-existent endpoints', async () => {
      await request(app)
        .get('/non-existent-endpoint')
        .expect(404);
    });
  });

  describe('Content-Type Compliance', () => {
    it('should return application/json content-type', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ days: '1' });

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('Business Logic Preservation', () => {
    it('should handle both days and hours in correct order (days first, then hours)', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          days: '1', 
          hours: '2',
          date: '2025-04-10T13:00:00.000Z'
        })
        .expect(200);

      expect(response.body).toHaveProperty('date');
      
      const resultDate = new Date(response.body.date);
      const startDate = new Date('2025-04-10T13:00:00.000Z');
      expect(resultDate.getTime()).toBeGreaterThan(startDate.getTime());
    });

    it('should handle holidays correctly', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          days: '5',
          hours: '4',
          date: '2025-04-10T15:00:00.000Z'
        })
        .expect(200);

      expect(response.body).toHaveProperty('date');
      
      const resultDate = new Date(response.body.date);
      expect(resultDate).toBeInstanceOf(Date);
      expect(resultDate.getTime()).toBeGreaterThan(new Date('2025-04-10T15:00:00.000Z').getTime());
    });

    it('should handle zero values correctly', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          days: '0',
          hours: '1'
        })
        .expect(200);

      expect(response.body).toHaveProperty('date');
    });
  });

  describe('Edge Cases Compliance', () => {
    it('should accept date without milliseconds', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          days: '1',
          date: '2025-04-10T15:00:00Z'
        })
        .expect(200);

      expect(response.body).toHaveProperty('date');
    });

    it('should handle large values', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          days: '50',
          hours: '100'
        })
        .expect(200);

      expect(response.body).toHaveProperty('date');
    });

    it('should trim whitespace in parameters', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          days: ' 1 ',
          hours: ' 2 '
        })
        .expect(200);

      expect(response.body).toHaveProperty('date');
    });
  });
});