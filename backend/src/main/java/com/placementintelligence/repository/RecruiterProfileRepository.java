package com.placementintelligence.repository;

import com.placementintelligence.entity.RecruiterProfile;
import com.placementintelligence.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecruiterProfileRepository
    extends JpaRepository<RecruiterProfile, Long> {

    Optional<RecruiterProfile> findByUser(User user);

    Optional<RecruiterProfile> findByUserUsername(String username);

    boolean existsByUser(User user);
}
