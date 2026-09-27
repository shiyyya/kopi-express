import express from 'express';
import cors from 'cors';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiRouter } from './routes/index.js';

export const app = express();
app.disable('x-powered-by');
// Express 5's overloaded middleware factory is safe here but confuses typed ESLint.
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json({ limit: '32kb' }));
app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});
app.use('/api/v1', apiRouter);
app.use(notFound);
app.use(errorHandler);
