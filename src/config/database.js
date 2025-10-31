const mongoose = require('mongoose');
/**
 * Configuración de la base de datos utilizando Mongoose.
 * Conexión a MongoDB.
 * Aplicar: Singleton Pattern para la conexión.
 */
class Database {
    constructor() {
        this._connect();
    }
    async _connect() {
        try {
            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            };
            this.connection = await mongoose.connect(
                process.env.MONGODB_URI, options
            );
            console.log('Database connection successful');

            /**
             * Manejo de eventos de la conexión
             */
            mongoose.connection.on('error', (err) => {
                console.error(`Database connection error: ${err}`);
            });
            mongoose.connection.on('disconnected', () => {
                console.warn('Database disconnected');
            });
            return this.connection;
        } catch (err) {
            console.error(`Database connection error: ${err}`);
        }
    }
    async disconnect() {
        if (this.connection) {
            await mongoose.disconnect();
            console.log('Database disconnected successfully');
        }
    }
}
module.exports = new Database();
