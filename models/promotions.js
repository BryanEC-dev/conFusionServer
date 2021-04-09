const mongoose = require('mongoose');
const schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency

let promotionsSchema = new schema({
    name : {
        require: true,
        type: String,
    },
    image: {
        require: true,
        type: String,
    }, 
    label : {
        default: '',
        type: String,
    },

    price : {
        require: true,
        type: Currency,
    },

    description : {
        require: true,
        type: String,
    },

    featured : {
        require: true,
        type: String,
    },
}, {   
    timestamps: true 
});

let Promotions = mongoose.model('Promotion',promotionsSchema);

module.exports = Promotions