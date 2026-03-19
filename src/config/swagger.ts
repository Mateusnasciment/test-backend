import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.1.0',
  info: {
    title: 'Dashboard API - RESTful API for Charts',
    version: '1.0.0',
    description:
      'A RESTful API for dashboard charts built with Node.js, TypeScript, Express, Prisma ORM, and MySQL. Provides dynamic chart endpoints with date filtering and multiple grouping options.',
    license: {
      name: 'ISC',
    },
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'http://localhost:{port}',
      description: 'Local server with custom port',
      variables: {
        port: {
          default: '3000',
        },
      },
    },
  ],
  tags: [
    {
      name: 'Charts',
      description: 'Chart data endpoints for dashboard visualization',
    },
    {
      name: 'Health',
      description: 'Health check and API information',
    },
  ],
  components: {
    schemas: {
      DateFilter: {
        type: 'object',
        properties: {
          startDate: {
            type: 'string',
            format: 'date',
            description: 'Start date for filtering data (ISO 8601 format: YYYY-MM-DD)',
            example: '2024-01-01',
          },
          endDate: {
            type: 'string',
            format: 'date',
            description: 'End date for filtering data (ISO 8601 format: YYYY-MM-DD)',
            example: '2024-12-31',
          },
        },
        required: ['startDate', 'endDate'],
      },
      PieChartData: {
        type: 'object',
        properties: {
          label: {
            type: 'string',
            description: 'Category or product label',
            example: 'Electronics',
          },
          value: {
            type: 'number',
            description: 'Aggregated value for the label',
            example: 5000,
          },
        },
      },
      LineChartData: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            description: 'Date/period label',
            example: '2024-01',
          },
          value: {
            type: 'number',
            description: 'Value for the time period',
            example: 1000,
          },
        },
      },
      BarChartData: {
        type: 'object',
        properties: {
          label: {
            type: 'string',
            description: 'Category or product label',
            example: 'Electronics',
          },
          value: {
            type: 'number',
            description: 'Aggregated value for the label',
            example: 5000,
          },
        },
      },
      DashboardSummary: {
        type: 'object',
        properties: {
          totalSales: {
            type: 'integer',
            description: 'Total quantity of items sold',
            example: 500,
          },
          totalRevenue: {
            type: 'number',
            description: 'Total revenue amount',
            example: 75000,
          },
          averageOrderValue: {
            type: 'number',
            description: 'Average value per order',
            example: 150,
          },
          totalOrders: {
            type: 'integer',
            description: 'Total number of orders',
            example: 500,
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          chartType: {
            type: 'string',
            example: 'pie',
          },
          filter: {
            type: 'object',
            properties: {
              startDate: {
                type: 'string',
                format: 'date-time',
              },
              endDate: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
          data: {
            oneOf: [
              { $ref: '#/components/schemas/PieChartData' },
              { $ref: '#/components/schemas/LineChartData' },
              { $ref: '#/components/schemas/BarChartData' },
              { $ref: '#/components/schemas/DashboardSummary' },
            ],
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'string',
            description: 'Error message',
            example: 'Missing required query parameters',
          },
        },
      },
    },
    parameters: {
      startDateParam: {
        name: 'startDate',
        in: 'query',
        required: true,
        schema: {
          type: 'string',
          format: 'date',
        },
        description: 'Start date for filtering data (ISO 8601 format: YYYY-MM-DD)',
        example: '2024-01-01',
      },
      endDateParam: {
        name: 'endDate',
        in: 'query',
        required: true,
        schema: {
          type: 'string',
          format: 'date',
        },
        description: 'End date for filtering data (ISO 8601 format: YYYY-MM-DD)',
        example: '2024-12-31',
      },
      groupByCategoryParam: {
        name: 'groupBy',
        in: 'query',
        required: false,
        schema: {
          type: 'string',
          enum: ['category', 'product'],
          default: 'category',
        },
        description: 'Field to group results by',
      },
      groupByTimeParam: {
        name: 'groupBy',
        in: 'query',
        required: false,
        schema: {
          type: 'string',
          enum: ['date', 'week', 'month'],
          default: 'date',
        },
        description: 'Time period to group results by',
      },
      chartTypeParam: {
        name: 'chartType',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
          enum: ['pie', 'line', 'bar', 'summary', 'trend'],
        },
        description: 'Type of chart to retrieve',
      },
    },
    responses: {
      BadRequestError: {
        description: 'Bad Request - Missing or invalid parameters',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      NotFoundError: {
        description: 'Not Found - Endpoint or resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      InternalServerError: {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
