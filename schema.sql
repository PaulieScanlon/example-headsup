CREATE TABLE heads_up_games (
    id SERIAL PRIMARY KEY,
    famous_person TEXT NOT NULL,
    game_won BOOLEAN NOT NULL,
    guess_count INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
