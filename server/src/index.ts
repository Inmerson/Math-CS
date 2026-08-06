import express, { Request, Response } from 'express';
import cors from 'cors';
import matrixRoutes from './routes/matrixRoutes.js';
import examRoutes from './routes/examRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'Inmerson Lab API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/matrix', matrixRoutes);
app.use('/api/exam', examRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Inmerson Lab API',
    version: '1.0.0',
    description: 'Backend API for Inmerson Personal Math & Biotech Lab',
    endpoints: {
      health: '/health',
      matrix: {
        add: 'POST /api/matrix/add',
        subtract: 'POST /api/matrix/subtract',
        multiply: 'POST /api/matrix/multiply',
        scalar: 'POST /api/matrix/scalar',
        transpose: 'POST /api/matrix/transpose',
        determinant: 'POST /api/matrix/determinant',
        inverse: 'POST /api/matrix/inverse',
        trace: 'POST /api/matrix/trace',
        eigenvalues: 'POST /api/matrix/eigenvalues'
      },
      exam: {
        getPerformance: 'GET /api/exam/performance',
        saveResult: 'POST /api/exam/result',
        resetData: 'DELETE /api/exam/reset',
        getQuestion: 'GET /api/exam/question/:questionId'
      }
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Inmerson Lab API server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`📚 API documentation at http://localhost:${PORT}/`);
});

export default app;