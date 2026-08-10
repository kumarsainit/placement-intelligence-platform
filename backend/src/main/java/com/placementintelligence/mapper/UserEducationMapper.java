package com.placementintelligence.mapper;

import com.placementintelligence.dto.response.UserEducationResponse;
import com.placementintelligence.entity.UserEducation;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserEducationMapper {

    UserEducationResponse toResponse(
        UserEducation userEducation
    );

}
