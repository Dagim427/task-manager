CREATE TABLE tasks (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    status ENUM(
        'todo',
        'in_progress',
        'completed'
    ) NOT NULL DEFAULT 'todo',

    priority ENUM(
        'low',
        'medium', 
        'high'
    ) NOT NULL DEFAULT 'medium',

    due_date DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_tasks_user_id (user_id),
    INDEX idx_tasks_user_status (user_id, status),
    INDEX idx_tasks_user_priority(user_id, priority),
    INDEX idx_tasks_user_created_at (user_id, created_at)
);

