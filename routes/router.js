const express = require('express');
const authRoutes = require('./auth');
const cvRoutes = require('./cv');
const recommendationRoutes = require('./recommendation');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('../swagger/SwaggerOptions');
const swaggerJSDoc = require('swagger-jsdoc');

const specs = swaggerJSDoc(swaggerOptions);

const router = express.Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
router.use('/auth', authRoutes);              
router.use('/cv', cvRoutes);                   
router.use('/recommendation', recommendationRoutes); 

module.exports = router;