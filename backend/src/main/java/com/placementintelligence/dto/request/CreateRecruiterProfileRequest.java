package com.placementintelligence.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRecruiterProfileRequest(

    @NotNull(message = "Company ID is required")
    Long companyId,

    @Size(
        max = 150,
        message = "Designation must not exceed 150 characters"
    )
    String designation,

    @Size(
        max = 100,
        message = "Department must not exceed 100 characters"
    )
    String department,

    @Size(
        max = 100,
        message = "Employee ID must not exceed 100 characters"
    )
    String employeeId
) {
}
