const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authmiddleware');
const { 
    createCV,
    updateCV, 
    deleteCV,
    getAllCVs,
    getUserCV,
    checkUserCV 
} = require('../controllers/cvcontroller.js'); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Education:
 *       type: object
 *       properties:
 *         degree:
 *           type: string
 *           example: "Master en Informatique"
 *         institution:
 *           type: string
 *           example: "EFREI Paris"
 *         startdate:
 *           type: string
 *           format: date
 *           example: "2018-09-01"
 *         enddate:
 *           type: string
 *           format: date
 *           example: "2020-06-30"
 *         description:
 *           type: string
 *           example: "Spécialisation en Intelligence Artificielle et Big Data"
 *     Experience:
 *       type: object
 *       properties:
 *         role:
 *           type: string
 *           example: "Lead Developer"
 *         company:
 *           type: string
 *           example: "Tech Solutions Paris"
 *         startdate:
 *           type: string
 *           format: date
 *           example: "2020-07-01"
 *         enddate:
 *           type: string
 *           format: date
 *           example: "2023-12-31"
 *         description:
 *           type: string
 *           example: "Direction d'une équipe de 5 développeurs, mise en place d'architecture microservices"
 */

/**
 * @swagger
 * /api/cv/create-cv:
 *   post:
 *     tags:
 *       - CV
 *     summary: Create a new CV
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - title
 *               - status_label
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 example: "Doe"
 *               title:
 *                 type: string
 *                 example: "Senior Software Engineer"
 *               location:
 *                 type: string
 *                 example: "Paris, France"
 *               summary:
 *                 type: string
 *                 example: "Experienced software engineer with 8 years of experience in full-stack development"
 *               education:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Education'
 *                 example:
 *                   - degree: "Master en Informatique"
 *                     institution: "EFREI Paris"
 *                     startdate: "2018-09-01"
 *                     enddate: "2020-06-30"
 *                     description: "Spécialisation en Intelligence Artificielle et Big Data"
 *                   - degree: "Licence en Informatique"
 *                     institution: "Université Paris-Saclay"
 *                     startdate: "2015-09-01"
 *                     enddate: "2018-06-30"
 *                     description: "Formation générale en informatique"
 *               experiences:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Experience'
 *                 example:
 *                   - role: "Lead Developer"
 *                     company: "Tech Solutions Paris"
 *                     startdate: "2020-07-01"
 *                     enddate: "2023-12-31"
 *                     description: "Direction d'une équipe de 5 développeurs, mise en place d'architecture microservices"
 *                   - role: "Full Stack Developer"
 *                     company: "Digital Innovation Lab"
 *                     startdate: "2018-06-01"
 *                     enddate: "2020-06-30"
 *                     description: "Développement d'applications web avec React et Node.js"
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Photographie", "Course à pied", "Développement de projets open source"]
 *               status_label:
 *                 type: string
 *                 example: "public"
 *                 enum: ["public", "private"]
 *     responses:
 *       201:
 *         description: CV created successfully
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
 *                   example: "CV created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *                     userid:
 *                       type: string
 *                       example: "65f1a2b3c4d5e6f7g8h9i0j2"
 *                     firstname:
 *                       type: string
 *                       example: "John"
 *                     lastname:
 *                       type: string
 *                       example: "Doe"
 *                     title:
 *                       type: string
 *                       example: "Senior Software Engineer"
 *                     location:
 *                       type: string
 *                       example: "Paris, France"
 *                     summary:
 *                       type: string
 *                       example: "Experienced software engineer with 8 years of experience in full-stack development"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/create-cv', authMiddleware, createCV);

/**
 * @swagger
 * /api/cv/update-cv:
 *   put:
 *     tags:
 *       - CV
 *     summary: Update an existing CV
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cvid
 *               - firstname
 *               - lastname
 *               - title
 *               - status_label
 *             properties:
 *               cvid:
 *                 type: string
 *                 example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 example: "Doe"
 *               title:
 *                 type: string
 *                 example: "Senior Software Engineer"
 *               location:
 *                 type: string
 *                 example: "Paris, France"
 *               summary:
 *                 type: string
 *                 example: "Experienced software engineer with 8 years of experience in full-stack development"
 *               education:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Education'
 *               experiences:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Experience'
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *               status_label:
 *                 type: string
 *                 example: "public"
 *     responses:
 *       200:
 *         description: CV updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: CV not found
 */
router.put('/update-cv', authMiddleware, updateCV);

/**
 * @swagger
 * /api/cv/delete-cv:
 *   delete:
 *     tags:
 *       - CV
 *     summary: Delete a CV
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cvid
 *             properties:
 *               cvid:
 *                 type: string
 *                 example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *     responses:
 *       200:
 *         description: CV deleted successfully
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
 *                   example: "CV and associated records deleted successfully"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: CV not found
 */
router.delete('/delete-cv', authMiddleware, deleteCV);

/**
 * @swagger
 * /api/cv/get-cv:
 *   get:
 *     tags:
 *       - CV
 *     summary: Get all public CVs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all public CVs
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
 *                         example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *                       userid:
 *                         type: string
 *                         example: "65f1a2b3c4d5e6f7g8h9i0j2"
 *                       firstname:
 *                         type: string
 *                         example: "John"
 *                       lastname:
 *                         type: string
 *                         example: "Doe"
 *                       title:
 *                         type: string
 *                         example: "Senior Software Engineer"
 *                       education:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Education'
 *                       experiences:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Experience'
 *                       hobbies:
 *                         type: array
 *                         items:
 *                           type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/get-cv', authMiddleware, getAllCVs);

/**
 * @swagger
 * /api/cv/get-cv/{userid}:
 *   get:
 *     tags:
 *       - CV
 *     summary: Get CV by user ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "65f1a2b3c4d5e6f7g8h9i0j2"
 *     responses:
 *       200:
 *         description: CV found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *                     userid:
 *                       type: string
 *                       example: "65f1a2b3c4d5e6f7g8h9i0j2"
 *                     firstname:
 *                       type: string
 *                       example: "John"
 *                     lastname:
 *                       type: string
 *                       example: "Doe"
 *                     education:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Education'
 *                     experiences:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Experience'
 *                     hobbies:
 *                       type: array
 *                       items:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: CV not found
 */
router.get('/get-cv/:userid', authMiddleware, getUserCV);

/**
 * @swagger
 * /api/cv/check/{userid}:
 *   get:
 *     tags:
 *       - CV
 *     summary: Check if user has a CV
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: "65f1a2b3c4d5e6f7g8h9i0j2"
 *     responses:
 *       200:
 *         description: Check successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 hasCV:
 *                   type: boolean
 *                   example: true
 *                 cvId:
 *                   type: string
 *                   example: "65f1a2b3c4d5e6f7g8h9i0j1"
 *       401:
 *         description: Unauthorized
 */
router.get('/check/:userid', authMiddleware, checkUserCV); 

module.exports = router;
