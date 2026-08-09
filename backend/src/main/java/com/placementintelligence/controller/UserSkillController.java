package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.request.AddUserSkillRequest;
import com.placementintelligence.dto.response.UserSkillResponse;
import com.placementintelligence.service.UserSkillService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/v1/users/skills")
@RequiredArgsConstructor
public class UserSkillController {

    private final UserSkillService userSkillService;

    @PostMapping
    public ApiResponse<UserSkillResponse> addSkill(
        Authentication authentication,
        @Valid @RequestBody AddUserSkillRequest request,
        HttpServletRequest httpRequest) {

        UserSkillResponse response =
            userSkillService.addSkill(
                authentication.getName(),
                request
            );

        return ApiResponseFactory.success(
            response,
            "Skill added successfully",
            httpRequest
        );
    }

    @GetMapping
    public ApiResponse<List<UserSkillResponse>> getMySkills(
        Authentication authentication,
        HttpServletRequest httpRequest) {

        List<UserSkillResponse> response =
            userSkillService.getMySkills(
                authentication.getName()
            );

        return ApiResponseFactory.success(
            response,
            "Skills fetched successfully",
            httpRequest
        );
    }

    @GetMapping("/{userSkillId}")
    public ApiResponse<UserSkillResponse> getMySkill(
        Authentication authentication,
        @PathVariable Long userSkillId,
        HttpServletRequest httpRequest) {

        UserSkillResponse response =
            userSkillService.getMySkill(
                authentication.getName(),
                userSkillId
            );

        return ApiResponseFactory.success(
            response,
            "User skill fetched successfully",
            httpRequest
        );
    }

    @PutMapping("/{userSkillId}")
    public ApiResponse<UserSkillResponse> updateMySkill(
        Authentication authentication,
        @PathVariable Long userSkillId,
        @Valid @RequestBody AddUserSkillRequest request,
        HttpServletRequest httpRequest) {

        UserSkillResponse response =
            userSkillService.updateMySkill(
                authentication.getName(),
                userSkillId,
                request
            );

        return ApiResponseFactory.success(
            response,
            "User skill updated successfully",
            httpRequest
        );
    }

    @DeleteMapping("/{userSkillId}")
    public ApiResponse<Void> removeMySkill(
        Authentication authentication,
        @PathVariable Long userSkillId,
        HttpServletRequest httpRequest) {

        userSkillService.removeMySkill(
            authentication.getName(),
            userSkillId
        );

        return ApiResponseFactory.success(
            null,
            "Skill removed successfully",
            httpRequest
        );
    }
}
