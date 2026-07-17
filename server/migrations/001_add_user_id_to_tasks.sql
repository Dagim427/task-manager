-- Migration: Add user_id column to tasks table
-- This migration associates tasks with their creator (user)

ALTER TABLE tasks
ADD COLUMN user_id INT NOT NULL,
ADD CONSTRAINT fk_tasks_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add an index on user_id for faster queries
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
