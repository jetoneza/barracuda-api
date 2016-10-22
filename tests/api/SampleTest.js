use('co-mocha')
const expect = use('chai').expect
const request = use('supertest')
const Server = use('Adonis/Src/Server').getInstance()

describe("GET /test", () => {
  context("Sample test route", () => {
    it("should return a status 200", function (done) {
      request(Server)
        .get('/test')
        .expect(res => {
          const response = res.body
          expect(response).to.be.not.null
          expect(response.success).to.equal(true)
          expect(response.message).to.equal('Testing is a success!')
        })
        .expect(200, done)
    });
  })
})

