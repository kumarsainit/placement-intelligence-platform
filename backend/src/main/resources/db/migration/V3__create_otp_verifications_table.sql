CREATE TABLE otp_verifications (
                                   id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                   phone_number VARCHAR(20) NOT NULL,

                                   otp VARCHAR(255) NOT NULL,

                                   attempt_count INT NOT NULL DEFAULT 0,

                                   verified BOOLEAN NOT NULL DEFAULT FALSE,

                                   expires_at TIMESTAMP NOT NULL,

                                   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                   updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                                       ON UPDATE CURRENT_TIMESTAMP
);
