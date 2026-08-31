package com.placementintelligence.service.impl;

import com.placementintelligence.dto.request.UploadResumeRequest;
import com.placementintelligence.dto.response.ResumeResponse;
import com.placementintelligence.entity.User;
import com.placementintelligence.entity.UserResume;
import com.placementintelligence.mapper.UserResumeMapper;
import com.placementintelligence.repository.UserRepository;
import com.placementintelligence.repository.UserResumeRepository;
import com.placementintelligence.service.FileStorageService;
import com.placementintelligence.service.UserResumeService;
import com.placementintelligence.validation.ResumeFileValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.exception.UnauthorizedException;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserResumeServiceImpl implements UserResumeService {

    private final UserRepository userRepository;
    private final UserResumeRepository resumeRepository;
    private final UserResumeMapper mapper;
    private final FileStorageService fileStorageService;
    private final ResumeFileValidator resumeFileValidator;

    @Override
    @Transactional
    public ResumeResponse uploadResume(
        String username,
        UploadResumeRequest request) {

        User user = getUser(username);

        /*
         * 1. Validate the uploaded file
         */
        resumeFileValidator.validate(request.file());

        /*
         * 2. Store the actual PDF file
         */
        String filePath =
            fileStorageService.storeResume(request.file());

        /*
         * 3. Check whether user already has a primary resume
         */
        boolean hasPrimary =
            resumeRepository.existsByUserAndIsPrimaryTrue(user);

        /*
         * 4. Create resume entity
         */
        UserResume resume = UserResume.builder()
            .user(user)
            .fileName(request.file().getOriginalFilename())
            .fileUrl(filePath)
            .fileType(request.file().getContentType())
            .fileSize(request.file().getSize())
            .isPrimary(false)
            .uploadedAt(Instant.now())
            .updatedAt(Instant.now())
            .build();

        /*
         * 5. First resume automatically becomes primary.
         *
         * Otherwise use the value requested by the client.
         */
        if (!hasPrimary) {
            resume.setIsPrimary(true);
        } else {
            resume.setIsPrimary(
                Boolean.TRUE.equals(request.isPrimary())
            );
        }

        /*
         * 6. If this resume is primary,
         * remove primary status from existing resumes.
         */
        if (Boolean.TRUE.equals(resume.getIsPrimary())) {
            removePrimaryStatus(user);
        }

        /*
         * 7. Save resume metadata in database
         */
        resume = resumeRepository.save(resume);

        return mapper.toResponse(resume);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResumeResponse> getMyResumes(String username) {

        User user = getUser(username);

        return resumeRepository.findByUser(user)
            .stream()
            .map(mapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ResumeResponse getMyResume(
        String username,
        Long resumeId) {

        User user = getUser(username);

        UserResume resume = resumeRepository
            .findById(resumeId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Resume not found"));

        verifyOwnership(resume, user);

        return mapper.toResponse(resume);
    }

    @Override
    @Transactional
    public ResumeResponse setPrimaryResume(
        String username,
        Long resumeId) {

        User user = getUser(username);

        UserResume resume = resumeRepository
            .findById(resumeId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Resume not found"));

        verifyOwnership(resume, user);

        /*
         * Remove primary status from all existing resumes
         */
        removePrimaryStatus(user);

        /*
         * Make selected resume primary
         */
        resume.setIsPrimary(true);
        resume.setUpdatedAt(Instant.now());

        resume = resumeRepository.save(resume);

        return mapper.toResponse(resume);
    }

    @Override
    @Transactional
    public void deleteResume(
        String username,
        Long resumeId) {

        User user = getUser(username);

        UserResume resume = resumeRepository
            .findById(resumeId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Resume not found"));

        verifyOwnership(resume, user);

        boolean wasPrimary =
            Boolean.TRUE.equals(resume.getIsPrimary());

        /*
         * Delete actual PDF from storage
         */
        fileStorageService.deleteResume(
            resume.getFileUrl()
        );

        /*
         * Delete resume metadata
         */
        resumeRepository.delete(resume);

        /*
         * If the deleted resume was primary,
         * promote the most recently uploaded
         * remaining resume.
         */
        if (wasPrimary) {

            resumeRepository
                .findFirstByUserOrderByUploadedAtDesc(user)
                .ifPresent(nextPrimary -> {

                    nextPrimary.setIsPrimary(true);
                    nextPrimary.setUpdatedAt(Instant.now());

                    resumeRepository.save(nextPrimary);
                });
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Resource getResumeFile(
        String username,
        Long resumeId) {

        User user = getUser(username);

        UserResume resume = resumeRepository
            .findById(resumeId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Resume not found"));

        verifyOwnership(resume, user);

        java.nio.file.Path filePath =
            fileStorageService.getResume(
                resume.getFileUrl()
            );

        return new FileSystemResource(filePath);
    }

    private User getUser(String username) {

        User user = userRepository.findByUsername(username)
            .orElseThrow(() ->
                new ResourceNotFoundException("User not found"));

        if (user.getRole() != com.placementintelligence.common.enums.UserRole.USER) {
            throw new org.springframework.security.access.AccessDeniedException("Only student users can access resume records");
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new org.springframework.security.access.AccessDeniedException("User account is inactive");
        }

        return user;
    }

    private void verifyOwnership(
        UserResume resume,
        User user) {

        if (!resume.getUser().getId().equals(user.getId())) {

            throw new org.springframework.security.access.AccessDeniedException(
                "You are not authorized to access this resume"
            );
        }
    }

    private void removePrimaryStatus(User user) {

        List<UserResume> resumes =
            resumeRepository.findByUser(user);

        for (UserResume resume : resumes) {

            if (Boolean.TRUE.equals(
                resume.getIsPrimary())) {

                resume.setIsPrimary(false);
                resume.setUpdatedAt(Instant.now());
            }
        }

        resumeRepository.saveAll(resumes);
    }
}
