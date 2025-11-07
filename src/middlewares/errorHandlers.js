const ApiError = require('../utils/ApiError');

/**
 * Middleware de manejo centralizado de errores
 * Aplica: Single Responsibility - Solo maneja errores
 */

// Convertir errores de Mongoose a ApiError
const handleMongooseError = (err) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return new ApiError(400, messages.join('; '));
  }

  if (err.name === 'CastError') {
    return new ApiError(400, `Valor inválido para ${err.path}: ${err.value}`);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return new ApiError(409, `El ${field} ya existe`);
  }

  return err;
};

// Middleware principal de manejo de errores
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convertir errores de Mongoose
  if (err.name === 'ValidationError' || err.name === 'CastError' || err.code === 11000) {
    error = handleMongooseError(err);
  }

  // Si no es ApiError, convertir a error genérico
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Error interno del servidor';
    error = new ApiError(statusCode, message, false);
  }

  // Respuesta de error
  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  };

  // Log de errores (en producción usar un logger como Winston)
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', error);
  }

  res.status(error.statusCode).json(response);
};

// Middleware para rutas no encontradas
const notFoundHandler = (req, res, next) => {
  throw new ApiError(404, `Ruta no encontrada: ${req.originalUrl}`);
};

module.exports = { errorHandler, notFoundHandler };