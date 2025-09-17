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
      '!node_modules/.git/**',
      '!node_modules/.bin/**',
      '!node_modules/aws-sdk/**',
      '!src/**',
      '!tsconfig.json',
      '!.eslintrc.cjs',
      '!.gitignore',
      '!**/*',
      'dist/**',
      'node_modules/**',
    ],
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
              summary: 'Obtiene horarios comerciales',
              description: 'Retorna los horarios comerciales basados en parámetros de consulta',
              tags: ['Business Hours'],
              queryParams: [
                {
                  name: 'dayToAdd',
                  description: 'Días hábiles a agregar',
                  required: true,
                  schema: { 
                    type: 'integer',
                    minimum: 0,
                    description: 'Número de días hábiles a agregar'
                  }
                },
                {
                  name: 'hourToAdd',
                  description: 'Horas hábiles a agregar',
                  required: true,
                  schema: { 
                    type: 'integer',
                    minimum: 0,
                    description: 'Número de horas hábiles a agregar'
                  }
                },
                {
                  name: 'startDate',
                  description: 'Fecha de inicio en formato ISO 8601 (opcional, por defecto: fecha actual)',
                  required: false,
                  schema: { 
                    type: 'string',
                    format: 'date-time',
                    description: 'Fecha de inicio en formato ISO 8601 (opcional, por defecto: fecha actual)'
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
                  dayToAdd: true,
                  hourToAdd: true,
                  startDate: false
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
          description: 'Respuesta con los horarios comerciales calculados',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              result: { 
                type: 'string',
                description: 'Resultado del cálculo'
              },
              startDate: { 
                type: 'string', 
                format: 'date-time',
                description: 'Fecha de inicio del período calculado'
              },
              endDate: { 
                type: 'string', 
                format: 'date-time',
                description: 'Fecha final del período calculado'
              },
              totalBusinessHours: { 
                type: 'number',
                description: 'Total de horas hábiles calculadas'
              },
              totalBusinessDays: { 
                type: 'number',
                description: 'Total de días hábiles calculados'
              },
              businessHours: { 
                type: 'number',
                description: 'Horas hábiles'
              },
              days: { 
                type: 'number',
                description: 'Días'
              },
              hours: { 
                type: 'number',
                description: 'Horas'
              },
              minutes: { 
                type: 'number',
                description: 'Minutos'
              }
            },
            required: [
              'startDate',
              'endDate',
              'totalBusinessHours',
              'totalBusinessDays',
              'businessHours',
              'days',
              'hours',
              'minutes'
            ]
          }
        },
        {
          name: 'ErrorResponse',
          description: 'Error response',
          contentType: 'application/json',
          schema: {
            type: 'object',
            properties: {
              statusCode: { type: 'number' },
              error: { type: 'string' },
              message: { type: 'string' },
              code: { type: 'string' }
            },
            required: ['statusCode', 'error', 'message']
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