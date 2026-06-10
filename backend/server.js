require('dotenv').config(); 

const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');
const connectDB  = require('./config/db');
const contactRoutes = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 5000;

connectDB();

const allowedOrigins = [
  process.env.FRONTEND_URL,          
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (process.env.NODE_ENV === 'development') return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.set('trust proxy', 1);
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   
  max: 5,
  message: {
    success: false,
    message: 'Too many messages sent. Please wait 15 minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Angelin Jinto Portfolio API is running!',
    version: '1.0.0',
    endpoints: {
      health:  'GET  /',
      contact: 'POST /api/contact',
      list:    'GET  /api/contact',
      single:  'GET  /api/contact/:id',
      read:    'PATCH /api/contact/:id/read',
      delete:  'DELETE /api/contact/:id',
    },
    docs: 'See README.md for full API documentation',
  });
});

app.use('/api/contact', (req, res, next) => {
  if (req.method === 'POST') return contactLimiter(req, res, next);
  next();
});
app.use('/api/contact', contactRoutes);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error('🔥 Unhandled error:', err.message);

  if (err.message && err.message.startsWith('CORS blocked')) {
    return res.status(403).json({ success: false, message: err.message });
  }

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log('  🚀  Angelin Jinto Portfolio Backend');
  console.log(`  📡  Server running on http://localhost:${PORT}`);
  console.log(`  🌍  Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`  📬  Email       : ${process.env.EMAIL_USER || '(not configured)'}`);
  console.log('══════════════════════════════════════════════════');
  console.log('');
});
module.exports = app;