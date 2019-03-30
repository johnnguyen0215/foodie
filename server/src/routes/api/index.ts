import express = require('express');
import userRouter from './user';

const router = express.Router();

router.use('/user', userRouter);

export default router;
