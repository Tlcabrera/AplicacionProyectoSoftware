require('dotenv').config();
const app = require('./src/app');

// IMPORTAR la base de datos → ejecuta constructor y conecta automáticamente
const database = require('./src/config/database');

// ============================================
// Configuración del servidor
// ============================================
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// Inicialización
// ============================================
async function startServer() {
  try {

    // ❌ YA NO LLAMAR:
    // await database.connect();

    // ✅ La conexión ya ocurrió al importar database.js

    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log('╔════════════════════════════════════════╗');
      console.log('║   🚀 SERVIDOR INICIADO EXITOSAMENTE   ║');
      console.log('╠════════════════════════════════════════╣');
      console.log(`║  Entorno: ${NODE_ENV.padEnd(28)}║`);
      console.log(`║  Puerto: ${PORT.toString().padEnd(29)}║`);
      console.log(`║  URL: http://localhost:${PORT.toString().padEnd(17)}║`);
      console.log('╠════════════════════════════════════════╣');
      console.log('║  Endpoints disponibles:                ║');
      console.log(`║  • GET    http://localhost:${PORT}/health      ║`);
      console.log(`║  • GET    http://localhost:${PORT}/api/products║`);
      console.log(`║  • POST   http://localhost:${PORT}/api/products║`);
      console.log(`║  • GET    http://localhost:${PORT}/api/products/:id║`);
      console.log(`║  • PUT    http://localhost:${PORT}/api/products/:id║`);
      console.log(`║  • DELETE http://localhost:${PORT}/api/products/:id║`);
      console.log('╚════════════════════════════════════════╝');
    });

    // Manejo de cierre graceful
    const gracefulShutdown = async (signal) => {
      console.log(`\n⚠️  ${signal} recibido. Cerrando servidor...`);
      
      server.close(async () => {
        console.log('🔒 Servidor HTTP cerrado');
        
        try {
          await database.disconnect();
          console.log('✅ Desconexión exitosa');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error al cerrar conexiones:', error);
          process.exit(1);
        }
      });

      // Forzar cierre si no responde en 10s
      setTimeout(() => {
        console.error('⏱️  Timeout: Forzando cierre...');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Iniciar la aplicación
startServer();
