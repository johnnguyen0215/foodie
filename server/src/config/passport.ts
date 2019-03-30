import mongoose = require('mongoose');
import passport = require('passport');
import { IUserModel } from '../models/User';
const LocalStrategy = require('passport-local').Strategy;

const User = mongoose.model('User');

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, (email, password, done) => {
  User.findOne({ email })
    .then((user: IUserModel) => {
      if (!user || !user.validatePassword(password)) {
        return done(
          null,
          false,
          {
            errors: {
              'email or password': 'is invalid'
            }
          }
        );
      }

      return done(null, user);
    }).catch(done);
}));
