CREATE TABLE users (
                       id BIGINT PRIMARY KEY AUTO_INCREMENT,
                       phone_number VARCHAR(20) NOT NULL UNIQUE,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       role VARCHAR(30) NOT NULL,
                       is_active BOOLEAN NOT NULL DEFAULT TRUE,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP
);
