import { Request, Response } from 'express';
import {
  addMatrices,
  subtractMatrices,
  multiplyMatrices,
  multiplyMatrixByScalar,
  transposeMatrix,
  getDeterminant,
  getInverse,
  getTrace,
  getEigenvalues2x2
} from '../utils/matrixMath.js';
import { MatrixOperationRequest } from '../types/index.js';

export const addMatricesController = (req: Request, res: Response) => {
  try {
    const { matrixA, matrixB } = req.body as MatrixOperationRequest;

    if (!matrixA || !matrixB) {
      return res.status(400).json({ success: false, error: 'Both matrices are required' });
    }

    const result = addMatrices(matrixA, matrixB);

    if (result === null) {
      return res.status(400).json({ success: false, error: 'Matrices must have the same dimensions' });
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const subtractMatricesController = (req: Request, res: Response) => {
  try {
    const { matrixA, matrixB } = req.body as MatrixOperationRequest;

    if (!matrixA || !matrixB) {
      return res.status(400).json({ success: false, error: 'Both matrices are required' });
    }

    const result = subtractMatrices(matrixA, matrixB);

    if (result === null) {
      return res.status(400).json({ success: false, error: 'Matrices must have the same dimensions' });
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const multiplyMatricesController = (req: Request, res: Response) => {
  try {
    const { matrixA, matrixB } = req.body as MatrixOperationRequest;

    if (!matrixA || !matrixB) {
      return res.status(400).json({ success: false, error: 'Both matrices are required' });
    }

    const result = multiplyMatrices(matrixA, matrixB);

    if (result === null) {
      return res.status(400).json({ success: false, error: 'Invalid matrix dimensions for multiplication' });
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const scalarMultiplyController = (req: Request, res: Response) => {
  try {
    const { matrixA, scalar } = req.body as MatrixOperationRequest;

    if (!matrixA || scalar === undefined) {
      return res.status(400).json({ success: false, error: 'Matrix and scalar are required' });
    }

    const result = multiplyMatrixByScalar(matrixA, scalar);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const transposeController = (req: Request, res: Response) => {
  try {
    const { matrixA } = req.body as MatrixOperationRequest;

    if (!matrixA) {
      return res.status(400).json({ success: false, error: 'Matrix is required' });
    }

    const result = transposeMatrix(matrixA);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const determinantController = (req: Request, res: Response) => {
  try {
    const { matrixA } = req.body as MatrixOperationRequest;

    if (!matrixA) {
      return res.status(400).json({ success: false, error: 'Matrix is required' });
    }

    const result = getDeterminant(matrixA);

    if (result === null) {
      return res.status(400).json({ success: false, error: 'Matrix must be square' });
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const inverseController = (req: Request, res: Response) => {
  try {
    const { matrixA } = req.body as MatrixOperationRequest;

    if (!matrixA) {
      return res.status(400).json({ success: false, error: 'Matrix is required' });
    }

    const result = getInverse(matrixA);

    if (result === null) {
      return res.status(400).json({ success: false, error: 'Matrix is not invertible or not square' });
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const traceController = (req: Request, res: Response) => {
  try {
    const { matrixA } = req.body as MatrixOperationRequest;

    if (!matrixA) {
      return res.status(400).json({ success: false, error: 'Matrix is required' });
    }

    const result = getTrace(matrixA);

    if (result === null) {
      return res.status(400).json({ success: false, error: 'Matrix must be square' });
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const eigenvaluesController = (req: Request, res: Response) => {
  try {
    const { matrixA } = req.body as MatrixOperationRequest;

    if (!matrixA) {
      return res.status(400).json({ success: false, error: 'Matrix is required' });
    }

    const result = getEigenvalues2x2(matrixA);

    if (result === null) {
      return res.status(400).json({ success: false, error: 'Matrix must be 2x2 with real eigenvalues' });
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
