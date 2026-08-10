package com.placementintelligence.mapper;

import com.placementintelligence.dto.response.UserSkillResponse;
import com.placementintelligence.entity.UserSkill;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserSkillMapper {

    @Mapping(target = "skillId", source = "skill.id")
    @Mapping(target = "skillName", source = "skill.name")
    @Mapping(target = "category", source = "skill.category")
    UserSkillResponse toResponse(UserSkill userSkill);
}
