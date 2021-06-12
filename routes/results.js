const express = require('express');
const got = require('got');
const router = express.Router();


router.get('/', async (req, res) => {
    let query = req.query.search;
    let url = process.env.API_URL + query + process.env.API_OPTIONS;
    const response = await got(url);
    let data = JSON.parse(response.body);
    function resultsPromise() {
        return new Promise((resolve, reject) => {
            if (data['entries'] === null) {
                // Add variable locals here to see if works
                reject ({
                    message: 'No results from search term. Please use another Search term'
                })
                } else {
                    resolve(res.render('results/index', {
                        data,
                        message: 'Here are your results'
                    }));
                }
            })
        }
    resultsPromise().then((message) => {
        console.log('it worked');
    }).catch((error) => {
         res.render('index', {error});
    })
})



// shows the results of search
// router.get('/', async (req, res) => {
//         try {
//             let query = req.query.search;
//             let url = process.env.API_URL + query + process.env.API_OPTIONS;
//             const response = await got(url);
//             let data = JSON.parse(response.body);
//             if (data['entries'] === null) {
//                 throw new Error();
//                 // res.redirect('/');
//             } else {
//                 res.render('results/index', {data});
//             }
//         } catch (error) {
//             res.json(error);
//             // res.json({ message: error.message });
//         }
// })

module.exports = router;