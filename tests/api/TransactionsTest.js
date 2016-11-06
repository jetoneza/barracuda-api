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
          amount: 500,
        })
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response).to.have.deep.property('amount')
          expect(response).to.have.deep.property('user')
          expect(response).to.have.deep.property('id')
        })
        .expect(200, done)
    });
  })

  context("PUT /transactions/:id", () => {
    it("should return a status 200", function (done) {
      request(Server)
        .put('/transactions/5')
        .set('Authorization', `Bearer abcdefg123`)
        .send({
          userId: 1,
          typeId: 1,
          amount: 5,
        })
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
        })
        .expect(200, done)
    });

    it("should return a status 400", function (done) {
      request(Server)
        .put('/transactions/1')
        .set('Authorization', `Bearer abcdefg123`)
        .send({
          userId: 1,
          typeId: 1,
          amount: 5,
        })
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
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

  context("GET /transactions/dataset", () => {
    it("should return a status 200", function (done) {
      request(Server)
        .get('/transactions/dataset')
        .set('Authorization', `Bearer abcdefg123`)
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response).to.be.array
          expect(response.length).to.not.equal(0)
          expect(response.length).to.equal(12)
          expect(response[0]).to.have.deep.property('amount')
          expect(response[0]).to.have.deep.property('start')
          expect(response[0]).to.have.deep.property('end')
          expect(response[0]).to.have.deep.property('month')
        })
        .expect(200, done)
    });
  })

  context("POST /transactions/:id/confirm", () => {
    it("should return a status 200", function (done) {
      request(Server)
        .post('/transactions/6/confirm')
        .set('Authorization', `Bearer abcdefg123`)
        .send({})
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
        })
        .expect(200, done)
    });

    it("should return a status 400", function (done) {
      request(Server)
        .post('/transactions/7/confirm')
        .set('Authorization', `Bearer abcdefg123`)
        .send({})
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response.errors[0].message).to.equal('Insufficient balance.')
        })
        .expect(400, done)
    });

    it("should return a status 400", function (done) {
      request(Server)
        .post('/transactions/1/confirm')
        .set('Authorization', `Bearer abcdefg123`)
        .send({})
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response.errors[0].message).to.equal('Transaction is already confirmed.')
        })
        .expect(400, done)
    });
  })

  context("DELETE /transactions/:id", () => {
    it("should return a status 200", function (done) {
      request(Server)
        .delete('/transactions/7')
        .set('Authorization', `Bearer abcdefg123`)
        .send({})
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
        })
        .expect(200, done)
    });

    it("should return a status 400", function (done) {
      request(Server)
        .delete('/transactions/1')
        .set('Authorization', `Bearer abcdefg123`)
        .send({})
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response.errors[0].message).to.equal('You can not delete confirmed transaction.')
        })
        .expect(400, done)
    });
  })
})


