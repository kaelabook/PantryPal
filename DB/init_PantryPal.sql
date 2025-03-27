-- Drop existing tables if they exist to reset the database
DROP TABLE IF EXISTS shopping_cart;
DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS pantry_items;
DROP TABLE IF EXISTS users;

-- Users table for authentication and user management
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pantry items table to store inventory items
CREATE TABLE pantry_items (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('fruits', 'vegetables', 'grains', 'protein', 'dairy', 'seasonings', 'substitutions', 'misc')),
    quantity DECIMAL(10,2) NOT NULL CHECK (quantity >= 0),
    unit VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipes table with added share functionality
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cook_time INT CHECK (cook_time >= 0), -- Cook time in minutes
    temperature INT CHECK (temperature BETWEEN 100 AND 500), -- Temperature in °F
    servings INT CHECK (servings > 0),
    instructions TEXT NOT NULL,
    shareable_link TEXT UNIQUE, -- Allow users to share recipes with a unique link
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recipe ingredients table for many-to-many relationship
CREATE TABLE recipe_ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(20)
);

-- Shopping cart table for missing ingredients when following a recipe
CREATE TABLE shopping_cart (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    ingredient_name VARCHAR(100) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(20),
    category VARCHAR(50) CHECK (category IN ('fruits', 'vegetables', 'grains', 'protein', 'dairy', 'seasonings', 'substitutions', 'misc')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (username, password_hash) VALUES 
    ('JohnDoe', 'hashedpassword1'),
    ('JaneDoe', 'hashedpassword2');

-- Insert sample pantry items
INSERT INTO pantry_items (user_id, name, category, quantity, unit) VALUES 
    (1, 'Apple', 'fruits', 10, 'pieces'),
    (1, 'Tomato', 'vegetables', 5, 'pieces'),
    (1, 'Rice', 'grains', 2, 'kg'),
    (1, 'Chicken', 'protein', 1, 'kg'),
    (1, 'Milk', 'dairy', 1, 'liter'),
    (1, 'Salt', 'seasonings', 1, 'packet'),
    (1, 'Butter', 'dairy', 500, 'grams'),
    (1, 'Cheese', 'dairy', 1, 'kg');

-- Insert sample recipes with shareable links
INSERT INTO recipes (user_id, name, description, cook_time, temperature, servings, instructions, shareable_link) VALUES 
    (1, 'Chicken Stir Fry', 'A quick and delicious stir fry.', 30, 350, 4, 'Cook chicken, add vegetables, stir fry with sauce.', 'https://pantrypal.com/recipe/1'),
    (2, 'Banana Smoothie', 'A refreshing banana smoothie.', 5, NULL, 2, 'Blend banana, milk, and ice together.', 'https://pantrypal.com/recipe/2'),
    (2, 'Spaghetti', 'A classic Italian pasta dish with meat sauce.', 30, 375, 4, 'Boil pasta, add sauce.', 'https://pantrypal.com/recipe/3');

-- Insert ingredients for recipes
INSERT INTO recipe_ingredients (recipe_id, ingredient_name, quantity, unit) VALUES 
    (1, 'Chicken', 1, 'kg'),
    (1, 'Tomato', 2, 'pieces'),
    (1, 'Rice', 1, 'cup'),
    (2, 'Banana', 2, 'pieces'),
    (2, 'Milk', 1, 'cup'),
    (3, 'Pasta', 1, 'box'),
    (3, 'Tomato Sauce', 2, 'cups'),
    (3, 'Ground Beef', 1, 'lb');

-- Insert sample shopping cart items
INSERT INTO shopping_cart (user_id, ingredient_name, quantity, unit, category) VALUES 
    (1, 'Soy Sauce', 1, 'bottle', 'seasonings'),
    (2, 'Honey', 1, 'jar', 'misc'),
    (1, 'Onion', 3, 'pieces', 'vegetables'),
    (2, 'Garlic', 2, 'heads', 'vegetables');

