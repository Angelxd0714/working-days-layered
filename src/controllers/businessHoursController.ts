import { type Request, type Response } from 'express';
import { calculateBusinessHours } from '../services/businessHoursService';

/**
 * @swagger
 * /business-hours:
 *   get:
 *     summary: Calculate business hours by adding days and hours to a start date
 *     tags: [Business Hours]
 *     parameters:
 *       - in: query
 *         name: dayToAdd
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of business days to add
 *       - in: query
 *         name: hourToAdd
 *         required: true
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

export const businessHoursController = async (req: Request, res: Response): Promise<Response> => {
  const { dayToAdd, hourToAdd, startDate } = req.query;
  
  if (!dayToAdd || !hourToAdd) {
    return res.status(400).json({ error: 'Missing parameters' });
  }
  
  try {
    const days = Number(dayToAdd);
    const hours = Number(hourToAdd);
    
    if (isNaN(days) || isNaN(hours)) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }
    
    let startDateObj: Date | undefined;
    if (startDate) {
      if (Array.isArray(startDate) || typeof startDate !== 'string') {
        return res.status(400).json({ error: 'startDate must be a string' });
      }
      startDateObj = new Date(startDate);
      if (isNaN(startDateObj.getTime())) {
        return res.status(400).json({ error: 'Invalid startDate format' });
      }
    }
    
    const result = await calculateBusinessHours(days, hours, startDateObj);
    console.log(result);
    return res.json(result);
  } catch (error) {
    // Log the error for debugging purposes
    // eslint-disable-next-line no-console
    console.error('Error calculating business hours:', error);
    return res.status(500).json({ error: 'Error calculating business hours' });
  }
};
