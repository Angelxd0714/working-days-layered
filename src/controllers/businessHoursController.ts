
import { calculateBusinessHours } from "../services/businessHoursService";
import { BusinessHoursResponse, ErrorResponse, BusinessHoursRequest } from "../types/api-types";

const createErrorResponse = (
  error: string,
  message: string
): ErrorResponse => ({
  error,
  message
});

export const businessHoursController = async (
  req: { query: BusinessHoursRequest }
): Promise<BusinessHoursResponse | ErrorResponse> => {
  try {
    const { days, hours, date } = req.query;

    let daysValue = 0;
    let hasValidDays = false;
    if (days !== undefined) {
      if (!/^\d+$/.test(days.trim())) {
        return createErrorResponse(
          "InvalidParameters",
          "Parameter 'days' must be a positive integer"
        );
      }
      daysValue = parseInt(days, 10);
      if (isNaN(daysValue) || daysValue < 0) {
        return createErrorResponse(
          "InvalidParameters",
          "Parameter 'days' must be a positive integer"
        );
      }
      hasValidDays = true;
    }

    let hoursValue = 0;
    let hasValidHours = false;
    if (hours !== undefined) {
      if (!/^\d+$/.test(hours.trim())) {
        return createErrorResponse(
          "InvalidParameters",
          "Parameter 'hours' must be a positive integer"
        );
      }
      hoursValue = parseInt(hours, 10);
      if (isNaN(hoursValue) || hoursValue < 0) {
        return createErrorResponse(
          "InvalidParameters",
          "Parameter 'hours' must be a positive integer"
        );
      }
      hasValidHours = true;
    }

    if (!hasValidDays && !hasValidHours) {
      daysValue = 1;
      hoursValue = 0;
    }

    let startDate: Date;
    if (date !== undefined) {
      if (!date.endsWith('Z') || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(date)) {
        return createErrorResponse(
          "InvalidParameters",
          "Parameter 'date' must be a valid UTC ISO 8601 format with Z suffix"
        );
      }
      startDate = new Date(date);
      if (isNaN(startDate.getTime())) {
        return createErrorResponse(
          "InvalidParameters",
          "Parameter 'date' must be a valid UTC ISO 8601 format with Z suffix"
        );
      }
    } else {
      startDate = new Date();
    }

    try {
      const result = await calculateBusinessHours(daysValue, hoursValue, startDate);
      
      return {
        date: result.toISOString()
      };
    } catch (error) {
      console.error('Error calculating business hours:', error);
      return createErrorResponse(
        "InternalServerError",
        "Error calculating business hours"
      );
    }
  } catch (error) {
    console.error('Unexpected error in businessHoursController:', error);
    return createErrorResponse(
      "InternalServerError",
      "Internal server error"
    );
  }
};
