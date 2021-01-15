//in the authentication projext we are going to use passport.js which is a authentication middleware for node.js and its the best package for creating the authentication project
//passport automatically converts the package into hash(encrypt it) and it also helps us to maintain the session for that user for the time which it is beign logged in
//we have to encode that password in g=form of hash not plain text password
const express = require("express");
const app = express();
const ejs = require('ejs');
const path = require('path');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const session = require('express-session');
const MemoryStore = require('memorystore')(session)
const flash = require('connect-flash');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//this means that we have to save data in local database and we have to authenticate data in our database, it has many other stratigies like facebookStrategy,twittrer Strategy which are used for different purposes
//requiringuserroutes and admin routes
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const User = require('./models/usermodel');
dotenv.config({ path: './config.env' });//middleware for dotenv.we are also going to write databse url in dotenv file later and is used to setup environment variables for our project
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(con => {

    console.log('Database Connected Successfully');
});

app.use(session({
    secret: "This is a simple login/signup application",
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000 
    }),
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
//this means that passport will use LocalStrategy and authenticate is a method in passport.js we can write our own code of authentication there
passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
//these two lines means that when we have-- as passport maintains a session for a looged in user ,these two lines helps us to maintain that session .these two lines means when we have to allow the user to use the dashboard based on the session and when not

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride('_method'));
app.use(flash());

//setting message variable globaly
app.use((req, res, next) => {

    res.locals.success_msg = req.flash(('success_msg'));
    res.locals.error_msg = req.flash(('error_msg'));
    res.locals.error = req.flash(('error'));
    res.locals.currentUser = req.user;//to pass the user globallu so that we can use it globally
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(userRoutes);
app.use(adminRoutes);
const port = process.env.PORT;
app.listen(port, () => {
    console.log('Server is Started');
});
