package com.placementintelligence.service;

import com.placementintelligence.dto.request.UpdateProfileRequest;
import com.placementintelligence.dto.response.UserProfileResponse;

public interface UserProfileService {

    UserProfileResponse getCurrentUserProfile(String username);

    UserProfileResponse updateCurrentUserProfile(
        String username,
        UpdateProfileRequest request
    );
}
