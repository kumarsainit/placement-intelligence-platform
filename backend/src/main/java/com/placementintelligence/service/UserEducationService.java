package com.placementintelligence.service;

import com.placementintelligence.dto.request.AddUserEducationRequest;
import com.placementintelligence.dto.response.UserEducationResponse;

import java.util.List;

public interface UserEducationService {

    UserEducationResponse addEducation(
        String username,
        AddUserEducationRequest request
    );

    List<UserEducationResponse> getMyEducations(
        String username
    );

    UserEducationResponse getMyEducation(
        String username,
        Long userEducationId
    );

    UserEducationResponse updateMyEducation(
        String username,
        Long userEducationId,
        AddUserEducationRequest request
    );

    void removeMyEducation(
        String username,
        Long userEducationId
    );
}
