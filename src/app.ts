import 'dotenv/config';
import { GlobalErrors, unknowEndpoint } from './middlewares';
import { swaggerInit } from './swagger';
import { PORT } from './config';
import cookieParser from 'cookie-parser'
import express from 'express';
import router from './routes';
import cors from 'cors'
import morgan from 'morgan'

// Create a new express application instance
const app: express.Application = express();

// Config
app.use(express.json());
app.use(cookieParser())
app.set('port', PORT)
app.disable('x-powered-by')
swaggerInit(app)

// Middleware
app.use(morgan('dev'))
app.use(cors({
  origin: '*', // Permitir todas las solicitudes de origen
  methods: 'GET,PUT,POST', // Asegúrate de incluir todos los métodos que necesitas
  allowedHeaders: 'Content-Type,Authorization', // Asegúrate de incluir todos los encabezados que necesitas
}));

// Routes
app.use('/palermo/api', router)
app.use(GlobalErrors)
app.use(unknowEndpoint)

// Return the application
export default app;