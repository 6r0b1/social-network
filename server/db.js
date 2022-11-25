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

module.exports = {
    addUser,
};
