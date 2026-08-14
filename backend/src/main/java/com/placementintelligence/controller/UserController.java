package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> me(
        Authentication authentication,
        HttpServletRequest request
    ) {

        Map<String, Object> data = Map.of(
            "username", authentication.getName(),
            "authenticated", true
        );

        return ApiResponseFactory.success(
            data,
            "Current user retrieved successfully",
            request
        );
    }
}
