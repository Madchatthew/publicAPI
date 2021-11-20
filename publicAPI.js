if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Applications setup to use for app
// const dotenv = require('dotenv').config();
const methodOverride = require('method-override');
const expressSanitizer = require('express-sanitizer');
const mongoose = require('mongoose');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const got = require('got');
const publicAPI = express();

// Application use and setup section
publicAPI.use(express.json());
publicAPI.use(express.urlencoded({ extended: true }));
publicAPI.set('view engine', 'ejs');
publicAPI.set('views', __dirname + '/views');
publicAPI.set('layout', 'layouts/layout');
publicAPI.use(expressLayouts);
publicAPI.use(express.static('public'));
publicAPI.use(expressSanitizer());
publicAPI.use(methodOverride('_method'));

// Routes section
const indexRouter = require('./routes/index');
const resultsRouter = require('./routes/results');
const favoritesRouter = require('./routes/favorites');

// Mongodb database connection settings
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

// Routes to use section
publicAPI.use('/', indexRouter);
publicAPI.use('/results', resultsRouter);
publicAPI.use('/favorites', favoritesRouter);

// starts the server
publicAPI.listen(process.env.PORT_PUBLICAPI);