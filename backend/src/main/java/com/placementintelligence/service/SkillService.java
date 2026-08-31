package com.placementintelligence.service;

import com.placementintelligence.dto.request.CreateSkillRequest;
import com.placementintelligence.dto.response.SkillResponse;

import java.util.List;

public interface SkillService {

    SkillResponse createSkill(String username, CreateSkillRequest request);

    List<SkillResponse> getAllSkills();

    SkillResponse getSkillById(Long skillId);

    SkillResponse updateSkill(
        String username,
        Long skillId,
        CreateSkillRequest request
    );

    void deleteSkill(String username, Long skillId);
}
