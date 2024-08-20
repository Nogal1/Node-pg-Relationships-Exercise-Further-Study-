// tests/invoices.test.js

const request = require('supertest');
const app = require('../app');
const db = require('../db');

beforeAll(async () => {
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");
  
  // Ensure the 'apple' company exists
  await db.query(`INSERT INTO companies (code, name, description)
                  VALUES ('apple', 'Apple Computer', 'Maker of OSX.')`);
  
  // Now insert an invoice related to the 'apple' company
  await db.query(`INSERT INTO invoices (comp_code, amt) 
                  VALUES ('apple', 100)`);
});

afterAll(async () => {
  await db.end();
});

describe("GET /invoices", function () {
  test("It should respond with an array of invoices", async function () {
    const response = await request(app).get('/invoices');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      invoices: [{ id: expect.any(Number), comp_code: 'apple' }]
    });
  });
});





