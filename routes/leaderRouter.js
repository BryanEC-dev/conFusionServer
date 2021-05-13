const express = require('express');
const bodyParser  = require('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
const leaderRouter = express.Router();
var authenticate = require('../authenticate');


leaderRouter.route('/')
.get((req,res) => {
    Leaders.find({})
    .then( (leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leaders)
    }, (err) => next(err))
    .catch( (err) => {
        next(err)
    })
})
.post(authenticate.verifyUser, (req, res) => {
   Leaders.create(req.body)
   .then( (leader) => {
       res.statusCode = 201,
       res.setHeader('Content-type','application/json');
       res.json(leader)
   })
   .catch( (err) => {
       //next(err)
       console.log(err);
   }) 
})
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leadership');
})
.delete(authenticate.verifyUser, (req, res) => {
    Leaders.remove()
    .then( (resp) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(resp)
    }).catch( (err) => {
        console.log(err);
    })
});

leaderRouter.route('/:leaderId')
.get((req,res) => {
    Leaders.findById(req.params.leaderId)
    .then( (leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(dishes)
    })
    .catch ( (err) => {
        console.log(err);
    })
})


.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leadership');
})
.put(authenticate.verifyUser, (req, res) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {new: true})
    .then( (leader) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leader)
    })
    .catch( (err) => {
        console.log(err);
    })
})
.delete(authenticate.verifyUser, (req, res) => {
    Leaders.findByIdAndRemove(req.params.leaderId, {
        $set: req.body
    }, {new: true})
    .then( (leader) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leader)
    })
    .catch( (err) => {
        console.log(err);
    })
});



module.exports = leaderRouter;