package com.placementintelligence.repository;

import com.placementintelligence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByPhoneNumber(String phoneNumber);

    Optional<User> findByUsername(String username);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByUsername(String username);

    long countByRole(com.placementintelligence.common.enums.UserRole role);

    long countByIsActiveTrue();
}
