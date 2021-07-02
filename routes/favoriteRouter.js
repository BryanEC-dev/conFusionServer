const express = require('express');
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const Favorites = require('../models/favorite');
const favoriteRouter = express.Router();
var authenticate = require('../authenticate');
let cors = require('./cors')


favoriteRouter.route('/')
.get(cors.corsWithOptions, authenticate.verifyUser,(req,res) => {
    Favorites.find({'user' : req.user._id})
    .populate('user')
    /* .populate('dishes') */
    .then( (favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(favorites)
    })
    .catch( (err) => {
        console.log();
    })
})
.post(cors.corsWithOptions, authenticate.verifyUser,(req,res) => {
    let doc =  {};
    doc.user = req.user._id
    doc.dishes = []
   Favorites.findOne({'user' : req.user._id})
    .then( (favorites) => {
        console.log(favorites);
        if(favorites != null){
            // actualizar el documento
            console.log('Actualizar')
             // validar que el elemento no se encuentre en favoritos
            req.body.forEach(element => {
                if( favorites.dishes.indexOf(element._id) == -1){
                    doc.dishes.push(element) 
                }
            });

            if (doc.dishes.length == 0){
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
            }
            else {
                Favorites.update({'user' : req.user._id}, {$addToSet : {dishes : doc.dishes}})
                .then( (favorites) => {
                    console.log("actualizado")
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }).catch( (err) => {
                    return next(err)
                })
            }

            
            
        }else {
            // agregar un nuevo documento
            doc.dishes = req.body;
            Favorites.create(doc)
            .then((favorite) => {
                res.sendStatus = 201;
                res.setHeader('Content-type', 'application/json');
                res.json(favorite);
             })
            .catch( (err) => {
                //next(err)
                console.log(err);
            }) 
            
        }
        
    })
    .catch( (err) => {
      console.error(err)
    })
})
.delete(cors.corsWithOptions, authenticate.verifyUser,(req,res) => {
    Favorites.deleteOne({'user' : req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));  
})

favoriteRouter.route('/:idFavorite')
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res) => {
    let doc =  {};
    doc.user = req.user._id
    doc.dishes = req.params.idFavorite

    Favorites.findOne({'user' : req.user._id})
    .then( (favorites) => {
        console.log(favorites.length)
        if(favorites.length != 0){
            // actualizar el documento
            if( favorites.dishes.indexOf(req.params.idFavorite) == -1){
                Favorites.update({'user' : req.user._id}, {$addToSet : {dishes : doc.dishes}})
                .then( (favorites) => {
                    console.log("actualizado")
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }).catch( (err) => {
                    return next(err)
                })
                
            }else{
                res.statusCode = 500;
                res.setHeader('Content-type', 'application/json');
                res.json({"message": "el plato ya se encuentra registrado en favoritos"})
            }

            
            
        }else {
             // agregar un nuevo documento
             Favorites.create(doc)
             .then((favorite) => {
                 res.sendStatus = 201;
                 res.setHeader('Content-type', 'application/json');
                 res.json(favorite);
              })
             .catch( (err) => {
                 //next(err)
                 console.log(err);
             }) 
            
        }
        
    })
    .catch( (err) => {
      console.error(err)
    })
    
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res) => {
    Favorites.findOne({'user' : req.user._id})
    .then( (favorites) => {
        if( favorites.dishes.indexOf(req.params.idFavorite) >= 0){
            Favorites.update({'user' : req.user._id},{$pull : {"dishes": req.params.idFavorite}})
            .then( (favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(favorites)
            }).catch( (err) => {
                console.log(err);
            })
            
        }else{
            res.statusCode = 404;
            res.setHeader('Content-type', 'application/json');
            res.json({"message": "No existe el id"})
        }
       
    })
    .catch( (err) => {
        console.log();
    })
})


module.exports = favoriteRouter;