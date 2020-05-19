const   bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        express         = require('express'),
        request         = require('request'),
        app             = express()

mongoose.connect('mongodb://localhost/publicAPI', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

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

app.get('/favorites', function(req, res) {
    Public.find({}, function(err, favorites) {
        if(err) {
            console.log('ERROR!')
        } else {
            res.render('favorites', {favorites: favorites})
        }
    })
})

app.listen(3000, function() {
    console.log("Server Started on webdev:3000");
});