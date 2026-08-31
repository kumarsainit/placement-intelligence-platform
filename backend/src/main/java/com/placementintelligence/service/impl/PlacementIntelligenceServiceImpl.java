package com.placementintelligence.service.impl;

import com.placementintelligence.common.enums.ApplicationStatus;
import com.placementintelligence.common.enums.ExperienceLevel;
import com.placementintelligence.common.enums.JobStatus;
import com.placementintelligence.common.enums.UserRole;
import com.placementintelligence.dto.response.JobRecommendationResponse;
import com.placementintelligence.dto.response.StudentPlacementInsightsResponse;
import com.placementintelligence.entity.*;
import com.placementintelligence.exception.BadRequestException;
import com.placementintelligence.exception.ResourceNotFoundException;
import com.placementintelligence.mapper.JobMapper;
import com.placementintelligence.repository.*;
import com.placementintelligence.service.PlacementIntelligenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlacementIntelligenceServiceImpl implements PlacementIntelligenceService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserEducationRepository userEducationRepository;
    private final UserSkillRepository userSkillRepository;
    private final SkillRepository skillRepository;
    private final UserProjectRepository userProjectRepository;
    private final UserResumeRepository userResumeRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final JobMapper jobMapper;

    @Override
    @Transactional(readOnly = true)
    public List<JobRecommendationResponse> getJobRecommendations(String username) {
        User user = validateStudentCaller(username);

        // 1. Fetch student context
        StudentContext context = buildStudentContext(user);

        // 2. Fetch all open jobs
        List<Job> allOpenJobs = jobRepository.findByStatusOrderByCreatedAtDesc(JobStatus.OPEN);

        // 3. Fetch global active skill catalog for missing skills inference
        List<Skill> catalogSkills = skillRepository.findAll();

        // 4. Score and filter eligible jobs
        return allOpenJobs.stream()
            .filter(this::isJobEligible)
            .map(job -> scoreJob(job, context, catalogSkills))
            .sorted(Comparator
                .comparing(JobRecommendationResponse::matchScore, Comparator.reverseOrder())
                .thenComparing(res -> res.job().createdAt(), Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(res -> res.job().id(), Comparator.reverseOrder())
            )
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public JobRecommendationResponse getJobMatchDetails(String username, Long jobId) {
        User user = validateStudentCaller(username);

        if (jobId == null) {
            throw new BadRequestException("Job ID is required");
        }

        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (!isJobEligible(job)) {
            throw new BadRequestException("Job is not currently open or eligible for placement recommendations");
        }

        StudentContext context = buildStudentContext(user);
        List<Skill> catalogSkills = skillRepository.findAll();

        return scoreJob(job, context, catalogSkills);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentPlacementInsightsResponse getStudentInsights(String username) {
        User user = validateStudentCaller(username);
        StudentContext context = buildStudentContext(user);

        List<Job> allOpenJobs = jobRepository.findByStatusOrderByCreatedAtDesc(JobStatus.OPEN);
        List<Job> eligibleJobs = allOpenJobs.stream()
            .filter(this::isJobEligible)
            .toList();

        List<Skill> catalogSkills = skillRepository.findAll();

        // Calculate matched jobs (scores >= 40)
        long matchedJobsCount = eligibleJobs.stream()
            .map(job -> scoreJob(job, context, catalogSkills))
            .filter(rec -> rec.matchScore() >= 40)
            .count();

        // Calculate profile completeness
        int profileSectionsCompleted = 0;
        if (context.profile != null) profileSectionsCompleted++;
        if (context.hasPrimaryResume) profileSectionsCompleted++;
        if (!context.educations.isEmpty()) profileSectionsCompleted++;
        if (!context.userSkills.isEmpty()) profileSectionsCompleted++;
        if (!context.projects.isEmpty()) profileSectionsCompleted++;
        int profileCompleteness = profileSectionsCompleted * 20; // 0 to 100%

        // Calculate top in-demand skills from eligible jobs
        Map<String, Integer> skillDemandMap = new HashMap<>();
        for (Skill skill : catalogSkills) {
            if (Boolean.FALSE.equals(skill.getIsActive())) continue;
            int count = 0;
            for (Job job : eligibleJobs) {
                String fullJobText = (job.getTitle() + " " + (job.getDescription() != null ? job.getDescription() : "")).toLowerCase();
                if (containsTerm(fullJobText, skill.getName())) {
                    count++;
                }
            }
            if (count > 0) {
                skillDemandMap.put(skill.getName(), count);
            }
        }

        List<String> topInDemandSkills = skillDemandMap.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(6)
            .map(Map.Entry::getKey)
            .toList();

        return new StudentPlacementInsightsResponse(
            profileCompleteness,
            context.userSkills.size(),
            context.projects.size(),
            context.hasPrimaryResume,
            eligibleJobs.size(),
            (int) matchedJobsCount,
            topInDemandSkills
        );
    }

    private User validateStudentCaller(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new AccessDeniedException("User account is inactive");
        }

        if (user.getRole() != UserRole.USER) {
            throw new AccessDeniedException("Only students can access placement recommendations");
        }

        return user;
    }

    private boolean isJobEligible(Job job) {
        if (job.getStatus() != JobStatus.OPEN) {
            return false;
        }

        if (job.getCompany() == null || !Boolean.TRUE.equals(job.getCompany().getIsActive())) {
            return false;
        }

        if (job.getApplicationDeadline() != null && job.getApplicationDeadline().isBefore(LocalDate.now())) {
            return false;
        }

        if (job.getOpenings() == null || job.getOpenings() <= 0) {
            return false;
        }

        return true;
    }

    private StudentContext buildStudentContext(User user) {
        UserProfile profile = userProfileRepository.findByUsername(user.getUsername()).orElse(null);
        List<UserEducation> educations = userEducationRepository.findByUser(user);
        List<UserSkill> userSkills = userSkillRepository.findByUser(user);
        List<UserProject> projects = userProjectRepository.findByUser(user);
        boolean hasPrimaryResume = userResumeRepository.existsByUserAndIsPrimaryTrue(user);
        List<JobApplication> applications = jobApplicationRepository.findByApplicantOrderByAppliedAtDesc(user);

        Map<Long, JobApplication> applicationMap = new HashMap<>();
        for (JobApplication app : applications) {
            if (app.getJob() != null) {
                applicationMap.putIfAbsent(app.getJob().getId(), app);
            }
        }

        Set<String> normalizedSkills = new LinkedHashSet<>();
        for (UserSkill us : userSkills) {
            if (us.getSkill() != null && us.getSkill().getName() != null) {
                normalizedSkills.add(us.getSkill().getName().trim());
            }
        }

        // Add project technologies
        for (UserProject project : projects) {
            if (project.getTechnologies() != null && !project.getTechnologies().isBlank()) {
                String[] split = project.getTechnologies().split("[,;|/]");
                for (String s : split) {
                    String clean = s.trim();
                    if (!clean.isEmpty()) {
                        normalizedSkills.add(clean);
                    }
                }
            }
        }

        return new StudentContext(
            user,
            profile,
            educations,
            userSkills,
            projects,
            hasPrimaryResume,
            applicationMap,
            normalizedSkills
        );
    }

    private JobRecommendationResponse scoreJob(Job job, StudentContext context, List<Skill> catalogSkills) {
        String jobTitle = job.getTitle() != null ? job.getTitle() : "";
        String jobDesc = job.getDescription() != null ? job.getDescription() : "";

        // A. Skill Matching (Max 45 points)
        List<String> matchedSkills = new ArrayList<>();
        int skillPoints = 0;

        for (String skillName : context.normalizedSkills) {
            boolean inTitle = containsTerm(jobTitle, skillName);
            boolean inDesc = containsTerm(jobDesc, skillName);

            if (inTitle || inDesc) {
                matchedSkills.add(skillName);
                if (inTitle) {
                    skillPoints += 15;
                } else {
                    skillPoints += 8;
                }
            }
        }
        int skillScore = Math.min(45, skillPoints);

        // Extract missing catalog skills from job text that student lacks
        List<String> missingSkills = new ArrayList<>();
        for (Skill catSkill : catalogSkills) {
            if (Boolean.FALSE.equals(catSkill.getIsActive())) continue;
            String catName = catSkill.getName();
            boolean studentHas = context.normalizedSkills.stream()
                .anyMatch(s -> s.equalsIgnoreCase(catName));

            if (!studentHas && (containsTerm(jobTitle, catName) || containsTerm(jobDesc, catName))) {
                missingSkills.add(catName);
            }
        }

        // B. Academic Alignment (Max 25 points)
        int academicPoints = 0;
        String combinedJobText = (jobTitle + " " + jobDesc).toLowerCase();

        // Check degree & branch matching
        Set<String> academicTerms = new HashSet<>();
        if (context.profile != null) {
            if (context.profile.getDegree() != null) academicTerms.add(context.profile.getDegree());
            if (context.profile.getBranch() != null) academicTerms.add(context.profile.getBranch());
        }
        for (UserEducation edu : context.educations) {
            if (edu.getDegree() != null) academicTerms.add(edu.getDegree());
            if (edu.getFieldOfStudy() != null) academicTerms.add(edu.getFieldOfStudy());
        }

        boolean matchedAcademicTerm = false;
        for (String term : academicTerms) {
            if (term != null && !term.isBlank() && containsTerm(combinedJobText, term)) {
                matchedAcademicTerm = true;
                break;
            }
        }

        // Default base alignment for student profiles
        if (matchedAcademicTerm) {
            academicPoints += 18;
        } else if (!academicTerms.isEmpty()) {
            academicPoints += 12; // Base degree qualification
        }

        // CGPA / academic performance contribution
        BigDecimal cgpa = null;
        if (context.profile != null && context.profile.getCgpa() != null) {
            cgpa = context.profile.getCgpa();
        } else {
            for (UserEducation edu : context.educations) {
                if (edu.getCgpa() != null) {
                    cgpa = edu.getCgpa();
                    break;
                }
            }
        }

        if (cgpa != null) {
            double val = cgpa.doubleValue();
            if (val >= 8.5) academicPoints += 7;
            else if (val >= 7.5) academicPoints += 5;
            else if (val >= 6.5) academicPoints += 3;
            else if (val >= 5.0) academicPoints += 1;
        } else if (!context.educations.isEmpty()) {
            academicPoints += 3; // Baseline education completed
        }

        int academicScore = Math.min(25, academicPoints);

        // C. Experience / Seniority Compatibility (Max 20 points)
        int experiencePoints = 0;
        ExperienceLevel level = job.getExperienceLevel() != null ? job.getExperienceLevel() : ExperienceLevel.ENTRY_LEVEL;

        switch (level) {
            case ENTRY_LEVEL:
                experiencePoints = 20;
                break;
            case MID_LEVEL:
                if (context.projects.size() >= 2 || context.userSkills.stream().anyMatch(us -> us.getYearsOfExperience() != null && us.getYearsOfExperience().doubleValue() >= 1.0)) {
                    experiencePoints = 15;
                } else {
                    experiencePoints = 10;
                }
                break;
            case SENIOR_LEVEL:
                experiencePoints = 5;
                break;
            case LEAD:
                experiencePoints = 3;
                break;
        }
        int experienceScore = Math.min(20, experiencePoints);

        // D. Candidate Readiness (Max 10 points)
        int readinessPoints = 0;
        if (context.hasPrimaryResume) readinessPoints += 4;
        if (context.profile != null && (context.profile.getBio() != null || context.profile.getGithubUrl() != null || context.profile.getLinkedinUrl() != null)) {
            readinessPoints += 2;
        }
        if (!context.educations.isEmpty()) readinessPoints += 2;
        if (!context.projects.isEmpty()) readinessPoints += 2;
        int readinessScore = Math.min(10, readinessPoints);

        // Total Composite Match Score (0 - 100)
        int totalScore = Math.min(100, Math.max(0, skillScore + academicScore + experienceScore + readinessScore));

        String matchGrade;
        if (totalScore >= 80) {
            matchGrade = "EXCELLENT_MATCH";
        } else if (totalScore >= 60) {
            matchGrade = "STRONG_MATCH";
        } else if (totalScore >= 40) {
            matchGrade = "GOOD_MATCH";
        } else {
            matchGrade = "POTENTIAL_FIT";
        }

        // Application Context
        JobApplication application = context.applicationMap.get(job.getId());
        boolean hasApplied = (application != null);
        ApplicationStatus appStatus = hasApplied ? application.getStatus() : null;

        return new JobRecommendationResponse(
            jobMapper.toResponse(job),
            totalScore,
            matchGrade,
            matchedSkills,
            missingSkills,
            true,
            hasApplied,
            appStatus
        );
    }

    private boolean containsTerm(String text, String term) {
        if (text == null || term == null || text.isBlank() || term.isBlank()) {
            return false;
        }
        String cleanTerm = term.trim();
        String escaped = Pattern.quote(cleanTerm);
        String regex = "(?<![a-zA-Z0-9])" + escaped + "(?![a-zA-Z0-9])";
        Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
        return pattern.matcher(text).find();
    }

    private record StudentContext(
        User user,
        UserProfile profile,
        List<UserEducation> educations,
        List<UserSkill> userSkills,
        List<UserProject> projects,
        boolean hasPrimaryResume,
        Map<Long, JobApplication> applicationMap,
        Set<String> normalizedSkills
    ) {}
}
