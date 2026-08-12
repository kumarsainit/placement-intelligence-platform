package com.placementintelligence.service;

import com.placementintelligence.dto.request.CreateRecruiterProfileRequest;
import com.placementintelligence.dto.request.UpdateRecruiterProfileRequest;
import com.placementintelligence.dto.response.RecruiterProfileResponse;

public interface RecruiterProfileService {

    RecruiterProfileResponse createProfile(
        String username,
        CreateRecruiterProfileRequest request
    );

    RecruiterProfileResponse getCurrentProfile(
        String username
    );

    RecruiterProfileResponse updateProfile(
        String username,
        UpdateRecruiterProfileRequest request
    );
}
