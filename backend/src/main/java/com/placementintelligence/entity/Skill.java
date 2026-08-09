package com.placementintelligence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(
    name = "skills",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_skill_name", columnNames = "name")
    },
    indexes = {
        @Index(name = "idx_skills_category", columnList = "category")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
        nullable = false,
        unique = true,
        length = 100
    )
    private String name;

    @Column(
        nullable = false,
        length = 50
    )
    private String category;

    @Column(length = 500)
    private String description;

    @Column(
        name = "is_active",
        nullable = false
    )
    @Builder.Default
    private Boolean isActive = true;

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
