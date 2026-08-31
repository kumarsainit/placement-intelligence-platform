package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.request.UpdateCompanyStatusRequest;
import com.placementintelligence.dto.response.CompanyResponse;
import com.placementintelligence.service.AdminPlacementGovernanceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/companies")
@RequiredArgsConstructor
public class AdminCompanyController {

    private final AdminPlacementGovernanceService governanceService;

    @GetMapping
    public ApiResponse<List<CompanyResponse>> getAllCompanies(
        Authentication authentication,
        HttpServletRequest request
    ) {
        List<CompanyResponse> response =
            governanceService.getAllCompanies(authentication.getName());

        return ApiResponseFactory.success(
            response,
            "Admin companies fetched successfully",
            request
        );
    }

    @GetMapping("/{companyId}")
    public ApiResponse<CompanyResponse> getCompanyById(
        Authentication authentication,
        @PathVariable Long companyId,
        HttpServletRequest request
    ) {
        CompanyResponse response =
            governanceService.getCompanyById(authentication.getName(), companyId);

        return ApiResponseFactory.success(
            response,
            "Company fetched successfully",
            request
        );
    }

    @PatchMapping("/{companyId}/status")
    public ApiResponse<CompanyResponse> updateCompanyStatusPatch(
        Authentication authentication,
        @PathVariable Long companyId,
        @Valid @RequestBody UpdateCompanyStatusRequest statusRequest,
        HttpServletRequest request
    ) {
        CompanyResponse response =
            governanceService.updateCompanyStatus(
                authentication.getName(),
                companyId,
                statusRequest
            );

        return ApiResponseFactory.success(
            response,
            "Company status updated successfully",
            request
        );
    }

    @PutMapping("/{companyId}/status")
    public ApiResponse<CompanyResponse> updateCompanyStatusPut(
        Authentication authentication,
        @PathVariable Long companyId,
        @Valid @RequestBody UpdateCompanyStatusRequest statusRequest,
        HttpServletRequest request
    ) {
        return updateCompanyStatusPatch(authentication, companyId, statusRequest, request);
    }
}
