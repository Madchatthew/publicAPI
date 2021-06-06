const mongoose = require('mongoose');

// mongodb schema
const publicSchema = new mongoose.Schema( {
    title: String,
    category: String,
    description: String,
    link: String,
    comments: String,
    created: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Public', publicSchema);