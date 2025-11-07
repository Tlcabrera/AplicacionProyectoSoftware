const Product = require('../models/product.model');

/**
 * Repository Pattern - Abstrae el acceso a datos
 * Aplica:
 * - Single Responsibility: Solo maneja operaciones de BD
 * - Dependency Inversion: Los servicios dependen de esta abstracción
 * - Interface Segregation: Métodos específicos para cada operación
 */
class ProductRepository {
  /**
   * Crear un nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Promise<Product>}
   */
  async create(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  /**
   * Obtener todos los productos con filtros opcionales
   * @param {Object} filters - Filtros de búsqueda
   * @param {Object} options - Opciones de paginación y ordenamiento
   * @returns {Promise<Array>}
   */
  async findAll(filters = {}, options = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const products = await Product.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(); // Devuelve objetos JavaScript planos (mejor rendimiento)

    const total = await Product.countDocuments(filters);

    return {
      products,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasMore: skip + products.length < total
      }
    };
  }

  /**
   * Obtener producto por ID
   * @param {String} id - ID del producto
   * @returns {Promise<Product|null>}
   */
  async findById(id) {
    return await Product.findById(id);
  }

  /**
   * Obtener producto por nombre
   * @param {String} name - Nombre del producto
   * @returns {Promise<Product|null>}
   */
  async findByName(name) {
    return await Product.findOne({ 
      name: new RegExp(name, 'i') // Búsqueda case-insensitive
    });
  }

  /**
   * Actualizar producto
   * @param {String} id - ID del producto
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Product|null>}
   */
  async update(id, updateData) {
    return await Product.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Devuelve el documento actualizado
        runValidators: true // Ejecuta validadores del schema
      }
    );
  }

  /**
   * Eliminar producto (soft delete)
   * @param {String} id - ID del producto
   * @returns {Promise<Product|null>}
   */
  async softDelete(id) {
    return await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  }

  /**
   * Eliminar producto permanentemente
   * @param {String} id - ID del producto
   * @returns {Promise<Product|null>}
   */
  async hardDelete(id) {
    return await Product.findByIdAndDelete(id);
  }

  /**
   * Buscar productos por categoría
   * @param {String} category - Categoría del producto
   * @returns {Promise<Array>}
   */
  async findByCategory(category) {
    return await Product.find({ category, isActive: true });
  }

  /**
   * Buscar productos con stock bajo
   * @param {Number} threshold - Umbral de stock
   * @returns {Promise<Array>}
   */
  async findLowStock(threshold = 10) {
    return await Product.find({
      stock: { $lte: threshold },
      isActive: true
    });
  }

  /**
   * Actualizar stock de un producto
   * @param {String} id - ID del producto
   * @param {Number} quantity - Cantidad a sumar/restar
   * @returns {Promise<Product|null>}
   */
  async updateStock(id, quantity) {
    return await Product.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true, runValidators: true }
    );
  }

  /**
   * Verificar si existe un producto por nombre
   * @param {String} name - Nombre del producto
   * @param {String} excludeId - ID a excluir (útil para updates)
   * @returns {Promise<Boolean>}
   */
  async existsByName(name, excludeId = null) {
    const query = { name: new RegExp(`^${name}$`, 'i') };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const product = await Product.findOne(query);
    return !!product;
  }
}

module.exports = new ProductRepository();