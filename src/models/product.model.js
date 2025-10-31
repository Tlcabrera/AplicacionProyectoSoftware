const mongoose = require('mongoose');

/**
 * Esquema de Producto
 * Definición del esquema y modelo para los productos.
 * Aplica¨:Single Responsibility Principle (SRP)
 *Parte de la capa de Modelo en MVC.
 */

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true,
        minlength: [6, 'El nombre del producto debe tener al menos 3 caracteres'],
        maxlength: [100, 'El nombre del producto no debe exceder los 100 caracteres']
    },
    description: {
        type: String,
        required: [true, 'La descripción del producto es obligatoria'],
        trim: true,
        minlength: [20, 'La descripción del producto debe tener al menos 10 caracteres'],
        maxlength: [500, 'La descripción del producto no debe exceder los 500 caracteres']
    },
    price: {
        type: Number,
        required: [true, 'El precio del producto es obligatorio'],
        min: [0, 'El precio del producto no puede ser negativo']
    },
    category: {
        type: String,
        required: [true, 'La categoría del producto es obligatoria'],
        enum: {
            values: ['Electrónica', 'Ropa', 'Hogar', 'Libros', 'Otros'],
            message: '{VALUE} no en una categoría válida'
        }
    },
    stock: {
        type: Number,
        required: [true, 'El stock del producto es obligatorio'],
        min: [0, 'El stock del producto no puede ser negativo'],
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    });

/** 
 * Indices para mejorar las busquedas
 */
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

/** Mostrar formato de precio */
productSchema.virtual('formattedPrice').get(function () {
    return `$${this.price.toFixed(2)}`;
});

/** Consultar existencia de productos */
productSchema.methods.isAvailable = function () {
    return this.isActive && this.stock > 0;
};

/** consulta de productos activos */
productSchema.statics.findActiveProducts = function () {
    return this.find({ isActive: true });
};

/** Middleware: pre save */
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }
    next();
});


/** Json para control de datos cuanmdo se devuelven */
productSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;