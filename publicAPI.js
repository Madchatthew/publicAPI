const   bodyParser          = require('body-parser'),
        methodOverride      = require('method-override'),
        expressSanitizer    = require('express-sanitizer'),
        mongoose            = require('mongoose'),
        express             = require('express'),
        request             = require('request'),
        publicAPI           = express()

mongoose.connect('mongodb://localhost/publicAPI', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.once('open', () => console.log('Connected to Mongoose'))

publicAPI.set('view engine', 'ejs')
publicAPI.use(bodyParser.urlencoded({extended: true}))
publicAPI.use(express.static('public'))
publicAPI.use(expressSanitizer())
publicAPI.use(methodOverride('_method'))

// mongodb schema
const publicSchema = new mongoose.Schema( {
    title: String,
    category: String,
    description: String,
    link: String,
    comments: String,
    created: {type: Date, default: Date.now}
})

const Public = mongoose.model('Public', publicSchema)

// renders the search page
publicAPI.get('/', function(req, res) {
        res.render('search')
})

// shows the results of search
publicAPI.get('/results', function(req, res) {
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

// starts the server
publicAPI.listen(3000, function() {
    console.log("Server Started");
})
