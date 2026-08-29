# Roadmap — Placement Intelligence Platform

> Reconciled with the repository audit on 2026-08-29.
>
> The core application has substantial implementation, but it is not ready for
> feature expansion or release until the security, authorization, and test
> gaps below are addressed.

## Phase 0 — Repository Audit

**Status:** Complete on `feature/frontend-dashboard` at `f71b21c`.

- [x] inspect Git status, branch, commits, and tags
- [x] inspect project structure, frontend, backend, data layer, and config
- [x] inspect authentication, authorization, routes, APIs, and state
- [x] inspect tests and TODO/FIXME items
- [x] reconcile `PROJECT_STATUS.md`, `ARCHITECTURE.md`, and this roadmap

The audit found tags `v0.1.0` through `v0.10.0`, a Spring Boot 4.1 / Java 21
backend, and a Next.js 16.3 App Router frontend. It also found critical
security, authorization, resume-access, and test gaps.

---

## Phase 1 — Authentication, Authorization, and Resume-Access Hardening

**Status:** Next milestone.

**Goal:** Make the existing student and recruiter workflows safe to validate
before implementing more product features.

### 1. Configuration and sensitive-data remediation

- [ ] Remove development database credentials and JWT secret from tracked
  backend configuration.
- [ ] Rotate the exposed credentials and JWT signing secret.
- [ ] Keep `.env.example` limited to non-secret placeholders.
- [ ] Make CORS configuration explicit and environment-aware.

### 2. OTP and JWT lifecycle

- [ ] Remove OTP, Authorization-header, and raw-JWT logging.
- [ ] Make OTPs single-use; enforce expiry and bounded verification attempts.
- [ ] Add rate limiting and a defined OTP delivery boundary before treating
  OTP authentication as production-ready.
- [ ] Return safe, correct client errors for invalid, expired, and missing
  OTPs.
- [ ] Implement a distinct refresh-token lifecycle: endpoint, token type,
  rotation/revocation, and frontend retry/expiry handling.

### 3. Backend role enforcement

- [ ] Keep `USER`, `RECRUITER`, `ADMIN`, and `SUPER_ADMIN` as the documented
  backend roles; do not rename `USER` to `STUDENT` without a separate,
  migration-aware decision.
- [ ] Require an authorized role for company creation and global skill-catalog
  operations.
- [ ] Apply consistent `USER` role checks to student-only operations while
  retaining existing ownership checks.
- [ ] Define and implement a controlled recruiter-provisioning path; new OTP
  users currently become `USER`.

### 4. Authorized resume access

- [ ] Stop returning stored backend file paths from job-application data.
- [ ] Add a recruiter-authorized, ownership-checked resume-download boundary.
- [ ] Update recruiter application UI to use that boundary rather than direct
  file links.

### 5. Focused validation

- [ ] Add isolated backend test configuration instead of depending on the
  local development MySQL database.
- [ ] Add tests for OTP expiry/replay/attempt limits, JWT access versus
  refresh behavior, role enforcement, ownership, and resume download.
- [ ] Add the first frontend tests for authentication/session failure and
  authorized resume access.
- [ ] Re-run lint and production build; investigate the audited Turbopack
  build stall rather than declaring the build healthy.

### Current touch points

The expected existing modules are:

```text
backend/src/main/resources/application-dev.yaml
backend/src/main/resources/application-prod.yaml
backend/src/main/java/com/placementintelligence/config/SecurityConfig.java
backend/src/main/java/com/placementintelligence/security/JwtService.java
backend/src/main/java/com/placementintelligence/security/JwtAuthenticationFilter.java
backend/src/main/java/com/placementintelligence/service/impl/AuthServiceImpl.java
backend/src/main/java/com/placementintelligence/service/impl/CompanyServiceImpl.java
backend/src/main/java/com/placementintelligence/service/impl/SkillServiceImpl.java
backend/src/main/java/com/placementintelligence/service/impl/JobApplicationServiceImpl.java
frontend/src/lib/api/client.ts
frontend/src/stores/auth-store.ts
frontend/src/features/auth/
frontend/src/features/recruiter-applications/
```

Do not modify the user-owned uncommitted change at
`frontend/src/app/(student)/jobs/page.tsx` as part of this milestone.

---

## Phase 2 — Stabilize and Complete Existing Core Workflows

**Goal:** Complete the audited workflow gaps after Phase 1 is validated.

- [ ] Finish recruiter job detail/edit at
  `frontend/src/app/recruiter/jobs/[jobId]/page.tsx` and reconnect the
  application-navigation flow.
- [ ] Review and safely integrate the user-owned `/jobs` list/search change;
  the committed page is currently incorrect.
- [ ] Remove the recruiter-dashboard application N+1 pattern where an
  appropriate API/query approach is available.
- [ ] Validate loading, empty, error, success, validation, responsive, and
  authorization states for profile, education, projects, skills, resumes,
  jobs, applications, companies, recruiter profiles, and dashboards.
- [ ] Add targeted frontend and backend tests for each corrected workflow.

Do not reimplement modules that already have satisfactory code; make the
smallest coherent corrections discovered during validation.

---

## Phase 3 — Intelligence Layer

**Goal:** Introduce placement intelligence only after the core platform is
stable and authorization is verified.

Potential capabilities, requiring separate product definition:

- [ ] student profile-completeness insights
- [ ] job/profile matching
- [ ] skill-gap analysis
- [ ] application insights
- [ ] recruiter-side candidate insights
- [ ] placement-oriented analytics
- [ ] recommendation workflows

---

## Phase 4 — Quality and Production Readiness

- [ ] comprehensive authorization review
- [ ] error-handling and validation audit
- [ ] accessibility and responsive UI audit
- [ ] unit/component coverage and critical end-to-end flows
- [ ] build verification
- [ ] performance review
- [ ] environment, logging, and observability review
- [ ] CI workflow, usable Docker/deployment configuration, and documentation
  cleanup

---

## Phase 5 — Release Preparation

### v1.0.0 readiness

Before `v1.0.0`:

- [ ] core workflows are stable and tested
- [ ] OTP authentication and authorization are verified
- [ ] recruiter and student workflows are complete
- [ ] no known critical security issues remain
- [ ] lint, tests, and production build succeed
- [ ] deployment process and release notes are documented
- [ ] `PROJECT_STATUS.md`, `ARCHITECTURE.md`, README, and release notes are
  synchronized with the repository

Then:

```text
develop
   ↓
release validation
   ↓
v1.0.0 tag
   ↓
main
```

## Working Rule

For each approved milestone: verify the current state, use the appropriate
feature branch, implement the smallest coherent change, test it, inspect the
diff, update documentation, prepare a focused commit/PR, and stop for review.
