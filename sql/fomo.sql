CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    passphrase VARCHAR NOT NULL,
    user_picture_url VARCHAR,
    user_bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
);

CREATE TABLE reset_keys(
    id SERIAL PRIMARY KEY,
    user_email VARCHAR REFERENCES users(email),
    reset_key VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);