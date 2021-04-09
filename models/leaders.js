// importar mongoose
const mongoose = require('mongoose');

// crear una variable de tipo esquema
const Schema =  mongoose.Schema;

// declarar el tipo de moneda
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency

// crear un nuevo esquema 

let leadersSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }, 
    image : {
        type: String,
        required : true
    },
    designation : {
        type: String,
        required: true,
    },

    abbr: {
        type: String,
        required: true,
    },

    description: {
        required: true,
        type: String,
    },

    featured: {
        required: true,
        type: String
    }
}, {
    timestamps: true    
})

let Leaders = mongoose.model('Leader',leadersSchema)

module.exports = Leaders;