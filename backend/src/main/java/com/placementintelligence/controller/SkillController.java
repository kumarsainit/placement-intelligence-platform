package com.placementintelligence.controller;

import com.placementintelligence.common.response.ApiResponse;
import com.placementintelligence.common.response.ApiResponseFactory;
import com.placementintelligence.dto.request.CreateSkillRequest;
import com.placementintelligence.dto.response.SkillResponse;
import com.placementintelligence.service.SkillService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @PostMapping
    public ApiResponse<SkillResponse> createSkill(
        org.springframework.security.core.Authentication authentication,
        @Valid @RequestBody CreateSkillRequest request,
        HttpServletRequest httpRequest) {

        SkillResponse response =
            skillService.createSkill(authentication.getName(), request);

        return ApiResponseFactory.success(
            response,
            "Skill created successfully",
            httpRequest
        );
    }

    @GetMapping
    public ApiResponse<List<SkillResponse>> getAllSkills(
        HttpServletRequest httpRequest) {

        List<SkillResponse> response =
            skillService.getAllSkills();

        return ApiResponseFactory.success(
            response,
            "Skills fetched successfully",
            httpRequest
        );
    }

    @GetMapping("/{skillId}")
    public ApiResponse<SkillResponse> getSkillById(
        @PathVariable Long skillId,
        HttpServletRequest httpRequest) {

        SkillResponse response =
            skillService.getSkillById(skillId);

        return ApiResponseFactory.success(
            response,
            "Skill fetched successfully",
            httpRequest
        );
    }

    @PutMapping("/{skillId}")
    public ApiResponse<SkillResponse> updateSkill(
        org.springframework.security.core.Authentication authentication,
        @PathVariable Long skillId,
        @Valid @RequestBody CreateSkillRequest request,
        HttpServletRequest httpRequest) {

        SkillResponse response =
            skillService.updateSkill(
                authentication.getName(),
                skillId,
                request
            );

        return ApiResponseFactory.success(
            response,
            "Skill updated successfully",
            httpRequest
        );
    }

    @DeleteMapping("/{skillId}")
    public ApiResponse<Void> deleteSkill(
        org.springframework.security.core.Authentication authentication,
        @PathVariable Long skillId,
        HttpServletRequest httpRequest) {

        skillService.deleteSkill(authentication.getName(), skillId);

        return ApiResponseFactory.success(
            null,
            "Skill deactivated successfully",
            httpRequest
        );
    }
}
