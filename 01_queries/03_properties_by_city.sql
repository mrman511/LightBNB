SELECT properties.id as id,
       title,
       cost_per_night,
       avg(rating) as average_rating
FROM properties JOIN property_reviews
ON properties.id = property_id
WHERE city = 'Vancouver'
GROUP BY properties.id
ORDER BY cost_per_night ASC;