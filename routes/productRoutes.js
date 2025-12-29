const productController = require('../controllers/productController');
const Joi = require('joi');

// Definierar routes för produkter och validerar med Joi.
module.exports = (server) => {
    server.route([
        {
            method: "GET",
            path: "/api/products",
            handler: productController.getAllProducts,
            options: {
                auth: 'session',
                validate: {
                    query: Joi.object({
                        // Lägger till validering på query-parametrarna för sökning, filtrering och sortering.
                        search: Joi.string().optional(),
                        category: Joi.string().valid('hudvård', 'makeup', 'verktyg').optional(),
                        sort: Joi.string().valid('name', 'stock', 'updatedAt').optional()
                    })
                }
            }
        },
        {
            method: "GET",
            path: "/api/products/{id}",
            handler: productController.getProductById,
            options: {
                auth: 'session',
                validate: {
                    params: Joi.object({
                        id: Joi.string().length(24).required()
                    })
                }
            }
        },
        {
            method: "POST",
            path: "/api/products",
            handler: productController.addProduct,
            options: {
                auth: 'session',
                validate: {
                    payload: Joi.object({
                        name: Joi.string().min(1).required(),
                        price: Joi.number().positive().required(),
                        stock: Joi.number().integer().min(0).required(),
                        description: Joi.string().allow('').optional(),
                        category: Joi.string().required(),
                        imageUrl: Joi.string().uri().optional()
                    })
                }
            }
        },
        {
            method: "PUT",
            path: "/api/products/{id}",
            handler: productController.updateProductById,
            options: {
                auth: 'session',
                validate: {
                    params: Joi.object({
                        id: Joi.string().length(24).required()
                    }),
                    payload: Joi.object({
                        name: Joi.string().min(1),
                        price: Joi.number().positive(),
                        stock: Joi.number().integer().min(0),
                        description: Joi.string().allow(''),
                        category: Joi.string(),
                        imageUrl: Joi.string().uri()
                    })
                }
            }
        },
        {
            method: "DELETE",
            path: "/api/products/{id}",
            handler: productController.deleteProductById,
            options: {
                auth: 'session',
                validate: {
                    params: Joi.object({
                        id: Joi.string().length(24).required()
                    })
                }
            }
        },
        {
            // Separat end point för att enkelt öka och minska lagersaldo.
            method: "PATCH",
            path: "/api/products/{id}/stock",
            handler: productController.updateProductStock,
            options: {
                auth: 'session',
                validate: {
                    params: Joi.object({
                        id: Joi.string().length(24).required()
                    }),
                    payload: Joi.object({
                        amount: Joi.number().integer().required() // positiv = öka, negativ = minska
                    })
                }
            }
        }
    ])

}