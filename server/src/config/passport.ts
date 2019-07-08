import { Model, model } from 'mongoose';
import passport = require('passport');
import { IUserModel } from '../models/User';
import authConfig from './auth';

const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const User = model('User');

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
},
async (email, password, done) => {
  console.log('executing local strategy');

  try {
    const user: any = await User.findOne(
      {
        email
      }
    );

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
  } catch (e) {

    return done(
      null,
      false,
      {
        errors: {
          'uknown-error': `There was an issue finding or creating the` +
          ` user record. ${e}`,
        }
      }
    );
  }

  return done();
}));

passport.use(new FacebookStrategy({
  clientID: authConfig.facebookAuth.clientID,
  clientSecret: authConfig.facebookAuth.clientSecret,
  callbackURL: authConfig.facebookAuth.callbackURL,
},
async (accessToken, refreshToken, profile, done) => {
  console.log('executing facebook strategy');

  try {
    const user = await User.findOneAndUpdate(
      {
        'email': profile._json.email
      },
      {
        $set: {
          email: profile._json.email,
          name: `${profile.name.givenName} ${profile.name.familyName}`,
          facebookId: profile.id,
          picture: `https://graph.facebook.com/${profile.id}` +
          `/picture?type=large`,
        }
      },
      {
        upsert: true,
      }
    );

    if (!user) {
      done(
        null,
        false,
        {
          errors: {
            'unknown-error': 'There was a problem accessing your account.'
          }
        }
      );
    }

  } catch (e) {
    done(
      null,
      false,
      {
        errors: {
          'uknown-error': `There was an issue finding or creating the` +
          ` user record. ${e}`,
        }
      }
    );
  }

  return done();
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
