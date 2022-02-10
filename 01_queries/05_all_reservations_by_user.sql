SELECT properties.id as id,
      title,
      cost_per_night,
      start_date,
      avg(rating) as average_rating
FROM properties JOIN reservations
ON properties.id = reservations.property_id
JOIN users
ON users.id = reservations.guest_id
JOIN property_reviews
ON property_reviews.property_id = properties.id
WHERE users.id = 2
GROUP BY properties.id, reservations.id
ORDER BY start_date ASC
LIMIT 30;
       