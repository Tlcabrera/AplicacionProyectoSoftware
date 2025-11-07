const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');

/**
 * Middleware de validación
 * Aplica: Single Responsibility - Solo valida datos
 */
class Validator {
  /**
   * Validar que el ID de MongoDB sea válido
   */
  static validateMongoId(req, res, next) {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'ID de producto inválido');
    }
    
    next();
  }

  /**
   * Validar datos de creación de producto
   */
  static validateProductCreate(req, res, next) {
    const { name, description, price, stock, category } = req.body;
    const errors = [];

    // Validaciones requeridas
    if (!name || name.trim() === '') {
      errors.push('El nombre es obligatorio');
    } else if (name.length < 3 || name.length > 100) {
      errors.push('El nombre debe tener entre 3 y 100 caracteres');
    }

    if (!description || description.trim() === '') {
      errors.push('La descripción es obligatoria');
    } else if (description.length < 10 || description.length > 500) {
      errors.push('La descripción debe tener entre 10 y 500 caracteres');
    }

    if (price === undefined || price === null) {
      errors.push('El precio es obligatorio');
    } else if (isNaN(price) || price < 0) {
      errors.push('El precio debe ser un número positivo');
    }

    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
      errors.push('El stock debe ser un número positivo');
    }

    const validCategories = ['electronics', 'clothing', 'food', 'books', 'other'];
    if (!category) {
      errors.push('La categoría es obligatoria');
    } else if (!validCategories.includes(category)) {
      errors.push(`Categoría inválida. Opciones: ${validCategories.join(', ')}`);
    }

    if (errors.length > 0) {
      throw new ApiError(400, errors.join('; '));
    }

    next();
  }

  /**
   * Validar datos de actualización de producto
   */
  static validateProductUpdate(req, res, next) {
    const { name, description, price, stock, category } = req.body;
    const errors = [];

    // Validaciones opcionales (solo si están presentes)
    if (name !== undefined) {
      if (name.trim() === '') {
        errors.push('El nombre no puede estar vacío');
      } else if (name.length < 3 || name.length > 100) {
        errors.push('El nombre debe tener entre 3 y 100 caracteres');
      }
    }

    if (description !== undefined) {
      if (description.trim() === '') {
        errors.push('La descripción no puede estar vacía');
      } else if (description.length < 10 || description.length > 500) {
        errors.push('La descripción debe tener entre 10 y 500 caracteres');
      }
    }

    if (price !== undefined && (isNaN(price) || price < 0)) {
      errors.push('El precio debe ser un número positivo');
    }

    if (stock !== undefined && (isNaN(stock) || stock < 0)) {
      errors.push('El stock debe ser un número positivo');
    }

    if (category !== undefined) {
      const validCategories = ['electronics', 'clothing', 'food', 'books', 'other'];
      if (!validCategories.includes(category)) {
        errors.push(`Categoría inválida. Opciones: ${validCategories.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      throw new ApiError(400, errors.join('; '));
    }

    next();
  }

  /**
   * Validar actualización de stock
   */
  static validateStockUpdate(req, res, next) {
    const { quantity } = req.body;

    if (quantity === undefined || quantity === null) {
      throw new ApiError(400, 'La cantidad es obligatoria');
    }

    if (isNaN(quantity) || !Number.isInteger(Number(quantity))) {
      throw new ApiError(400, 'La cantidad debe ser un número entero');
    }

    next();
  }
}
module.exports = Validator;