import { Application } from 'express';
import swaggerUi from 'swagger-ui-express'
import path from 'node:path'
import yaml from 'yamljs';

let swaggerDocument = {}
try{
    const yamlPath = path.join(__dirname, 'swagger.yaml')
    swaggerDocument = yaml.load(yamlPath)
} catch (error) {
    swaggerDocument = {
        openapi: "3.0.0",
        info: {
          title: "API Documentation",
          version: "1.0.0",
          description: "No se pudo cargar el archivo Swagger YAML. Revisa los logs para más detalles.",
        },
        paths: {},
      };
    console.log('Error loading swagger file', error)
}

export const swaggerInit = (app: Application) => {
    const swaggerOptions = {
        customSiteTitle: "Documentación API Palermo",
        customCss: ".swagger-ui .topbar { background-color: #2a2a2a; }", // Opcional: personaliza el estilo
        customfavIcon: "/favicon.ico", // Opcional: cambia el favicon
      };
    app.use('/palermo/api_node/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions))
}