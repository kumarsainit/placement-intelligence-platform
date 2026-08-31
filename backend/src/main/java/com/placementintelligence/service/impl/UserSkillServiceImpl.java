package com.placementintelligence.service.impl;

import com.placementintelligence.dto.request.AddUserSkillRequest;
import com.placementintelligence.dto.response.UserSkillResponse;
import com.placementintelligence.entity.Skill;
import com.placementintelligence.entity.User;
import com.placementintelligence.entity.UserSkill;
import com.placementintelligence.exception.BadRequestException;
import com.placementintelligence.exception.ResourceAlreadyExistsException;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.exception.UnauthorizedException;
import com.placementintelligence.mapper.UserSkillMapper;
import com.placementintelligence.repository.SkillRepository;
import com.placementintelligence.repository.UserRepository;
import com.placementintelligence.repository.UserSkillRepository;
import com.placementintelligence.service.UserSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserSkillServiceImpl implements UserSkillService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserSkillMapper userSkillMapper;

    @Override
    @Transactional
    public UserSkillResponse addSkill(
        String username,
        AddUserSkillRequest request) {

        User user = getUser(username);

        Skill skill = getSkill(request.skillId());

        if (!Boolean.TRUE.equals(skill.getIsActive())) {
            throw new BadRequestException(
                "Skill is no longer active"
            );
        }

        if (userSkillRepository.existsByUserAndSkillId(
            user,
            skill.getId())) {

            throw new ResourceAlreadyExistsException(
                "User already has this skill"
            );
        }

        UserSkill userSkill = UserSkill.builder()
            .user(user)
            .skill(skill)
            .proficiency(request.proficiency())
            .yearsOfExperience(request.yearsOfExperience())
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .build();

        userSkill = userSkillRepository.save(userSkill);

        return userSkillMapper.toResponse(userSkill);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSkillResponse> getMySkills(
        String username) {

        User user = getUser(username);

        return userSkillRepository.findByUser(user)
            .stream()
            .map(userSkillMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserSkillResponse getMySkill(
        String username,
        Long userSkillId) {

        User user = getUser(username);

        UserSkill userSkill =
            getUserSkill(userSkillId);

        verifyOwnership(userSkill, user);

        return userSkillMapper.toResponse(userSkill);
    }

    @Override
    @Transactional
    public UserSkillResponse updateMySkill(
        String username,
        Long userSkillId,
        AddUserSkillRequest request) {

        User user = getUser(username);

        UserSkill userSkill =
            getUserSkill(userSkillId);

        verifyOwnership(userSkill, user);

        Skill skill = getSkill(request.skillId());

        if (!Boolean.TRUE.equals(skill.getIsActive())) {
            throw new BadRequestException(
                "Skill is no longer active"
            );
        }

        /*
         * If the skill itself is being changed,
         * make sure the user doesn't already have it.
         */
        if (!userSkill.getSkill().getId()
            .equals(skill.getId())
            && userSkillRepository.existsByUserAndSkillId(
            user,
            skill.getId())) {

            throw new ResourceAlreadyExistsException(
                "User already has this skill"
            );
        }

        userSkill.setSkill(skill);
        userSkill.setProficiency(
            request.proficiency()
        );
        userSkill.setYearsOfExperience(
            request.yearsOfExperience()
        );
        userSkill.setUpdatedAt(Instant.now());

        userSkill =
            userSkillRepository.save(userSkill);

        return userSkillMapper.toResponse(userSkill);
    }

    @Override
    @Transactional
    public void removeMySkill(
        String username,
        Long userSkillId) {

        User user = getUser(username);

        UserSkill userSkill =
            getUserSkill(userSkillId);

        verifyOwnership(userSkill, user);

        userSkillRepository.delete(userSkill);
    }

    private User getUser(String username) {

        User user = userRepository.findByUsername(username)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "User not found"
                ));

        if (user.getRole() != com.placementintelligence.common.enums.UserRole.USER) {
            throw new org.springframework.security.access.AccessDeniedException("Only student users can access student skill records");
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new org.springframework.security.access.AccessDeniedException("User account is inactive");
        }

        return user;
    }

    private Skill getSkill(Long skillId) {

        return skillRepository.findById(skillId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Skill not found"
                ));
    }

    private UserSkill getUserSkill(
        Long userSkillId) {

        return userSkillRepository.findById(userSkillId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "User skill not found"
                ));
    }

    private void verifyOwnership(
        UserSkill userSkill,
        User user) {

        if (!userSkill.getUser().getId()
            .equals(user.getId())) {

            throw new org.springframework.security.access.AccessDeniedException(
                "You are not authorized to access this skill"
            );
        }
    }
}
