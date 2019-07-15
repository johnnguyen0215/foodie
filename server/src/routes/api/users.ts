import { Model, model } from 'mongoose';
import passport = require('passport');
import express = require('express');
import auth from '../auth';
import { IUserModel } from '../../models/User';

const User: Model<IUserModel> = model('User');

const router = express.Router();

const FRONTEND_URL = 'http://localhost:4200';

// POST new user route
router.post('/register', auth.optional, (req, res, next) => {
  const {
    body: {
      user
    }
  } = req;

  if (!user.name) {
    return res.status(422).json({
      errors: {
        name: 'is required',
      }
    });
  }

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      }
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      }
    });
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

router.post('/login', auth.optional, (req, res, next) => {
  const {
    body: {
      user,
    },
  } = req;

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      }
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      }
    });
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

      return res.status(400).send('User not found!');
    }
  )(req, res, next);
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/api/users/auth',
  failureRedirect: '/api/users/login'
}));

router.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/api/users/auth',
  failureRedirect: '/api/users/login',
}));

router.get('/auth', auth.optional, (req, res, next) => {
  const {
    user,
  } = req;

  if (!user) {
    return res.status(400).send('User not found!');
  }

  const userObject = new User(user);
  const token = user.generateJWT();

  const redirectUrl = `${FRONTEND_URL}/home?token=${token}`;

  res.redirect(redirectUrl);
});

// GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const {
    payload: {
      id
    }
  } = req;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
});

export default router;
