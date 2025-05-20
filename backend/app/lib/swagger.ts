import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../../package.json'; // backend/package.json の version を参照

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Receipt Assistant API',
      version: version,
      description: 'API documentation for the Receipt Assistant backend.',
      contact: {
        name: 'API Support',
        url: 'https://example.com/support',
        email: 'support@example.com',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: 'Local development server (without /api/v1 base path in server URL)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Auth Schemas
        RegisterUserInput: {
          type: 'object',
          required: ['email', 'password', 'displayName'],
          properties: {
            email: { type: 'string', format: 'email', description: 'User email address' },
            password: { type: 'string', format: 'password', description: 'User password (min 8 characters)', minLength: 8 },
            displayName: { type: 'string', description: 'User display name', minLength: 1 },
          },
        },
        LoginUserInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', description: 'User email address' },
            password: { type: 'string', format: 'password', description: 'User password' },
          },
        },
        UserObject: { // Corresponds to UserResponse
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', description: 'User ID' },
            email: { type: 'string', format: 'email', description: 'User email address' },
            displayName: { type: 'string', description: 'User display name' },
            createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
            updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
          },
        },
        AuthSuccessResponse: { // Corresponds to AuthResponse for login/register
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/UserObject' },
            session: {
              type: 'object',
              properties: {
                accessToken: { type: 'string', description: 'JWT access token' },
                refreshToken: { type: 'string', description: 'JWT refresh token' },
                expiresAt: { type: 'integer', format: 'int64', description: 'Access token expiration timestamp (seconds since epoch)' },
              },
            },
          },
        },
        // Generic Error Schemas
        ErrorResponse: {
          type: 'object',
          properties: {
            statusCode: { type: 'integer', description: 'HTTP status code' },
            message: { type: 'string', description: 'Error message' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
              nullable: true,
              description: 'Validation errors, if any'
            },
          },
        },
        NotFoundError: {
          allOf: [
            { $ref: '#/components/schemas/ErrorResponse' },
            { properties: { statusCode: { example: 404 } } }
          ]
        },
        UnauthorizedError: {
          allOf: [
            { $ref: '#/components/schemas/ErrorResponse' },
            { properties: { statusCode: { example: 401 } } }
          ]
        },
        BadRequestError: {
          allOf: [
            { $ref: '#/components/schemas/ErrorResponse' },
            { properties: { statusCode: { example: 400 } } }
          ]
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/app/modules/**/*.routes.ts', './src/app/lib/swagger.ts'], // Added self for component definitions
};

export const swaggerSpec = swaggerJsdoc(options);