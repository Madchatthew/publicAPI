const express = require('express')
const app = express()
const request = require('request')

app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    res.render('search')
})

app.get('/results', function(req, res) {
    let query = req.query.search
    let url = 'https://api.publicapis.org/entries?title=' + query + '&https=true'
    request(url, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            let data = JSON.parse(body)
            res.render('results', {data: data})
            // res.send(results['entries'][0]['API'])
        }
    })
})

app.listen(3000, function() {
    console.log("Server Started on webdev:3000");
});