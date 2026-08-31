package com.placementintelligence.service.impl;

import com.placementintelligence.common.enums.UserRole;
import com.placementintelligence.dto.request.CreateCompanyRequest;
import com.placementintelligence.dto.response.CompanyResponse;
import com.placementintelligence.entity.Company;
import com.placementintelligence.entity.User;
import com.placementintelligence.exception.ResourceAlreadyExistsException;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.exception.UnauthorizedException;
import com.placementintelligence.mapper.CompanyMapper;
import com.placementintelligence.repository.CompanyRepository;
import com.placementintelligence.repository.UserRepository;
import com.placementintelligence.service.CompanyService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanyServiceImpl implements CompanyService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    @Override
    public CompanyResponse createCompany(
        String username,
        CreateCompanyRequest request) {

        User user = userRepository.findByUsername(username)
            .orElseThrow(() ->
                new ResourceNotFoundException("User not found")
            );

        if (user.getRole() != UserRole.RECRUITER && user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SUPER_ADMIN) {
            throw new org.springframework.security.access.AccessDeniedException(
                "Only recruiters and admins can create companies"
            );
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new org.springframework.security.access.AccessDeniedException(
                "User account is inactive"
            );
        }

        if (companyRepository.existsByNameIgnoreCase(
            request.name().trim())) {

            throw new ResourceAlreadyExistsException(
                "Company already exists"
            );
        }

        Company company =
            companyMapper.toEntity(request);

        company.setName(request.name().trim());

        Company savedCompany =
            companyRepository.save(company);

        return companyMapper.toResponse(savedCompany);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyResponse> getAllActiveCompanies() {

        return companyRepository
            .findByIsActiveTrueOrderByNameAsc()
            .stream()
            .map(companyMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(
        Long companyId) {

        Company company = companyRepository
            .findById(companyId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Company not found"
                )
            );

        return companyMapper.toResponse(company);
    }
}
