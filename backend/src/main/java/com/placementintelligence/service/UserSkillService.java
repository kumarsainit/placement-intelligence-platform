package com.placementintelligence.service;

import com.placementintelligence.dto.request.AddUserSkillRequest;
import com.placementintelligence.dto.response.UserSkillResponse;

import java.util.List;

public interface UserSkillService {

    UserSkillResponse addSkill(
        String username,
        AddUserSkillRequest request
    );

    List<UserSkillResponse> getMySkills(
        String username
    );

    UserSkillResponse getMySkill(
        String username,
        Long userSkillId
    );

    UserSkillResponse updateMySkill(
        String username,
        Long userSkillId,
        AddUserSkillRequest request
    );

    void removeMySkill(
        String username,
        Long userSkillId
    );
}
