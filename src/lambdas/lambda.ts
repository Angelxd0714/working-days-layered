import { APIGatewayProxyHandler } from 'aws-lambda';
import { businessHoursController } from '../controllers/businessHoursController';

export const businessHoursHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const response = await businessHoursController({ 
      query: event.queryStringParameters || {}
    });

    return {
      statusCode: response.statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(response.result),
    };
  } catch (error) {
    console.error('Error in businessHoursHandler:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};