'use strict';

const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
require('dotenv').config();

const init = async () => {

    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Registrera routes här

        // Root-route för live-servern
        server.route({
            method: 'GET',
            path: '/',
            handler: () => `
                <h1>Välkommen till mitt REST-API!</h1>
                <p>Se README.md för information om webbtjänsten och endpoints.</p>
            `
        });

        await server.start();
        console.log('Server running on %s', server.info.uri);

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();