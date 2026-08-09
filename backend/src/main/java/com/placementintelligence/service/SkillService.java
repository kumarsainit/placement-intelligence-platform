package com.placementintelligence.service;

import com.placementintelligence.dto.request.CreateSkillRequest;
import com.placementintelligence.dto.response.SkillResponse;

import java.util.List;

public interface SkillService {

    SkillResponse createSkill(CreateSkillRequest request);

    List<SkillResponse> getAllSkills();

    SkillResponse getSkillById(Long skillId);

    SkillResponse updateSkill(
        Long skillId,
        CreateSkillRequest request
    );

    void deleteSkill(Long skillId);
}
