import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import dotenv from 'dotenv'; // Import dotenv
import axios from 'axios';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: 'https://engees-login-register.vercel.app', 
  // Allow requests from your React app's origin
}));

axios.defaults.baseURL = "https://";
    axios.defaults.headers.post["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});
const User = mongoose.model('User', userSchema);

app.post(
  '/api/register',
  [
    check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }


    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

function authenticateToken(req, res, next) {
  // console.log(req.headers)
  let token=null;

  const authHeader = req.headers['authorization'];
  if(authHeader)
     token = authHeader;
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    // console.log(user);
    req.user = user;
    next();
  });
}

app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    // Find the user based on the user ID from the token
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return a subset of user information (excluding sensitive data)
    const profileData = {
      username: user.username,
      // Add other non-sensitive user fields as needed
    };

    res.json({ profileData });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
    res.send("hello world")
});

const PORT = process.env.PORT || 3001 ;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
