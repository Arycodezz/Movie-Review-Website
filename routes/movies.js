const express = require('express');
const router = express.Router();
const Movie = require('../models/Movies');

router.get('/', async (req, res) => {
    const movies = await Movie.find({});
    res.render('movies/index', { movies });
});

router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim() === '') {
            req.flash('error','Enter something first');
            return res.redirect('/movies');
        }
        
        const movies = await Movie.find({
            name: { $regex: q, $options: 'i' } 
        });
        if(!movies || movies.length === 0){
            req.flash('error','Sorry this movie is not available in our database');
            return res.redirect('/movies');
        }
        res.redirect(`/movies/${movies[0]._id}`);
    }
    catch (e) {
        console.error(e);
        req.flash('error','Some Error Occurred');
        res.redirect('/movies');
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author',
                model: 'User'
            }
        });
        
        if (!movie) {
            return res.status(404).render('error', { message: 'Movie not found' });
        }
        
        movie.reviews.forEach(review => {
            console.log(review);
        });
        
        res.render('movies/show', { movie });
    }
    catch (e) {
        next(e);
    }
});

module.exports = router;