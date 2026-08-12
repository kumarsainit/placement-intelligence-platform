package com.placementintelligence.mapper;

import com.placementintelligence.dto.response.RecruiterProfileResponse;
import com.placementintelligence.entity.RecruiterProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RecruiterProfileMapper {

    @Mapping(
        target = "userId",
        source = "user.id"
    )
    @Mapping(
        target = "username",
        source = "user.username"
    )
    @Mapping(
        target = "companyId",
        source = "company.id"
    )
    @Mapping(
        target = "companyName",
        source = "company.name"
    )
    RecruiterProfileResponse toResponse(
        RecruiterProfile recruiterProfile
    );
}
