// auth controllers

const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const registerController = async (req, res) => {
    try {
        const { firstname, lastname, email, password, roleid } = req.body;

        if (!firstname || !lastname || !email || !password || !roleid) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            roleid
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: `An error occurred during registration: ${error.message}` });
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
                roleid: user.roleid
            },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );


        // Set ONLY the token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        // Send user data in response body for initial client-side state
        res.status(200).json({ 
            message: 'Login successful', 
            user: {
                userid: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                roleid: user.roleid
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};

const logoutController = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { registerController, loginController, logoutController };