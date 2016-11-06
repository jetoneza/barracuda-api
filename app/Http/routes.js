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
Route.get('/user/kaha', 'UsersController.getUserKaha').middleware('auth')
Route.get('/user/statistics', 'UsersController.getUserStatistics').middleware('auth')
Route.get('/user/dataset', 'UsersController.dataset').middleware('auth')

/*
 |--------------------------------------------------------------------------
 | Transaction routes
 |--------------------------------------------------------------------------
 */
Route.get('/transactions', 'TransactionsController.list').middleware('auth')
Route.post('/transactions', 'TransactionsController.store').middleware('auth')
Route.put('/transactions/:id', 'TransactionsController.update').middleware('auth')
Route.delete('/transactions/:id', 'TransactionsController.delete').middleware('auth')
Route.post('/transactions/:id/confirm', 'TransactionsController.confirm').middleware('auth')
Route.get('/transactions/types', 'TransactionsController.getTypes').middleware('auth')

/*
 |--------------------------------------------------------------------------
 | Sample test route
 |--------------------------------------------------------------------------
 */
Route.get('/test', 'TestController.index')
