'use strict';

/**
 * Standard response for successful HTTP requests. The actual response will depend
 * on the request method used. In a GET request, the response will contain an entity
 * corresponding to the requested resource. In a POST request the response will contain
 * an entity describing or containing the result of the action
 */
const STATUS_OK = 200;

/**
 * Permanent Redirect
 */
const STATUS_MOVED_PERMANENTLY = 301;

/**
 * Temporary Redirect
 */
const STATUS_MOVED_TEMPORARILY = 302;

/**
 * The request could not be understood by the server due to malformed syntax.
 * The client SHOULD NOT repeat the request without modifications
 */
const STATUS_BAD_REQUEST = 400;

/**
 * Similar to 403 Forbidden, but specifically for use when authentication is possible
 * but has failed or not yet been provided.[2] The response must include a WWW-Authenticate
 * header field containing a challenge applicable to the requested resource.
 */
const STATUS_UNAUTHORIZED = 401;

/**
 * The request was a legal request, but the server is refusing to respond to it.
 * Unlike a 401 Unauthorized response, authenticating will make no difference.
 */
const STATUS_FORBIDDEN = 403;

/**
 * The requested resource could not be found but may be available again in the future.
 * Subsequent requests by the client are permissible.
 */
const STATUS_NOT_FOUND = 404;

/**
 * A request was made of a resource using a request method not supported by that resource;
 * for example, using GET on a form which requires data to be presented via POST, or
 * using PUT on a read-only resource.
 */
const STATUS_METHOD_NOT_ALLOWED = 405;

/**
 * The request could not be completed due to a conflict with the current state of the resource.
 * This code is only allowed in situations where it is expected that the user might be able
 * to resolve the conflict and resubmit the request.
 */
const STATUS_CONFLICT = 409;

/**
 * A generic error message, given when no more specific message is suitable.
 */
const STATUS_INTERNAL_SERVER_ERROR = 500;

/**
 * The 429 status code indicates that the user has sent too many
 * requests in a given amount of time ("rate limiting").
 */
const STATUS_TOO_MANY_REQUESTS = 429;

/**
 * Exports everything
 */
module.exports = {
  STATUS_OK,
  STATUS_MOVED_PERMANENTLY,
  STATUS_MOVED_TEMPORARILY,
  STATUS_BAD_REQUEST,
  STATUS_UNAUTHORIZED,
  STATUS_FORBIDDEN,
  STATUS_NOT_FOUND,
  STATUS_METHOD_NOT_ALLOWED,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_TOO_MANY_REQUESTS
}

