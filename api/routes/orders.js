const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'get from /orders'
  })
})

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'post from /orders'
  })
})

router.get('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  res.status(200).json({
    message: 'Get order /w id',
    id 
  })
})

router.delete('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  res.status(200).json({
    message: 'Delete order /w id',
    id 
  })
})


module.exports = router;