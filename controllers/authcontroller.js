// auth controllers

const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Role = require('../models/role');




const meController = async (req, res) => {
    try {
        const token = req.cookies.token; // Récupère le token du cookie

        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userid).select('firstname lastname email roleid');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            user: {
                userid: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                roleid: user.roleid,
            },
        });
    } catch (err) {
        console.error('Error in /me endpoint:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
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
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                userid: user._id,
                email: user.email,
                roleid: user.roleid,
                firstname: user.firstname,
                lastname: user.lastname,
            },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 3600000, 
            domain: process.env.NODE_ENV === 'production' 
                ? '.onrender.com'
                : 'localhost'
        });

        return res.status(200).json({
            message: 'Login successful',
            user: {
                userid: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                roleid: user.roleid,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'An error occurred during login' });
    }
};



const logoutController = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Activer seulement en prod
        sameSite: 'strict',
        expires: new Date(0), // Expire immédiatement
    });
    res.status(200).json({ message: 'Logged out successfully' });
};


module.exports = { registerController, loginController, logoutController, meController };