'use strict';

const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const Cookie = require('@hapi/cookie');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();

const init = async () => {
  // Render sätter automatiskt RENDER=true
  const isProduction = process.env.RENDER === 'true' || process.env.NODE_ENV === 'production';

  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: [
          'http://localhost:5173'
        ],
        credentials: true
      }
    }
  });

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await server.register(Cookie);

    server.auth.strategy('session', 'cookie', {
      cookie: {
        name: 'nordicskin-session',
        password: process.env.COOKIE_PASSWORD,
        isSecure: isProduction,              // true på Render
        isHttpOnly: true,
        isSameSite: isProduction ? 'None' : 'Lax',
        clearInvalid: true,
        strictHeader: true,
        encoding: 'iron',
        path: '/'
      },
      redirectTo: false,
      validate: async (request, session) => {
        if (!session.id) return { isValid: false };
        return { isValid: true, credentials: session };
      }
    });

    server.auth.default('session');

    userRoutes(server);
    productRoutes(server);

    server.route({
      method: 'GET',
      path: '/',
      handler: () =>
        `<h1>Välkommen till mitt REST-API!</h1>
        <p>Se README.md för information om webbtjänsten och endpoints.</p>`,
      options: {
        auth: false
      }
    });

    await server.start();
    console.log(`Server running on ${server.info.uri} (Production: ${isProduction})`);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Hantera unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();