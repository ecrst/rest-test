require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@rest-test-hqs9m.mongodb.net/test?retryWrites=true`,
  { useNewUrlParser: true }
)
app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
}); 

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


// Error handling
app.use((req, res, next) => {
  const error = new Error('Such route is not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: error.message
  });
});

module.exports = app;