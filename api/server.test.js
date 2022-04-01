const db = require('../data/dbConfig');
const server = require('./server');
const request = require('supertest');

const Users = require("./users/users-model.js")


beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db('users').truncate();
});
afterAll(async () => {
  await db.destroy();
});


// Write your tests here
test('sanity', () => {
  expect(1).toBe(1)
})


test('[POST] /register exists', async () => {
  const res = await request(server).post('/api/auth/register').send({username: "leila", password: "nunya"})
  expect(res.status).toBe(201)
})

test('[POST] /register assigns id', async () => {
  const res = await request(server).post('/api/auth/register').send({username: "leila", password: "nunya"})
   expect(res.body).toHaveProperty('id', 1)
})

test('[POST] /login requires username and password', async () => {
  const res = await request(server).post('/api/auth/login').send({username: "leila"})
  expect(res.status).toBe(400)
  expect(res.body.message).toBe("username and password required")
  const createUser = await request(server).post('/api/auth/register').send({username: "leila", password: "nunya"})
  const correctRes = await request(server).post('/api/auth/login').send({username: "leila", password: "nunya"})
  expect(correctRes.status).toBe(200)
})

test('[POST] /login returns token', async () => {
  const createUser = await request(server).post('/api/auth/register').send({username: "leila", password: "nunya"})
  const login = await request(server).post('/api/auth/login').send({username: "leila", password: "nunya"})
  expect(login.body).toHaveProperty('token')
})