const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const {
  getRecommendations,
  addRecommendation,
  deleteRecommendation,
  editRecommendation,
} = require('../controllers/recommendation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Recommendation:
 *       type: object
 *       required:
 *         - text
 *         - cvid
 *         - status_label
 *       properties:
 *         text:
 *           type: string
 *           description: The content of the recommendation
 *           example: "John is an excellent developer with strong problem-solving skills"
 *         cvid:
 *           type: string
 *           description: The ID of the CV being recommended
 *           example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *         status_label:
 *           type: string
 *           description: The visibility status of the recommendation
 *           enum: [public, private]
 *           example: "public"
 */

/**
 * @swagger
 * /api/recommendation/{cvid}/recommendations:
 *   get:
 *     tags:
 *       - Recommendations
 *     summary: Get all recommendations for a CV
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cvid
 *         required: true
 *         schema:
 *           type: string
 *         description: The CV ID
 *         example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *     responses:
 *       200:
 *         description: List of recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "65f1a2b3c4d5e6f7g8h9i0j2"
 *                       commentatorid:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "65f1a2b3c4d5e6f7g8h9i0j3"
 *                           firstname:
 *                             type: string
 *                             example: "Marie"
 *                           lastname:
 *                             type: string
 *                             example: "Dupont"
 *                       text:
 *                         type: string
 *                         example: "John is an excellent developer with strong problem-solving skills"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-15T10:30:00.000Z"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: CV not found
 */
router.get('/:cvid/recommendations', authMiddleware, getRecommendations);

/**
 * @swagger
 * /api/recommendation/add-recommendation:
 *   post:
 *     tags:
 *       - Recommendations
 *     summary: Add a new recommendation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recommendation'
 *     responses:
 *       201:
 *         description: Recommendation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Recommendation added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65f1a2b3c4d5e6f7g8h9i0j2"
 *                     text:
 *                       type: string
 *                       example: "John is an excellent developer with strong problem-solving skills"
 *                     cvid:
 *                       type: string
 *                       example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *                     commentatorid:
 *                       type: string
 *                       example: "65f1a2b3c4d5e6f7g8h9i0j3"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-15T10:30:00.000Z"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/add-recommendation', authMiddleware, addRecommendation);

/**
 * @swagger
 * /api/recommendation/delete/{id}:
 *   delete:
 *     tags:
 *       - Recommendations
 *     summary: Delete a recommendation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recommendation ID
 *         example: "65f1a2b3c4d5e6f7g8h9i0j2"
 *     responses:
 *       200:
 *         description: Recommendation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Recommendation deleted successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Recommendation not found
 */
router.delete('/delete/:id', authMiddleware, deleteRecommendation);

/**
 * @swagger
 * /api/recommendation/edit/{id}:
 *   put:
 *     tags:
 *       - Recommendations
 *     summary: Edit a recommendation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The recommendation ID
 *         example: "65f1a2b3c4d5e6f7g8h9i0j2"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - status_label
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Updated: John is an exceptional developer with outstanding leadership skills"
 *               status_label:
 *                 type: string
 *                 enum: [public, private]
 *                 example: "public"
 *     responses:
 *       200:
 *         description: Recommendation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Recommendation updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65f1a2b3c4d5e6f7g8h9i0j2"
 *                     text:
 *                       type: string
 *                       example: "Updated: John is an exceptional developer with outstanding leadership skills"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-15T11:30:00.000Z"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Recommendation not found
 */
router.put('/edit/:id', authMiddleware, editRecommendation);

module.exports = router;
