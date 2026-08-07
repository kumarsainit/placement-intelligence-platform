package com.placementintelligence.mapper;

import com.placementintelligence.dto.response.LoginResponse;
import com.placementintelligence.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "accessToken", ignore = true)
    @Mapping(target = "refreshToken", ignore = true)
    LoginResponse toLoginResponse(User user);
}
