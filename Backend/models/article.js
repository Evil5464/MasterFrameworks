'use strict'

var mongosse = require('mongoose');
var Schema = mongooseSchema;
var ArticleSchema = Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
    image: String
});

module.exports = mongosse.model('Article', ArticleSchema);
