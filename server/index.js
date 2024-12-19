const express = require('express');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const session = require('express-session');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: true }));

// Google OAuth2 Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const ALLOWED_USERS = [process.env.ALLOWED_USER_1, process.env.ALLOWED_USER_2];

passport.use(new Strategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3001/auth/google/callback'
}, (token, tokenSecret, profile, done) => {
  if (ALLOWED_USERS.includes(profile.emails[0].value)) {
    return done(null, profile);
  }
  return done(null, false, { message: 'Unauthorized user' });
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).send('Unauthorized');
};

// Sequelize Initialization
const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres' });
const Expense = sequelize.define('Expense', {
  name: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false }
});

sequelize.sync({ force: true }); // WARNING: Drops and recreates the table

// Google OAuth Routes
app.use(passport.initialize());
app.use(passport.session());

app.post('/auth/google', passport.authenticate('google', { scope: ['email'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/form'));

// API Endpoints
app.post('/expenses', isAuthenticated, async (req, res) => {
  const { name, date, description, amount } = req.body;
  try {
    const expense = await Expense.create({ name, date, description, amount });
    res.status(201).json(expense);
  } catch (err) {
    if (res.statusCode === 401) {

      console.log(`CORS Error: Unauthorized access attempt on route: ${req.originalUrl}`);
      return res.status(401).json({ error: err.message });
    }
    res.status(400).json({ error: err.message });
  }
});

app.get('/expenses', isAuthenticated, async (req, res) => {
  const expenses = await Expense.findAll();
  res.json(expenses);
});

app.listen(3001, () => console.log('Server running on port 3001'));
