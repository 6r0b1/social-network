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

CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    recipient_id INTEGER NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT current_timestamp
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    recipient_id INTEGER REFERENCES users(id),
    message_body TEXT,
    created_at TIMESTAMP DEFAULT current_timestamp
);