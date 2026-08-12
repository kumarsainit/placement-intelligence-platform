CREATE TABLE jobs (

                      id BIGINT PRIMARY KEY AUTO_INCREMENT,

                      company_id BIGINT NOT NULL,

                      recruiter_id BIGINT NOT NULL,

                      title VARCHAR(200) NOT NULL,

                      description TEXT NOT NULL,

                      location VARCHAR(200),

                      employment_type VARCHAR(30) NOT NULL,

                      experience_level VARCHAR(30) NOT NULL,

                      salary_min DECIMAL(12,2),

                      salary_max DECIMAL(12,2),

                      openings INT NOT NULL,

                      application_deadline DATE NOT NULL,

                      status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',

                      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                          ON UPDATE CURRENT_TIMESTAMP,

                      CONSTRAINT fk_job_company
                          FOREIGN KEY (company_id)
                              REFERENCES companies(id),

                      CONSTRAINT fk_job_recruiter
                          FOREIGN KEY (recruiter_id)
                              REFERENCES recruiter_profiles(id)
);

CREATE INDEX idx_jobs_company_id
    ON jobs(company_id);

CREATE INDEX idx_jobs_recruiter_id
    ON jobs(recruiter_id);

CREATE INDEX idx_jobs_status
    ON jobs(status);

CREATE INDEX idx_jobs_deadline
    ON jobs(application_deadline);
