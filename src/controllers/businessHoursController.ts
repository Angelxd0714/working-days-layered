
/**
 * @swagger
 * /business-hours:
 *   get:
 *     summary: Calculate business hours by adding days and hours to a start date
 *     tags: [Business Hours]
 *     parameters:
 *       - in: query
 *         name: dayToAdd
 *         required: false
 *         optional: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of business days to add
 *       - in: query
 *         name: hourToAdd
 *         required: false
 *         optional: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of business hours to add
 *       - in: query
 *         name: startDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date (ISO 8601 format). If not provided, current date will be used.
 *     responses:
 *       200:
 *         description: The calculated date after adding business hours
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   format: date-time
 *                   description: The calculated date in ISO 8601 format
 *       400:
 *         description: Invalid input parameters
 *       500:
 *         description: Server error while calculating business hours
 */

import { calculateBusinessHours } from "../services/businessHoursService.js";
import { BusinessHoursResponse, CustomRequest } from "../types/index.js";

export const businessHoursController = async (
  req: CustomRequest
): Promise<BusinessHoursResponse> => {
  try {
    const { dayToAdd, hourToAdd, startDate } = req.query;

    // Validate input parameters
    const days = dayToAdd ? parseInt(dayToAdd, 10) : 0;
    const hours = hourToAdd ? parseInt(hourToAdd, 10) : 0;
    const start = startDate ? new Date(startDate) : new Date();

    if (isNaN(days) || isNaN(hours) || isNaN(start.getTime())) {
      return {
        statusCode: 400,
        body: { error: 'Invalid input parameters' } as const
      };
    }

    if (days < 0 || hours < 0) {
      return {
        statusCode: 400,
        body: { error: 'Days and hours must be non-negative' } as const
      };
    }

    const result = calculateBusinessHours(days, hours, start ? new Date(start) : undefined);

    return {
      statusCode: 200,
      body: { result: (await result).toISOString() } as const
    };
  } catch (error) {
    console.error('Error in businessHoursController:', error);
    return {
      statusCode: 500,
      body: { error: 'Internal server error' } as const
    };
  }
};
