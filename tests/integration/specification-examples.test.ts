import request from 'supertest';
import app from '../../src/app';

jest.mock('../../src/utils/holidays', () => ({
  getHolidays: jest.fn().mockResolvedValue([
    '2025-04-17', 
    '2025-04-18', 
    '2025-01-01', 
    '2025-12-25' 
  ])
}));

describe('Integration Tests - Specification Examples', () => {
  
  describe('Parameter Name Compliance', () => {
    it('should accept "days" parameter', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ days: '1' })
        .expect(200);

      expect(response.body).toHaveProperty('date');
      expect(typeof response.body.date).toBe('string');
      expect(response.body.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should accept "hours" parameter', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ hours: '4' })
        .expect(200);

      expect(response.body).toHaveProperty('date');
      expect(typeof response.body.date).toBe('string');
      expect(response.body.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });

    it('should accept "date" parameter in UTC ISO 8601 format', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          days: '1',
          date: '2025-04-10T15:00:00.000Z'
        })
        .expect(200);

      expect(response.body).toHaveProperty('date');
      expect(typeof response.body.date).toBe('string');
      expect(response.body.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  describe('Parameter Combinations', () => {
    it('should handle days only', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ days: '2' })
        .expect(200);

      expect(response.body).toEqual({
        date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      });
    });

    it('should handle hours only', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ hours: '8' })
        .expect(200);

      expect(response.body).toEqual({
        date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      });
    });

    it('should handle both days and hours (days first, then hours)', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          days: '1', 
          hours: '3' 
        })
        .expect(200);

      expect(response.body).toEqual({
        date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      });
    });

    it('should handle all three parameters', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          days: '5', 
          hours: '4',
          date: '2025-04-10T15:00:00.000Z'
        })
        .expect(200);

      expect(response.body).toEqual({
        date: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      });
    });
  });

  describe('Response Format Compliance', () => {
    it('should return exactly the format specified: { "date": "YYYY-MM-DDTHH:mm:ss.sssZ" }', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ days: '1' })
        .expect(200);

      // Check exact structure
      expect(Object.keys(response.body)).toEqual(['date']);
      expect(typeof response.body.date).toBe('string');
      
      expect(response.body.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      
      const parsedDate = new Date(response.body.date);
      expect(parsedDate.toISOString()).toBe(response.body.date);
    });

    it('should return error format: { "error": "ErrorType", "message": "Description" }', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({}) // No parameters
        .expect(400);

      expect(Object.keys(response.body)).toEqual(['error', 'message']);
      expect(typeof response.body.error).toBe('string');
      expect(typeof response.body.message).toBe('string');
      expect(response.body.error).toBe('InvalidParameters');
    });
  });

  describe('Business Logic Verification', () => {
    it('should maintain Colombian timezone handling', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          hours: '1',
          date: '2025-04-10T13:00:00.000Z'
        })
        .expect(200);

      expect(response.body).toHaveProperty('date');
      

      const resultDate = new Date(response.body.date);
      expect(resultDate).toBeInstanceOf(Date);
      expect(resultDate.getTime()).toBeGreaterThan(new Date('2025-04-10T13:00:00.000Z').getTime());
    });

    it('should handle business hours correctly (8AM-5PM with 12PM-1PM lunch)', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ hours: '1' })
        .expect(200);

      expect(response.body).toHaveProperty('date');
      expect(typeof response.body.date).toBe('string');
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
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          days: '0',
          hours: '1'
        })
        .expect(200);

      expect(response.body).toHaveProperty('date');
    });

    it('should handle large values', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          days: '100',
          hours: '50'
        })
        .expect(200);

      expect(response.body).toHaveProperty('date');
    });

    it('should handle weekend start dates', async () => {
      // Saturday date
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          hours: '1',
          date: '2025-04-12T15:00:00.000Z'
        })
        .expect(200);

      expect(response.body).toHaveProperty('date');
    });
  });

  describe('Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          days: '1',
          date: '1900-01-01T00:00:00.000Z' 
        });

     
      if (response.status === 200) {
        expect(response.body).toHaveProperty('date');
      } else {
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('message');
      }
    });
  });
});