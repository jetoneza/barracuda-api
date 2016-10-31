'use strict'

const Encryption = use('Encryption')
const Hash = use('Hash')
const randomString = use('randomstring')
const User = use('App/Model/User')
const UserProperty = use('App/Model/UserProperty')
const Kaha = use('App/Model/Kaha')
const Token = use('App/Model/Token')

class UserSeeder {

  * run () {
    let user = new User()
    let userProperty = new UserProperty()
    let salt = Encryption.encrypt(randomString.generate(32))

    user.username = 'testinguser'
    user.email = 'testinguser@email.com'

    yield user.save()

    userProperty.userId = user.id
    userProperty.key = 'passwordHash'
    userProperty.value = yield Hash.make('123456789' + salt, 10)

    yield userProperty.save()

    userProperty = new UserProperty()
    userProperty.userId = user.id
    userProperty.key = 'passwordSalt'
    userProperty.value = salt

    yield userProperty.save()

    let kaha = new Kaha()
    kaha.userId = user.id

    yield kaha.save()

    let token = new Token();
    token.user_id = user.id
    token.token = 'abcdefg123'
    token.forever = true

    yield token.save()
  }

}

module.exports = UserSeeder
