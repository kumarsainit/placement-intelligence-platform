package com.placementintelligence.service.impl;

import com.placementintelligence.dto.request.AddUserProjectRequest;
import com.placementintelligence.dto.response.UserProjectResponse;
import com.placementintelligence.entity.User;
import com.placementintelligence.entity.UserProject;
import com.placementintelligence.exception.BadRequestException;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.mapper.UserProjectMapper;
import com.placementintelligence.repository.UserProjectRepository;
import com.placementintelligence.repository.UserRepository;
import com.placementintelligence.service.UserProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserProjectServiceImpl implements UserProjectService {

    private final UserRepository userRepository;
    private final UserProjectRepository userProjectRepository;
    private final UserProjectMapper userProjectMapper;

    @Override
    @Transactional
    public UserProjectResponse addProject(
        String username,
        AddUserProjectRequest request) {

        User user = getUser(username);

        validateProjectDates(request);

        UserProject project = UserProject.builder()
            .user(user)
            .title(request.title())
            .description(request.description())
            .technologies(request.technologies())
            .projectUrl(request.projectUrl())
            .githubUrl(request.githubUrl())
            .startDate(request.startDate())
            .endDate(request.endDate())
            .currentlyWorking(
                Boolean.TRUE.equals(request.currentlyWorking())
            )
            .createdAt(Instant.now())
            .updatedAt(Instant.now())
            .build();

        project = userProjectRepository.save(project);

        return userProjectMapper.toResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserProjectResponse> getMyProjects(
        String username) {

        User user = getUser(username);

        return userProjectRepository.findByUser(user)
            .stream()
            .map(userProjectMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UserProjectResponse getMyProject(
        String username,
        Long projectId) {

        User user = getUser(username);

        UserProject project =
            getProject(projectId);

        verifyOwnership(project, user);

        return userProjectMapper.toResponse(project);
    }

    @Override
    @Transactional
    public UserProjectResponse updateMyProject(
        String username,
        Long projectId,
        AddUserProjectRequest request) {

        User user = getUser(username);

        UserProject project =
            getProject(projectId);

        verifyOwnership(project, user);

        validateProjectDates(request);

        project.setTitle(request.title());
        project.setDescription(request.description());
        project.setTechnologies(request.technologies());
        project.setProjectUrl(request.projectUrl());
        project.setGithubUrl(request.githubUrl());
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());
        project.setCurrentlyWorking(
            Boolean.TRUE.equals(request.currentlyWorking())
        );
        project.setUpdatedAt(Instant.now());

        project = userProjectRepository.save(project);

        return userProjectMapper.toResponse(project);
    }

    @Override
    @Transactional
    public void deleteMyProject(
        String username,
        Long projectId) {

        User user = getUser(username);

        UserProject project =
            getProject(projectId);

        verifyOwnership(project, user);

        userProjectRepository.delete(project);
    }

    private User getUser(String username) {

        return userRepository.findByUsername(username)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "User not found"
                )
            );
    }

    private UserProject getProject(Long projectId) {

        return userProjectRepository.findById(projectId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Project not found"
                )
            );
    }

    private void verifyOwnership(
        UserProject project,
        User user) {

        if (!project.getUser().getId()
            .equals(user.getId())) {

            throw new com.placementintelligence.exception.UnauthorizedException(
                "You are not authorized to access this project"
            );
        }
    }

    private void validateProjectDates(
        AddUserProjectRequest request) {

        if (request.startDate() != null
            && request.endDate() != null
            && request.endDate()
            .isBefore(request.startDate())) {

            throw new BadRequestException(
                "End date cannot be before start date"
            );
        }

        if (Boolean.TRUE.equals(request.currentlyWorking())
            && request.endDate() != null) {

            throw new BadRequestException(
                "End date must be empty when currently working"
            );
        }
    }
}
