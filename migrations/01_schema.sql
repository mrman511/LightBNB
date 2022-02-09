CREATE TABLE users (
  id SERIAl PRIMARY KEY NOT NULL,
  name VARCHAR(225) NOT NULL,
  email VARCHAR(225) NOT NULL,
  password VARCHAR(225) NOT NULL
);


CREATE TABLE properties (
  id SERIAl PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  title VARCHAR(225) NOT NULL,
  description TEXT,
  thumbnail_url VARCHAR(225) NOT NULL,
  cover_photo_url VARCHAR(225) NOT NULL,
  cost_per_night INTEGER NOT NULL DEFAULT 0,
  parking_spaces INTEGER DEFAULT 0,
  number_of_bathroms INTEGER DEFAULT 0,
  number_of_bedroms INTEGER DEFAULT 0,
  country VARCHAR(225) NOT NULL,
  street VARCHAR(225) NOT NULL,
  province VARCHAR(225) NOT NULL,
  post_code VARCHAR(225) NOT NULL,
  active BOOLEAN NOT NULL
);



CREATE TABLE reservations (
  id SERIAl PRIMARY KEY NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guest_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE property_reviews (
  id SERIAl PRIMARY KEY NOT NULL,
  reservation_id INTEGER REFERENCES reservations(id) ON DELETE CASCADE,
  rating INTEGER DEFAULT 0,
  message TEXT
);