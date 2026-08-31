package com.placementintelligence.service.impl;

import com.placementintelligence.dto.request.AddUserEducationRequest;
import com.placementintelligence.dto.response.UserEducationResponse;
import com.placementintelligence.entity.User;
import com.placementintelligence.entity.UserEducation;
import com.placementintelligence.exception.BadRequestException;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.exception.UnauthorizedException;
import com.placementintelligence.mapper.UserEducationMapper;
import com.placementintelligence.repository.UserEducationRepository;
import com.placementintelligence.repository.UserRepository;
import com.placementintelligence.service.UserEducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserEducationServiceImpl
    implements UserEducationService {

    private final UserRepository userRepository;
    private final UserEducationRepository userEducationRepository;
    private final UserEducationMapper userEducationMapper;

    @Override
    @Transactional
    public UserEducationResponse addEducation(
        String username,
        AddUserEducationRequest request) {

        User user = getUser(username);

        validateEducation(request);

        UserEducation education = UserEducation.builder()
            .user(user)
            .educationLevel(request.educationLevel())
            .degree(request.degree())
            .institution(request.institution())
            .fieldOfStudy(request.fieldOfStudy())
            .startYear(request.startYear())
            .endYear(request.endYear())
            .cgpa(request.cgpa())
            .percentage(request.percentage())
            .currentlyPursuing(
                Boolean.TRUE.equals(request.currentlyPursuing())
            )
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .build();

        education =
            userEducationRepository.save(education);

        return userEducationMapper.toResponse(education);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserEducationResponse> getMyEducations(
        String username) {

        User user = getUser(username);

        return userEducationRepository.findByUser(user)
            .stream()
            .map(userEducationMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserEducationResponse getMyEducation(
        String username,
        Long userEducationId) {

        User user = getUser(username);

        UserEducation education =
            getUserEducation(userEducationId);

        verifyOwnership(education, user);

        return userEducationMapper.toResponse(education);
    }

    @Override
    @Transactional
    public UserEducationResponse updateMyEducation(
        String username,
        Long userEducationId,
        AddUserEducationRequest request) {

        User user = getUser(username);

        UserEducation education =
            getUserEducation(userEducationId);

        verifyOwnership(education, user);

        validateEducation(request);

        education.setEducationLevel(
            request.educationLevel()
        );

        education.setDegree(
            request.degree()
        );

        education.setInstitution(
            request.institution()
        );

        education.setFieldOfStudy(
            request.fieldOfStudy()
        );

        education.setStartYear(
            request.startYear()
        );

        education.setEndYear(
            request.endYear()
        );

        education.setCgpa(
            request.cgpa()
        );

        education.setPercentage(
            request.percentage()
        );

        education.setCurrentlyPursuing(
            Boolean.TRUE.equals(
                request.currentlyPursuing()
            )
        );

        education.setUpdatedAt(Instant.now());

        education =
            userEducationRepository.save(education);

        return userEducationMapper.toResponse(education);
    }

    @Override
    @Transactional
    public void removeMyEducation(
        String username,
        Long userEducationId) {

        User user = getUser(username);

        UserEducation education =
            getUserEducation(userEducationId);

        verifyOwnership(education, user);

        userEducationRepository.delete(education);
    }

    private User getUser(String username) {

        User user = userRepository.findByUsername(username)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "User not found"
                ));

        if (user.getRole() != com.placementintelligence.common.enums.UserRole.USER) {
            throw new org.springframework.security.access.AccessDeniedException("Only student users can access education records");
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new org.springframework.security.access.AccessDeniedException("User account is inactive");
        }

        return user;
    }

    private UserEducation getUserEducation(
        Long userEducationId) {

        return userEducationRepository
            .findById(userEducationId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "User education not found"
                ));
    }

    private void verifyOwnership(
        UserEducation education,
        User user) {

        if (!education.getUser().getId()
            .equals(user.getId())) {

            throw new org.springframework.security.access.AccessDeniedException(
                "You are not authorized to access this education"
            );
        }
    }

    private void validateEducation(
        AddUserEducationRequest request) {

        if (request.startYear() != null
            && request.endYear() != null
            && request.endYear() < request.startYear()) {

            throw new BadRequestException(
                "End year cannot be before start year"
            );
        }

        if (Boolean.TRUE.equals(request.currentlyPursuing())
            && request.endYear() != null) {

            throw new BadRequestException(
                "Currently pursuing education cannot have an end year"
            );
        }

        if (request.cgpa() != null
            && request.percentage() != null) {

            throw new BadRequestException(
                "Provide either CGPA or percentage, not both"
            );
        }
    }
}
