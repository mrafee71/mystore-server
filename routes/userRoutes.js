const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authmiddleware');

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
        res.status(500).send("Server error");
    }
});

// Route POST /api/users/login
// Login an existing user
// Public access
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

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
            res.json({
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
        res.status(500).send("Server error");
    }
});

// Route GET /api/users/profile
// Get logged-in user's profile (protected route)
// Private access
router.get('/profile', protect, async (req,res) => {
    res.json(req.user);
})

module.exports = router;