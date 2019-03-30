import express = require('express');
import apiRouter from './api';

const router = express.Router();

router.use('/api', apiRouter);

export default router;
