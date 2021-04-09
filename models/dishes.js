// importar mongoose
const mongoose = require('mongoose');
const Dishes = require('./dishes');

// crear una variable de tipo esquema
const Schema =  mongoose.Schema;

// declarar el tipo de moneda
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency

// crear un nuevo esquema 


var commentSchema = new Schema({
    rating:  {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    author:  {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    comments:[commentSchema]
}, {
    timestamps: true
});
