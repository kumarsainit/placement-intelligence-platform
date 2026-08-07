package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.response.HealthResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/v1/health")
    public ApiResponse<HealthResponse> health(HttpServletRequest request) {

        HealthResponse response = new HealthResponse("UP");

        return ApiResponseFactory.success(
            response,
            "Application is running",
            request
        );
    }
}
