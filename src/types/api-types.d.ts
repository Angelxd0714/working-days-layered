export interface BusinessHoursRequest {
  days?: string;
  hours?: string;
  date?: string;
}

export interface BusinessHoursResponse {
  date: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}
