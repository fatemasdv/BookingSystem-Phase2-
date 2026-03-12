require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000; // Fixed typo: process.env.PORT
const path = require('path');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');

// --- Middleware ---
app.use(express.json()); 

const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// --- Views ---
app.get("/", (req, res) => res.sendFile(path.join(publicDir, "index.html")));
app.get('/resources', (req, res) => res.sendFile(path.join(publicDir, 'resources.html')));

// --- Postgres connection ---
const pool = new Pool({});

// --- 1. FIXED: Comprehensive Validation Rules ---
const resourceValidators = [
  body('action').trim().equals('create').withMessage("Action must be 'create'"),
  
  body('resourceName')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 5, max: 30 }).withMessage('Name must be 5-30 characters')
    .escape(), // Prevents XSS/Script injection

  body('resourceDescription')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 50 }).withMessage('Description must be 10-50 characters')
    .escape(),

  body('resourceAvailable')
    .isBoolean().withMessage('Availability must be true or false')
    .toBoolean(),

  body('resourcePrice')
    .isFloat({ min: 0 }).withMessage('Price cannot be negative')
    .toFloat(),

  body('resourcePriceUnit')
    .trim()
    .isIn(['hour', 'day', 'week', 'month']).withMessage('Invalid price unit')
];

// POST /api/resources
app.post('/api/resources', resourceValidators, async (req, res) => {
  
  // --- 2. FIXED: Check for Validation Errors ---
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.array().map(e => ({ field: e.path, msg: e.msg })),
    });
  }

  const {
    resourceName,
    resourceDescription,
    resourceAvailable,
    resourcePrice,
    resourcePriceUnit
  } = req.body;

  try {
    // --- 3. FIXED: Correct Functional Logic ---
    // We use parameterized queries ($1, $2...) to prevent SQL Injection
    const insertSql = `
      INSERT INTO resources (name, description, available, price, price_unit)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, available, price, price_unit, created_at
    `;
    
    const params = [
      resourceName,           // Corrected: No hardcoded values
      resourceDescription,
      resourceAvailable, 
      resourcePrice,          
      resourcePriceUnit
    ];

    const { rows } = await pool.query(insertSql, params);
    
    // Success response
    return res.status(201).json({ ok: true, data: rows[0] });

  } catch (err) {
    console.error('Database Error:', err.message);
    return res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});