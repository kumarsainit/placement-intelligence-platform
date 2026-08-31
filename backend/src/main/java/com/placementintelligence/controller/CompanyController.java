package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.request.CreateCompanyRequest;
import com.placementintelligence.dto.response.CompanyResponse;
import com.placementintelligence.service.CompanyService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CompanyResponse> createCompany(
        org.springframework.security.core.Authentication authentication,
        @Valid @RequestBody CreateCompanyRequest request,
        HttpServletRequest httpRequest) {

        CompanyResponse response =
            companyService.createCompany(authentication.getName(), request);

        return ApiResponseFactory.created(
            response,
            "Company created successfully",
            httpRequest
        );
    }

    @GetMapping
    public ApiResponse<List<CompanyResponse>> getAllCompanies(
        HttpServletRequest httpRequest) {

        List<CompanyResponse> response =
            companyService.getAllActiveCompanies();

        return ApiResponseFactory.success(
            response,
            "Companies fetched successfully",
            httpRequest
        );
    }

    @GetMapping("/{companyId}")
    public ApiResponse<CompanyResponse> getCompanyById(
        @PathVariable Long companyId,
        HttpServletRequest httpRequest) {

        CompanyResponse response =
            companyService.getCompanyById(companyId);

        return ApiResponseFactory.success(
            response,
            "Company fetched successfully",
            httpRequest
        );
    }
}
