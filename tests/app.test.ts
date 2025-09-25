import request from 'supertest';
import app from '../src/app';

jest.mock('../src/services/businessHoursService', () => ({
  calculateBusinessHours: jest.fn().mockResolvedValue(new Date('2025-08-01T14:00:00.000Z'))
}));

describe('API Response Format Tests', () => {
  
  describe('Success Response Format', () => {
    it('should return exactly { date: "..." } for successful request', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ days: '1' })
        .expect(200);

      expect(response.body).toEqual({
        date: '2025-08-01T14:00:00.000Z'
      });

      expect(Object.keys(response.body)).toEqual(['date']);
      
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should return valid ISO 8601 date with Z suffix', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ hours: '8' })
        .expect(200);

      expect(response.body.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      
      const date = new Date(response.body.date);
      expect(date.toISOString()).toBe(response.body.date);
    });

    it('should return 200 status code for valid requests', async () => {
      await request(app)
        .get('/business-hours')
        .query({ days: '2', hours: '4' })
        .expect(200);
    });
  });

  describe('Error Response Format', () => {
    it('should return exactly { error: "...", message: "..." } for parameter errors', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({})
        .expect(400);

      expect(response.body).toEqual({
        error: 'InvalidParameters',
        message: "At least one of 'days' or 'hours' parameters is required"
      });

      expect(Object.keys(response.body)).toEqual(['error', 'message']);
      
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should return 400 status code for invalid parameters', async () => {
      await request(app)
        .get('/business-hours')
        .query({ days: 'invalid' })
        .expect(400);
    });

    it('should return proper error format for negative values', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ days: '-1' })
        .expect(400);

      expect(response.body).toEqual({
        error: 'InvalidParameters',
        message: "Parameter 'days' must be a positive integer"
      });
    });

    it('should return proper error format for invalid date', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ 
          days: '1', 
          date: '2025-04-10T15:00:00'
        })
        .expect(400);

      expect(response.body).toEqual({
        error: 'InvalidParameters',
        message: "Parameter 'date' must be a valid UTC ISO 8601 format with Z suffix"
      });
    });
  });

  describe('HTTP Status Codes', () => {
    it('should return 200 for successful calculations', async () => {
      await request(app)
        .get('/business-hours')
        .query({ days: '1' })
        .expect(200);
    });

    it('should return 400 for missing parameters', async () => {
      await request(app)
        .get('/business-hours')
        .query({})
        .expect(400);
    });

    it('should return 400 for invalid parameters', async () => {
      await request(app)
        .get('/business-hours')
        .query({ days: 'abc' })
        .expect(400);
    });

    it('should return 404 for non-existent endpoints', async () => {
      const response = await request(app)
        .get('/non-existent')
        .expect(404);

      expect(response.body).toEqual({
        error: 'NotFound',
        message: 'Endpoint not found'
      });
    });
  });

  describe('Content-Type Headers', () => {
    it('should return application/json for success responses', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ days: '1' });

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should return application/json for error responses', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({});

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('Response Structure Validation', () => {
    it('should not include statusCode in response body', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ days: '1' })
        .expect(200);

      expect(response.body).not.toHaveProperty('statusCode');
    });

    it('should not include extra fields in success response', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ hours: '4' })
        .expect(200);

      const allowedFields = ['date'];
      const responseFields = Object.keys(response.body);
      
      expect(responseFields).toEqual(allowedFields);
    });

    it('should not include extra fields in error response', async () => {
      const response = await request(app)
        .get('/business-hours')
        .query({ days: 'invalid' })
        .expect(400);

      const allowedFields = ['error', 'message'];
      const responseFields = Object.keys(response.body);
      
      expect(responseFields).toEqual(allowedFields);
    });
  });
});