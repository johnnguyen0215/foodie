import { Model, model } from 'mongoose';
import passport = require('passport');
import { IUserModel } from '../models/User';
import authConfig from './auth';
import request = require('request');

const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = model('User');

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
},
async (email, password, done) => {
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

const socialMediaStrategy = async (profile, done, type, pictureUrl) => {
  try {
    let fullName = profile.displayName;

    if (profile.name && profile.name.givenName) {
      fullName = `${profile.name.givenName} ${profile.name.familyName}`;
    }

    const idKey = `${type}.id`;
    const pictureKey = `${type}.picture`;

    const user = await User.findOne({
      [idKey]: profile.id
    });

    if (!user) {
      const newUser = new User({
        email: profile._json.email,
        name: fullName,
        [idKey]: profile.id,
        [pictureKey]: pictureUrl,
      });

      newUser.save((saveError) => {
        return done(saveError, newUser);
      });
    }

    return done(null, user);
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
};

passport.use(new FacebookStrategy({
  clientID: authConfig.facebookAuth.clientID,
  clientSecret: authConfig.facebookAuth.clientSecret,
  callbackURL: authConfig.facebookAuth.callbackURL,
},
(accessToken, refreshToken, profile, done) => {
  if (profile) {
    const pictureUrl = `https://graph.facebook.com/${profile.id}` +
    `/picture?type=large`;

    return socialMediaStrategy(profile, done, 'facebook', pictureUrl);
  }

  return done(
    null,
    false,
    {
      errors: {
        'profile-error': 'No profile was found for this facebook account',
      }
    }
  );
}));

passport.use(new GoogleStrategy({
  clientID: authConfig.googleAuth.clientID,
  clientSecret: authConfig.googleAuth.clientSecret,
  callbackURL: authConfig.googleAuth.callbackURL,
},
(token, refreshToken, profile, done) => {
  if (profile) {
    const pictureUrl = profile._json.picture;

    return socialMediaStrategy(profile, done, 'google', pictureUrl);
  }

  return done(
    null,
    false,
    {
      errors: {
        'profile-error': 'No profile was found for this google account',
      }
    }
  );
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
