const userController = require('../controllers/userController');
const Joi = require('joi');

// Definierar routes för användare och validerar med Joi.
module.exports = (server) => {
    server.route([
        {
            method: "GET",
            path: "/api/users",
            handler: userController.getAllUsers,
            options: {
                auth: 'session' // kräver inloggning
            }
        },
        {
            method: "GET",
            path: "/api/users/{id}",
            handler: userController.getUserById,
            options: {
                auth: 'session', // kräver inloggning
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
                auth: 'session', // kräver inloggning
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
                auth: 'session', // kräver inloggning
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
                auth: 'session', // kräver inloggning
                validate: {
                    params: Joi.object({
                        id: Joi.string().length(24).required()
                    })
                }
            }
        },
        {
            // Route för användarregistrering
            method: "POST",
            path: "/api/register",
            handler: userController.registerUser,
            options: {
                auth: false, // ingen auth behövs för att registrera sig
                validate: {
                    payload: Joi.object({
                        name: Joi.string().min(2).required(),
                        email: Joi.string().email().required(),
                        phone: Joi.string().required(),
                        department: Joi.string().required(),
                        password: Joi.string().min(8).required()
                    })
                }
            }
        },
        {
            // Route för användarinloggning
            method: "POST",
            path: "/api/login",
            handler: userController.loginUser,
            options: {
                auth: false, // ingen auth behövs för att logga in
                validate: {
                    payload: Joi.object({
                        email: Joi.string().email().required(),
                        password: Joi.string().required()
                    })
                }
            }
        },
        {
            // Route för att logga ut en användare
            method: "POST",
            path: "/api/logout",
            handler: userController.logoutUser,
            options: {
                auth: 'session' // användaren måste vara inloggad för att logga ut
            }
        },
        {
            // Nyckel till frontend för att hämta info om inloggad användare
            method: "GET",
            path: "/api/me",
            handler: userController.getMe,
            options: {
                auth: 'session'
            }
        }
    ])
}