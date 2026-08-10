CREATE TABLE skills (
                        id BIGINT PRIMARY KEY AUTO_INCREMENT,

                        name VARCHAR(100) NOT NULL UNIQUE,

                        category VARCHAR(50) NOT NULL,

                        description VARCHAR(500),

                        is_active BOOLEAN NOT NULL DEFAULT TRUE,

                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                            ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE user_skills (
                             id BIGINT PRIMARY KEY AUTO_INCREMENT,

                             user_id BIGINT NOT NULL,

                             skill_id BIGINT NOT NULL,

                             proficiency VARCHAR(30),

                             years_of_experience DECIMAL(4,2),

                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                             updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,

                             CONSTRAINT fk_user_skills_user
                                 FOREIGN KEY (user_id)
                                     REFERENCES users(id)
                                     ON DELETE CASCADE,

                             CONSTRAINT fk_user_skills_skill
                                 FOREIGN KEY (skill_id)
                                     REFERENCES skills(id)
                                     ON DELETE CASCADE,

                             CONSTRAINT uk_user_skill
                                 UNIQUE (user_id, skill_id)
);


CREATE INDEX idx_skills_category
    ON skills(category);

CREATE INDEX idx_user_skills_user_id
    ON user_skills(user_id);

CREATE INDEX idx_user_skills_skill_id
    ON user_skills(skill_id);
