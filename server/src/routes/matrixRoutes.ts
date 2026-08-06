import express from 'express';
import {
  addMatricesController,
  subtractMatricesController,
  multiplyMatricesController,
  scalarMultiplyController,
  transposeController,
  determinantController,
  inverseController,
  traceController,
  eigenvaluesController
} from '../controllers/matrixController.js';

const router = express.Router();

router.post('/add', addMatricesController);
router.post('/subtract', subtractMatricesController);
router.post('/multiply', multiplyMatricesController);
router.post('/scalar', scalarMultiplyController);
router.post('/transpose', transposeController);
router.post('/determinant', determinantController);
router.post('/inverse', inverseController);
router.post('/trace', traceController);
router.post('/eigenvalues', eigenvaluesController);

export default router;
