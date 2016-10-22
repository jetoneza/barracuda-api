'use strict'

/*
 |--------------------------------------------------------------------------
 | Test Setup
 |--------------------------------------------------------------------------
 |
 */

const Mocha = require('mocha')
const fs = require('fs')
const app = require('./app')
const fold = require('adonis-fold')
const path = require('path')
const packageFile = path.join(__dirname, '../package.json')
require('./extend')

module.exports = function (callback) {
  fold.Registrar
    .register(app.providers)
    .then(() => {
      /*
       |--------------------------------------------------------------------------
       | Register Aliases
       |--------------------------------------------------------------------------
       |
       | After registering all the providers, we need to setup aliases so that
       | providers can be referenced with short sweet names.
       |
       */
      fold.Ioc.aliases(app.aliases)

      /*
       |--------------------------------------------------------------------------
       | Register Package File
       |--------------------------------------------------------------------------
       |
       | Adonis application package.json file has the reference to the autoload
       | directory. Here we register the package file with the Helpers provider
       | to setup autoloading.
       |
       */
      const Helpers = use('Helpers')
      const Env = use('Env')

      Helpers.load(packageFile, fold.Ioc)

      require('./events')

      use(Helpers.makeNameSpace('Http', 'kernel'))
      use(Helpers.makeNameSpace('Http', 'routes'))

      // Instantiate a Mocha instance.
      let mocha = new Mocha({
        useColors: true,
        timeout: 10000
      })

      let dirPath = `../tests${typeof process.argv[2] === 'undefined' ? '' : `/${process.argv[2]}`}`
      let testDir = path.join(__dirname, dirPath)

      let walkFiles = function (dir) {
        if (fs.statSync(dir).isFile()) {
          mocha.addFile(dir);
          return
        }

        fs.readdirSync(dir).filter(function (file) {
          let filePath = `${dir}/${file}`
          if (fs.statSync(filePath).isDirectory()) {
            walkFiles(filePath)
            return false
          }

          // Only keep the .js files
          return file.substr(-3) === '.js'

        }).forEach(function (file) {
          mocha.addFile(
            path.join(dir, file)
          );
        });
      };

      // Add each .js file to the mocha instance
      walkFiles(testDir);

      // HTTP Server
      const Server = use('Adonis/Src/Server')
      Server.listen(Env.get('HOST'), Env.get('PORT'))
      if (typeof (callback) === 'function') {
        callback()
      }

      // Run the tests.
      let runner = mocha.run(function (failures) {
        process.on('exit', function () {
          process.exit(failures);  // exit with non-zero status if there were failures
        });
      });

      // Terminate Database connection and Web Server
      runner.on('end', function () {
        let Database = use('Database')
        Database.close()
        Server.close()
      })
    }).catch((error) => console.error(error.stack))
}

