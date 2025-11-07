const productService = require('../services/product.service');
const ApiResponse = require('../utils/ApiResponse');

/**
 * Controlador de Productos
 * Parte del patrón MVC (Controller)
 * Aplica:
 * - Single Responsibility: Solo maneja peticiones HTTP
 * - Dependency Inversion: Depende del servicio (abstracción)
 */
class ProductController {
  /**
   * Crear producto
   * POST /api/products
   */
  async createProduct(req, res, next) {
    try {
      const product = await productService.createProduct(req.body);
      const response = ApiResponse.created(product, 'Producto creado exitosamente');
      response.send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener todos los productos
   * GET /api/products?page=1&limit=10&category=electronics&search=laptop
   */
  async getAllProducts(req, res, next) {
    try {
      const filters = {
        category: req.query.category,
        isActive: req.query.isActive,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        search: req.query.search
      };

      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sortBy: req.query.sortBy || 'createdAt',
        sortOrder: req.query.sortOrder || 'desc'
      };

      const result = await productService.getAllProducts(filters, options);
      const response = ApiResponse.success(
        result,
        'Productos obtenidos exitosamente'
      );
      response.send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener producto por ID
   * GET /api/products/:id
   */
  async getProductById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      const response = ApiResponse.success(product, 'Producto encontrado');
      response.send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar producto
   * PUT /api/products/:id
   */
  async updateProduct(req, res, next) {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body
      );
      const response = ApiResponse.success(
        product,
        'Producto actualizado exitosamente'
      );
      response.send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar producto (soft delete)
   * DELETE /api/products/:id
   */
  async deleteProduct(req, res, next) {
    try {
      const product = await productService.deleteProduct(req.params.id);
      const response = ApiResponse.success(
        product,
        'Producto eliminado exitosamente'
      );
      response.send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Eliminar producto permanentemente
   * DELETE /api/products/:id/permanent
   */
  async permanentDeleteProduct(req, res, next) {
    try {
      const result = await productService.permanentDeleteProduct(req.params.id);
      const response = ApiResponse.success(
        result,
        'Producto eliminado permanentemente'
      );
      response.send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener productos por categoría
   * GET /api/products/category/:category
   */
  async getProductsByCategory(req, res, next) {
    try {
      const products = await productService.getProductsByCategory(
        req.params.category
      );
      const response = ApiResponse.success(
        products,
        `Productos de categoría ${req.params.category}`
      );
      response.send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener productos con stock bajo
   * GET /api/products/low-stock?threshold=10
   */
  async getLowStockProducts(req, res, next) {
    try {
      const threshold = parseInt(req.query.threshold) || 10;
      const products = await productService.getLowStockProducts(threshold);
      const response = ApiResponse.success(
        products,
        `Productos con stock bajo (≤ ${threshold})`
      );
      response.send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualizar stock de producto
   * PATCH /api/products/:id/stock
   * Body: { quantity: 5 } o { quantity: -5 }
   */
  async updateStock(req, res, next) {
    try {
      const product = await productService.updateStock(
        req.params.id,
        parseInt(req.body.quantity)
      );
      const response = ApiResponse.success(
        product,
        'Stock actualizado exitosamente'
      );
      response.send(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener estadísticas de productos
   * GET /api/products/statistics
   */
  async getStatistics(req, res, next) {
    try {
      const statistics = await productService.getStatistics();
      const response = ApiResponse.success(
        statistics,
        'Estadísticas obtenidas exitosamente'
      );
      response.send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();