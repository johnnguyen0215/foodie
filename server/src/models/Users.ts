import mongoose = require('mongoose');
import crypto = require('crypto');
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const UsersSchema: mongoose.Schema = new Schema({
  email: String,
  hash: String,
  salt: String,
});

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(
    password,
    this.salt,
    10000,
    512,
    'sha512'
  ).toString('hex');
};

UsersSchema.methods.validatePassword = (password) => {
  const hash = crypto.pbkdf2Sync(
    password,
    this.salt,
    10000,
    512,
    'sha512'
  ).toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = () => {
  const today = new Date();
  const expirationDate = new Date();
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: expirationDate.getTime() / 1000,
  }, 'secret');
}

UsersSchema.methods.toAuthJSON = () => {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

mongoose.model('Users', UsersSchema);
