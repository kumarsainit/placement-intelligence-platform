package com.placementintelligence.repository;

import com.placementintelligence.entity.User;
import com.placementintelligence.entity.UserProject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserProjectRepository
    extends JpaRepository<UserProject, Long> {

    List<UserProject> findByUser(User user);

    List<UserProject> findByUserId(Long userId);

    Optional<UserProject> findByIdAndUser(
        Long id,
        User user
    );
}
