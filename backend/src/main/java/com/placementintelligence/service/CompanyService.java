package com.placementintelligence.service;

import com.placementintelligence.dto.request.CreateCompanyRequest;
import com.placementintelligence.dto.response.CompanyResponse;

import java.util.List;

public interface CompanyService {

    CompanyResponse createCompany(CreateCompanyRequest request);

    List<CompanyResponse> getAllActiveCompanies();

    CompanyResponse getCompanyById(Long companyId);
}
