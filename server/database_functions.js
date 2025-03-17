const argon2 = require('argon2');

// define the user type
/**
 * @typedef {Object} User
 * @property {Number} user_id
 * @property {String} username
 * @property {String} email
 * @property {String} password
 * 
 * @typedef {Object} Session
 * @property {Number} id
 * @property {String} token
 * @property {Number} user_id
 */

/**
 * 
 * @param {*} type 
 * @param {*} value 
 * @returns 
 */
async function checkIfUnique(type, value) {
    try {
        let query = '';
        if (type === 1) {
            query = 'SELECT COUNT(*) AS count FROM users WHERE username = ?';
        } else if (type === 2) {
            query = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
        } else {
            throw new Error('Invalid type');
        }
        const [rows] = await pool.execute(query, [value]);
        return rows[0].count === 0;
    } catch (error) {
        console.error(error);
        return false;
    }
}

/**
 * 
 * @param {String} username 
 * @param {String} email 
 * @param {String} password 
 * @returns {[Boolean, User | Error]}
 */
async function registerUser(username, email, password) {
    try {
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?) RETURNING username, email';
        // hash password using argon2 a state of the art hashing algorithm
        const hash = await argon2.hash(password);
        const user = await pool.execute(query, [username, email, hash]);
        console.log(user)
        return [true, user];
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function getUserByIdentifier(identifier) {
    try {
        const query = 'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1';
        const [rows] = await pool.execute(query, [identifier, identifier]);
        return rows[0] || null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getUser(query, identifier) {
    try {
        const [results] = await pool.execute(query, [identifier, identifier])
        if (!results || results.length === 0) {
            return { success: false, message: "No user found" };
        }
        const user = { ...results[0] };
        delete user.user_id;
        return { success: true, message: user };
    } catch (error) {
        return { success: false, message: "Query error", error };
    }
}

module.exports = {
    checkIfUnique,
    registerUser,
    getUserByIdentifier,
    getUser
}
