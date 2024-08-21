// tests/companies.test.js

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

describe("GET /companies/:code", function () {
  test("It should respond with company details including associated industries", async function () {
    const response = await request(app).get('/companies/apple');
    expect(response.statusCode).toBe(200);
    expect(response.body.company).toEqual({
      code: 'apple',
      name: 'Apple Computer',
      description: 'Maker of OSX.',
      invoices: [expect.any(Number), expect.any(Number)],
      industries: ['Technology']
    });
  });
});
