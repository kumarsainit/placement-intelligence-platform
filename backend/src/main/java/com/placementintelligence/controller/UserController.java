package com.placementintelligence.controller;

import com.placementintelligence.common.enums.UserRole;
import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.entity.User;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> me(
        Authentication authentication,
        HttpServletRequest request
    ) {
        String role = authentication.getAuthorities()
            .stream()
            .findFirst()
            .map(authority ->
                authority.getAuthority().replace("ROLE_", "")
            )
            .orElse(null);

        Map<String, Object> data = Map.of(
            "username", authentication.getName(),
            "authenticated", true,
            "role", role
        );

        return ApiResponseFactory.success(
            data,
            "Current user retrieved successfully",
            request
        );
    }

    public record UpdateUserRoleRequest(
        @NotNull(message = "Role is required")
        UserRole role
    ) {}

    @PutMapping("/{userId}/role")
    public ApiResponse<Map<String, Object>> updateUserRole(
        Authentication authentication,
        @PathVariable Long userId,
        @Valid @RequestBody UpdateUserRoleRequest roleRequest,
        HttpServletRequest request
    ) {
        User caller = userRepository.findByUsername(authentication.getName())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!Boolean.TRUE.equals(caller.getIsActive())) {
            throw new AccessDeniedException("User account is inactive");
        }

        if (caller.getRole() != UserRole.ADMIN && caller.getRole() != UserRole.SUPER_ADMIN) {
            throw new AccessDeniedException("Only administrators can update user roles");
        }

        User targetUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Target user not found"));

        if (caller.getId().equals(targetUser.getId())) {
            throw new AccessDeniedException("Cannot modify own role");
        }

        if (caller.getRole() == UserRole.ADMIN) {
            if (targetUser.getRole() == UserRole.ADMIN || targetUser.getRole() == UserRole.SUPER_ADMIN) {
                throw new AccessDeniedException("ADMIN cannot modify roles of other administrators");
            }

            if (roleRequest.role() != UserRole.USER && roleRequest.role() != UserRole.RECRUITER) {
                throw new AccessDeniedException("ADMIN may only assign USER or RECRUITER roles");
            }
        }

        targetUser.setRole(roleRequest.role());
        targetUser.setUpdatedAt(Instant.now());
        userRepository.save(targetUser);

        Map<String, Object> data = Map.of(
            "userId", targetUser.getId(),
            "username", targetUser.getUsername(),
            "role", targetUser.getRole().name()
        );

        return ApiResponseFactory.success(
            data,
            "User role updated successfully",
            request
        );
    }
}
