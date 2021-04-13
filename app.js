var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

// Declaración de las rutas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');

// creación del servidor
var app = express();


// conexión a la base de datos
const url = 'mongodb://localhost:27017/conFusionServer';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// agregando midleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


  // cookie 
    // suministrar clave secreta para cifrar la cookie
app.use(cookieParser('12345-67890-09876-54321'));

function auth (req, res, next) {

    // validamos si no existe una cookie firmada con la propiedad user, en caso de que exista se valida
    // la cookie
  if (!req.signedCookies.user) {
    var authHeader = req.headers.authorization;
    // si no existe un encabezado de autenticación regresamos un 401
    if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        return next(err);
    }
    // si existe un encabezado validamos el usuario y la contraseña
    // antes de obtener los valores de user y pass se debe de decodificar el valor de la autenticación
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
    // si los valores de user y pass coinciden autorizamos al usuario y creamos una cookie firmada
    // con el valor de admin, caso contrario retornamos un error
    if (user == 'admin' && pass == 'password') {
        res.cookie('user','admin',{signed: true});
        next(); // authorized
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');              
        err.status = 401;
        next(err);
    }
  }
  else {
      if (req.signedCookies.user === 'admin') {
          next();
      }
      else {
          var err = new Error('You are not authenticated!');
          err.status = 401;
          next(err);
      }
  }
}






app.use(express.static(path.join(__dirname, 'public')));
app.use(auth);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
 
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
