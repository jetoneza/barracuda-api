'use strict'

const Lucid = use('Lucid')

class TransactionType extends Lucid {

}

TransactionType.TYPE_INFLOW = 'inflow'
TransactionType.TYPE_OUTFLOW = 'outflow'

module.exports = TransactionType
