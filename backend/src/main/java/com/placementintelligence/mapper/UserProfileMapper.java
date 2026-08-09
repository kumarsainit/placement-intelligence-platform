package com.placementintelligence.mapper;

import com.placementintelligence.dto.request.UpdateProfileRequest;
import com.placementintelligence.dto.response.UserProfileResponse;
import com.placementintelligence.entity.UserProfile;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {

    @Mapping(target = "username", source = "user.username")
    @Mapping(target = "phoneNumber", source = "user.phoneNumber")
    UserProfileResponse toResponse(UserProfile profile);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateProfileFromRequest(
        UpdateProfileRequest request,
        @MappingTarget UserProfile profile
    );
}
