DROP TABLE IF EXISTS wall_posts;

CREATE TABLE wall_posts(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    wall_owner_id INTEGER NOT NULL,
    post TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
