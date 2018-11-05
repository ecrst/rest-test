const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'get from /products'
  })
})

router.post('/', (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price
  }
  res.status(201).json({
    message: 'post from /products',
    product
  })
})

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  res.status(200).json({
    message: 'Get /w id',
    id 
  })
})

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  res.status(200).json({
    message: 'Patch /w id',
    id 
  })
})

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  res.status(200).json({
    message: 'Delete /w id',
    id 
  })
})


module.exports = router;