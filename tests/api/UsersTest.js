use('co-mocha')
const expect = use('chai').expect
const request = use('supertest')
const Server = use('Adonis/Src/Server').getInstance()

describe("Testing users routes.", () => {
  context("POST /users", () => {
    it("should return a status 200", function (done) {
      request(Server)
        .post('/users')
        .send({
          username: `test${Date.now()}`,
          email: `test${Date.now()}@email.com`,
          password: '123456789',
          confirmPassword: '123456789'
        })
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response).to.have.deep.property('token')
          expect(response).to.have.deep.property('user')
        })
        .expect(200, done)
    });

    it("should return a status 400", function (done) {
      request(Server)
        .post('/users')
        .send({
          email: 'testuser@email.com',
          password: 'test',
          confirmPassword: 'test'
        })
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
        })
        .expect(400, done)
    });
  })

  context("GET /user/kaha", () => {
    it("should return a status 200", function (done) {
      request(Server)
        .get('/user/kaha')
        .set('Authorization', `Bearer abcdefg123`)
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response).to.have.deep.property('amount')
        })
        .expect(200, done)
    });

    it("should return a status 401", function (done) {
      request(Server)
        .get('/user/kaha')
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
        })
        .expect(401, done)
    });
  })

  context("GET /user/statistics", () => {
    it("should return a status 200", function (done) {
      request(Server)
        .get('/user/statistics')
        .set('Authorization', `Bearer abcdefg123`)
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response).to.have.property('topPayin')
          expect(response).to.have.property('topPayout')
          expect(response).to.have.property('transactionsCount')
        })
        .expect(200, done)
    });

    it("should return a status 401", function (done) {
      request(Server)
        .get('/user/statistics')
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
        })
        .expect(401, done)
    });
  })
})


