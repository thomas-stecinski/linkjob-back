const express = require('express');
const authRoutes = require('./auth');
const cvRoutes = require('./cv');
const recommendationRoutes = require('./recommendation');

const router = express.Router();

router.use('/auth', authRoutes);              
router.use('/cv', cvRoutes);                   
router.use('/recommendation', recommendationRoutes); 

module.exports = router;