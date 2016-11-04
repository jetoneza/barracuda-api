'use strict'

const Encryption = use('Encryption')
const Hash = use('Hash')
const randomString = use('randomstring')
const User = use('App/Model/User')
const UserProperty = use('App/Model/UserProperty')
const Kaha = use('App/Model/Kaha')
const Token = use('App/Model/Token')
const Transaction = use('App/Model/Transaction')

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
    kaha.amount = 10988

    yield kaha.save()

    let token = new Token();
    token.user_id = user.id
    token.token = 'abcdefg123'
    token.forever = true

    yield token.save()

    // Create transactions for user
    const transactions = [
      {
        typeId: 1,
        amount: 10000,
      },
      {
        typeId: 1,
        amount: 8000,
      },
      {
        typeId: 3,
        amount: 7512,
      },
      {
        typeId: 2,
        amount: 500,
      },
    ];
    let transaction;
    for(let txn of transactions) {
      transaction = new Transaction()
      transaction.typeId = txn.typeId
      transaction.amount = txn.amount
      transaction.userId = user.id
      transaction.kahaId = kaha.id
      transaction.confirmed = true

      yield transaction.save()
    }
  }

}

module.exports = UserSeeder
