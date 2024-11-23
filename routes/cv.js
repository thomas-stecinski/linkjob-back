const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const { 
    createCV,
    updateCV, 
    deleteCV,
    getAllCVs,
    getUserCV
} = require('../controllers/cvcontroller.js');

router.post('/create-cv', authMiddleware, createCV);

router.put('/update-cv', authMiddleware, updateCV);

router.delete('/delete-cv', authMiddleware, deleteCV);

router.get('/get-cv', authMiddleware, getAllCVs);

router.get('/get-cv/:iduser', authMiddleware, getUserCV);

module.exports = router;
