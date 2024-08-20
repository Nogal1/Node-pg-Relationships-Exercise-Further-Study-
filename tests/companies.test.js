const request = require('supertest');
const app = require('../app');
const db = require('../db');

beforeAll(async () => {
  await db.query("DELETE FROM invoices");
  await db.query("DELETE FROM companies");
  await db.query(`INSERT INTO companies (code, name, description)
                  VALUES ('apple', 'Apple Computer', 'Maker of OSX.')`);
});

afterAll(async () => {
  await db.end();
});

describe("GET /companies", function () {
  test("It should respond with an array of companies", async function () {
    const response = await request(app).get('/companies');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      companies: [{ code: 'apple', name: 'Apple Computer' }]
    });
  });
});


