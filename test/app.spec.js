const expect = require('chai').expect;
const supertest = require('supertest');
const app = require('../src/app');

describe('App', () => {
  it('GET / respondes with 200 and "Hello, world"', () => {
    return supertest(app)
      .get('/')
      .expect(200, "Hello, world!")
  })
})