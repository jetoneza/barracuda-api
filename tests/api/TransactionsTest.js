use('co-mocha')
const expect = use('chai').expect
const request = use('supertest')
const Server = use('Adonis/Src/Server').getInstance()

describe("Testing transactions routes.", () => {
  context("POST /transactions", () => {
    it("should return a status 200", function (done) {
      request(Server)
        .post('/transactions')
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
        .send({
          userId: 1,
          typeId: 4,
          amount: 100,
        })
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response.errors[0].message).to.equal('Insufficient balance.')
        })
        .expect(400, done)
    });
  })
})


