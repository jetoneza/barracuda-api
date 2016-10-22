'use strict'

const Encryption = use('Encryption')
const Hash = use('Hash')
const randomString = use('randomstring')
const User = use('App/Model/User')
const UserProperty = use('App/Model/UserProperty')

/*
|--------------------------------------------------------------------------
| Database Seeder
|--------------------------------------------------------------------------
| Database Seeder can be used to seed dummy data to your application
| database. Here you can make use of Factories to create records.
|
| make use of Ace to generate a new seed
|   ./ace make:seed [name]
|
*/

// const Factory = use('Factory')

class DatabaseSeeder {

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
  }

}

module.exports = DatabaseSeeder
