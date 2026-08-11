package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.request.AddUserProjectRequest;
import com.placementintelligence.dto.response.UserProjectResponse;
import com.placementintelligence.service.UserProjectService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/users/projects")
@RequiredArgsConstructor
public class UserProjectController {

    private final UserProjectService userProjectService;

    @PostMapping
    public ApiResponse<UserProjectResponse> addProject(
        Authentication authentication,
        @Valid @RequestBody AddUserProjectRequest request,
        HttpServletRequest httpRequest) {

        UserProjectResponse response =
            userProjectService.addProject(
                authentication.getName(),
                request
            );

        return ApiResponseFactory.created(
            response,
            "Project added successfully",
            httpRequest
        );
    }

    @GetMapping
    public ApiResponse<List<UserProjectResponse>> getMyProjects(
        Authentication authentication,
        HttpServletRequest httpRequest) {

        List<UserProjectResponse> response =
            userProjectService.getMyProjects(
                authentication.getName()
            );

        return ApiResponseFactory.success(
            response,
            "Projects fetched successfully",
            httpRequest
        );
    }

    @GetMapping("/{projectId}")
    public ApiResponse<UserProjectResponse> getMyProject(
        Authentication authentication,
        @PathVariable Long projectId,
        HttpServletRequest httpRequest) {

        UserProjectResponse response =
            userProjectService.getMyProject(
                authentication.getName(),
                projectId
            );

        return ApiResponseFactory.success(
            response,
            "Project fetched successfully",
            httpRequest
        );
    }

    @PutMapping("/{projectId}")
    public ApiResponse<UserProjectResponse> updateMyProject(
        Authentication authentication,
        @PathVariable Long projectId,
        @Valid @RequestBody AddUserProjectRequest request,
        HttpServletRequest httpRequest) {

        UserProjectResponse response =
            userProjectService.updateMyProject(
                authentication.getName(),
                projectId,
                request
            );

        return ApiResponseFactory.success(
            response,
            "Project updated successfully",
            httpRequest
        );
    }

    @DeleteMapping("/{projectId}")
    public ApiResponse<Void> deleteMyProject(
        Authentication authentication,
        @PathVariable Long projectId,
        HttpServletRequest httpRequest) {

        userProjectService.deleteMyProject(
            authentication.getName(),
            projectId
        );

        return ApiResponseFactory.success(
            null,
            "Project removed successfully",
            httpRequest
        );
    }
}
