package com.placementintelligence.mapper;

import com.placementintelligence.dto.response.UserProjectResponse;
import com.placementintelligence.entity.UserProject;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserProjectMapper {

    UserProjectResponse toResponse(UserProject userProject);
}
