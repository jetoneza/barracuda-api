use('co-mocha')
const expect = use('chai').expect
const request = use('supertest')
const Server = use('Adonis/Src/Server').getInstance()

describe("Testing transactions routes.", () => {
  context("POST /transactions", () => {
    it("should return a status 200", function (done) {
      request(Server)
        .post('/transactions')
        .set('Authorization', `Bearer abcdefg123`)
        .send({
          userId: 1,
          typeId: 1,
          amount: 5,
        })
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response).to.have.deep.property('amount')
          expect(response).to.have.deep.property('user')
          expect(response).to.have.deep.property('kaha')
          expect(response).to.have.deep.property('id')
        })
        .expect(200, done)
    });

    it("should return a status 400 with error message insufficient balance", function (done) {
      request(Server)
        .post('/transactions')
        .set('Authorization', `Bearer abcdefg123`)
        .send({
          userId: 1,
          typeId: 4,
          amount: 1000000,
        })
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response.errors[0].message).to.equal('Insufficient balance.')
        })
        .expect(400, done)
    });
  })

  context("GET /transactions/types", () => {
    it("should return a status 200", function (done) {
      request(Server)
        .get('/transactions/types')
        .set('Authorization', `Bearer abcdefg123`)
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response).to.be.array
          expect(response.length).to.not.equal(0)
        })
        .expect(200, done)
    });
  })

  context("GET /transactions", () => {
    it("should return a status 200", function (done) {
      request(Server)
        .get('/transactions')
        .set('Authorization', `Bearer abcdefg123`)
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response).to.be.array
          expect(response.length).to.not.equal(0)
          expect(response.data.length).to.not.equal(0)
        })
        .expect(200, done)
    });
    it("should return a status 200 and get 2 data", function (done) {
      request(Server)
        .get('/transactions?page=1&pageSize=2')
        .set('Authorization', `Bearer abcdefg123`)
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response).to.be.array
          expect(response.length).to.not.equal(0)
          expect(response.data.length).to.equal(2)
        })
        .expect(200, done)
    });
  })
})


