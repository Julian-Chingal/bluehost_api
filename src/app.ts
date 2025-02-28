import { GlobalErrors, unknowEndpoint } from './middlewares';
import { swaggerInit, config } from './config';
import express from 'express';
import router from './routes';
import cors from 'cors'

// Create a new express application instance
const app: express.Application = express();

// Config
app.use(express.json());
app.set('port', config.PORT)
app.disable('x-powered-by')
swaggerInit(app)

// Middleware
app.use(cors({
  origin: '*', // Permitir todas las solicitudes de origen
  methods: 'GET,PUT,POST', // Asegúrate de incluir todos los métodos que necesitas
  allowedHeaders: 'Content-Type,Authorization', // Asegúrate de incluir todos los encabezados que necesitas
}));

// Routes
app.use('/palermo/api_node', router)
app.use(unknowEndpoint)
app.use(GlobalErrors)

// Return the application
export default app;