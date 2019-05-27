const {Rental} = require('../../models/rental');
const request = require('supertest');
const {User} = require('../../models/user');
const {Movie} = require('../../models/movie');
const moment = require('moment');
const mongoose = require('mongoose');

describe('/api/returns', ()=>{

    let server;
    let rental;
    let movie;
    let customerID;
    let movieID;
    let token;

    beforeEach(async ()=> {
        server = require('../../index');
        token = new User().genAuthToken();
        movieID = mongoose.Types.ObjectId();


        movie = new Movie({
            _id: movieID,
            title: '12345',
            dailyRentalRate: 2,
            genre: { name: '12345'},
            numberInStock: 10
        });

        await movie.save();

        rental = new Rental({
            customer: {
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieID,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();
        customerID = rental.customer._id;
        movieID = rental.movie._id;
    });
    afterEach(async ()=> { 
        await server.close();          
        await Rental.remove({});
    });

    const exec = () => {
        return request(server).post('/api/returns')
        .set('x-auth-token', token)
        .send({ rentalID: rental._id, customerID, movieID });
    };

    it('should return 401 if client is not logged in', async ()=>{
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 customerID is not provided', async ()=>{
        customerID = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 400 movieID is not provided', async ()=>{
        movieID = '';
        const res = await exec();        
        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for customer/movie', async ()=>{
        await Rental.remove({});
        const res = await exec();        
        expect(res.status).toBe(404);
    });

    it('should return 400 if return is already processed', async ()=>{
        rental.dateReturned = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });
    
    it('should return 200 if valid request', async ()=>{
        const res = await exec();
        expect(res.status).toBe(200);
    });

    it('should set the returnDate if input is valid', async ()=>{
        const res = await exec();
        
        const rentalInDB = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDB.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);

    });

    it('should calculate the rental fee ', async ()=>{
        rental.dateOut = moment().add(-7,'days').toDate();
        await rental.save();
         
        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);
        expect(rentalInDB.rentalFee).toBe(14);
    });

    it('should increase the movie stock ', async ()=>{
        const res = await exec();

        const movieInDB = await Movie.findById(movie._id);
        expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental if valid input', async ()=>{
        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);
        expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
            'dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'
        ]));

    });

});