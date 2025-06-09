const schema = require('../model/schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports.signup = async (req, res) => {
    try {
        const existingUser = await schema.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        req.body.password = await bcrypt.hash(req.body.password, 10);

        await schema.create(req.body);
        res.status(201).json({ msg: 'User created successfully' });
    }
    catch (error) {
        res.status(500).json({ msg: 'Error creating user', error });
    }
}

module.exports.login = async (req, res) => {
    try {
        const user = await schema.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid email' });
        }
        if (await bcrypt.compare(req.body.password, user.password)) {
            const token = jwt.sign({ id: user._id }, 'Madhav', { expiresIn: '1h' });
            res.json({ msg: 'Login successful', token, user });
        }
        else {
            return res.status(400).json({ msg: 'Wrong password' });
        }
    }
    catch (error) {
        res.status(500).json({ msg: 'Error logging in', error });
    }
}

module.exports.dashboard = async (req, res) => {
    try {
        const user = await schema.findById(req.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ msg: 'Dashboard data', user });
    }
    catch (error) {
        res.status(500).json({ msg: 'Error fetching dashboard data', error });
    }
}