CREATE TABLE user_projects (

    id BIGINT NOT NULL AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    title VARCHAR(200) NOT NULL,

    description TEXT NOT NULL,

    technologies VARCHAR(500) NOT NULL,

    project_url VARCHAR(500),

    github_url VARCHAR(500),

    start_date DATE,

    end_date DATE,

    currently_working BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_user_projects_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_user_projects_dates
        CHECK (
            end_date IS NULL
            OR start_date IS NULL
            OR end_date >= start_date
        ),

    CONSTRAINT chk_user_projects_currently_working
        CHECK (
            currently_working = FALSE
            OR end_date IS NULL
        ),

    INDEX idx_user_projects_user_id (user_id)
);
