// auth controllers

const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Role = require('../models/role');




const meController = async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'Non authentifié.' });
        }

        // Retourne les données utilisateur de la session
        return res.status(200).json({
            user: req.session.user,
        });
    } catch (error) {
        console.error('Erreur dans le contrôleur /me :', error);
        return res.status(500).json({ message: 'Une erreur est survenue.' });
    }
};




const registerController = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Récupérer l'ID du rôle "user"
        const userRole = await Role.findOne({ name: 'user' });
        if (!userRole) {
            return res.status(500).json({ message: 'User role not found in the system' });
        }

        // Créer un nouvel utilisateur
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            roleid: userRole._id, // Associer l'ID du rôle "user"
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
};
   
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Identifiants invalides.' });
        }

        // Stocker les informations utilisateur dans la session
        req.session.user = {
            userid: user._id,
            email: user.email,
            roleid: user.roleid,
            firstname: user.firstname,
            lastname: user.lastname,
        };

        return res.status(200).json({
            message: 'Connexion réussie.',
            user: req.session.user, // Renvoie les données utilisateur
        });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        return res.status(500).json({ message: 'Une erreur est survenue.' });
    }
};



const logoutController = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
            return res.status(500).json({ message: 'Une erreur est survenue.' });
        }

        res.clearCookie('connect.sid'); // Efface le cookie de session
        return res.status(200).json({ message: 'Déconnexion réussie.' });
    });
};


module.exports = { registerController, loginController, logoutController, meController };