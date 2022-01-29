require('dotenv').config()

const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const req = require('express/lib/request');
const path = require('path');
const PORT = process.env.PORT || 3000
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')

//database connection

const url = 'mongodb://localhost/pizza';

mongoose.connect(url);

const connection = mongoose.connection;
mongoose.connection
    .once('open', function () {
        console.log('Database Connected..');
    })
    .on('error', function (err) {
        console.log(err);
    });

//session store
// let mongoStore = new MongoDbStore({
//     mongooseConnection : connection,
//     collection: 'sessions'
// })



// Session - config

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: url
    }),
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 } //24hrs
    // cookie: {maxAge: 1000 * 15 } 
}))

app.use(flash());


// assets
app.use(express.static('public'));
app.use(express.json());


//Global middelware
app.use(function(req,res,next){
    res.locals.session = req.session;
     next();
});

// set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs');



require('./routes/web')(app)



app.listen(PORT, function(){
    console.log('Listening on port '+ PORT);
});