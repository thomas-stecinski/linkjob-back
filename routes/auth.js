const express = require('express');
const bcrypt = require('bcrypt'); 
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const jwt = require('jsonwebtoken'); 
const router = express.Router();
require('dotenv').config(); 

router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password, roleId } = req.body;

        if (!firstname || !lastname || !email || !password || !roleId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            uuid: uuidv4(), 
            firstname,
            lastname,
            email,
            password: hashedPassword,
            roleId
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'An error occurred during registration' });
    }
});

router.post('/login', async (req, res) => {
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
            { uuid: user.uuid, email: user.email, roleId: user.roleId },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user: {
                uuid: user.uuid,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                roleId: user.roleId
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
});

module.exports = router;
