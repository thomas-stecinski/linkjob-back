const CV = require('../models/cv');
const Education = require('../models/education');
const Experience = require('../models/experiences');
const Hobbies = require('../models/hobbies');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Create a new CV
const createCV = async (req, res) => {
    try {
        const { firstname, lastname, title, location, summary, userid } = req.body;
        const newCV = new CV({
            userid,
            firstname,
            lastname,
            title,
            location,
            summary,
            statusid : process.env.STATUS_DRAFT_ID
        });

        const savedCV = await newCV.save();
        res.status(201).json({
            success: true,
            data: savedCV
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating CV',
            error: error.message
        });
    }
};

// Update CV
const updateCV = async (req, res) => {
    try {
        const { cvId, firstname, lastname, title, location, summary, statusid } = req.body;
        const userid = req.user.id;

        const cv = await CV.findOne({ id: cvId, userid });
        
        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found'
            });
        }

        const updatedCV = await CV.findOneAndUpdate(
            { id: cvId },
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
        const { cvId } = req.body;
        const userid = req.user.id;

        const cv = await CV.findOne({ id: cvId, userid });
        
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
        await CV.findOneAndDelete({ id: cvId });

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
        const cvs = await CV.find()
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