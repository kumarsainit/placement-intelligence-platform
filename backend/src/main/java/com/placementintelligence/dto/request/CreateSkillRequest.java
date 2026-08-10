package com.placementintelligence.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateSkillRequest(

    @NotBlank(message = "Skill name is required")
    @Size(max = 100, message = "Skill name must not exceed 100 characters")
    String name,

    @NotBlank(message = "Skill category is required")
    @Size(max = 50, message = "Skill category must not exceed 50 characters")
    String category,

    @Size(max = 500, message = "Description must not exceed 500 characters")
    String description

) {
}
