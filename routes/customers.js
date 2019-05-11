const express = require('express');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const router = express.Router();

const Customers = mongoose.model('Customers', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

router.get('/', async (req,res)=>{
    res.send(await Customers.find().sort('name'));
});

router.post('/', async (req,res)=>{
    const {error} = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let customer = new Customers({name: req.body.name});
    customer = await customer.save();

    res.send(customer);
});

function validateCustomer(customer){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required()
    }

    return Joi.validate(customer, schema);
}  

module.exports = router;