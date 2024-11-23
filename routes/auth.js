const express = require('express');
const router = express.Router();
const { registerController, loginController, meController, logoutController } = require('../controllers/authcontroller');

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', logoutController); 
router.get('/me', meController);

module.exports = router;