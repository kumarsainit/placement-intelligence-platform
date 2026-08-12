package com.placementintelligence.entity;

import com.placementintelligence.common.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(
    name = "job_applications",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_job_application_job_applicant",
            columnNames = {"job_id", "applicant_id"}
        )
    },
    indexes = {
        @Index(
            name = "idx_job_applications_job_id",
            columnList = "job_id"
        ),
        @Index(
            name = "idx_job_applications_applicant_id",
            columnList = "applicant_id"
        ),
        @Index(
            name = "idx_job_applications_resume_id",
            columnList = "resume_id"
        ),
        @Index(
            name = "idx_job_applications_status",
            columnList = "status"
        ),
        @Index(
            name = "idx_job_applications_applied_at",
            columnList = "applied_at"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "job_id",
        nullable = false,
        foreignKey = @ForeignKey(
            name = "fk_job_application_job"
        )
    )
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "applicant_id",
        nullable = false,
        foreignKey = @ForeignKey(
            name = "fk_job_application_applicant"
        )
    )
    private User applicant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "resume_id",
        nullable = false,
        foreignKey = @ForeignKey(
            name = "fk_job_application_resume"
        )
    )
    private UserResume resume;

    @Column(
        name = "resume_file_name",
        nullable = false,
        length = 255
    )
    private String resumeFileName;

    @Column(
        name = "resume_file_url",
        nullable = false,
        length = 500
    )
    private String resumeFileUrl;

    @Column(
        name = "resume_file_type",
        nullable = false,
        length = 100
    )
    private String resumeFileType;

    @Column(
        name = "resume_file_size",
        nullable = false
    )
    private Long resumeFileSize;

    @Column(
        name = "cover_letter",
        columnDefinition = "TEXT"
    )
    private String coverLetter;

    @Enumerated(EnumType.STRING)
    @Column(
        nullable = false,
        length = 30
    )
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(
        name = "applied_at",
        nullable = false,
        updatable = false
    )
    private Instant appliedAt;

    @Column(
        name = "updated_at",
        nullable = false
    )
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        appliedAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
