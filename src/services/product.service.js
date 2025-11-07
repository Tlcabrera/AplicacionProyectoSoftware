const productRepository = require('../repositories/product.repository');
const ApiError = require('../utils/ApiError');

/**
 * Service Layer - Lógica de negocio
 * Aplica:
 * - Single Responsibility: Solo lógica de negocio
 * - Dependency Inversion: Depende de abstracción (repository)
 * - Open/Closed: Abierto a extensión mediante nuevos métodos
 */
class ProductService {
  constructor(repository) {
    this.repository = repository;
  }

  /**
   * Crear un nuevo producto
   * Valida lógica de negocio antes de persistir
   */
  async createProduct(productData) {
    // Validación: Producto con nombre duplicado
    const existingProduct = await this.repository.existsByName(productData.name);
    if (existingProduct) {
      throw new ApiError(400, 'Ya existe un producto con ese nombre');
    }

    // Validación de negocio: Precio mínimo
    if (productData.price < 0.01) {
      throw new ApiError(400, 'El precio debe ser mayor a $0.01');
    }

    // Crear producto
    const product = await this.repository.create(productData);
    return product;
  }

  /**
   * Obtener todos los productos
   */
  async getAllProducts(filters = {}, options = {}) {
    // Construir filtros dinámicos
    const queryFilters = {};

    if (filters.category) {
      queryFilters.category = filters.category;
    }

    if (filters.isActive !== undefined) {
      queryFilters.isActive = filters.isActive === 'true';
    }

    if (filters.minPrice || filters.maxPrice) {
      queryFilters.price = {};
      if (filters.minPrice) queryFilters.price.$gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) queryFilters.price.$lte = parseFloat(filters.maxPrice);
    }

    if (filters.search) {
      queryFilters.$or = [
        { name: new RegExp(filters.search, 'i') },
        { description: new RegExp(filters.search, 'i') }
      ];
    }

    return await this.repository.findAll(queryFilters, options);
  }

  /**
   * Obtener producto por ID
   */
  async getProductById(id) {
    const product = await this.repository.findById(id);
    
    if (!product) {
      throw new ApiError(404, 'Producto no encontrado');
    }

    return product;
  }

  /**
   * Actualizar producto
   */
  async updateProduct(id, updateData) {
    // Verificar que el producto existe
    const existingProduct = await this.repository.findById(id);
    if (!existingProduct) {
      throw new ApiError(404, 'Producto no encontrado');
    }

    // Si se intenta cambiar el nombre, verificar que no exista otro con ese nombre
    if (updateData.name && updateData.name !== existingProduct.name) {
      const duplicated = await this.repository.existsByName(updateData.name, id);
      if (duplicated) {
        throw new ApiError(400, 'Ya existe otro producto con ese nombre');
      }
    }

    // Validación de negocio
    if (updateData.price !== undefined && updateData.price < 0.01) {
      throw new ApiError(400, 'El precio debe ser mayor a $0.01');
    }

    const updatedProduct = await this.repository.update(id, updateData);
    return updatedProduct;
  }

  /**
   * Eliminar producto (soft delete)
   */
  async deleteProduct(id) {
    const product = await this.repository.findById(id);
    
    if (!product) {
      throw new ApiError(404, 'Producto no encontrado');
    }

    if (!product.isActive) {
      throw new ApiError(400, 'El producto ya está inactivo');
    }

    const deletedProduct = await this.repository.softDelete(id);
    return deletedProduct;
  }

  /**
   * Eliminar permanentemente
   */
  async permanentDeleteProduct(id) {
    const product = await this.repository.findById(id);
    
    if (!product) {
      throw new ApiError(404, 'Producto no encontrado');
    }

    await this.repository.hardDelete(id);
    return { message: 'Producto eliminado permanentemente' };
  }

  /**
   * Obtener productos por categoría
   */
  async getProductsByCategory(category) {
    const validCategories = ['electronics', 'clothing', 'food', 'books', 'other'];
    
    if (!validCategories.includes(category)) {
      throw new ApiError(400, `Categoría inválida. Opciones: ${validCategories.join(', ')}`);
    }

    return await this.repository.findByCategory(category);
  }

  /**
   * Obtener productos con stock bajo
   */
  async getLowStockProducts(threshold = 10) {
    if (threshold < 0) {
      throw new ApiError(400, 'El umbral debe ser un número positivo');
    }

    return await this.repository.findLowStock(threshold);
  }

  /**
   * Actualizar stock (incrementar o decrementar)
   */
  async updateStock(id, quantity) {
    const product = await this.repository.findById(id);
    
    if (!product) {
      throw new ApiError(404, 'Producto no encontrado');
    }

    // Validación: No permitir stock negativo
    const newStock = product.stock + quantity;
    if (newStock < 0) {
      throw new ApiError(400, `Stock insuficiente. Stock actual: ${product.stock}`);
    }

    const updatedProduct = await this.repository.updateStock(id, quantity);
    return updatedProduct;
  }

  /**
   * Obtener estadísticas de productos
   */
  async getStatistics() {
    const allProducts = await this.repository.findAll();
    const lowStock = await this.repository.findLowStock();

    const statistics = {
      totalProducts: allProducts.pagination.total,
      activeProducts: allProducts.products.filter(p => p.isActive).length,
      inactiveProducts: allProducts.products.filter(p => !p.isActive).length,
      lowStockProducts: lowStock.length,
      totalInventoryValue: allProducts.products.reduce(
        (sum, p) => sum + (p.price * p.stock), 
        0
      ),
      byCategory: {}
    };

    // Agrupar por categoría
    allProducts.products.forEach(product => {
      if (!statistics.byCategory[product.category]) {
        statistics.byCategory[product.category] = 0;
      }
      statistics.byCategory[product.category]++;
    });

    return statistics;
  }
}

// Inyección de dependencias: Se pasa el repository al servicio
module.exports = new ProductService(productRepository);