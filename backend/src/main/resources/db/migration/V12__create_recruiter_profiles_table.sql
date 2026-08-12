CREATE TABLE recruiter_profiles (

                                    id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                    user_id BIGINT NOT NULL UNIQUE,

                                    company_id BIGINT NOT NULL,

                                    designation VARCHAR(150),

                                    department VARCHAR(100),

                                    employee_id VARCHAR(100),

                                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,

                                    CONSTRAINT fk_recruiter_profile_user
                                        FOREIGN KEY (user_id)
                                            REFERENCES users(id)
                                            ON DELETE CASCADE,

                                    CONSTRAINT fk_recruiter_profile_company
                                        FOREIGN KEY (company_id)
                                            REFERENCES companies(id)
                                            ON DELETE RESTRICT,

                                    INDEX idx_recruiter_profiles_company_id (company_id)
);
