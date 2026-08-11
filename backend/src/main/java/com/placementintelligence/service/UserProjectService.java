package com.placementintelligence.service;

import com.placementintelligence.dto.request.AddUserProjectRequest;
import com.placementintelligence.dto.response.UserProjectResponse;

import java.util.List;

public interface UserProjectService {

    UserProjectResponse addProject(
        String username,
        AddUserProjectRequest request
    );

    List<UserProjectResponse> getMyProjects(
        String username
    );

    UserProjectResponse getMyProject(
        String username,
        Long projectId
    );

    UserProjectResponse updateMyProject(
        String username,
        Long projectId,
        AddUserProjectRequest request
    );

    void deleteMyProject(
        String username,
        Long projectId
    );
}
