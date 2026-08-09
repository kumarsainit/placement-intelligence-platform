package com.placementintelligence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(
    name = "user_skills",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_user_skill",
            columnNames = {"user_id", "skill_id"}
        )
    },
    indexes = {
        @Index(
            name = "idx_user_skills_user_id",
            columnList = "user_id"
        ),
        @Index(
            name = "idx_user_skills_skill_id",
            columnList = "skill_id"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "user_id",
        nullable = false
    )
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "skill_id",
        nullable = false
    )
    private Skill skill;

    @Column(length = 30)
    private String proficiency;

    @Column(
        name = "years_of_experience",
        precision = 4,
        scale = 2
    )
    private BigDecimal yearsOfExperience;

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
