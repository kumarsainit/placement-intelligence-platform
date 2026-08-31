# Roadmap — Placement Intelligence Platform

> Audited and reconciled for Release v1.0.0.
>
> All core platform phases, security hardening, governance workflows, and placement intelligence
> matching capabilities are fully implemented and verified.

## Phase 0 — Foundation & Repository Setup

**Status:** Complete.

- [x] Initial Spring Boot 4.1 / Java 21 backend foundation
- [x] Initial Next.js 16.3 App Router frontend foundation
- [x] MySQL database and initial Flyway migration structure
- [x] Common API response envelopes and centralized error handling

---

## Phase 1 — Authentication, Authorization, & Security Hardening

**Status:** Complete.

- [x] OTP authentication lifecycle: bcrypt hashing, 5-minute expiry, single-use, 3-attempt limit
- [x] Dev/Prod OTP delivery decoupling (`DevOtpDeliveryService` / `NoOpOtpDeliveryService`)
- [x] JWT access token and refresh token distinction (`type` claim)
- [x] Refresh token endpoint (`POST /v1/auth/refresh-token`) with rotation
- [x] Role-Based Access Control (`USER`, `RECRUITER`, `ADMIN`, `SUPER_ADMIN`)
- [x] Path-traversal-protected local resume storage abstraction
- [x] Production credential externalization via environment variables
- [x] Sanitization of sensitive logs (no OTPs, tokens, or auth headers in production logs)

---

## Phase 2 — Student Workflows

**Status:** Complete.

- [x] Student profile management (bio, degree, college, branch, CGPA, coding/social links)
- [x] Education history CRUD with validation rules
- [x] Skills management and student proficiency ratings
- [x] Projects portfolio management with technology tags and URLs
- [x] Resume management with PDF drag-and-drop upload and primary resume failover promotion
- [x] Job search and discovery with keyword, location, company, employment type, and salary filtering
- [x] Job application workflow with resume snapshotting and duplicate protection
- [x] Application history tracking and real-time status indicators

---

## Phase 3 — Recruiter Workflows

**Status:** Complete.

- [x] Recruiter company registration and association
- [x] Recruiter profile setup
- [x] Job management: draft, open, and closed job lifecycle
- [x] Multi-tenant applicant review dashboard
- [x] Application status transitions (Applied → Shortlisted → Selected / Rejected)
- [x] Authorized candidate resume downloads with recruiter ownership verification

---

## Phase 4 — Admin & Governance Workflows

**Status:** Complete.

- [x] Placement analytics overview (user counts, job statuses, application conversion funnel)
- [x] User management: role assignment, user activation/deactivation, super admin protections
- [x] Company directory governance
- [x] Job oversight and status administration

---

## Phase 5 — Placement Intelligence & Recommendation Engine

**Status:** Complete.

- [x] Deterministic heuristic compatibility scoring algorithm (0–100)
- [x] Fit grade classification (`EXCELLENT_FIT`, `GOOD_FIT`, `POTENTIAL_FIT`, `NEEDS_PREPARATION`)
- [x] Regex-based boundary-safe skill matching and skill gap identification
- [x] Student placement readiness metrics and profile completeness calculation
- [x] Dedicated personalized recommendation UI and job detail compatibility analysis
- [x] Automated TanStack Query cache invalidation across all student profile mutations

---

## Phase 6 — Release Readiness & v1.0.0 Promotion

**Status:** Current Milestone.

- [x] Comprehensive 11-scenario automated test suite on isolated H2 test database (`11/11 PASS`)
- [x] Backend package verification (`BUILD SUCCESS`)
- [x] Frontend code quality checks (`npm run lint` -> 0 errors, `npx tsc --noEmit` -> 0 errors)
- [x] Production compilation (`next build --webpack` -> 27/27 routes)
- [x] Repository format verification (`git diff --check` -> clean)
- [x] Reconcile project documentation for v1.0.0
- [x] Tag and release `v1.0.0`
- [x] Promote develop to main
