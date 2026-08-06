# Math Biotech Web API - Quick Start Guide

## Overview

This Web API provides backend services for the Math Biotech Project, including:
- Mathematical operations (matrix calculations, linear algebra)
- Exam performance tracking and analytics

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` to set your configuration:
- `PORT=5000` - API server port
- `FRONTEND_URL=http://localhost:3000` - Frontend URL for CORS

### 3. Run Development Server

```bash
npm run dev
```

Server starts at: `http://localhost:5000`

### 4. Test the API

```bash
npm test
```

### 5. Access API Documentation

Open your browser to: `http://localhost:5000/`

You'll see a JSON response with all available endpoints.

## Key Endpoints

### Matrix Operations

- **POST** `/api/matrix/add` - Add matrices
- **POST** `/api/matrix/multiply` - Multiply matrices  
- **POST** `/api/matrix/determinant` - Calculate determinant
- **POST** `/api/matrix/inverse` - Calculate inverse
- **POST** `/api/matrix/eigenvalues` - Get eigenvalues (2x2)

### Exam Tracking

- **GET** `/api/exam/performance` - Get all performance data
- **POST** `/api/exam/result` - Save exam result
- **GET** `/api/exam/question/:id` - Get question stats

## Example Usage

### Matrix Addition

```bash
curl -X POST http://localhost:5000/api/matrix/add \
  -H "Content-Type: application/json" \
  -d '{
    "matrixA": [[1, 2], [3, 4]],
    "matrixB": [[5, 6], [7, 8]]
  }'
```

Response:
```json
{
  "success": true,
  "result": [[6, 8], [10, 12]]
}
```

### Save Exam Result

```bash
curl -X POST http://localhost:5000/api/exam/result \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": 1,
    "isCorrect": true
  }'
```

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Docker Deployment

```bash
docker-compose up -d
```

## Project Structure

```
server/
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/          # API routes
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── index.ts         # Main server file
├── dist/                # Built output (generated)
├── test-api.js          # Test suite
├── Dockerfile           # Docker configuration
└── package.json         # Dependencies
```

## Technology Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **tsx** - TypeScript execution

## Need Help?

See full documentation: [server/README.md](README.md)

---
© 2026 Inmersion. All rights reserved.
