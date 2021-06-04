const express = require('express');
const got = require('got');
const publicAPI = express.Router();
const Public = require('../models/publicapi');

// shows the results of search
publicAPI.get('/results', async (req, res) => {
    try {
        let query = req.query.search;
        let url = process.env.API_URL + query + process.env.API_OPTIONS;
        const response = await got(url);
        let data = response.body;
        res.render('results', data);
    } catch (error) {
        res.status(500).json({ message: err.message });
    }
});
    
//     (url, function(error, response, body) {
//         if(query === null) {
//             console.log('No search results, Please try again')
//         } else {
//             let data = JSON.parse(body)
//             res.render('results', {data: data})
//             // res.send(results['entries'][0]['API'])
//         }
//     })
// })

module.exports = publicAPI;