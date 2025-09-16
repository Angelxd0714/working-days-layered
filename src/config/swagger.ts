import swaggerJsdoc from 'swagger-jsdoc';
import type { Options } from 'swagger-jsdoc';

/**
 * Swagger configuration options
 */
const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Business Hours API',
      version: '1.0.0',
      description: 'API para calcular horas y días hábiles',
      contact: {
        name: 'API Support',
        email: 'angelxd0714@gmail.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/dev',
        description: 'Development server',
      }
    ],
  },
  apis: [
    './src/controllers/*.ts',
    './src/types/*.ts',
  ],
};

// Initialize swagger-jsdoc
const specs = swaggerJsdoc(swaggerOptions);

export { specs };
