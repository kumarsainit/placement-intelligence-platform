package com.placementintelligence.service.impl;

import com.placementintelligence.common.enums.UserRole;
import com.placementintelligence.dto.request.UpdateUserRoleRequest;
import com.placementintelligence.dto.request.UpdateUserStatusRequest;
import com.placementintelligence.dto.response.AdminUserResponse;
import com.placementintelligence.entity.User;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.mapper.UserMapper;
import com.placementintelligence.repository.UserRepository;
import com.placementintelligence.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    private User validateAdminCaller(String callerUsername) {
        User caller = userRepository.findByUsername(callerUsername)
            .orElseThrow(() -> new ResourceNotFoundException("Caller user not found"));

        if (!Boolean.TRUE.equals(caller.getIsActive())) {
            throw new AccessDeniedException("User account is inactive");
        }

        if (caller.getRole() != UserRole.ADMIN && caller.getRole() != UserRole.SUPER_ADMIN) {
            throw new AccessDeniedException("Only administrators can access user management");
        }

        return caller;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers(String callerUsername) {
        validateAdminCaller(callerUsername);
        List<User> users = userRepository.findAllByOrderByCreatedAtDesc();
        return userMapper.toAdminUserResponseList(users);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserResponse> getUsers(String callerUsername, Pageable pageable) {
        validateAdminCaller(callerUsername);
        return userRepository.findAll(pageable).map(userMapper::toAdminUserResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserResponse getUserById(String callerUsername, Long userId) {
        validateAdminCaller(callerUsername);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return userMapper.toAdminUserResponse(user);
    }

    @Override
    @Transactional
    public AdminUserResponse updateUserStatus(
        String callerUsername,
        Long userId,
        UpdateUserStatusRequest request
    ) {
        User caller = validateAdminCaller(callerUsername);

        User targetUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (caller.getId().equals(targetUser.getId()) && Boolean.FALSE.equals(request.isActive())) {
            throw new AccessDeniedException("Administrators cannot deactivate their own account");
        }

        if (caller.getRole() == UserRole.ADMIN) {
            if (targetUser.getRole() == UserRole.ADMIN || targetUser.getRole() == UserRole.SUPER_ADMIN) {
                throw new AccessDeniedException("ADMIN cannot modify the status of other administrators");
            }
        }

        if (targetUser.getRole() == UserRole.SUPER_ADMIN && Boolean.FALSE.equals(request.isActive())) {
            long activeSuperAdmins = userRepository.countByRoleAndIsActiveTrue(UserRole.SUPER_ADMIN);
            if (activeSuperAdmins <= 1 && Boolean.TRUE.equals(targetUser.getIsActive())) {
                throw new AccessDeniedException("Cannot deactivate the final active SUPER_ADMIN account");
            }
        }

        targetUser.setIsActive(request.isActive());
        targetUser.setUpdatedAt(Instant.now());
        User updated = userRepository.save(targetUser);

        return userMapper.toAdminUserResponse(updated);
    }

    @Override
    @Transactional
    public AdminUserResponse updateUserRole(
        String callerUsername,
        Long userId,
        UpdateUserRoleRequest request
    ) {
        User caller = validateAdminCaller(callerUsername);

        User targetUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (caller.getId().equals(targetUser.getId())) {
            throw new AccessDeniedException("Cannot modify own role");
        }

        if (caller.getRole() == UserRole.ADMIN) {
            if (targetUser.getRole() == UserRole.ADMIN || targetUser.getRole() == UserRole.SUPER_ADMIN) {
                throw new AccessDeniedException("ADMIN cannot modify roles of other administrators");
            }

            if (request.role() != UserRole.USER && request.role() != UserRole.RECRUITER) {
                throw new AccessDeniedException("ADMIN may only assign USER or RECRUITER roles");
            }
        }

        if (targetUser.getRole() == UserRole.SUPER_ADMIN && request.role() != UserRole.SUPER_ADMIN) {
            long activeSuperAdmins = userRepository.countByRoleAndIsActiveTrue(UserRole.SUPER_ADMIN);
            if (activeSuperAdmins <= 1 && Boolean.TRUE.equals(targetUser.getIsActive())) {
                throw new AccessDeniedException("Cannot demote the final active SUPER_ADMIN account");
            }
        }

        targetUser.setRole(request.role());
        targetUser.setUpdatedAt(Instant.now());
        User updated = userRepository.save(targetUser);

        return userMapper.toAdminUserResponse(updated);
    }
}
