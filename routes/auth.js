const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const { User } = require('../models/user');
const router = express.Router();

router.post('/', async (req,res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email or password');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid email or password');

    const token = user.genAuthToken();
    res.send(token);
});

function validateUser(user){
    const schema = {
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(5).max(255).required()
    }

    return Joi.validate(user, schema);
}  

module.exports = router;

