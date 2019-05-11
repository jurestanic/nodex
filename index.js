const express = require('express');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
        .then(()=>console.log('Connected to DB!'))
        .catch(err => console.error('Could not connect to DB!'));

const app = express();

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const PORT = process.env.PORT || 3030;
app.listen(PORT, ()=>console.log(`Server starting on port: ${PORT}...`));