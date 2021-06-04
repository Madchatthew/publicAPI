const express = require('express');
const got = require('got');
const publicAPI = express.Router();
const Public = require('../models/publicapi');

// render the new page
publicAPI.get('/favorites/new', function(req, res) {
    res.render('new')
})

// pulls the form data from results into a new form
publicAPI.post('/favorites/new', function(req, res) {
        res.render('new', {
            form: req.body.favorite
        })
})

// Create route - inserts data into mongodb
publicAPI.post('/favorites', function(req, res) {
    req.body.favorite.comments = req.sanitize(req.body.favorite.comments)
    Public.create(req.body.favorite, function(err, newFavorite) {
        if(err) {
            res.render('new')
        } else {
            res.redirect('/favorites')
        }
    })
})

// display favorites
publicAPI.get('/favorites', function(req, res) {
    Public.find({}, function(err, favorites) {
        if(err) {
            console.log('ERROR!')
        } else {
            res.render('favorites', {favorites: favorites})
        }
    })
})

// edit route
publicAPI.get('/favorites/:id/edit', function(req, res) {
    Public.findById(req.params.id, function(err, foundFavorite) {
        if(err) {
            res.redirect('/favorites')
        } else {
            res.render('edit', {favorite: foundFavorite})
        }
    })
})

// show route
publicAPI.get('/favorites/:id', function(req, res) {
    Public.findById(req.params.id, function(err, foundFavorite) {
        if(err) {
            res.redirect('/favorites')
        } else {
            res.render('show', {favorite: foundFavorite})
        }
    })
})

// update route
publicAPI.put('/favorites/:id', function(req, res) {
    req.body.favorite.comments = req.sanitize(req.body.favorite.comments)
    Public.findByIdAndUpdate(req.params.id, req.body.favorite, function(err, updatedFavorite) {
        if(err) {
            res.redirect('/favorites')
        } else {
            res.redirect('/favorites/' + req.params.id)
        }
    })
})

// delete route
publicAPI.delete('/favorites/:id', function(req, res) {
    Public.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect('/favorites')
        } else {
            res.redirect('/favorites')
        }
    })
})

module.exports = publicAPI;