import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for travel box application',
    },
  },
  apis: ['./src/routes/*.ts'], // 라우트 파일의 주석에서 Swagger 스키마를 가져옵니다.
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
