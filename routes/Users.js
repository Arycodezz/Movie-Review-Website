const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/', (req, res) => {
    res.render('users/login');
})
router.post('/', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!!');
    res.redirect('/movies');
})
router.get('/register', (req, res) => {
    res.render('users/register');
})
router.post('/register', async (req, res, next) => {
    try {
        const { email, username, password, cpassword } = req.body;
        if (!username || !email || !password || !cpassword) {
            req.flash('error', 'Pls fill all required credentials first');
            return res.redirect('/login/register');
        }
        if (cpassword === password) {
            const newUser = new User({
                email: email,
                username: username
            });
            const registeredUser = await User.register(newUser, password);
            req.login(registeredUser, err => {
                if (err) return next(err);
                req.flash('success', 'Successfully Registered');
                res.redirect('/movies');
            })
        }
        else {
            req.flash('error', 'Passwords entered are not the same');
            res.redirect('/login/register');
        }
    }
    catch (e) {
        console.log(e);
        req.flash('error', 'Error in registering');
        res.redirect('users/register');
    }
})
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/movies');
    });
});


module.exports = router;