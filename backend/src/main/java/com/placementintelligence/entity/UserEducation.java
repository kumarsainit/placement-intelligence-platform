package com.placementintelligence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(
    name = "user_educations",
    indexes = {
        @Index(name = "idx_user_educations_user_id", columnList = "user_id"),
        @Index(name = "idx_user_educations_level", columnList = "education_level")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEducation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "user_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_user_educations_user")
    )
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "education_level",
        nullable = false,
        length = 30
    )
    private EducationLevel educationLevel;

    @Column(length = 150)
    private String degree;

    @Column(nullable = false, length = 200)
    private String institution;

    @Column(name = "field_of_study", length = 150)
    private String fieldOfStudy;

    @Column(name = "start_year")
    private Integer startYear;

    @Column(name = "end_year")
    private Integer endYear;

    @Column(
        precision = 4,
        scale = 2
    )
    private BigDecimal cgpa;

    @Column(
        precision = 5,
        scale = 2
    )
    private BigDecimal percentage;

    @Column(
        name = "currently_pursuing",
        nullable = false
    )
    @Builder.Default
    private Boolean currentlyPursuing = false;

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
