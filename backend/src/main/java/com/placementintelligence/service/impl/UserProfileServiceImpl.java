package com.placementintelligence.service.impl;

import com.placementintelligence.common.enums.UserRole;
import com.placementintelligence.dto.request.UpdateProfileRequest;
import com.placementintelligence.dto.response.UserProfileResponse;
import com.placementintelligence.entity.User;
import com.placementintelligence.entity.UserProfile;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.exception.UnauthorizedException;
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

        User user = getUser(username);

        UserProfile profile = profileRepository
            .findByUsername(username)
            .orElseGet(() -> buildEmptyProfile(user));

        return mapper.toResponse(profile);
    }

    @Override
    @Transactional
    public UserProfileResponse updateCurrentUserProfile(
        String username,
        UpdateProfileRequest request) {

        User user = getUser(username);

        UserProfile profile = profileRepository
            .findByUsername(username)
            .orElseGet(() -> createEmptyProfile(user));

        mapper.updateProfileFromRequest(request, profile);

        profile.setUpdatedAt(Instant.now());

        profile = profileRepository.save(profile);

        return mapper.toResponse(profile);
    }

    private User getUser(String username) {

        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != UserRole.USER) {
            throw new org.springframework.security.access.AccessDeniedException("Only student users can access student profile");
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new org.springframework.security.access.AccessDeniedException("User account is inactive");
        }

        return user;
    }

    /**
     * Creates an in-memory empty profile representation.
     *
     * This method MUST NOT persist the entity because it can be
     * called from a read-only transaction.
     */
    private UserProfile buildEmptyProfile(User user) {

        return UserProfile.builder()
            .user(user)
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .build();
    }

    /**
     * Creates and persists a profile.
     *
     * This method is only called from the write transaction.
     */
    private UserProfile createEmptyProfile(User user) {

        UserProfile profile = buildEmptyProfile(user);

        return profileRepository.save(profile);
    }
}
