package com.placementintelligence.service;

import com.placementintelligence.dto.request.UploadResumeRequest;
import com.placementintelligence.dto.response.ResumeResponse;
import org.springframework.core.io.Resource;

import java.util.List;

public interface UserResumeService {



    ResumeResponse uploadResume(
        String username,
        UploadResumeRequest request
    );

    List<ResumeResponse> getMyResumes(
        String username
    );

    ResumeResponse getMyResume(
        String username,
        Long resumeId
    );

    ResumeResponse setPrimaryResume(
        String username,
        Long resumeId
    );

    void deleteResume(
        String username,
        Long resumeId
    );

    Resource getResumeFile(String username, Long resumeId);
}
