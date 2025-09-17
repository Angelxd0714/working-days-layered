
import { calculateBusinessHours } from "../services/businessHoursService";
import { BusinessHoursResponse, ErrorResponse } from "../types/api-types";

const createErrorResponse = (
  statusCode: number,
  message: string,
  details?: Array<{ message: string; field?: string }>
): ErrorResponse => ({
  statusCode,
  error: message,
  ...(details && { details })
});

interface QueryParams {
  dayToAdd?: string;
  hourToAdd?: string;
  startDate?: string;
}

export const businessHoursController = async (
  req: { query: QueryParams }
): Promise<BusinessHoursResponse | ErrorResponse> => {
  try {
    const { dayToAdd, hourToAdd, startDate } = req.query;

    // Validate required parameters
    if (!dayToAdd || !hourToAdd) {
      const missingParams = [];
      if (!dayToAdd) missingParams.push('dayToAdd');
      if (!hourToAdd) missingParams.push('hourToAdd');
      
      return createErrorResponse(400, `Missing required parameters: ${missingParams.join(', ')}`);
    }

    // Parse and validate numbers
    const days = parseInt(dayToAdd, 10);
    const hours = parseInt(hourToAdd, 10);
    const start = startDate ? new Date(startDate) : new Date();

    const errors: Array<{ message: string; field?: string }> = [];
    
    if (isNaN(days)) {
      errors.push({ message: 'dayToAdd must be a valid number', field: 'dayToAdd' });
    } else if (days < 0) {
      errors.push({ message: 'dayToAdd must be a non-negative number', field: 'dayToAdd' });
    }
    
    if (isNaN(hours)) {
      errors.push({ message: 'hourToAdd must be a valid number', field: 'hourToAdd' });
    } else if (hours < 0) {
      errors.push({ message: 'hourToAdd must be a non-negative number', field: 'hourToAdd' });
    }
    
    if (isNaN(start.getTime())) {
      errors.push({ message: 'startDate must be a valid date', field: 'startDate' });
    }
    
    if (errors.length > 0) {
      return createErrorResponse(400, 'Invalid input parameters', errors);
    }

    try {
      const result = await calculateBusinessHours(days, hours, start);
      
      return {
        statusCode: 200,
        result: result.toISOString()
      };
    } catch (error) {
      console.error('Error calculating business hours:', error);
      return createErrorResponse(500, 'Error calculating business hours');
    }
  } catch (error) {
    console.error('Unexpected error in businessHoursController:', error);
    return createErrorResponse(500, 'Internal server error');
  }
};
