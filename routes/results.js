const express = require('express');
const got = require('got');
const router = express.Router();

// shows the results of search
router.get('/', async (req, res) => {
        try {
            let query = req.query.search;
            let url = process.env.API_URL + query + process.env.API_OPTIONS;
            const response = await got(url);
            let data = JSON.parse(response.body);
            if (data['entries'] === null) {
                res.redirect('/');
            } else {
                res.render('results/index', {data});
            }
        } catch (error) {
            res.json({ message: error.message });
        }
})

module.exports = router;