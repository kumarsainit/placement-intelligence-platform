CREATE TABLE user_educations (

                                 id BIGINT NOT NULL AUTO_INCREMENT,

                                 user_id BIGINT NOT NULL,

                                 education_level VARCHAR(30) NOT NULL,

                                 degree VARCHAR(150),

                                 institution VARCHAR(200) NOT NULL,

                                 field_of_study VARCHAR(150),

                                 start_year SMALLINT,

                                 end_year SMALLINT,

                                 cgpa DECIMAL(4,2),

                                 percentage DECIMAL(5,2),

                                 currently_pursuing BOOLEAN NOT NULL DEFAULT FALSE,

                                 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,

                                 PRIMARY KEY (id),

                                 CONSTRAINT fk_user_educations_user
                                     FOREIGN KEY (user_id)
                                         REFERENCES users(id)
                                         ON DELETE CASCADE,

                                 CONSTRAINT chk_user_education_years
                                     CHECK (
                                         end_year IS NULL
                                             OR start_year IS NULL
                                             OR end_year >= start_year
                                         ),

                                 CONSTRAINT chk_user_education_cgpa
                                     CHECK (
                                         cgpa IS NULL
                                             OR (cgpa >= 0 AND cgpa <= 10)
                                         ),

                                 CONSTRAINT chk_user_education_percentage
                                     CHECK (
                                         percentage IS NULL
                                             OR (percentage >= 0 AND percentage <= 100)
                                         ),

                                 INDEX idx_user_educations_user_id (user_id),

                                 INDEX idx_user_educations_level (education_level)

);
