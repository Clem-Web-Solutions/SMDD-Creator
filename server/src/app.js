import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check for root
app.get('/', (req, res) => {
    res.send('API Server is running 🚀');
});

// Routes
app.use('/api', routes);

export default app;
