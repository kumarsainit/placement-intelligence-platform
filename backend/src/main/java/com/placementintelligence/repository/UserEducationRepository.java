package com.placementintelligence.repository;

import com.placementintelligence.entity.User;
import com.placementintelligence.entity.UserEducation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserEducationRepository
    extends JpaRepository<UserEducation, Long> {

    List<UserEducation> findByUser(User user);

}
