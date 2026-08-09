package com.placementintelligence.dto.response;

import java.math.BigDecimal;

public record UserProfileResponse(

    String username,

    String phoneNumber,

    String fullName,

    String college,

    String degree,

    String branch,

    Integer graduationYear,

    BigDecimal cgpa,

    String bio,

    String githubUrl,

    String linkedinUrl,

    String leetcodeUrl,

    String codeforcesUrl,

    String portfolioUrl,

    String profilePhotoUrl,

    String resumeUrl
) {
}
