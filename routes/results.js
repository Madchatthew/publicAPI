const express = require('express');
const got = require('got');
const router = express.Router();
const bodyParser = require('body-parser');

// shows the results of search
router.get('/', async (req, res) => {
        try {
            let query = req.query.search;
            let url = process.env.API_URL + query + process.env.API_OPTIONS;
            const response = await got(url);
            let data = JSON.parse(response.body);
            if(data['entries'] === null) {
                res.redirect('/');
            } else {
                res.render('results/index', {data});
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
})

module.exports = router;