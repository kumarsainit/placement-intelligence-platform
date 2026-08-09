CREATE TABLE user_profiles (

                               id BIGINT PRIMARY KEY AUTO_INCREMENT,

                               user_id BIGINT NOT NULL UNIQUE,

                               full_name VARCHAR(100),

                               college VARCHAR(150),

                               degree VARCHAR(100),

                               branch VARCHAR(100),

                               graduation_year INT,

                               cgpa DECIMAL(3,2),

                               bio VARCHAR(500),

                               github_url VARCHAR(255),

                               linkedin_url VARCHAR(255),

                               leetcode_url VARCHAR(255),

                               codeforces_url VARCHAR(255),

                               portfolio_url VARCHAR(255),

                               profile_photo_url VARCHAR(255),

                               resume_url VARCHAR(255),

                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                               updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                   ON UPDATE CURRENT_TIMESTAMP,

                               CONSTRAINT fk_profile_user
                                   FOREIGN KEY (user_id)
                                       REFERENCES users(id)
                                       ON DELETE CASCADE
);
