import { Model, model } from 'mongoose';
import passport = require('passport');
import { IUserModel } from '../models/User';
import authConfig from './auth';
import request = require('request');

const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = model('User');

const GOOGLE_PROFILE_URL = 'https://www.googleapis.com/plus/v1/people';

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

passport.use(new FacebookStrategy({
  clientID: authConfig.facebookAuth.clientID,
  clientSecret: authConfig.facebookAuth.clientSecret,
  callbackURL: authConfig.facebookAuth.callbackURL,
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let fullName = profile.displayName;

    if (profile.name && profile.name.givenName) {
      fullName = `${profile.name.givenName} ${profile.name.familyName}`;
    }

    const user = await User.findOneAndUpdate(
      {
        facebookId: profile.facebook.id
      },
      {
        $set: {
          email: profile._json.email,
          name: fullName,
          facebook: {
            id: profile.id,
            picture: `https://graph.facebook.com/${profile.id}` +
            `/picture?type=large`
          }
        }
      },
      {
        upsert: true,
      }
    );

    if (!user) {
      return done(
        null,
        false,
        {
          errors: {
            'unknown-error': 'There was a problem accessing your account.'
          }
        }
      );
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
}));

passport.use(new GoogleStrategy({
  clientID: authConfig.googleAuth.clientID,
  clientSecret: authConfig.googleAuth.clientSecret,
  callbackURL: authConfig.googleAuth.callbackURL,
},
async (token, refreshToken, profile, done) => {
  try {
    let fullName = profile.displayName;

    if (profile.name && profile.name.givenName) {
      fullName = `${profile.name.givenName} ${profile.name.familyName}`;
    }

    const googlePictureReq = await request(
      `${GOOGLE_PROFILE_URL}/${profile.id}` +
      `?fields=image&key=${authConfig.googleAuth.apiKey}`
    );

    const googlePicture = googlePictureReq && googlePictureReq.image.url;

    const user = await User.findOneAndUpdate(
      {
        googleId: profile.google.id,
      },
      {
        $set: {
          email: profile._json.email,
          name: fullName,
          google: {
            id: profile.id,
            picture: googlePicture,
          }
        }
      },
      {
        upsert: true,
      }
    );

    if (!user) {
      return done(
        null,
        false,
        {
          errors: {
            'unknown-error': 'There was a problem accessing your account.'
          }
        }
      );
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
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
