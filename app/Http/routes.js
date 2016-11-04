'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.on('/').render('welcome')

/*
 |--------------------------------------------------------------------------
 | Auth routes
 |--------------------------------------------------------------------------
 */
Route.post('/auth/access-token', 'AuthController.accessToken')

/*
 |--------------------------------------------------------------------------
 | User routes
 |--------------------------------------------------------------------------
 */
Route.post('/users', 'UsersController.store')

/*
 |--------------------------------------------------------------------------
 | Transaction routes
 |--------------------------------------------------------------------------
 */
Route.get('/transactions', 'TransactionsController.list').middleware('auth')
Route.post('/transactions', 'TransactionsController.store').middleware('auth')
Route.get('/transactions/types', 'TransactionsController.getTypes').middleware('auth')

/*
 |--------------------------------------------------------------------------
 | Sample test route
 |--------------------------------------------------------------------------
 */
Route.get('/test', 'TestController.index')
