const express = require('express');
const router = new express.Router();
const db = require('../db');

// POST /industries: Adds a new industry
router.post('/', async (req, res, next) => {
  try {
    const { code, industry } = req.body;
    const result = await db.query(
      `INSERT INTO industries (code, industry) 
       VALUES ($1, $2) 
       RETURNING code, industry`,
      [code, industry]
    );
    return res.status(201).json({ industry: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

// GET /industries: Lists all industries with associated companies
router.get('/', async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT i.code, i.industry, ARRAY_AGG(ci.comp_code) AS companies
       FROM industries AS i
       LEFT JOIN companies_industries AS ci ON i.code = ci.industry_code
       GROUP BY i.code`
    );
    return res.json({ industries: result.rows });
  } catch (err) {
    return next(err);
  }
});

// POST /industries/:code/companies/:companyCode: Associates an industry with a company
router.post('/:code/companies/:companyCode', async (req, res, next) => {
  try {
    const { code, companyCode } = req.params;
    const result = await db.query(
      `INSERT INTO companies_industries (industry_code, comp_code) 
       VALUES ($1, $2) 
       RETURNING industry_code, comp_code`,
      [code, companyCode]
    );
    return res.status(201).json({ association: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
