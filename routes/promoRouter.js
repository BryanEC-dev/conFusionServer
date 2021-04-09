const express = require('express');
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const Promotions = require('../models/promotions')
const promotionRouter = express.Router()

promotionRouter.route('/')
.get((req,res) => {
    Promotions.find({})
    .then( (promotios) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(promotios)
    }, (err) => next(err))
    .catch( (err) => {
        next(err)
    })
})
.post((req, res) => {
   Promotions.create(req.body)
   .then( (promotion) => {
        res.statusCode = 201,
        res.setHeader('Content-type','application/json');
        res.json(promotion)
   }).catch( (err) => {
       console.log(err);
   })
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res) => {
    Promotions.remove()
    .then( (resp) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(resp)
    }).catch( (err) => {
        console.log(err);
    })
});

promotionRouter.route('/:promoId')
.get((req,res) => {
    Promotions.findById(req.params.promoId)
    .then( (promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(promotions)
    })
    .catch ( (err) => {
        console.log(err);
    })
})
.post((req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions');
})
.put((req, res) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, {new: true})
    .then( (promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(promotions)
    })
    .catch( (err) => {
        console.log(err);
    })
})
.delete((req, res) => {
    Promotions.findByIdAndRemove(req.params.promoId)
    .then( (leader) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leader)
    })
    .catch( (err) => {
        console.log(err);
    })
});

module.exports = promotionRouter;