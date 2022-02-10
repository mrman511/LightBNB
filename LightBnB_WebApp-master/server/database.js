const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'paulbodner',
  password: '12345',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  const values = [email];
  return pool.query('SELECT * FROM users WHERE email = $1;', values)
  .then(res => {
    return res.rows[0];
  })
  .catch(err => {
    console.log('ERROR: ',err);
  })

}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const values = [id];
  return pool.query('SELECT * FROM users WHERE id = $1;', values)
  .then(res => {
    return res.rows[0];
  })
  .catch(err => {
    console.log('ERROR: ',err);
  })
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const values = [user.name, user.email, user.password];
  return pool.query(`INSERT INTO users (name, email, password)
                    Values ($1, $2, $3) RETURNING *;`, values)
  .then(res => {
    return res.rows;
  })
  .catch(err => {
    console.log('ERROR: ',err);
  })
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const values = [guest_id, limit];
  return pool.query('SELECT * FROM reservations WHERE guest_id = $1 LIMIT $2;', values)
  .then(res => {
    return res.rows;
  })
  .catch(err => {
    console.log('ERROR: ',err);
  })
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = (options, limit = 10) =>{
  const values = [limit];
  return pool.query('SELECT * FROM properties LIMIT $1;', values)
  .then(res => {
    //console.log(res.rows);
    return res.rows;
  })
  .catch(err => {
    console.log('ERROR: ',err);
  })

};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
