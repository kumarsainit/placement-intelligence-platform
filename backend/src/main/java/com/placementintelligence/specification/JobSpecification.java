package com.placementintelligence.specification;

import com.placementintelligence.common.enums.EmploymentType;
import com.placementintelligence.common.enums.ExperienceLevel;
import com.placementintelligence.common.enums.JobStatus;
import com.placementintelligence.entity.Job;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public final class JobSpecification {

    private JobSpecification() {
    }

    public static Specification<Job> hasOpenStatus() {
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.equal(
                root.get("status"),
                JobStatus.OPEN
            );
    }

    public static Specification<Job> keywordContains(
        String keyword) {

        return (root, query, criteriaBuilder) -> {

            if (keyword == null || keyword.isBlank()) {
                return null;
            }

            String pattern =
                "%" + keyword.trim().toLowerCase() + "%";

            return criteriaBuilder.or(
                criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("title")),
                    pattern
                ),
                criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("description")),
                    pattern
                )
            );
        };
    }

    public static Specification<Job> locationContains(
        String location) {

        return (root, query, criteriaBuilder) -> {

            if (location == null || location.isBlank()) {
                return null;
            }

            return criteriaBuilder.like(
                criteriaBuilder.lower(root.get("location")),
                "%" + location.trim().toLowerCase() + "%"
            );
        };
    }

    public static Specification<Job> hasCompany(
        Long companyId) {

        return (root, query, criteriaBuilder) -> {

            if (companyId == null) {
                return null;
            }

            return criteriaBuilder.equal(
                root.get("company").get("id"),
                companyId
            );
        };
    }

    public static Specification<Job> hasEmploymentType(
        EmploymentType employmentType) {

        return (root, query, criteriaBuilder) -> {

            if (employmentType == null) {
                return null;
            }

            return criteriaBuilder.equal(
                root.get("employmentType"),
                employmentType
            );
        };
    }

    public static Specification<Job> hasExperienceLevel(
        ExperienceLevel experienceLevel) {

        return (root, query, criteriaBuilder) -> {

            if (experienceLevel == null) {
                return null;
            }

            return criteriaBuilder.equal(
                root.get("experienceLevel"),
                experienceLevel
            );
        };
    }

    public static Specification<Job> salaryAtLeast(
        BigDecimal minSalary) {

        return (root, query, criteriaBuilder) -> {

            if (minSalary == null) {
                return null;
            }

            return criteriaBuilder.greaterThanOrEqualTo(
                root.get("salaryMax"),
                minSalary
            );
        };
    }

    public static Specification<Job> salaryAtMost(
        BigDecimal maxSalary) {

        return (root, query, criteriaBuilder) -> {

            if (maxSalary == null) {
                return null;
            }

            return criteriaBuilder.lessThanOrEqualTo(
                root.get("salaryMin"),
                maxSalary
            );
        };
    }
}
