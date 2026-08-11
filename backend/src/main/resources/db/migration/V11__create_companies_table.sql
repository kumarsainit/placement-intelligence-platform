CREATE TABLE companies (

                           id BIGINT PRIMARY KEY AUTO_INCREMENT,

                           name VARCHAR(200) NOT NULL,

                           website VARCHAR(500),

                           industry VARCHAR(150),

                           description TEXT,

                           location VARCHAR(200),

                           is_active BOOLEAN NOT NULL DEFAULT TRUE,

                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                           updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP
);
