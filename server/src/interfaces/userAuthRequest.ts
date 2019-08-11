import { Request } from 'express';

export interface IUserAuthRequest extends Request {
  payload?: {
    id?: string
  };
}
