import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import connectDB from './config/db.js';
import User from './models/User.js';
import fetch from 'node-fetch'; // If using Node.js <18, install: npm i node-fetch
import dotenv from 'dotenv';
dotenv.config();




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const SECRET = process.env.SECRET || 'tB87#kPtkxqOS2';
const API_URL = process.env.API_URL || 'https://wos-giftcode-api.centurygame.com/api/player';
const allowedHost = process.env.ALLOWED_HOST || "";
const tokens = {};

await connectDB();

app.use(express.json());
app.use(cookieParser());

function isValidToken(token) {
  return tokens[token] && tokens[token].expiry > Date.now();
}

// 🧠 Vite build output directory
// dev const clientDist = path.resolve(__dirname, '..', '..', 'wos-interactive-map-front', 'dist');
const clientDist = path.resolve(__dirname, '..', 'public');


// 📁 Serve static assets (from Vite)
app.use(express.static(clientDist));

// ✅ API Routes
import buildingsRouter from './routes/buildings.js';
import guildsRouter from './routes/guilds.js';
import userRouter from './routes/user.js';

app.use('/api/buildings', buildingsRouter);
app.use('/api/guilds', guildsRouter);
app.use('/api/users', userRouter);

// 🔐 Middleware for auth (for protected API routes)
app.use((req, res, next) => {
  const publicRoutes = ['/validate-id'];

  const host = req.headers.host;

  if (!host || !host.includes(allowedHost)) {
      const redirectUrl = `http://${allowedHost}${req.url}`;
      return res.redirect(301, redirectUrl);
  }

  if (
    publicRoutes.includes(req.path) ||
    req.path.startsWith('/assets/') ||
    req.path.match(/\.(js|css|png|jpg|svg|json|woff2?)$/)
  ) return next();

  let authToken = req.cookies['authToken'];

  if (!authToken && req.headers.authorization?.startsWith('Bearer ')) {
    authToken = req.headers.authorization.split(' ')[1];
  }

  if (!authToken || !isValidToken(authToken)) {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ success: false, message: 'Invalid or missing token.' });
    }
  }

  next();
});

// 🎮 Validate ID
async function validateWithWhiteoutAPI(id) {
  const time = Date.now();
  const form = `fid=${id}&time=${time}`;
  const sign = crypto.createHash('md5').update(form + SECRET).digest('hex');
  const body = `sign=${sign}&${form}`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  return response.json();
}

app.post('/validate-id', async (req, res) => {
  const { id } = req.body;

  try {
    const apiResponse = await validateWithWhiteoutAPI(id);

    if (apiResponse.code === 0 && apiResponse.msg === 'success') {
      const token = crypto.randomBytes(16).toString('hex');
      tokens[token] = { valid: true, expiry: Date.now() + 3600000 };

      let user = await User.findOne({ id: apiResponse.data.fid });
      if (!user) {
        user = new User({
          id: apiResponse.data.fid,
          kid : apiResponse.data.kid,
          nom: apiResponse.data.nickname,
          lvl: apiResponse.data.stove_lv,
          avatar: apiResponse.data.avatar_image,
          lvl_content: apiResponse.data.stove_lv_content,
        });
      } else {
        user.nom = apiResponse.data.nickname;
        user.lvl = apiResponse.data.stove_lv;
        user.kid = apiResponse.data.kid;
        user.avatar = apiResponse.data.avatar_image;
        user.lvl_content = apiResponse.data.stove_lv_content;
      }

      await user.save();

      return res.json({ success: true, token, playerData: apiResponse.data });
    }

    return res.status(400).json({ success: false, message: apiResponse.msg || 'Invalid ID' });
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// 🧠 React SPA: serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
