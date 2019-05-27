const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genres = mongoose.model('Genres', genreSchema);

function validateGenre(genre){
    const schema = {
        name: Joi.string().min(5).max(50).required()
    }

    return Joi.validate(genre, schema);
}  

exports.genreSchema = genreSchema;
exports.Genre = Genres;
exports.validateGenre = validateGenre;