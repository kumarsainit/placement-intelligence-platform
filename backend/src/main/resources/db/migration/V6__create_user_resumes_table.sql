CREATE TABLE user_resumes (

                              id BIGINT PRIMARY KEY AUTO_INCREMENT,

                              user_id BIGINT NOT NULL,

                              file_name VARCHAR(255) NOT NULL,

                              file_url VARCHAR(500) NOT NULL,

                              file_type VARCHAR(100) NOT NULL,

                              file_size BIGINT NOT NULL,

                              is_primary BOOLEAN NOT NULL DEFAULT TRUE,

                              uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                  ON UPDATE CURRENT_TIMESTAMP,

                              CONSTRAINT fk_resume_user
                                  FOREIGN KEY (user_id)
                                      REFERENCES users(id)
                                      ON DELETE CASCADE
);
