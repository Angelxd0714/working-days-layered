'use strict';

/** @type {import('@serverless/types').AWS} */
const serverlessConfiguration = {
  service: 'working-days-api',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
    'serverless-aws-documentation'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    stage: '${opt:stage, "dev"}',
    region: 'us-east-1',
    memorySize: 256,
    timeout: 30,
    httpApi: {
      cors: true
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
    api: {
      handler: 'dist/src/app.handler',
      events: [
    
      ],
      environment: {
        API_VERSION: '1.0.0',
      },
    },
    businessHours: {
      handler: 'dist/src/lambdas/lambda.businessHoursHandler',
      events: [
        {
          http: {
            path: '/business-hours',
            method: 'GET',
            cors: true,
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
  },
};

module.exports = serverlessConfiguration;
