const express = require('express');
const got = require('got');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();
const Public = require('../models/publicapi');

// display favorites //
router.get('/', function(req, res) {
    Public.find({}, function(err, favorites) {
        if(err) {
            console.log('ERROR!')
        } else {
            res.render('favorites/index', {favorites: favorites})
        }
    })
})

// render the new page
router.get('/new', function(req, res) {
    res.render('favorites/new')
})

// pulls the form data from results into a new form //
router.post('/new', function(req, res) {
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
router.get('/:id/edit', function(req, res) {
    Public.findById(req.params.id, function(err, foundFavorite) {
        if(err) {
            res.redirect('favorites/index')
        } else {
            res.render('favorites/edit', {favorite: foundFavorite})
        }
    })
})

// show route //
router.get('/:id', function(req, res) {
    Public.findById(req.params.id, function(err, foundFavorite) {
        if(err) {
            res.redirect('favorites/index')
        } else {
            res.render('favorites/show', {favorite: foundFavorite})
        }
    })
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
    
    // req.body.favorite.comments = req.sanitize(req.body.favorite.comments)
    // Public.findOneAndUpdate(req.params.id, req.body.favorite, function(err, updatedFavorite) {
    //     if(err) {
    //         res.redirect('favorites/index')
    //     } else {
    //         res.redirect('favorites/' + req.params.id)
    //     }
    // })
})

// delete route
router.delete('/:id', async (req, res) => {
    try {
        await Public.findByIdAndDelete(req.params.id);
        res.redirect('/favorites/index');
    } catch (error) {
        res.json({ message: error.message });
    }
    
    // Public.findOneAndDelete(req.params.id, function(err) {
    //     if(err) {
    //         res.redirect('favorites/')
    //     } else {
    //         res.redirect('favorites/')
    //     }
    // })
})

module.exports = router;