import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setupSwagger(app: Express) {
  // Read the OpenAPI specification file
  const openApiSpec = YAML.parse(
    fs.readFileSync(path.join(__dirname, '../../openapi.yaml'), 'utf8')
  );

  // Serve Swagger UI at /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Restaurant Menu API Documentation",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      syntaxHighlight: {
        theme: 'monokai'
      }
    }
  }));

  // Add a redirect from / to /api-docs
  app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });
} 