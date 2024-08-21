// tests/setup.js - General setup file for database seeding and cleaning

const db = require('../db');

async function seedData() {
  // Drop and recreate tables to ensure a clean state
  await db.query(`
    DROP TABLE IF EXISTS companies_industries;
    DROP TABLE IF EXISTS industries;
    DROP TABLE IF EXISTS invoices;
    DROP TABLE IF EXISTS companies;

    CREATE TABLE companies (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );

    CREATE TABLE invoices (
      id SERIAL PRIMARY KEY,
      comp_code TEXT NOT NULL REFERENCES companies ON DELETE CASCADE,
      amt FLOAT NOT NULL,
      paid BOOLEAN DEFAULT false NOT NULL,
      add_date DATE DEFAULT CURRENT_DATE NOT NULL,
      paid_date DATE,
      CONSTRAINT invoices_amt_check CHECK (amt > 0)
    );

    CREATE TABLE industries (
      code TEXT PRIMARY KEY,
      industry TEXT NOT NULL
    );

    CREATE TABLE companies_industries (
      comp_code TEXT REFERENCES companies(code) ON DELETE CASCADE,
      industry_code TEXT REFERENCES industries(code) ON DELETE CASCADE,
      PRIMARY KEY (comp_code, industry_code)
    );
  `);

  // Insert initial test data
  await db.query(`INSERT INTO companies (code, name, description)
                  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
                         ('ibm', 'IBM', 'Big blue.')`);

  await db.query(`INSERT INTO invoices (comp_code, amt, paid, paid_date)
                  VALUES ('apple', 100, false, null),
                         ('apple', 200, false, null),
                         ('ibm', 400, false, null)`);

  await db.query(`INSERT INTO industries (code, industry)
                  VALUES ('tech', 'Technology'),
                         ('fin', 'Finance'),
                         ('acct', 'Accounting')`);

  await db.query(`INSERT INTO companies_industries (comp_code, industry_code)
                  VALUES ('apple', 'tech'),
                         ('ibm', 'acct')`);
}

module.exports = { seedData };

