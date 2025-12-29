const userController = require('../controllers/userController');
const Joi = require('joi');

// Definierar routes för användare och validerar med Joi.
module.exports = (server) => {
    server.route([
        {
            method: "GET",
            path: "/api/users",
            handler: userController.getAllUsers
        },
        {
            method: "GET",
            path: "/api/users/{id}",
            handler: userController.getUserById,
            options: {
                validate: {
                    params: Joi.object({
                        id: Joi.string().length(24).required()
                    })
                }
            }
        },
        {
            method: "POST",
            path: "/api/users",
            handler: userController.addUser,
            options: {
                validate: {
                    payload: Joi.object({
                        name: Joi.string().min(2).required(),
                        email: Joi.string().email().required(),
                        phone: Joi.string().optional(),
                        department: Joi.string().required(),
                        password: Joi.string().min(8).required()
                    })
                }
            }
        },
        {
            method: "PUT",
            path: "/api/users/{id}",
            handler: userController.updateUserById,
            options: {
                validate: {
                    params: Joi.object({
                        id: Joi.string().length(24).required()
                    }),
                    payload: Joi.object({
                        name: Joi.string().min(2),
                        email: Joi.string().email(),
                        phone: Joi.string(),
                        department: Joi.string(),
                        password: Joi.string().min(8)
                    }).min(1)
                }
            }
        },
        {
            method: "DELETE",
            path: "/api/users/{id}",
            handler: userController.deleteUserById,
            options: {
                validate: {
                    params: Joi.object({
                        id: Joi.string().length(24).required()
                    })
                }
            }
        }
    ])
}