
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

import { calculateBusinessHours } from "../services/businessHoursService";

export const businessHoursController = async (
  req: { query: { dayToAdd?: string; hourToAdd?: string; startDate?: string } }
): Promise<{ statusCode: number; result: string }> => {
  try {
    const { dayToAdd, hourToAdd, startDate } = req.query;

    // Validate input parameters
    const days = dayToAdd ? parseInt(dayToAdd, 10) : 0;
    const hours = hourToAdd ? parseInt(hourToAdd, 10) : 0;
    const start = startDate ? new Date(startDate) : new Date();

    if (isNaN(days) || isNaN(hours) || isNaN(start.getTime())) {
      return {
        statusCode: 400,
        result: 'Invalid input parameters'
      };
    }

    if (days < 0 || hours < 0) {
      return {
        statusCode: 400,
        result: 'Days and hours must be non-negative'
      };
    }

    const result = calculateBusinessHours(days, hours, start ? new Date(start) : undefined);

    return {
      statusCode: 200,
      result: (await result).toISOString()
    };
  } catch (error) {
    console.error('Error in businessHoursController:', error);
    return {
      statusCode: 500,
      result: 'Internal server error'
    };
  }
};
