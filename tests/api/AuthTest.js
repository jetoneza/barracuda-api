'use strict'

use('co-mocha')
const expect = use('chai').expect
const request = use('supertest')
const Server = use('Adonis/Src/Server').getInstance()

describe('POST /auth/access-token', () => {

  it("should return status code 404 for inexistent users", function(done) {
    request(Server)
    .post('/auth/access-token')
    .send({
      username: 'thisuserdoesnotexist',
      password: 'mypassword'
    })
    .expect(404, done)
  })

  it("should return status code 401 for invalid credentials", function(done) {
    request(Server)
    .post('/auth/access-token')
    .send({
      username: 'testinguser',
      password: '12345678'
    })
    .expect(401, done)
  })

  it("should return status code 200 for logged in users", function(done) {
    request(Server)
    .post('/auth/access-token')
    .send({
      username: 'testinguser',
      password: '123456789'
    })
    .expect(res => {
      expect(res.body).to.have.deep.property('token')
      expect(res.body).to.have.deep.property('user')
    })
    .expect(200, done)
  })
})

