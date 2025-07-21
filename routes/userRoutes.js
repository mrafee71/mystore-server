const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Route POST /api/users/register
// Register a new user
// Public access
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        // Registration logic
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ name, email, password });
        await user.save();

        // create JWT Payload
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        // Sign and return the token along with user data
        jwt.sign( payload, process.env.JWT_SECRET, { expiresIn: '40h' }, (err, token) => {
            if (err) throw err;

            // Return the token and user data
            res.status(201).json({
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        });
    
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

module.exports = router;