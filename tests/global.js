const shelljs = use('shelljs')

before(function () {
  shelljs.exec('./ace migration:run', { silent: true })
  shelljs.exec('./ace db:seed', { silent: true })
})

after(function () {
  shelljs.exec('./ace migration:reset', { silent: true })
})
