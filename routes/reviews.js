const express = require('express');
const router = express.Router({ mergeParams: true });
const Movie = require('../models/Movies');
const Review = require('../models/Review');
const { reviewSchema } = require('../schemas.js');
const isLoggedIn = (req, res, next) => {
    console.log("REQ.USER: ", req.user);
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    }
    next();
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        const err = new Error(msg);
        err.status = 400;
        return next(err);
    }
    next();
}

const isReviewAuthor = async(req, res, next) => {
    const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that');
        return res.redirect(`/movies/${id}`);
    }
    next();
}

router.post('/', isLoggedIn, validateReview, async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return next(new Error('Movie not found'));
        }

        const review = new Review(req.body.review);
        review.author = req.user._id;
        movie.reviews.push(review);
        await review.save();
        await movie.save();
        req.flash('success', 'Created New Review');
        res.redirect(`/movies/${movie._id}`);
    } catch (err) {
        next(err);
    }
})

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, async (req, res) => {
    const { id, reviewId } = req.params;
    await Movie.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('error', 'Successfully Deleted Review');
    res.redirect(`/movies/${id}`);
})


module.exports = router;