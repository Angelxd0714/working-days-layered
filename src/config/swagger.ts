import swaggerJsdoc from 'swagger-jsdoc';

export const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Business Hours API',
      version: '1.0.0',
      description: 'API for calculating business hours considering working days and holidays',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/controllers/*.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
