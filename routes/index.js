const express = require('express');
const got = require('got');
const router = express.Router();

// renders the search page
router.get('/', (req, res) => {
    res.render('index');
})

module.exports = router;