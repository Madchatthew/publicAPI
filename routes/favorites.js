const express = require('express');
const got = require('got');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();
const Public = require('../models/publicapi');

// display favorites //
router.get('/', async (req, res) => {
    try {
        const favorites = await Public.find({});
        res.render('favorites/index', {favorites})
    } catch (error) {
        
    }
})

// render the new page
router.get('/new', (req, res) => {
    res.render('favorites/new')
})

// pulls the form data from results into a new form //
router.post('/new', (req, res) => {
        res.render('favorites/new', {
            form: req.body.favorite
        })
})

// Create route - inserts data into mongodb
router.post('/', async (req, res) => {
    try {
        req.body.favorite.comments = req.sanitize(req.body.favorite.comments);
        await Public.create(req.body.favorite);
        res.redirect('favorites/');
    } catch (error) {
        res.json({ message: error.message });
    }
})

// edit route //
router.get('/:id/edit', async (req, res) => {
    try {
       const favorite = await Public.findById(req.params.id);
       res.render('favorites/edit', {favorite});
    } catch (error) {
        res.json({ message: error.message });
    }
})

// show route //
router.get('/:id', async (req, res) => {
    try {
        const favorite = await Public.findById(req.params.id);
        res.render('favorites/show', {favorite});
    } catch (error) {
        res.json({ message: error.message });
    }
})

// update route //
router.put('/:id', async (req, res) => {
    try {
        req.body.favorite.comments = req.sanitize(req.body.favorite.comments);
        await Public.findByIdAndUpdate(req.params.id, req.body.favorite);
        res.redirect(req.params.id);
    } catch (error) {
        res.json({ message: error.message });
    }
})

// delete route
router.delete('/:id', async (req, res) => {
    try {
        await Public.findByIdAndDelete(req.params.id);
        res.redirect('/favorites');
    } catch (error) {
        res.json({ message: error.message });
    }
})

module.exports = router;