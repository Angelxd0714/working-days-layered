import express, { Express, Request, Response, NextFunction } from 'express';
import { businessHoursController } from './controllers/businessHoursController';
import serverless from 'serverless-http';

const app: Express = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/business-hours', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await businessHoursController(req);
    if ('error' in result) {
      const { error, message } = result;
      const statusCode = error === 'InvalidParameters' ? 400 : 500;
      res.status(statusCode).json({ error, message });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    next(error);
  }
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'NotFound', message: 'Endpoint not found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'InternalServerError',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

export const handler = serverless(app, {
  binary: ['image/*', 'application/json'],
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API Docs: http://localhost:${PORT}/api-docs`);
  });
}

export default app;
