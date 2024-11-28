const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'LinkJob API',
        version: '1.0.0',
        description: 'API documentation for LinkJob application',
      },
      servers: [
        {
          url: process.env.NODE_ENV === 'production'
            ? 'https://linkjob-back.onrender.com'
            : 'http://localhost:8000',
          description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
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
      },
      security: [{
        bearerAuth: [],
      }],
    },
    apis: ['./routes/*.js'], // Path to the API routes
  };
  
  module.exports = swaggerOptions;