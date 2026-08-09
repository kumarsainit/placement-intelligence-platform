package com.placementintelligence.mapper;

import com.placementintelligence.dto.response.ResumeResponse;
import com.placementintelligence.entity.UserResume;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserResumeMapper {

    ResumeResponse toResponse(UserResume resume);
}
