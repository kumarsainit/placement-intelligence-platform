package com.placementintelligence.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCompanyRequest(

    @NotBlank(message = "Company name is required")
    @Size(
        max = 200,
        message = "Company name must not exceed 200 characters"
    )
    String name,

    @Size(
        max = 500,
        message = "Website must not exceed 500 characters"
    )
    String website,

    @Size(
        max = 150,
        message = "Industry must not exceed 150 characters"
    )
    String industry,

    String description,

    @Size(
        max = 200,
        message = "Location must not exceed 200 characters"
    )
    String location

) {
}
