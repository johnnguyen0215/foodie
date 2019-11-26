import { Model, model } from 'mongoose';
import passport = require('passport');
import express = require('express');
import auth from '../auth';
import { IUserModel, UserSchema } from '../../models/User';
import { IUserAuthRequest } from '../../interfaces/userAuthRequest';
import Joi = require('@hapi/joi');

const User: Model<IUserModel> = model('User');

const router = express.Router();

const FRONTEND_URL = 'https://localhost:4200';

router.post('/register', auth.optional, async (req, res, next) => {
  const {
    body: {
      user
    }
  } = req;

  const userValidationSchema = Joi.object().keys({
    name: Joi.string().min(1).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
    email: Joi.string().email().required()
  });

  try {
    await Joi.validate(user, userValidationSchema, { abortEarly: false});
  } catch (err) {
    console.log(err);

    if (err) {
      switch (err.details[0].context.key) {
        case 'password':
          return res.status(400).send(`The password provided must be
          alphanumeric and 6-30 characters long.`);
        case 'email':
          return res.status(400).send('The email provided is not valid.');
        case 'name':
          return res.status(400).send('A name must be provided.');
        default:
          return res.status(400).send('An unknown error occurred.');
      }
    } else {
      return res.status(400).send('An unknown error occurred.');
    }
  }

  const userExists = await User.findOne({
    email: user.email,
  });

  if (userExists) {
    return res.status(409).send('User already exists.');
  }

  const finalUser = new User(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => {
      res.json({
        user: finalUser.toAuthJSON()
      });
    });
});

router.post('/login', auth.optional, async (req, res, next) => {
  const {
    body: {
      user,
    },
  } = req;

  const userValidationSchema = Joi.object().keys({
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    email: Joi.string().email().required()
  });

  try {
    await userValidationSchema.validate(user);
  } catch (err) {
    if (err) {
      return res.status(400).send(err.details[0].message);
    } else {
      return res.status(400).send('An unknown error occurred.');
    }
  }

  return passport.authenticate(
    'local',
    { session: false },
    (err, passportUser: IUserModel, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const userObject = {...passportUser};
        userObject.token = passportUser.generateJWT();

        return res.json({ user: userObject.toAuthJSON() });
      }

      return res.status(400).send('User not found.');
    }
  )(req, res, next);
});

// GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req: IUserAuthRequest, res, next) => {
  return User.findById(req.payload.id)
    .then((user) => {
      if (!user) {
        return res.status(400).send('User not found.');
      }

      return res.json({ user: user.toAuthJSON() });
    });
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/api/users/auth',
  failureRedirect: '/api/users/auth/fail'
}));

router.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/api/users/auth',
  failureRedirect: '/api/users/auth/fail',
}));

router.get('/auth', auth.optional, (req, res, next) => {
  const {
    user,
  } = req;

  if (!user) {
    return res.status(400).send('User not found.');
  }

  const token = user.generateJWT();

  const redirectUrl = `${FRONTEND_URL}/home?token=${token}`;

  res.redirect(redirectUrl);
});

router.get('/auth/fail', auth.optional, (req, res, next) => {
  return res.status(400).send(`There was a failure logging ` +
  `into your social media account`);
});

export default router;
