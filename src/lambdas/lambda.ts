import { APIGatewayProxyHandler } from 'aws-lambda';
import { businessHoursController } from '../controllers/businessHoursController';
import { BusinessHoursResponse, ErrorResponse } from '../types/api-types';

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const businessHoursHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const response = await businessHoursController({
      query: event.queryStringParameters || {}
    });

    if ('date' in response) {
      const successResponse = response as BusinessHoursResponse;
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(successResponse),
      };
    }

    const errorResponse = response as ErrorResponse;
    const statusCode = errorResponse.error === 'InvalidParameters' ? 400 : 500;

    return {
      statusCode,
      headers: CORS_HEADERS,
      body: JSON.stringify(errorResponse),
    };

  } catch (error) {
    console.error('Unexpected error in businessHoursHandler:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'InternalServerError',
        message: error instanceof Error ? error.message : 'Internal server error'
      }),
    };
  }
};