package com.placementintelligence.entity;

import com.placementintelligence.common.enums.EmploymentType;
import com.placementintelligence.common.enums.ExperienceLevel;
import com.placementintelligence.common.enums.JobStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(
    name = "jobs",
    indexes = {
        @Index(
            name = "idx_jobs_company_id",
            columnList = "company_id"
        ),
        @Index(
            name = "idx_jobs_recruiter_id",
            columnList = "recruiter_id"
        ),
        @Index(
            name = "idx_jobs_status",
            columnList = "status"
        ),
        @Index(
            name = "idx_jobs_deadline",
            columnList = "application_deadline"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "company_id",
        nullable = false,
        foreignKey = @ForeignKey(
            name = "fk_job_company"
        )
    )
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "recruiter_id",
        nullable = false,
        foreignKey = @ForeignKey(
            name = "fk_job_recruiter"
        )
    )
    private RecruiterProfile recruiter;

    @Column(
        nullable = false,
        length = 200
    )
    private String title;

    @Column(
        nullable = false,
        columnDefinition = "TEXT"
    )
    private String description;

    @Column(length = 200)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "employment_type",
        nullable = false,
        length = 30
    )
    private EmploymentType employmentType;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "experience_level",
        nullable = false,
        length = 30
    )
    private ExperienceLevel experienceLevel;

    @Column(
        name = "salary_min",
        precision = 12,
        scale = 2
    )
    private BigDecimal salaryMin;

    @Column(
        name = "salary_max",
        precision = 12,
        scale = 2
    )
    private BigDecimal salaryMax;

    @Column(
        nullable = false
    )
    private Integer openings;

    @Column(
        name = "application_deadline",
        nullable = false
    )
    private LocalDate applicationDeadline;

    @Enumerated(EnumType.STRING)
    @Column(
        nullable = false,
        length = 30
    )
    @Builder.Default
    private JobStatus status = JobStatus.DRAFT;

    @Column(
        name = "created_at",
        nullable = false,
        updatable = false
    )
    private Instant createdAt;

    @Column(
        name = "updated_at",
        nullable = false
    )
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
