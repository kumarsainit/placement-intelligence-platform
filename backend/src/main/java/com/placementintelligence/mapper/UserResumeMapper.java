package com.placementintelligence.mapper;

import com.placementintelligence.dto.response.ResumeResponse;
import com.placementintelligence.entity.UserResume;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserResumeMapper {

    @Mapping(
        target = "fileUrl",
        expression = "java(\"/api/v1/users/resumes/\" + resume.getId() + \"/file\")"
    )
    ResumeResponse toResponse(UserResume resume);
}
