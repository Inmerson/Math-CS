# Math Biotech API

Backend Web API for the Math Biotech Project. This API provides mathematical computation endpoints and exam performance tracking.

## Features

- **Matrix Operations**: Add, subtract, multiply, transpose, determinant, inverse, trace, and eigenvalue calculations
- **Exam Performance Tracking**: Save and retrieve exam results and performance statistics
- **RESTful API**: Clean and well-documented REST endpoints
- **CORS Support**: Cross-origin resource sharing enabled for frontend integration
- **TypeScript**: Fully typed with TypeScript for better development experience

## Installation

```bash
cd server
npm install
```

## Configuration

Create a `.env` file in the server directory based on `.env.example`:

```bash
cp .env.example .env
```

Configure the following environment variables:
- `PORT`: Port number for the API server (default: 5000)
- `FRONTEND_URL`: URL of the frontend application (default: http://localhost:3000)
- `NODE_ENV`: Environment mode (development/production)

## Development

Start the development server with hot reload:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## Production

Build the TypeScript code:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Docker Deployment

Build and run with Docker:

```bash
# Build the image
docker build -t math-biotech-api .

# Run the container
docker run -p 5000:5000 -e FRONTEND_URL=http://localhost:3000 math-biotech-api
```

Or use Docker Compose:

```bash
docker-compose up -d
```

## Testing

Run the API test suite:

```bash
npm test
```

This will execute a comprehensive test of all API endpoints.

## API Endpoints

### Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Math Biotech API is running",
  "timestamp": "2026-02-04T09:17:13.133Z"
}
```

### Matrix Operations

#### Add Matrices

**POST** `/api/matrix/add`

Add two matrices.

**Request Body:**
```json
{
  "matrixA": [[1, 2], [3, 4]],
  "matrixB": [[5, 6], [7, 8]]
}
```

**Response:**
```json
{
  "success": true,
  "result": [[6, 8], [10, 12]]
}
```

#### Subtract Matrices

**POST** `/api/matrix/subtract`

Subtract two matrices.

**Request Body:**
```json
{
  "matrixA": [[5, 6], [7, 8]],
  "matrixB": [[1, 2], [3, 4]]
}
```

**Response:**
```json
{
  "success": true,
  "result": [[4, 4], [4, 4]]
}
```

#### Multiply Matrices

**POST** `/api/matrix/multiply`

Multiply two matrices.

**Request Body:**
```json
{
  "matrixA": [[1, 2], [3, 4]],
  "matrixB": [[2, 0], [1, 2]]
}
```

**Response:**
```json
{
  "success": true,
  "result": [[4, 4], [10, 8]]
}
```

#### Scalar Multiplication

**POST** `/api/matrix/scalar`

Multiply a matrix by a scalar.

**Request Body:**
```json
{
  "matrixA": [[1, 2], [3, 4]],
  "scalar": 3
}
```

**Response:**
```json
{
  "success": true,
  "result": [[3, 6], [9, 12]]
}
```

#### Transpose Matrix

**POST** `/api/matrix/transpose`

Transpose a matrix.

**Request Body:**
```json
{
  "matrixA": [[1, 2, 3], [4, 5, 6]]
}
```

**Response:**
```json
{
  "success": true,
  "result": [[1, 4], [2, 5], [3, 6]]
}
```

#### Calculate Determinant

**POST** `/api/matrix/determinant`

Calculate the determinant of a square matrix.

**Request Body:**
```json
{
  "matrixA": [[4, 3], [6, 3]]
}
```

**Response:**
```json
{
  "success": true,
  "result": -6
}
```

#### Calculate Inverse

**POST** `/api/matrix/inverse`

Calculate the inverse of a square matrix.

**Request Body:**
```json
{
  "matrixA": [[4, 7], [2, 6]]
}
```

**Response:**
```json
{
  "success": true,
  "result": [[0.6, -0.7], [-0.2, 0.4]]
}
```

#### Calculate Trace

**POST** `/api/matrix/trace`

Calculate the trace (sum of diagonal elements) of a square matrix.

**Request Body:**
```json
{
  "matrixA": [[1, 2], [3, 4]]
}
```

**Response:**
```json
{
  "success": true,
  "result": 5
}
```

#### Calculate Eigenvalues (2x2)

**POST** `/api/matrix/eigenvalues`

Calculate eigenvalues for a 2x2 matrix.

**Request Body:**
```json
{
  "matrixA": [[4, 1], [2, 3]]
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "lambda1": 5,
    "lambda2": 2
  }
}
```

### Exam Performance

#### Get All Performance Data

**GET** `/api/exam/performance`

Get all exam performance data.

**Response:**
```json
{
  "success": true,
  "data": {
    "1": {
      "correct": 3,
      "incorrect": 1,
      "lastAttempt": 1707038233133
    },
    "2": {
      "correct": 2,
      "incorrect": 0,
      "lastAttempt": 1707038235000
    }
  }
}
```

#### Save Exam Result

**POST** `/api/exam/result`

Save a question attempt result.

**Request Body:**
```json
{
  "questionId": 1,
  "isCorrect": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "correct": 1,
    "incorrect": 0,
    "lastAttempt": 1707038233133
  }
}
```

#### Get Question Statistics

**GET** `/api/exam/question/:questionId`

Get statistics for a specific question.

**Response:**
```json
{
  "success": true,
  "data": {
    "correct": 3,
    "incorrect": 1,
    "lastAttempt": 1707038233133
  }
}
```

#### Reset Exam Data

**DELETE** `/api/exam/reset`

Reset all exam performance data.

**Response:**
```json
{
  "success": true,
  "message": "Exam data reset successfully"
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `400` - Bad Request (invalid input)
- `404` - Not Found (endpoint doesn't exist)
- `500` - Internal Server Error

## Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe programming
- **CORS** - Cross-origin support
- **tsx** - TypeScript execution for development

## License

© 2026 Inmersion. All rights reserved.
