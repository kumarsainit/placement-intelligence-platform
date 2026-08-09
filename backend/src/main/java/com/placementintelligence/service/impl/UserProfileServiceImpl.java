package com.placementintelligence.service.impl;

import com.placementintelligence.dto.request.UpdateProfileRequest;
import com.placementintelligence.dto.response.UserProfileResponse;
import com.placementintelligence.entity.User;
import com.placementintelligence.entity.UserProfile;
import com.placementintelligence.mapper.UserProfileMapper;
import com.placementintelligence.repository.UserProfileRepository;
import com.placementintelligence.repository.UserRepository;
import com.placementintelligence.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository profileRepository;
    private final UserProfileMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(String username) {

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepository
            .findByUsername(username)
            .orElseGet(() -> createEmptyProfile(user));

        return mapper.toResponse(profile);
    }

    @Override
    @Transactional
    public UserProfileResponse updateCurrentUserProfile(
        String username,
        UpdateProfileRequest request) {

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepository
            .findByUsername(username)
            .orElseGet(() -> createEmptyProfile(user));

        mapper.updateProfileFromRequest(request, profile);

        profile.setUpdatedAt(Instant.now());

        profile = profileRepository.save(profile);

        return mapper.toResponse(profile);
    }

    private UserProfile createEmptyProfile(User user) {

        UserProfile profile = UserProfile.builder()
            .user(user)
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .build();

        return profileRepository.save(profile);
    }
}
