const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config();
const server = express();
const PORT = process.env.PORT || 5000;

// Sessions are stored in local storage
const sessionConfig = {
    name: process.env.SESS_NAME,
    secret: process.env.TOKEN_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: false
    },
    resave: false,
    saveUninitialized: false
}

server.use(session(sessionConfig));

server.use(bodyParser.json());
server.use(cors())

// There should obviously be a public folder, but I don't intend on ever making this into an actual website.
server.use(express.static(path.join(__dirname, '/public')))

// Sets up the server to use handlebars
server.set('views', path.join(__dirname, 'views'));
server.engine('handlebars', exphbs({defaultLayout: 'main'})),
server.set('view engine', 'handlebars');

// Authorization middleware, you must enter the password to get to the main site.
function auth (req, res, next){
    if (req.session.allowed){
        next()
    } else {
        res.render('login');
    }
}

server.get('/', auth, (req, res) => {
    res.render('home');
})

server.get('/guns', auth, (req, res) => {
    res.render('guns');
})

server.get('/tutorial', auth, (req, res) => {
    res.render('tutorial');
})

server.get('/contact', auth, (req, res) => {
    res.render('contact');
})


server.post('/authenticate', (req, res) => {
    // The user gets 5 tries to enter the correct password, or else they get locked out for an hour
    if (!req.session.tries){
        req.session.tries = 1;
    }
    if (req.session.tries < 5){
        if (req.body.password === process.env.PASSWORD){
            req.session.allowed = true;
            res.status(200).send("success");
        } else {
            req.session.tries += 1;
            res.send('invalid');
        }
    } else {
        res.status(200).send("maxed")
    }
})

// 404 page
server.use(function(req, res){
    res.status(404).render('notFound');
})


server.listen(5000, () => {
    console.log(`Feed Nana ${PORT}`)
})