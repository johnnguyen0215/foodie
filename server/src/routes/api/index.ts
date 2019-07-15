import express = require('express');
import usersRouter from './users';

const router = express.Router();

router.use('/users', usersRouter);

export default router;
