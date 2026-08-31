package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.request.UpdateUserRoleRequest;
import com.placementintelligence.dto.request.UpdateUserStatusRequest;
import com.placementintelligence.dto.response.AdminUserResponse;
import com.placementintelligence.service.AdminUserService;
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
@RequestMapping("/v1/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ApiResponse<List<AdminUserResponse>> getAllUsers(
        Authentication authentication,
        HttpServletRequest request
    ) {
        List<AdminUserResponse> response =
            adminUserService.getAllUsers(authentication.getName());

        return ApiResponseFactory.success(
            response,
            "Users fetched successfully",
            request
        );
    }

    @GetMapping("/{userId}")
    public ApiResponse<AdminUserResponse> getUserById(
        Authentication authentication,
        @PathVariable Long userId,
        HttpServletRequest request
    ) {
        AdminUserResponse response =
            adminUserService.getUserById(authentication.getName(), userId);

        return ApiResponseFactory.success(
            response,
            "User fetched successfully",
            request
        );
    }

    @PatchMapping("/{userId}/status")
    public ApiResponse<AdminUserResponse> updateUserStatusPatch(
        Authentication authentication,
        @PathVariable Long userId,
        @Valid @RequestBody UpdateUserStatusRequest statusRequest,
        HttpServletRequest request
    ) {
        AdminUserResponse response =
            adminUserService.updateUserStatus(authentication.getName(), userId, statusRequest);

        return ApiResponseFactory.success(
            response,
            "User status updated successfully",
            request
        );
    }

    @PutMapping("/{userId}/status")
    public ApiResponse<AdminUserResponse> updateUserStatusPut(
        Authentication authentication,
        @PathVariable Long userId,
        @Valid @RequestBody UpdateUserStatusRequest statusRequest,
        HttpServletRequest request
    ) {
        return updateUserStatusPatch(authentication, userId, statusRequest, request);
    }

    @PatchMapping("/{userId}/role")
    public ApiResponse<AdminUserResponse> updateUserRolePatch(
        Authentication authentication,
        @PathVariable Long userId,
        @Valid @RequestBody UpdateUserRoleRequest roleRequest,
        HttpServletRequest request
    ) {
        AdminUserResponse response =
            adminUserService.updateUserRole(authentication.getName(), userId, roleRequest);

        return ApiResponseFactory.success(
            response,
            "User role updated successfully",
            request
        );
    }

    @PutMapping("/{userId}/role")
    public ApiResponse<AdminUserResponse> updateUserRolePut(
        Authentication authentication,
        @PathVariable Long userId,
        @Valid @RequestBody UpdateUserRoleRequest roleRequest,
        HttpServletRequest request
    ) {
        return updateUserRolePatch(authentication, userId, roleRequest, request);
    }
}
