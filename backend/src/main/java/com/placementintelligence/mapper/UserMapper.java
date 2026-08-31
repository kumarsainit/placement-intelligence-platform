package com.placementintelligence.mapper;

import com.placementintelligence.dto.response.AdminUserResponse;
import com.placementintelligence.dto.response.LoginResponse;
import com.placementintelligence.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "accessToken", ignore = true)
    @Mapping(target = "refreshToken", ignore = true)
    LoginResponse toLoginResponse(User user);

    AdminUserResponse toAdminUserResponse(User user);

    List<AdminUserResponse> toAdminUserResponseList(List<User> users);
}
