package com.placementintelligence.service;

import com.placementintelligence.dto.request.UpdateUserRoleRequest;
import com.placementintelligence.dto.request.UpdateUserStatusRequest;
import com.placementintelligence.dto.response.AdminUserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminUserService {

    List<AdminUserResponse> getAllUsers(String callerUsername);

    Page<AdminUserResponse> getUsers(String callerUsername, Pageable pageable);

    AdminUserResponse getUserById(String callerUsername, Long userId);

    AdminUserResponse updateUserStatus(String callerUsername, Long userId, UpdateUserStatusRequest request);

    AdminUserResponse updateUserRole(String callerUsername, Long userId, UpdateUserRoleRequest request);
}
