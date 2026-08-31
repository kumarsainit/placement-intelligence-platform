package com.placementintelligence.repository;

import com.placementintelligence.common.enums.UserRole;
import com.placementintelligence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByPhoneNumber(String phoneNumber);

    Optional<User> findByUsername(String username);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByUsername(String username);

    long countByRole(UserRole role);

    long countByIsActiveTrue();

    long countByRoleAndIsActiveTrue(UserRole role);

    List<User> findAllByOrderByCreatedAtDesc();
}
