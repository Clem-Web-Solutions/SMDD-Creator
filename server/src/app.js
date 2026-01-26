import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Basic health check for root
app.get('/', (req, res) => {
    res.send('API Server is running 🚀');
});

// Routes
app.use('/api', routes);

export default app;
