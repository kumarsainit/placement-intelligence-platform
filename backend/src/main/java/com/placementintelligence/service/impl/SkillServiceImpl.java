package com.placementintelligence.service.impl;

import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.exception.ResourceAlreadyExistsException;
import com.placementintelligence.dto.request.CreateSkillRequest;
import com.placementintelligence.dto.response.SkillResponse;
import com.placementintelligence.entity.Skill;
import com.placementintelligence.mapper.SkillMapper;
import com.placementintelligence.repository.SkillRepository;
import com.placementintelligence.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final SkillMapper skillMapper;

    @Override
    @Transactional
    public SkillResponse createSkill(CreateSkillRequest request) {

        String normalizedName = normalizeName(request.name());

        if (skillRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new ResourceAlreadyExistsException("Skill already exists");
        }

        Skill skill = skillMapper.toEntity(request);

        skill.setName(normalizedName);
        skill.setIsActive(true);
        skill.setCreatedAt(Instant.now());
        skill.setUpdatedAt(Instant.now());

        skill = skillRepository.save(skill);

        return skillMapper.toResponse(skill);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponse> getAllSkills() {

        return skillRepository.findAll()
            .stream()
            .map(skillMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SkillResponse getSkillById(Long skillId) {

        Skill skill = getSkill(skillId);

        return skillMapper.toResponse(skill);
    }

    @Override
    @Transactional
    public SkillResponse updateSkill(
        Long skillId,
        CreateSkillRequest request) {

        Skill skill = getSkill(skillId);

        String normalizedName = normalizeName(request.name());

        skillRepository.findByNameIgnoreCase(normalizedName)
            .ifPresent(existing -> {
                if (!existing.getId().equals(skillId)) {
                    throw new ResourceAlreadyExistsException("Another skill with this name already exists");
                }
            });

        skill.setName(normalizedName);
        skill.setCategory(request.category());
        skill.setDescription(request.description());
        skill.setUpdatedAt(Instant.now());

        skill = skillRepository.save(skill);

        return skillMapper.toResponse(skill);
    }

    @Override
    @Transactional
    public void deleteSkill(Long skillId) {

        Skill skill = getSkill(skillId);

        /*
         * Soft delete is safer for a master skill table.
         *
         * Existing student skill mappings remain valid.
         */
        skill.setIsActive(false);
        skill.setUpdatedAt(Instant.now());

        skillRepository.save(skill);
    }

    private Skill getSkill(Long skillId) {

        return skillRepository.findById(skillId)
            .orElseThrow(() ->
                new ResourceNotFoundException("Skill not found"));
    }

    private String normalizeName(String name) {

        return name.trim()
            .replaceAll("\\s+", " ");
    }
}
