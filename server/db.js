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
        `SELECT firstname, lastname, user_picture_url, user_bio FROM users WHERE id=$1`,
        [id]
    );
}

function addProfilePic({ id, user_picture_url }) {
    return db.query(
        `UPDATE users SET user_picture_url=$2 WHERE id=$1 RETURNING *`,
        [id, user_picture_url]
    );
}

function updateProfileBio({ id, bio }) {
    return db.query(`UPDATE users SET user_bio=$2 WHERE id=$1 RETURNING *`, [
        id,
        bio,
    ]);
}

function getThreeNewestUsers() {
    return db.query(
        `SELECT id, firstname, lastname, user_picture_url FROM users ORDER BY id DESC LIMIT 3`
    );
}

function getThreeOthersBySerchParam(searchString) {
    return db.query(
        `SELECT id, firstname, lastname, user_picture_url FROM users WHERE firstname ILIKE $1 
        OR lastname ILIKE $1 
        ORDER BY id DESC
        LIMIT 3`,
        ["%" + searchString + "%"]
    );
}

function getFriendRequest(user1, user2) {
    return db.query(
        `SELECT * FROM friendships
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)`,
        [user1, user2]
    );
}

function createFriendRequest(sender, recipient) {
    return db.query(
        `INSERT INTO friendships (sender_id, recipient_id) VALUES ($1, $2) RETURNING *`,
        [sender, recipient]
    );
}

function deleteFriendRequest(user1, user2) {
    return db.query(
        `DELETE FROM friendships
        WHERE (sender_id = $1 AND recipient_id = $2)
        OR (sender_id = $2 AND recipient_id = $1)`,
        [user1, user2]
    );
}

module.exports = {
    addUser,
    getUserByEmail,
    addResetCode,
    getUserdataByID,
    addProfilePic,
    updateProfileBio,
    getThreeNewestUsers,
    getThreeOthersBySerchParam,
    getFriendRequest,
    createFriendRequest,
    deleteFriendRequest,
};
