package com.placementintelligence.repository;

import com.placementintelligence.entity.User;
import com.placementintelligence.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {

    List<UserSkill> findByUser(User user);

    Optional<UserSkill> findByUserAndSkillId(User user, Long skillId);

    boolean existsByUserAndSkillId(User user, Long skillId);

    void deleteByUserAndSkillId(User user, Long skillId);
}
