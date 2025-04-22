-- Only create tables (no DROP DATABASE or USE statements)
-- Note the PostgreSQL-compatible syntax:

CREATE TABLE IF NOT EXISTS pantry_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'FRUITS', 'VEGETABLES', 'GRAINS', 'PROTEIN', 
        'DAIRY', 'SEASONINGS', 'SUBSTITUTIONS', 'MISC'
    )),
    quantity DECIMAL(10,2) NOT NULL CHECK (quantity >= 0),
    unit VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS recipes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cook_time INT,
    temperature INT,
    servings INT,
    instructions TEXT
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id BIGSERIAL PRIMARY KEY,
    recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS shopping_cart (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20),
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'FRUITS', 'VEGETABLES', 'GRAINS', 'PROTEIN', 
        'DAIRY', 'SEASONINGS', 'SUBSTITUTIONS', 'MISC'
    ))
);

-- Sample data (optional)
INSERT INTO pantry_items (name, category, quantity, unit) VALUES 
    ('Apple', 'FRUITS', 10, 'pieces'),
    ('Tomato', 'VEGETABLES', 5, 'pieces');