DROP TABLE IF EXISTS friendships;

CREATE TABLE friendships(
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER,
    status INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
