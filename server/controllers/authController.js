
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Registration
const registeration = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            location,
            description,
            occupation
        } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: 'Fill all required fields'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const emailExist = await User.getEmail(normalizedEmail);

        if (emailExist) {
            return res.status(400).json({
                message: 'This email already exists'
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.addUser({
            firstName,
            lastName,
            email: normalizedEmail,
            password: hashPassword,
            location,
            description,
            occupation
        });

        const { password: savedPassword, ...publicUser } =
            newUser.toObject();

        return res.status(201).json({
            message: 'Registration successful',
            user: publicUser
        });

    } catch (error) {
        console.error('REGISTRATION ERROR:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: 'This email already exists'
            });
        }

        return res.status(500).json({
            message: error.message
        });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Fill all fields'
            });
        }

        const user = await User.getEmail(email);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const check = await bcrypt.compare(password, user.password);

        if (!check) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const { password: savedPassword, ...publicUser } =
            user.toObject();

        return res.status(200).json({
            message: 'Login successful',
            user: publicUser
        });

    } catch (error) {
        console.error('LOGIN ERROR:', error);

        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { registeration, login };
