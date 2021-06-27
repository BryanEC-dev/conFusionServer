var passport = require('passport');
// indicamos la estrategía de auntenticación que se va a utilizar
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
// librería con los método para extraer el token
var ExtractJwt = require('passport-jwt').ExtractJwt;
// usado para crear, firmar y verificar tokens
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');
var User = require('./models/user');


// como en el modelo ya declaramos passport-local-mongoose y utilizamos como plugin 
//  el modelo ya cuenta como metodos propios de la librería como User.authenticate()
// el cual se base en la estrategia de auntenticación de usuario y contraseña
passport.use(new LocalStrategy(User.authenticate()));

//TODO
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//  con esta función creamos el token 
exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 36000000});
};


var opts = {};
// como extraer el json web token en una solicitud entrante 
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

// analiza el mensaje de la solicitud , utiliza la estrategia de autenticación y extrae la información
exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        //console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});
exports.verifyAdmin = function (req, res, next) {
    console.log(req.user.admin);
    if(!req.user.admin) {
        res.statusCode = 403;
        res.setHeader('Content-type','application/json');
        res.json({"Message" : "Unauthorized"})

        // otra forma de hacerlo
       /*  var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err); */
    }
    return next();
}

