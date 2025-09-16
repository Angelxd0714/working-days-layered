'use strict';

/** @type {import('@serverless/types').AWS} */
const serverlessConfiguration = {
  org: 'angelkashed12',
  app: 'working-days-layered',
  service: 'working-days-layered',
  frameworkVersion: '3',
  plugins: [
    'serverless-auto-swagger',
    'serverless-esbuild',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    stage: '${opt:stage, "dev"}',
    region: 'us-west-2',
    memorySize: 256,
    timeout: 30,
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
            summary: 'Obtiene horarios comerciales',
            description: 'Retorna los horarios comerciales basados en parámetros de consulta',
            swaggerTags: ['Business Hours'],
            queryStringParameters: {
              dayToAdd: {
                required: true,
                type: 'string',
                description: 'Día a agregar para el cálculo'
              },
              hourToAdd: {
                required: true,
                type: 'string',
                description: 'Hora a agregar para el cálculo'
              },
              startDate: {
                required: false,
                type: 'string',
                description: 'Fecha de inicio para el cálculo'
              }
            },
            responseData: {
              200: {
                description: 'Horarios comerciales obtenidos exitosamente',
                bodyType: 'BusinessHoursResponse'
              },
              400: {
                description: 'Parámetros de consulta inválidos',
                bodyType: 'ErrorResponse'
              },
              500: {
                description: 'Error interno del servidor',
                bodyType: 'ErrorResponse'
              }
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
    serverlessOffline: {
      noPrependStageInUrl: true,
      httpPort: 3000,
      ignoreJWTSignature: true,
      reloadHandler: true,
    },
    esbuild: {
      bundle: true,
      minify: false,
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
      
    },
    autoswagger: {
      title: 'Working Days API',
      apiType: 'http',
      generateSwaggerOnDeploy: true,
      swaggerPath: 'swagger',
      typefiles: ['./src/types/api-types.d.ts'],
      useStage: false,
      basePath: '/',
      host: 'localhost:3000/dev',
      schemes: ['http'],
      excludeStages: ['production'],
      useRedirectUI: true
    }
    
  },
};

module.exports = serverlessConfiguration;