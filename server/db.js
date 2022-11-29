// ++++++++++++++ Setup modules

const spicedPg = require("spiced-pg");
require("dotenv").config();

const { DB_USER, DB_PASS, DB_DATABASE } = process.env;
const db = spicedPg(
    `postgres:${DB_USER}:${DB_PASS}@localhost:5432/${DB_DATABASE}`
    // `${DATABASE_URL}`
);

//  ++++++++++++++ END setup modules

// Create a user
function addUser({ email, firstname, lastname, passphrase }) {
    return db.query(
        `INSERT INTO users (email, firstname, lastname, passphrase)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
        [email, firstname, lastname, passphrase]
    );
}

// Get user data for Log in
function getUserByEmail(email) {
    return db.query(`SELECT * FROM users WHERE email=$1`, [email]);
}

// Add a reset code
function addResetCode(user_email, reset_key) {
    return db.query(
        `INSERT INTO reset_keys (user_email, reset_key)
        VALUES ($1, $2)
        RETURNING *`,
        [user_email, reset_key]
    );
}

function getUserdataByID(id) {
    return db.query(
        `SELECT firstname, lastname, user_picture_url FROM users WHERE id=$1`,
        [id]
    );
}

function addProfilePic({ id, user_picture_url }) {
    return db.query(`UPDATE users SET user_picture_url=$2 WHERE id=$1`, [
        id,
        user_picture_url,
    ]);
}
module.exports = {
    addUser,
    getUserByEmail,
    addResetCode,
    getUserdataByID,
    addProfilePic,
};
