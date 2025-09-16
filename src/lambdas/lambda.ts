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

    // If the response is a BusinessHoursResponse, format it properly
    if ('result' in response) {
      const successResponse = response as BusinessHoursResponse;
      return {
        statusCode: successResponse.statusCode,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          statusCode: successResponse.statusCode,
          result: successResponse.result
        }),
      };
    }
    
    // If it's an error response, return it as is
    return {
      statusCode: response.statusCode,
      headers: CORS_HEADERS,
      body: JSON.stringify(response),
    };
    
  } catch (error) {
    console.error('Unexpected error in businessHoursHandler:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        statusCode: 500,
        error: 'Internal server error',
        details: [
          {
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        ],
      }),
    };
  }
};