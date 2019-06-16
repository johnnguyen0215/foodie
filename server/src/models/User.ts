import { Document, Schema, Model, model } from 'mongoose';
import crypto = require('crypto');
import jwt = require('jsonwebtoken');
import { IUser } from '../interfaces/user';
import { AuthObject } from '../interfaces/authObject';

export interface IUserModel extends IUser, Document {
  setPassword(password: string): void;
  validatePassword(password: string): boolean;
  generateJWT(): string;
  toAuthJSON(): AuthObject;
}

export const UserSchema: Schema = new Schema({
  createdAt: Date,
  name: String,
  email: String,
  hash: String,
  salt: String,
});

UserSchema.pre('save', (next) => {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }

  next();
});

UserSchema.methods.setPassword = function (password: string) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(
    password,
    this.salt,
    10000,
    512,
    'sha512'
  ).toString('hex');
};

UserSchema.methods.validatePassword = function (password: string): boolean {
  const hash = crypto.pbkdf2Sync(
    password,
    this.salt,
    10000,
    512,
    'sha512'
  ).toString('hex');

  return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date();
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    name: this.name,
    email: this.email,
    id: this._id,
    exp: expirationDate.getTime() / 1000,
  }, 'secret');
};

UserSchema.methods.toAuthJSON = function (): AuthObject {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    token: this.generateJWT(),
  };
};

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
