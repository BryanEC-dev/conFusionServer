var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Eres libre de definir tu usuario como quieras. Passport-Local Mongoose agregará un nombre de usuario, 
//hash y campo de sal para almacenar el nombre de usuario, la contraseña con hash y el valor de sal.

let passportLocalMongoose = require('passport-local-mongoose');
let passportLoca
var User = new Schema({
    admin:   {
        type: Boolean,
        default: false
    }
});

// le indicamos al modelo que se va a utilizar passport lo cual agrega campos adicionales al esquema
// adicional nos permite utilizar más métodos
User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);