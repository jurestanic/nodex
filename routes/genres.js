const express = require('express');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const router = express.Router();


const Genres = mongoose.model('Genres', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
}));

router.get('/', async (req,res)=>{
    res.send(await Genres.find().sort('name'));
});

router.post('/', async (req,res)=>{
    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let genre = new Genres({name: req.body.name});
    genre = await genre.save();

    res.send(genre);
});

router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new:true});
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    res.send(genre);
  });
  
  router.delete('/:id', async (req, res) => {
    const genre = await Genres.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
  });
  
  router.get('/:id', async (req, res) => {

    const genre = await Genres.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
  });


  function validateGenre(genre){
    const schema = {
        name: Joi.string().min(3).required()
    }

    return Joi.validate(genre, schema);
}  

  module.exports = router;