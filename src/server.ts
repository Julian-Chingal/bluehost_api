import express from "express";

// Create a new express application instance
const app: express.Application = express();

// Config
app.use(express.json());

// Middleware

// Routes
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello World!");
}
);

export default app; 