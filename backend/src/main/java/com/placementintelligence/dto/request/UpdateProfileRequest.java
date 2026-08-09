package com.placementintelligence.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdateProfileRequest(

    @Size(max = 100)
    String fullName,

    @Size(max = 150)
    String college,

    @Size(max = 100)
    String degree,

    @Size(max = 100)
    String branch,

    @Min(2000)
    @Max(2100)
    Integer graduationYear,

    @DecimalMin("0.00")
    @DecimalMax("10.00")
    BigDecimal cgpa,

    @Size(max = 500)
    String bio,

    String githubUrl,

    String linkedinUrl,

    String leetcodeUrl,

    String codeforcesUrl,

    String portfolioUrl
) {
}
