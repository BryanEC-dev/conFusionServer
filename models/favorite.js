// importar mongoose
const mongoose = require('mongoose');

// crear una variable de tipo esquema
const Schema =  mongoose.Schema;


// crear un nuevo esquema 

let favoritesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }, 
    dishes : [{type: Schema.Types.ObjectId, ref: 'Dishe'}],
}, {
    timestamps: true    
})

let Favorites = mongoose.model('Favorite',favoritesSchema)

module.exports = Favorites;