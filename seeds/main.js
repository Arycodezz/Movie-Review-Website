const mongoose = require('mongoose');
const axios = require('axios');
const Movie = require('../models/Movies');
const movieNames = require('./movieNames');

mongoose.connect('mongodb://127.0.0.1:27017/movieReview')
    .then(() => {
        console.log("Mongo DB Connection Open");
    })
    .catch((err) => {
        console.log("OH NO!!!");
        console.log(err);
    })


const seedDB = async () => {
    try {
        await Movie.deleteMany({});
        for (let i = 0; i < movieNames.length; i++) {
            //const rand = Math.floor(Math.random() * (movieNames.length - 1));
            const url = await axios.get(`http://www.omdbapi.com/?i=tt3896198&apikey=72f11d76&t=${movieNames[i]}`);
            const dat = url.data;
            const mov = new Movie({
                name: dat.Title,
                description: dat.Plot,
                IMDBRating: dat.imdbRating,
                Director: dat.Director,
                image: dat.Poster
            })
            await mov.save();
        }
    }
    catch (e) {
        console.log("OH NO!!!");
        console.log(e);
    }
}
seedDB().then(() => {
    mongoose.connection.close();
});