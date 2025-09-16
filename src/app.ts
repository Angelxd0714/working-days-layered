import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { CustomRequest } from './types/index.js';

import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import { businessHoursController } from './controllers/businessHoursController.js';
import serverless from 'serverless-http';

export const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/business-hours', async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const result = await businessHoursController(req);
    res.status(result.statusCode).json(result.body);
  } catch (error) {
    next(error);
  }
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export const handler = serverless(app);