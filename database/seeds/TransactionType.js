'use strict'

const TransactionType = use('App/Model/TransactionType')

class TransactionTypeSeeder {

  * run () {
    const types = [
      {
        name: 'Salary',
        type: 'inflow'
      },
      {
        name: 'Payable',
        type: 'outflow'
      },
      {
        name: 'Spend',
        type: 'outflow'
      },
      {
        name: 'Donation',
        type: 'inflow'
      },
      {
        name: 'Offering',
        type: 'outflow'
      },
    ];
    let transactionType;
    for(let type of types) {
      transactionType = new TransactionType()
      transactionType.name = type.name
      transactionType.type = type.type

      yield transactionType.save()
    }
  }

}

module.exports = TransactionTypeSeeder
