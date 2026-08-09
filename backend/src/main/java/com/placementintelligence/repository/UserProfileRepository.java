package com.placementintelligence.repository;

import com.placementintelligence.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserProfileRepository
    extends JpaRepository<UserProfile, Long> {

    @Query("""
        SELECT p
        FROM UserProfile p
        JOIN FETCH p.user
        WHERE p.user.username = :username
    """)
    Optional<UserProfile> findByUsername(String username);
}
