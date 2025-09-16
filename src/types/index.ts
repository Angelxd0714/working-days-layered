export interface ApiError {
  error: string;
  code: number;
}

export interface BusinessHoursRequestQuery {
  dayToAdd?: string;
  hourToAdd?: string;
  startDate?: string;
  [key: string]: string | undefined;
}



export interface BusinessHoursResponse {
  statusCode: number;
  body: any;
}

import { Request } from 'express';

export interface CustomRequest extends Omit<Request, 'query'> {
  query: BusinessHoursRequestQuery;
  body: any;
  [key: string]: any;
}