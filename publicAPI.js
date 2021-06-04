const dotenv = require('dotenv').config();
// const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const mongoose = require('mongoose');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const got = require('got');
const publicAPI = express();

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

publicAPI.use(express.json());
publicAPI.set('view engine', 'ejs');
publicAPI.set('views', __dirname + '/views');
publicAPI.set('layout', 'layouts/layout');
publicAPI.use(expressLayouts);
// publicAPI.use(bodyParser.urlencoded({extended: true}));
publicAPI.use(express.static('public'));
publicAPI.use(expressSanitizer());
publicAPI.use(methodOverride('_method'));

const searchRouter = require('./routes/search');
const resultsRouter = require('./routes/results');
const favoritesRouter = require('./routes/favorites');

publicAPI.use('/', searchRouter);
publicAPI.use('/results', resultsRouter);
publicAPI.use('/favorites', favoritesRouter);

// starts the server
publicAPI.listen(process.env.PORT || 3000, () => {
    console.log("Server Started");
})
