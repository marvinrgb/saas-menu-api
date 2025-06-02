import express, { json as parseRequestJSON, urlencoded as parseURLQuery } from 'express';
import { errorHandler } from './middleware/error-handler.js';
import RouteManager from './routes/router-manager.js';
import { setupSwagger } from './config/swagger.js';
// if there a env set use it as port, if not use 3000
const port = process.env.API_PORT ? Number(process.env.API_PORT) : 3000;
const app = express();
// remove express header
app.disable('x-powered-by');
// parse requestbody if in json (= make it usable)
app.use(parseRequestJSON());
// the same but for the query parameters
app.use(parseURLQuery({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});
// Setup Swagger UI documentation
setupSwagger(app);
// forwards all requests under /api to the routeManager, wich distributes them further
app.use('/api', RouteManager);
// Global error handling
app.use(errorHandler);
// starts the server under the specified port
app.listen(port, () => {
    console.log(`API server running on port ${port}`);
    console.log(`API documentation available at http://localhost:${port}/api-docs`);
});
//# sourceMappingURL=main.js.map