'use strict';

/** @type {import('@serverless/types').AWS} */
const serverlessConfiguration = {
  org: 'angelkashed12',
  app: 'working-days-layered',
  service: 'working-days-layered',
  frameworkVersion: '3',
  plugins: [
    'serverless-openapi-documentation',
    'serverless-esbuild',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    stage: '${opt:stage, "dev"}',
    region: 'us-west-2',
    logs: {
      restApi: {
        role: 'arn:aws:iam::604100153030:role/serverlessApiGatewayCloudWatchRole',
        roleManagedExternally: true,
      },
    },
    memorySize: 256,
    timeout: 30,
    deploymentBucket: {
      name: 'working-days-layered-deployment-${self:provider.region}-${self:provider.stage}'
    },
    httpApi: {
      cors: true,
      disableDefaultEndpoint: true
    },
    apiGateway: {
      shouldStartNameWithService: true,
      minimumCompressionSize: 0,
      apiKeys: undefined,
      usagePlan: {
        quota: {
          limit: 5000,
          offset: 0,
          period: 'MONTH'
        },
        throttle: {
          burstLimit: 200,
          rateLimit: 100
        }
      }
    },
    environment: {
      NODE_ENV: '${self:provider.stage}',
      STAGE: '${self:provider.stage}'
    },
  },
  package: {
    patterns: [
      'dist/**',
      '!**/*'
    ]
  },
  functions: {
    businessHours: {
      handler: 'dist/src/lambdas/lambda.businessHoursHandler',
      events: [
        {
          http: {
            path: '/business-hours',
            method: 'GET',
            cors: true,
            documentation: {
              summary: 'Calcula fechas hábiles',
              description: 'Calcula fechas hábiles considerando días festivos colombianos y horarios laborales',
              tags: ['Business Hours'],
              queryParams: [
                {
                  name: 'days',
                  description: 'Número de días hábiles a sumar (opcional, entero positivo)',
                  required: false,
                  schema: { 
                    type: 'integer',
                    minimum: 0,
                    description: 'Número de días hábiles a sumar'
                  }
                },
                {
                  name: 'hours',
                  description: 'Número de horas hábiles a sumar (opcional, entero positivo)',
                  required: false,
                  schema: { 
                    type: 'integer',
                    minimum: 0,
                    description: 'Número de horas hábiles a sumar'
                  }
                },
                {
                  name: 'date',
                  description: 'Fecha/hora inicial en UTC (ISO 8601) con sufijo Z (opcional)',
                  required: false,
                  schema: { 
                    type: 'string',
                    format: 'date-time',
                    pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?Z$',
                    description: 'Fecha/hora inicial en UTC ISO 8601 con sufijo Z'
                  }
                }
              ],
              methodResponses: [
                {
                  statusCode: '200',
                  responseBody: {
                    description: 'Horarios comerciales obtenidos exitosamente'
                  },
                  responseModels: {
                    'application/json': 'BusinessHoursResponse'
                  }
                },
                {
                  statusCode: '400',
                  responseBody: {
                    description: 'Parámetros de entrada inválidos'
                  },
                  responseModels: {
                    'application/json': 'ErrorResponse'
                  }
                },
                {
                  statusCode: '500',
                  responseModels: {
                    'application/json': 'ErrorResponse'
                  },
                  responseBody: {
                    description: 'Error interno del servidor'
                  }
                }
              ]
            },
            request: {
              parameters: {
                querystrings: {
                  days: false,
                  hours: false,
                  date: false
                }
              }
            }
          }
        }
      ]
    },
  },
  custom: {
    documentation: {
      version: '1.0.0',
      title: 'Working Days API',
      description: 'API para el cálculo de días y horas hábiles',
      models: [
        {
          name: 'BusinessHoursResponse',
          description: 'Respuesta exitosa con la fecha calculada',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              date: { 
                type: 'string',
                format: 'date-time',
                description: 'Fecha y hora calculada en UTC ISO 8601',
                example: '2025-08-01T14:00:00.000Z'
              }
            },
            required: ['date']
          }
        },
        {
          name: 'ErrorResponse',
          description: 'Respuesta de error',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              error: { 
                type: 'string',
                description: 'Tipo de error',
                example: 'InvalidParameters'
              },
              message: { 
                type: 'string',
                description: 'Descripción del error',
                example: 'At least one of \'days\' or \'hours\' parameters is required'
              }
            },
            required: ['error', 'message']
          }
        }
      ]
    },
    serverlessOffline: {
      noPrependStageInUrl: true,
      httpPort: 3000,
      ignoreJWTSignature: true,
      reloadHandler: true,
    },
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node20',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      watch: {
        pattern: ['src/**/*.ts'],
        ignore: ['dist', '.esbuild', 'node_modules'],
      },
    }
  },
};

module.exports = serverlessConfiguration;