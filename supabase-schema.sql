-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    guild_id VARCHAR(255) NOT NULL,
    about TEXT,
    reminder_frequency VARCHAR(50),
    reminder_time VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, guild_id)
);

-- Create user_study_time table
CREATE TABLE IF NOT EXISTS user_study_time (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    guild_id VARCHAR(255) NOT NULL,
    total_minutes INTEGER DEFAULT 0,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, guild_id)
);

-- Create user_todos table
CREATE TABLE IF NOT EXISTS user_todos (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    guild_id VARCHAR(255) NOT NULL,
    task TEXT NOT NULL,
    deadline DATE,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_guild ON user_profiles(user_id, guild_id);
CREATE INDEX IF NOT EXISTS idx_user_study_time_user_guild ON user_study_time(user_id, guild_id);
CREATE INDEX IF NOT EXISTS idx_user_todos_user_guild ON user_todos(user_id, guild_id);
CREATE INDEX IF NOT EXISTS idx_user_todos_completed ON user_todos(completed);

-- Enable Row Level Security (RLS) for better security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_study_time ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_todos ENABLE ROW LEVEL SECURITY;

-- Create policies (optional - for additional security)
-- You can customize these based on your needs
CREATE POLICY "Allow all operations for authenticated users" ON user_profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON user_study_time FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON user_todos FOR ALL USING (true); 