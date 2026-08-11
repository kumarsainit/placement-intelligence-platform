package com.placementintelligence.service.impl;

import com.placementintelligence.dto.request.CreateCompanyRequest;
import com.placementintelligence.dto.response.CompanyResponse;
import com.placementintelligence.entity.Company;
import com.placementintelligence.exception.ResourceAlreadyExistsException;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.mapper.CompanyMapper;
import com.placementintelligence.repository.CompanyRepository;
import com.placementintelligence.service.CompanyService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    @Override
    public CompanyResponse createCompany(
        CreateCompanyRequest request) {

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
