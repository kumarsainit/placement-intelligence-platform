package com.placementintelligence.repository;

import com.placementintelligence.entity.User;
import com.placementintelligence.entity.UserResume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserResumeRepository extends JpaRepository<UserResume, Long> {

    List<UserResume> findByUser(User user);

    List<UserResume> findByUserId(Long userId);

    Optional<UserResume> findByUserAndIsPrimaryTrue(User user);

    boolean existsByUserAndIsPrimaryTrue(User user);
}
