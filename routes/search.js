const express = require('express');
const got = require('got');
const publicAPI = express.Router();
const Public = require('../models/publicapi');

// renders the search page
publicAPI.get('/', (req, res) => {
    res.render('search');
})

module.exports = publicAPI;