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

describe("POST /industries", function () {
  test("It should add a new industry", async function () {
    const response = await request(app)
      .post('/industries')
      .send({ code: 'med', industry: 'Medical' });

    expect(response.statusCode).toBe(201);
    expect(response.body.industry).toEqual({
      code: 'med',
      industry: 'Medical'
    });
  });
});

describe("GET /industries", function () {
  test("It should list all industries with associated companies", async function () {
    const response = await request(app).get('/industries');
    expect(response.statusCode).toBe(200);
    expect(response.body.industries.length).toBeGreaterThan(0);
  });
});

describe("POST /industries/:code/companies/:companyCode", function () {
  test("It should associate an industry with a company", async function () {
    const response = await request(app)
      .post('/industries/tech/companies/ibm');

    expect(response.statusCode).toBe(201);
    expect(response.body.association).toEqual({
      industry_code: 'tech',
      comp_code: 'ibm'
    });
  });
});
