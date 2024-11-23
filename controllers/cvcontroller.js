const CV = require('../models/cv');
const Education = require('../models/education');
const Experience = require('../models/experiences');
const Hobbies = require('../models/hobbies');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const mapStatus = require('../utils/mapStatus');
dotenv.config();

// Create a new CV
const createCV = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userid, firstname, lastname, title, location, summary, education, experiences, hobbies, status_label } = req.body;

        // Vérification de l'existence du CV
        const existingCV = await CV.findOne({ userid });
        if (existingCV) {
            return res.status(400).json({
                success: false,
                message: 'User already has a CV',
            });
        }

        // Mapping du statut
        const statusid = mapStatus(status_label);

        // Création du CV principal
        const newCV = new CV({
            userid,
            firstname,
            lastname,
            title,
            location,
            summary,
            statusid,
        });

        // Sauvegarde initiale du CV pour obtenir son ID
        const savedCV = await newCV.save({ session });

        if (!savedCV || !savedCV._id) {
            throw new Error('Failed to save CV');
        }

        // Sauvegarde des éducations
        const savedEducation = await Promise.all(
            (education || []).map(async (edu) => {
                if (!edu.degree || !edu.institution) {
                    console.warn('Incomplete education data, skipping:', edu);
                    return null;
                }
                const newEducation = new Education({
                    cvid: savedCV._id, // Correction ici
                    userid,
                    degree: edu.degree,
                    institution: edu.institution,
                    startdate: edu.startdate,
                    enddate: edu.enddate,
                    description: edu.description,
                    statusid,
                });
                return await newEducation.save({ session });
            })
        );

        // Sauvegarde des expériences
        const savedExperiences = await Promise.all(
            (experiences || []).map(async (exp) => {
                if (!exp.role || !exp.company) {
                    console.warn('Incomplete experience data, skipping:', exp);
                    return null;
                }
                const newExperience = new Experience({
                    cvid: savedCV._id, // Correction ici
                    userid,
                    role: exp.role,
                    company: exp.company,
                    startdate: exp.startdate,
                    enddate: exp.enddate,
                    description: exp.description,
                });
                return await newExperience.save({ session });
            })
        );

        // Sauvegarde des hobbies
        const savedHobbies = await Promise.all(
            (hobbies || []).map(async (hobby) => {
                if (!hobby) {
                    console.warn('Empty hobby detected, skipping');
                    return null;
                }
                const newHobby = new Hobbies({
                    cvid: savedCV._id, // Correction ici
                    userid,
                    hobby,
                });
                return await newHobby.save({ session });
            })
        );

        // Nettoyage des résultats (filtrer les valeurs nulles)
        const validEducation = savedEducation.filter((edu) => edu !== null);
        const validExperiences = savedExperiences.filter((exp) => exp !== null);
        const validHobbies = savedHobbies.filter((hob) => hob !== null);

        // Mise à jour des relations dans le CV principal
        savedCV.education = validEducation.map((edu) => edu._id);
        savedCV.experiences = validExperiences.map((exp) => exp._id);
        savedCV.hobbies = validHobbies.map((hob) => hob._id);

        // Sauvegarde finale du CV avec les relations
        await savedCV.save({ session });

        // Validation de la transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'CV created successfully',
            data: savedCV,
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating CV:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating CV',
            error: error.message,
        });
    }
};



const updateCV = async (req, res) => {
    try {
        const { cvid, firstname, lastname, title, location, summary, userid, status_label} = req.body;

        const statusid = mapStatus(status_label);

        const cv = await CV.findOne({ _id: cvid, userid });
        
        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found'
            });
        }

        const updatedCV = await CV.findOneAndUpdate(
            { _id: cvid },
            {
                firstname,
                lastname,
                title,
                location,
                summary,
                statusid
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: updatedCV
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating CV',
            error: error.message
        });
    }
};

// Delete CV
const deleteCV = async (req, res) => {
    try {
        const { cvid, userid } = req.body;

        const cv = await CV.findOne({ _id: cvid, userid });
        
        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found'
            });
        }

        // Delete associated records
        await Education.deleteMany({ cvid: cv._id });
        await Experience.deleteMany({ cvid: cv._id });
        await Hobbies.deleteMany({ cvid: cv._id });
        
        // Delete the CV
        await CV.findOneAndDelete({ _id: cvid });

        res.status(200).json({
            success: true,
            message: 'CV and associated records deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting CV',
            error: error.message
        });
    }
};

// Get all CVs
const getAllCVs = async (req, res) => {
    try {
        const cvs = await CV.find({ statusid: process.env.STATUS_PUBLIC_ID })
            .populate('education')
            .populate('experiences')
            .populate('hobbies');

        res.status(200).json({
            success: true,
            data: cvs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching CVs',
            error: error.message
        });
    }
};

// Get CV by user ID
const getUserCV = async (req, res) => {
    try {
        const { iduser } = req.params;

        const cv = await CV.findOne({ userid: iduser })
            .populate('education')
            .populate('experiences')
            .populate('hobbies');

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: cv
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user CV',
            error: error.message
        });
    }
};

module.exports = {
    createCV,
    updateCV,
    deleteCV,
    getAllCVs,
    getUserCV
};
