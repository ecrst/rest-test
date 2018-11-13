const mongoose = require('mongoose');
const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then(result => {
      const response = {
        count: result.length,
        products: result.map(product => {
          return {
            name: product.name,
            price: product.price,
            _id: product._id,
            productImage: product.productImage,
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
};

exports.products_create = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path.replace('\\', '/')
  })
  product
    .save()
    .then(result => {
      res.status(201).json({
        message: 'success',
        resultObject: {
          name: result.name,
          price: result.price,
          productImage: result.productImage,
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
};

exports.products_get_by_id = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then(result => {
      if (result) {
        const response = {
          count: result.length,
          product: {
            name: result.name,
            price: result.price,
            productImage: result.productImage,
            _id: result._id,
            request: {
              type: 'GET',
              url: `http://${process.env.DOMAIN}:${process.env.PORT}/products/${result._id}`
            }
          }
        }
        res.status(200).json(response);
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        error
      });
    });
};

exports.products_edit = (req, res, next) => {
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
};

exports.products_delete = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(error => {
      res.status(500).json({error});
    });
};
