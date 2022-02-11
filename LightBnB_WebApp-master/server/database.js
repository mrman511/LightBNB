const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool, Query } = require('pg');

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
  let queryString = `SELECT properties.*, avg(rating) as average_rating
                    FROM properties JOIN property_reviews
                    ON properties.id = property_id`
  const queryParams = [];
  let where = false;
  //add queries for optional options array
  if (options.city){
    queryParams.push(`%${options.city}%`);
    queryString += ` WHERE properties.city LIKE $${queryParams.length}`;
    where = true
  }

  if (options.owner_id){
    if (where) {
      queryParams.push(options.owner_id);
      queryString += ` AND properties.owner_id = $${queryParams.length}`;
    } else {
      queryParams.push(options.owner_id);
      queryString += ` WHERE properties.owner_id = $${queryParams.length}`;
      where = true
    }
  }

  if (options.minimum_price_per_night){
    if (where) {
      queryParams.push(options.minimum_price_per_night);
      queryString += ` AND properties.cost_per_night >= $${queryParams.length}`;
    } else {
      queryParams.push(options.minimum_price_per_night);
      queryString += ` WHERE properties.cost_per_night >= $${queryParams.length}`
      where = true
    }
  }

  if (options.maximum_price_per_night){
    if (where) {
      queryParams.push(options.maximum_price_per_night);
      queryString += ` AND properties.cost_per_night <= $${queryParams.length}`;
    } else {
      queryParams.push(options.maximum_price_per_night);
      queryString += ` WHERE properties.cost_per_night <= $${queryParams.length}`
      where = true
    }
  }

  queryString += ` GROUP BY properties.id`

  if (options.minimum_rating){
      queryParams.push(options.minimum_rating);
      queryString += ` HAVING avg(rating) >= $${queryParams.length}`;
  }


  queryParams.push(limit);
  queryString += ` ORDER BY cost_per_night LIMIT $${queryParams.length};`;


  return pool.query(queryString, queryParams)
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
  const p = property
  const values = [
    p.owner_id,
    p.title,
    p.description,
    p.thumbnail_photo_url,
    p.cover_photo_url,
    p.street,
    p.city,
    p.province,
    p.post_code,
    p.country,
    p.parking_spaces,
    p.number_of_bathrooms,
    p.number_of_bedrooms
  ];
  return pool.query(`INSERT INTO properties
                   (owner_id, title, description, thumbnail_photo_url,
                    cover_photo_url, street, city, province, post_code,
                    country, parking_spaces, number_of_bathrooms,
                    number_of_bedrooms)
                   Values ($1, $2, $3, $4, $5, $6,
                    $7, $8, $9, $10, $11, $12, $13) 
                   RETURNING *;`, values)
  .then(res => {
    return res.rows;
  })
  .catch(err => {
    console.log('ERROR: ',err);
  })
}
exports.addProperty = addProperty;
