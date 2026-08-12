package com.placementintelligence.service.impl;

import com.placementintelligence.common.enums.UserRole;
import com.placementintelligence.dto.request.CreateRecruiterProfileRequest;
import com.placementintelligence.dto.request.UpdateRecruiterProfileRequest;
import com.placementintelligence.dto.response.RecruiterProfileResponse;
import com.placementintelligence.entity.Company;
import com.placementintelligence.entity.User;
import com.placementintelligence.entity.RecruiterProfile;
import com.placementintelligence.exception.BadRequestException;
import com.placementintelligence.exception.ResourceAlreadyExistsException;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.exception.UnauthorizedException;
import com.placementintelligence.mapper.RecruiterProfileMapper;
import com.placementintelligence.repository.CompanyRepository;
import com.placementintelligence.repository.RecruiterProfileRepository;
import com.placementintelligence.repository.UserRepository;
import com.placementintelligence.service.RecruiterProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class RecruiterProfileServiceImpl
    implements RecruiterProfileService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final RecruiterProfileMapper mapper;

    @Override
    @Transactional
    public RecruiterProfileResponse createProfile(
        String username,
        CreateRecruiterProfileRequest request) {

        User user = getRecruiter(username);

        if (recruiterProfileRepository.existsByUser(user)) {
            throw new ResourceAlreadyExistsException(
                "Recruiter profile already exists"
            );
        }

        Company company = getCompany(request.companyId());

        RecruiterProfile profile = RecruiterProfile.builder()
            .user(user)
            .company(company)
            .designation(request.designation())
            .department(request.department())
            .employeeId(request.employeeId())
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .build();

        profile = recruiterProfileRepository.save(profile);

        return mapper.toResponse(profile);
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterProfileResponse getCurrentProfile(
        String username) {

        User user = getRecruiter(username);

        RecruiterProfile profile =
            recruiterProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Recruiter profile not found"
                    )
                );

        return mapper.toResponse(profile);
    }

    @Override
    @Transactional
    public RecruiterProfileResponse updateProfile(
        String username,
        UpdateRecruiterProfileRequest request) {

        User user = getRecruiter(username);

        RecruiterProfile profile =
            recruiterProfileRepository
                .findByUser(user)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Recruiter profile not found"
                    )
                );

        Company company = getCompany(request.companyId());

        profile.setCompany(company);
        profile.setDesignation(request.designation());
        profile.setDepartment(request.department());
        profile.setEmployeeId(request.employeeId());
        profile.setUpdatedAt(Instant.now());

        profile = recruiterProfileRepository.save(profile);

        return mapper.toResponse(profile);
    }

    private User getRecruiter(String username) {

        User user = userRepository.findByUsername(username)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "User not found"
                )
            );

        if (user.getRole() != UserRole.RECRUITER) {
            throw new UnauthorizedException(
                "Only recruiters can access recruiter profile"
            );
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new UnauthorizedException(
                "User account is inactive"
            );
        }

        return user;
    }

    private Company getCompany(Long companyId) {

        if (companyId == null) {
            throw new BadRequestException(
                "Company ID is required"
            );
        }

        return companyRepository.findById(companyId)
            .filter(company ->
                Boolean.TRUE.equals(company.getIsActive())
            )
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Active company not found"
                )
            );
    }
}
