const express = require('express');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandlers');
const productRoutes = require('./routes/product.route');

/**
 * Configuración de la aplicación Express
 * Aplica: Separation of Concerns
 */
const app = express();

// ============================================
// Middlewares globales
// ============================================

// Parser de JSON
app.use(express.json());

// Parser de URL-encoded
app.use(express.urlencoded({ extended: true }));

// Logging simple (en producción usar Winston/Morgan)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// CORS básico (en producción configurar correctamente)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// ============================================
// Rutas
// ============================================

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta raíz con información de la API
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de Gestión de Productos',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      health: '/health'
    },
    documentation: 'Ver README.md para documentación completa'
  });
});

// Montar rutas de productos
app.use('/api/products', productRoutes);

// ============================================
// Manejo de errores
// ============================================

// Ruta no encontrada (404)
app.use(notFoundHandler);

// Manejador de errores global
app.use(errorHandler);

module.exports = app;