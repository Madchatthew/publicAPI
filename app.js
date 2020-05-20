const   bodyParser      = require('body-parser'),
        methodOverride  = require('method-override'),
        mongoose        = require('mongoose'),
        express         = require('express'),
        request         = require('request'),
        app             = express()

mongoose.connect('mongodb://localhost/publicAPI', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.once('open', () => console.log('Connected to Mongoose'))

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))

const publicSchema = new mongoose.Schema( {
    title: String,
    category: String,
    description: String,
    link: String,
    comments: String,
    created: {type: Date, default: Date.now}
})

const Public = mongoose.model('Public', publicSchema)

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

app.post('/favorites', function(req, res) {
    Public.create(req.body.favorite, function(err, newFavorite) {
        if(err) {
            res.render('new')
        } else {
            res.redirect('/favorites')
        }
    })
})

app.get('/favorites', function(req, res) {
    Public.find({}, function(err, favorites) {
        if(err) {
            console.log('ERROR!')
        } else {
            res.render('favorites', {favorites: favorites})
        }
    })
})

app.get('favorites/:id', function(req, res) {
    Public.findById(req.params.id, function(err, foundFavorite) {
        if(err) {
            res.redirect('/favorites')
        } else {
            res.render('show', {favorite: foundFavorite})
        }
    })
})

app.get('/favorites/:id/edit', function(req, res) {
    Public.findById(req.params.id, function(err, foundFavorite) {
        if(error) {
            res.redirect('/favorites')
        } else {
            res.render('edit', {favorite: foundFavorite})
        }
    })
})

app.put('/favorites/:id', function(req, res) {
    Public.findByIdAndUpdate(req.params.id, req.body.favorite, function(err, updatedFavorite) {
        if(err) {
            res.redirect('/favorites')
        } else {
            res.redirect('/favorites/' + req.params.id)
        }
    })
})

app.delete('/favorites/:id', function(req, res) {
    Public.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect('/favorites')
        } else {
            res.redirect('/favorites')
        }
    })
})

app.listen(3000, function() {
    console.log("Server Started on webdev:3000");
});