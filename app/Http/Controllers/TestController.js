'use strict'

class TestController {
  * index(request, response) {
    response.json({
      success: true,
      message: 'Testing is a success!'
    })
  }
}

module.exports = TestController
