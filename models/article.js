'use strict'


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate-v2');



var BlogSchema = Schema({
    title: String,
    content: String,
    date: {type: Date, default:Date.now},
    image: String
});

BlogSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('blog', BlogSchema);