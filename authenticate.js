var passport = require('passport');
// indicamos la estrategía de auntenticación que se va a utilizar
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');


// como en el modelo ya declaramos passport-local-mongoose y utilizamos como plugin 
//  el modelo ya cuenta como metodos propios de la librería como User.authenticate()
// el cual se base en la estrategia de auntenticación de usuario y contraseña
passport.use(new LocalStrategy(User.authenticate()));


// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());