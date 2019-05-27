const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const auth = require('../middleware/auth');
const Joi = require('@hapi/joi');
const validate = require('../middleware/validate');

router.post('/', [auth, validate(validateReturns)] , async (req,res)=>{

    const rental = await Rental.findById(req.body.rentalID);
    if(!rental) return res.status(404).send('Rental not found!');
    if(rental.dateReturned) return res.status(400).send('Return already processed');

    rental.return();
    await rental.save();
    
    await Movie.findByIdAndUpdate(req.body.movieID, {$inc: { numberInStock: 1}});

    return res.status(200).send(rental);
});

function validateReturns(req){

    const schema = {
        rentalID: Joi.objectId().required(),
        customerID: Joi.objectId().required(),
        movieID: Joi.objectId().required()
    }

    return Joi.validate(req, schema);
}  

module.exports = router;