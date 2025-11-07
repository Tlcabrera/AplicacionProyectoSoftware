const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const Validator = require('../middlewares/validator');

/**
 * Rutas de productos
 * Organización RESTful
 */

// Rutas especiales (deben ir antes de las rutas con :id)
router.get(
  '/statistics',
  productController.getStatistics.bind(productController)
);

router.get(
  '/low-stock',
  productController.getLowStockProducts.bind(productController)
);

router.get(
  '/category/:category',
  productController.getProductsByCategory.bind(productController)
);

// CRUD básico
router.post(
  '/',
  Validator.validateProductCreate,
  productController.createProduct.bind(productController)
);

router.get(
  '/',
  productController.getAllProducts.bind(productController)
);

router.get(
  '/:id',
  Validator.validateMongoId,
  productController.getProductById.bind(productController)
);

router.put(
  '/:id',
  Validator.validateMongoId,
  Validator.validateProductUpdate,
  productController.updateProduct.bind(productController)
);

router.delete(
  '/:id',
  Validator.validateMongoId,
  productController.deleteProduct.bind(productController)
);

router.delete(
  '/:id/permanent',
  Validator.validateMongoId,
  productController.permanentDeleteProduct.bind(productController)
);

// Actualización de stock
router.patch(
  '/:id/stock',
  Validator.validateMongoId,
  Validator.validateStockUpdate,
  productController.updateStock.bind(productController)
);

module.exports = router;