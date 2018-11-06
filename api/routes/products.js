const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Product.find()
    .select('name price _id')
    .exec()
    .then(result => {
      const response = {
        count: result.length,
        products: result.map(product => {
          return {
            name: product.name,
            price: product.price,
            _id: product._id,
            request: {
              type: 'GET',
              url: `http://${process.env.DOMAIN}:${process.env.PORT}/products/${product._id}`
            }
          }
        })
      };
      if (result.length > 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(error => {
      res.status(500).json({
        error
      });
    });
})

router.post('/', (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  })
  product
    .save()
    .then(result => {
      res.status(201).json({
        message: 'success',
        resultObject: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: `http://${process.env.DOMAIN}:${process.env.PORT}/products/${result._id}`
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then(result => {
      const response = {
        count: result.length,
        product: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: `http://${process.env.DOMAIN}:${process.env.PORT}/products/${result._id}`
          }
        }
      }
      if (result) {
        res.status(200).json(response);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(error => {
      res.status(500).json({
        error
      });
    });
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      Product.findById(id).exec()
        .then(result => {
          res.status(200).json(result);
        });
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

module.exports = router;