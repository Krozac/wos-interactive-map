import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware for JSON parsing
app.use(express.json());

// MongoDB connection URI
const mongoURI = process.env.MONGO_URI; 


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Mock database for tokens
const tokens = {};

// API configuration
const SECRET = 'tB87#kPtkxqOS2';
const API_URL = 'https://wos-giftcode-api.centurygame.com/api/player';

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser()); 

function isValidToken(token) {
    return tokens[token] && tokens[token].expiry > Date.now();
}

// Middleware for token validation
app.use((req, res, next) => {
    const publicRoutes = ['/', '/login', '/validate-id', '/map'];

    const allowedHost = process.env.ALLOWED_HOST;
    const host = req.headers.host;

    if (!host || !host.includes(allowedHost)) {
        const redirectUrl = `http://${allowedHost}${req.url}`;
        return res.redirect(301, redirectUrl);
    }

    const isPublic = publicRoutes.includes(req.path) 
        || req.path.startsWith('/static/')
        || req.path.startsWith('/libs/')
        || req.path.match(/\.(js|css|png|jpg|json)$/);

    if (isPublic) return next();

    let authToken = req.cookies['authToken'];

    // Fallback to Authorization header
    if (!authToken && req.headers.authorization?.startsWith('Bearer ')) {
        authToken = req.headers.authorization.split(' ')[1];
    }

    if (!authToken || !isValidToken(authToken)) {
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({ success: false, message: 'Invalid or missing token.' });
        }
        return res.redirect('/login');
    }

    next();
});

// Routes
import buildingsRouter from './routes/buildings.js';
import guildsRouter from './routes/guilds.js';
import userRouter from './routes/user.js';

app.use('/api/buildings', buildingsRouter);
app.use('/api/guilds', guildsRouter);
app.use('/api/users', userRouter);

// Serve login page
app.get('/login', (req, res) => {
    const authToken = req.cookies['authToken'];
    if (isValidToken(authToken)) {
        res.redirect('/map');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
});

// Serve map page (protected)
app.get('/map', (req, res) => {
    const authToken = req.cookies['authToken'];
    if (isValidToken(authToken)) {
        res.sendFile(path.join(__dirname, 'public', 'map.html'));
    } else {
        res.redirect('/login');
    }
});

// Validate ID API
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

import User from './models/User.js';

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
                    nom: apiResponse.data.nickname, 
                    lvl: apiResponse.data.stove_lv, 
                    avatar: apiResponse.data.avatar_image 
                });
                await user.save();
            } else {
                user.nom = apiResponse.data.nickname;
                user.lvl = apiResponse.data.stove_lv;
                user.avatar = apiResponse.data.avatar_image;
                user.lvl_content = apiResponse.data.stove_lv_content;
                await user.save();
            }
            
            return res.json({ success: true, token, playerData: apiResponse.data });
        }

        return res.status(400).json({ success: false, message: apiResponse.msg || 'ID invalid' });
    } catch (error) {
        console.error('Validation error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    const authToken = req.cookies['authToken'];
    if (isValidToken(authToken)) {
        res.redirect('/map');
    } else {
        res.redirect('/login');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
