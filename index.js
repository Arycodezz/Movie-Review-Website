require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/User.js');
const movies = require('./routes/movies.js');
const reviews = require('./routes/reviews.js');
const users = require('./routes/Users.js');
mongoose.connect('mongodb://127.0.0.1:27017/movieReview')
    .then(() => {
        console.log("Mongo DB Connection Open");
    })
    .catch((err) => {
        console.log("OH NO!!!");
        console.log(err);
    })



const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/movies',movies);
app.use('/movies/:id/reviews',reviews);
app.use('/login',users);

app.get('/', (req, res) => {
    res.send("Movie Review Website");
})





app.use((err, req, res, next) => {
    res.status(404).render('error');
})

app.use((err, req, res, next) => {
    console.error(err);
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(status).render('error', { err });
})



app.listen(7000, () => {
    console.log("Serving on Port 7000");
})

