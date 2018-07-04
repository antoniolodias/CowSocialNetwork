const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");

var spicedPg = require("spiced-pg");

var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

exports.hashPassword = function(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};

exports.checkPassword = function(
    textEnteredInLoginForm,
    hashedPasswordFromDatabase
) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(
            textEnteredInLoginForm,
            hashedPasswordFromDatabase,
            function(err, doesMatch) {
                if (err) {
                    reject(err);
                } else {
                    resolve(doesMatch);
                }
            }
        );
    });
};

exports.register = function(first, last, email, hashpassword) {
    return db.query(
        `INSERT INTO users (first, last, email, hashpassword)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [first, last, email, hashpassword]
    );
};

exports.getUserById = function(id) {
    return db.query(
        `SELECT id, first, last, bio, photo
        FROM users
        WHERE id = $1`,
        [id]
    );
};

exports.getUserByEmail = function(email) {
    return db.query(
        `SELECT id, first, last, email, hashpassword
            FROM users
            WHERE email = $1
            `,
        [email]
    );
};

exports.uploadProfilePicture = function(id, photo) {
    return db.query(
        `UPDATE users
        SET photo = $2
        WHERE id = $1`,
        [id, photo]
    );
};

exports.saveBio = function(id, bio) {
    return db.query(
        `UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING bio`,
        [id, bio]
    );
};

exports.getAllUsers = function() {
    return db.query(
        `SELECT id, first, last, photo
        FROM users
        `
    );
};

exports.sendFriendRequest = function(sender_id, recipient_id) {
    return db.query(
        `INSERT INTO friendships (sender_id, recipient_id, status)
        VALUES ($1, $2, 1)
        RETURNING status, recipient_id, sender_id`,
        [sender_id, recipient_id]
    );
};

exports.deletefriendrequest = function(sender_id, recipient_id) {
    return db.query(
        `DELETE FROM friendships
        WHERE (sender_id =$1 AND recipient_id=$2)
        OR (sender_id =$2 AND recipient_id=$1)
        RETURNING status`,
        [sender_id, recipient_id]
    );
};

exports.acceptFriendRequest = function(sender_id, recipient_id) {
    return db.query(
        `
        UPDATE friendships
        SET status = 2
        WHERE (sender_id = $1 AND recipient_id=$2)
        OR (sender_id = $2 AND recipient_id=$1)
        RETURNING status
        `,
        [sender_id, recipient_id]
    );
};

exports.friendshipstatus = function(sender_id, recipient_id) {
    return db.query(
        `
        SELECT status, recipient_id FROM friendships
        WHERE (sender_id = $1 AND recipient_id=$2)
        OR (sender_id = $2 AND recipient_id=$1)
        `,
        [sender_id, recipient_id]
    );
};

exports.getFriendsAndWannabes = function(userId) {
    return db.query(
        `
        SELECT users.id, first, last, photo, status
        FROM friendships
        JOIN users
        ON (status = 1 AND recipient_id = $1 AND sender_id = users.id)
        OR (status = 2 AND recipient_id = $1 AND sender_id = users.id)
        OR (status = 2 AND sender_id = $1 AND recipient_id = users.id)
        `,
        [userId]
    );
};

exports.getUsersByIds = function(arrayOfIds) {
    return db.query(
        `SELECT id, first, last, photo
        FROM users
        WHERE id = ANY($1)
        `,
        [arrayOfIds]
    );
};

exports.userJoined = function(userId) {
    return db.query(
        `SELECT id, first, last, photo
        FROM users
        WHERE id=$1`,
        [userId]
    );
};

exports.getLastTenMessages = function() {
    return db.query(
        `SELECT users.id as userId, users.first, users.last, users.photo, forum_messages.message, forum_messages.created_at as createdAt, forum_messages.id
        FROM users
        JOIN forum_messages
        ON users.id = forum_messages.user_id
        ORDER BY forum_messages.created_at DESC
        LIMIT 5
        `
    );
};

exports.insertNewMessage = function(userId, message) {
    return db.query(
        `INSERT INTO forum_messages (user_id, message)
        VALUES ($1, $2)
        RETURNING message, created_at as createdAt, id`,
        [userId, message]
    );
};

exports.getUserInfo = function(userId) {
    return db.query(
        `SELECT id, first, last, photo
        FROM users
        WHERE id = $1
        `,
        [userId]
    );
};

exports.getWallPosts = function(someId, viewerId) {
    let q;
    let params;

    if (someId === viewerId) {
        q = `SELECT users.id as userid, users.first, users.last, users.photo, wall_posts.post, wall_posts.created_at as createdat, wall_posts.id
        FROM wall_posts
        JOIN users
        ON users.id = wall_posts.user_id

        WHERE wall_owner_id = $1

        ORDER BY wall_posts.created_at DESC
        LIMIT 3`;
        params = [someId];
    } else {
        q = `SELECT users.id as userid, users.first, users.last, users.photo, wall_posts.post, wall_posts.created_at as createdat, wall_posts.id
        FROM wall_posts
        JOIN users
        ON users.id = wall_posts.user_id

        WHERE ($2 in (
            SELECT recipient_id FROM friendships
            WHERE sender_id = $1 and status = 2
        )
        OR $2 in (
            SELECT sender_id FROM friendships
            WHERE recipient_id = $1 and status = 2
        ))
        AND wall_owner_id = $1

        ORDER BY wall_posts.created_at DESC
        LIMIT 3
        `;
        params = [someId, viewerId];
    }
    return db.query(q, params);
};

exports.writePost = function(userId, post, wallOwnerId) {
    return db.query(
        `INSERT INTO wall_posts (user_id, post, wall_owner_id)
        VALUES ($1, $2, $3)
        RETURNING post, created_at as createdat, id`,
        [userId, post, wallOwnerId]
    );
};
