CREATE TABLE job_applications (

                                  id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                  job_id BIGINT NOT NULL,

                                  applicant_id BIGINT NOT NULL,

                                  resume_id BIGINT NOT NULL,

                                  resume_file_name VARCHAR(255) NOT NULL,

                                  resume_file_url VARCHAR(500) NOT NULL,

                                  resume_file_type VARCHAR(100) NOT NULL,

                                  resume_file_size BIGINT NOT NULL,

                                  cover_letter TEXT,

                                  status VARCHAR(30) NOT NULL DEFAULT 'APPLIED',

                                  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                      ON UPDATE CURRENT_TIMESTAMP,

                                  CONSTRAINT fk_job_application_job
                                      FOREIGN KEY (job_id)
                                          REFERENCES jobs(id)
                                          ON DELETE CASCADE,

                                  CONSTRAINT fk_job_application_applicant
                                      FOREIGN KEY (applicant_id)
                                          REFERENCES users(id)
                                          ON DELETE CASCADE,

                                  CONSTRAINT fk_job_application_resume
                                      FOREIGN KEY (resume_id)
                                          REFERENCES user_resumes(id)
                                          ON DELETE RESTRICT,

                                  CONSTRAINT uk_job_application_job_applicant
                                      UNIQUE (job_id, applicant_id)
);

CREATE INDEX idx_job_applications_job_id
    ON job_applications(job_id);

CREATE INDEX idx_job_applications_applicant_id
    ON job_applications(applicant_id);

CREATE INDEX idx_job_applications_resume_id
    ON job_applications(resume_id);

CREATE INDEX idx_job_applications_status
    ON job_applications(status);

CREATE INDEX idx_job_applications_applied_at
    ON job_applications(applied_at);
