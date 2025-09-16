export interface ApiError {
  error: string;
  code: number;
}
/**
 * @swagger
 * components:
 *   schemas:
 *     BusinessHoursResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           format: int32
 *           example: 200
 *         result:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora calculada en formato ISO 8601
 *           example: "2023-09-25T10:30:00.000Z"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           format: int32
 *           example: 400
 *         error:
 *           type: string
 *           description: Descripción del error
 *           example: "Parámetros de consulta inválidos"
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "dayToAdd debe ser un número"
 *               field:
 *                 type: string
 *                 example: "dayToAdd"
 */

export interface BusinessHoursResponse {
  statusCode: number;
  result: string;
}

export interface ErrorResponse {
  statusCode: number;
  error: string;
  details?: Array<{
    message: string;
    field?: string;
  }>;
}
