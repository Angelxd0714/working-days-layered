export const specs = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Working Days API',
      version: '1.0.0',
      description: 'API for calculating working days and business hours',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/**/*.ts'],
};
