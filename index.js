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
server.use(express.static(path.join(__dirname, '/')))
server.set('views', path.join(__dirname, 'views'));
server.engine('handlebars', exphbs({defaultLayout: 'main'})),
server.set('view engine', 'handlebars');

function auth (req, res, next){
    console.log(req.session);
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
    if (!req.session.tries){
        req.session.tries = 1;
    }
    if (req.session.tries < 5){
        if (req.body.password === "BernardAustinZimbabwe"){
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

server.use(function(req, res){
    res.status(404).render('notFound');
})


server.listen(5000, () => {
    console.log(`Feed Nana ${PORT}`)
})