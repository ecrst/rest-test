const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(result => {
      if (result.length > 0) {
        return res.status(409).json({
          message: 'User with such email already created!'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });    
            user.save()
              .then(result => {
                res.status(201).json({
                  message: 'User created'
                });
              })
              .catch(err => {
                console.error(err);
                res.status(500).json({
                  error: err
                });
              });
          };
        });
      };
    });
});

router.post('/signin', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(result => {
      if (result.length > 0) {
        bcrypt.compare(req.body.password, result[0].password, (err, response) => {
          if (err) {
            return res.status(401).json({
              message: 'Wrong credentials!'
            });
          } else if (response) {
            const token = jwt.sign(
              {
                email: result[0].email,
                userId: result[0]._id,
              }, 
              process.env.JWT_KEY, 
              {
                expiresIn: '1h'
              }
            );
            return res.status(200).json({
              message: 'Auth succeed!',
              token
            });
          } else {
            return res.status(401).json({
              message: 'Wrong credentials!'
            });
          }
        });
      } else {
        return res.status(401).json({
          message: 'Wrong credentials!'
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: err
      });
    });
})


module.exports = router;