// tests/invoices.test.js

const request = require('supertest');
const app = require('../app');
const db = require('../db');
const { seedData } = require('./setup');

beforeAll(async () => {
  await seedData();
});

afterAll(async () => {
  await db.end();
});

describe("GET /invoices", function () {
  test("It should respond with an array of invoices", async function () {
    const response = await request(app).get('/invoices');
    expect(response.statusCode).toBe(200);
    expect(response.body.invoices.length).toBeGreaterThan(0);
  });
});




