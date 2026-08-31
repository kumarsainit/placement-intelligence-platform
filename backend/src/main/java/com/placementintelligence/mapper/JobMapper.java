package com.placementintelligence.mapper;

import com.placementintelligence.dto.response.JobResponse;
import com.placementintelligence.entity.Job;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface JobMapper {

    @Mapping(
        target = "companyId",
        source = "company.id"
    )
    @Mapping(
        target = "companyName",
        source = "company.name"
    )
    @Mapping(
        target = "recruiterProfileId",
        source = "recruiter.id"
    )
    @Mapping(
        target = "userId",
        source = "recruiter.user.id"
    )
    @Mapping(
        target = "recruiterUsername",
        source = "recruiter.user.username"
    )
    JobResponse toResponse(Job job);

    List<JobResponse> toResponseList(List<Job> jobs);
}
