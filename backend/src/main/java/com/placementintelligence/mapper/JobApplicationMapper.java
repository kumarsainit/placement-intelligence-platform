package com.placementintelligence.mapper;

import com.placementintelligence.dto.response.JobApplicationResponse;
import com.placementintelligence.entity.JobApplication;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface JobApplicationMapper {

    @Mapping(
        target = "jobId",
        source = "job.id"
    )
    @Mapping(
        target = "jobTitle",
        source = "job.title"
    )
    @Mapping(
        target = "applicantId",
        source = "applicant.id"
    )
    @Mapping(
        target = "applicantUsername",
        source = "applicant.username"
    )
    @Mapping(
        target = "resumeId",
        source = "resume.id"
    )
    JobApplicationResponse toResponse(
        JobApplication application
    );
}
