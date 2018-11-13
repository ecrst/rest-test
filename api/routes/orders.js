const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders');

router.get('/', OrdersController.orders_get_all);
router.post('/', OrdersController.orders_create);
router.get('/:orderId', OrdersController.orders_get_by_id);
router.delete('/:orderId', OrdersController.orderds_delete);

module.exports = router;
