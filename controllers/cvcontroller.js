const CV = require('../models/cv');
const Education = require('../models/education');
const Experience = require('../models/experiences');
const Hobbies = require('../models/hobbies');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const mapStatus = require('../utils/mapStatus');
dotenv.config();

const createCV = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userid, firstname, lastname, title, location, summary, education, experiences, hobbies, status_label } = req.body;
        if (typeof status_label !== 'string') {
            throw new Error('Invalid status_label format');
        }
        
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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Validate required fields
        const requiredFields = ['cvid', 'userid', 'firstname', 'lastname', 'title', 'status_label'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                details: `Missing: ${missingFields.join(', ')}`
            });
        }

        const { 
            cvid, 
            firstname, 
            lastname, 
            title, 
            location, 
            summary, 
            userid,
            status_label,
            education,
            experiences,
            hobbies 
        } = req.body;

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(cvid) || !mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format',
                details: 'cvid and userid must be valid MongoDB ObjectIds'
            });
        }

        // Find and validate CV existence and ownership
        const existingCV = await CV.findOne({ _id: cvid });
        if (!existingCV) {
            return res.status(404).json({
                success: false,
                message: 'CV not found'
            });
        }
        
        if (existingCV.userid.toString() !== userid) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this CV'
            });
        }

        // Validate and map status
        let statusid;
        try {
            statusid = mapStatus(status_label);
            if (!statusid) {
                throw new Error('Invalid status');
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status_label',
                details: 'status_label must be a valid status string'
            });
        }

        // Update main CV
        const updatedCV = await CV.findOneAndUpdate(
            { _id: cvid, userid },
            {
                firstname,
                lastname,
                title,
                location,
                summary,
                statusid
            },
            { new: true, session }
        );

        // Validate education data if present
        if (education) {
            const invalidEducation = education.find(edu => !edu.degree || !edu.institution);
            if (invalidEducation) {
                throw new Error('Each education entry must have degree and institution');
            }
        }

        // Validate experience data if present
        if (experiences) {
            const invalidExperience = experiences.find(exp => !exp.role || !exp.company);
            if (invalidExperience) {
                throw new Error('Each experience entry must have role and company');
            }
        }

        // Update education records
        if (education) {
            await Education.deleteMany({ cvid }, { session });
            const savedEducation = await Education.insertMany(
                education.map(edu => ({
                    ...edu,
                    cvid,
                    userid,
                    statusid
                })),
                { session }
            );
            updatedCV.education = savedEducation.map(edu => edu._id);
        }

        // Update experience records
        if (experiences) {
            await Experience.deleteMany({ cvid }, { session });
            const savedExperiences = await Experience.insertMany(
                experiences.map(exp => ({
                    ...exp,
                    cvid,
                    userid
                })),
                { session }
            );
            updatedCV.experiences = savedExperiences.map(exp => exp._id);
        }

        // Update hobbies
        if (hobbies) {
            await Hobbies.deleteMany({ cvid }, { session });
            const hobbiesToInsert = hobbies.map(hobby => ({
        hobby: hobby.hobby, // Extract just the hobby text
        cvid,
        userid
    }));
    
    const savedHobbies = await Hobbies.insertMany(
        hobbiesToInsert,
        { session }
    );
            updatedCV.hobbies = savedHobbies.map(hobby => hobby._id);
        }

        await updatedCV.save({ session });
        await session.commitTransaction();

        res.status(200).json({
            success: true,
            data: updatedCV
        });
    } catch (error) {
        await session.abortTransaction();
        
        // Handle specific known errors
        if (error.message.includes('degree and institution')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid education data',
                error: error.message
            });
        }
        
        if (error.message.includes('role and company')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid experience data',
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating CV',
            error: error.message
        });
    } finally {
        session.endSession();
    }
};

// Delete CV
const deleteCV = async (req, res) => {
    try {
        const { cvid } = req.body;
        const userid = req.user.userid;
        const cv = await CV.findOne({ _id: cvid, userid });
        
        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found or you do not have permission to delete it'
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
    const { userid } = req.params;

    try {
        if (!userid) {
            return res.status(400).json({
                success: false,
                message: "ID utilisateur manquant.",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).json({
                success: false,
                message: "Format d'ID utilisateur invalide.",
            });
        }

        const cv = await CV.findOne({ userid })
            .populate("education")
            .populate("experiences")
            .populate("hobbies")
            .populate("userid", "firstname lastname email");

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: "CV introuvable pour cet utilisateur.",
            });
        }

        return res.status(200).json({
            success: true,
            data: cv,
        });
    } catch (error) {
        console.error("Erreur lors de la récupération du CV :", error.message);
        return res.status(500).json({
            success: false,
            message: "Erreur serveur.",
            error: error.message,
        });
    }
};


  

const checkUserCV = async (req, res) => {
    try {
        const { userid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userid)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format',
            });
        }

        const existingCV = await CV.findOne({ userid });

        if (!existingCV) {
            return res.status(200).json({
                success: true,
                hasCV: false,
            });
        }

        return res.status(200).json({
            success: true,
            hasCV: true,
            cvId: existingCV._id, // Retourne l'ID du CV si trouvé
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking CV',
            error: error.message,
        });
    }
};

module.exports = {
    createCV,
    updateCV,
    deleteCV,
    getAllCVs,
    getUserCV,
    checkUserCV, // Ajoutez cette méthode ici
};
