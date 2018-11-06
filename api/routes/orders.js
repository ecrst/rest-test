const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(500).json({error});
    });
})

router.post('/', (req, res, next) => {
  Product.findById(req.body.productId)
    .exec()
    .then(result => {
      if (!result) {
        res.status(404).json({ message: 'Not found such product ID' });
        return;
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });
      return order.save();
    })
    .then(result => {
      res.statusCode == 404 || res.status(201).json(result);
    })
    .catch(error => {
      res.status(500).json({error});
    });
});

router.get('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select('_id product quantity')
    .exec()
    .then(result => {
      result ? res.status(200).json(result) : res.status(404).json({ message: 'Not found' });
    })
    .catch(error => {
      res.status(500).json({error});
    })
})

router.delete('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({_id: id})
  .exec()
  .then(result => {
    result.n != 0 ? res.status(200).json(result) : res.status(404).json({ message: 'Not found' });
  })
  .catch(error => {
    res.status(500).json({error});
  })
})


module.exports = router;