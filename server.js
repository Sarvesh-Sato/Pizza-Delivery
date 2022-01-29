const express = require('express');
const app = express();
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const req = require('express/lib/request');
const path = require('path');
const PORT = process.env.PORT || 3000


// set template engine
app.use(expressLayout);
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs');

// assets
app.use(express.static('public'));
app.get('/',function(req,res){
    res.render('home');
})

app.get('/cart',function(req,res){
    res.render('customers/cart');
})

app.get('/register',function(req,res){
    res.render('auth/register');
})

app.get('/login',function(req,res){
    res.render('auth/login');
})



app.listen(PORT, function(){
    console.log('Listening on port '+ PORT);
});