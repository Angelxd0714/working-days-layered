import express, { type Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import { businessHoursController } from './controllers/businessHoursController';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// API Routes
app.get('/business-hours', businessHoursController);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Start server
app.listen(PORT, (): void => {
  // Using console.log for server startup is acceptable
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});
