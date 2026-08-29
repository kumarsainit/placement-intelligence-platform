# Project Status — Placement Intelligence Platform

> Audit and documentation reconciliation: 2026-08-29
>
> This document records the audited repository state. The repository remains
> authoritative when this document becomes stale.

## 1. Project Goal

Build a Placement Intelligence Platform with student and recruiter workflows
for authentication, profiles, education, skills, projects, resumes, jobs, and
applications. Placement intelligence and analytics remain future work.

## 2. Audit Snapshot

| Item | Audited state |
|---|---|
| Current branch | `feature/frontend-dashboard` |
| Current HEAD | `f71b21c` — `refactor(frontend): remove duplicate student dashboard shell` |
| Relation to `develop` | One commit ahead; zero commits behind |
| Existing release tags | `v0.1.0` through `v0.10.0` |
| Working tree | Modified `frontend/src/app/(student)/jobs/page.tsx`; project documentation is being reconciled |
| Application-code changes made during audit | None |

The modified student jobs page is user-owned work. It replaces the committed
incorrect `/jobs` implementation with a list/search page and must not be
discarded or overwritten without the user's direction.

## 3. Technology Actually in Use

### Backend

- Java 21, Maven, Spring Boot 4.1
- Spring MVC, Spring Security, Spring Data JPA, Hibernate, Bean Validation
- MySQL with Flyway migrations (`V1` through `V14`)
- JWT through JJWT, MapStruct, and local filesystem resume storage
- REST API under `/api/v1`

### Frontend

- Next.js 16.3 App Router, React 19, TypeScript
- TanStack Query / React Query for server state
- Zustand for persisted client authentication state
- React Hook Form and Zod for forms and validation
- Tailwind CSS 4 and ESLint

No Vitest, Playwright, or shadcn/ui package/configuration is currently present.

## 4. Roles and Access Model

The backend enum defines these roles:

```text
USER
RECRUITER
ADMIN
SUPER_ADMIN
```

`USER` is the role used by the current student-facing UI; it is not named
`STUDENT` in code. The frontend role guard currently recognizes only `USER`
and `RECRUITER`.

New OTP-authenticated accounts are created as `USER`. No audited API or UI
provisions a recruiter role, so recruiter setup currently requires an
out-of-band database/admin action.

## 5. Implemented Modules and Verified Gaps

| Area | Audited state |
|---|---|
| Backend foundation and data layer | Implemented: layered Spring services/repositories, MySQL, Flyway, JWT security, common API responses |
| OTP login and frontend session | Implemented, but requires security hardening before release |
| Role-aware frontend routing | Implemented for `USER` and `RECRUITER` layouts |
| Student profile, education, projects, skills, and resumes | UI and backend CRUD are present |
| Student jobs and applications | Search, job detail, apply, and application tracking code are present; committed `/jobs` is currently wrong while the user-owned uncommitted change corrects it |
| Student dashboard | Implemented as frontend aggregation of feature queries |
| Recruiter profile and companies | UI/API flows are present; company creation lacks audited server-side role enforcement |
| Recruiter jobs | Create, list, and delete are present; job detail/edit is incomplete because `frontend/src/app/recruiter/jobs/[jobId]/page.tsx` is a placeholder |
| Recruiter applications | List, detail, and status update UI/API are present; resume access is not correctly implemented |
| Recruiter dashboard | Implemented as client-side aggregation; fetching applications once per job creates an N+1 request pattern |
| Intelligence, analytics, reporting, coordinator/admin workflows | Not implemented |
| CI, usable Docker Compose services, deployment/monitoring | Not implemented or not configured in the audited repository |

## 6. Current Architecture Summary

The frontend uses App Router routes with a pathless `(student)` route group and
`/recruiter` routes. Both role layouts render `AuthGuard` and a shared
application shell. Feature folders generally separate API functions, React
Query hooks, components, schemas, and types. The central API client sends a
Bearer token from persisted Zustand state.

The backend follows controller → service → repository → MySQL layering, with
DTOs and MapStruct mappers at the API boundary. Resumes are stored on the
backend filesystem; metadata is stored in MySQL.

## 7. Security and Authentication Findings

The current authentication implementation is functional but not production
ready. The next implementation work must address all of the following:

- Tracked development configuration contains database credentials and a JWT
  secret. They must be removed from tracked configuration and rotated.
- The JWT filter logs Authorization headers and raw tokens; OTP service logs
  raw OTP values. These logs must be removed.
- OTP codes are bcrypt-hashed and have an expiry, but they can be replayed
  before expiry, `attemptCount` is not enforced, no rate limit exists, and no
  external delivery adapter is implemented.
- Invalid, expired, or missing OTPs currently become generic server errors.
- Access and refresh tokens are issued, but no refresh endpoint, rotation,
  revocation, retry flow, or token-type distinction exists. Both tokens are
  persisted in the frontend auth store.
- Server-side recruiter authorization is applied to recruiter profiles, jobs,
  and recruiter application actions, but not to company creation or global
  skill-catalog management. Student-owned resources are ownership-protected
  but not consistently constrained to the `USER` role.
- Job applications persist and return an internal resume file path. Recruiter
  UI links directly to it instead of using an authorized resume-download API.

## 8. Validation and Test Status

- `npm run lint` passed during the audit.
- The only backend test is a Spring context-load test. It passed when run
  against the local development MySQL database and its Flyway migrations.
- Backend tests are not isolated from the development database and do not
  exercise OTP, JWT, authorization, controllers, or critical workflows.
- No frontend unit/component tests, end-to-end tests, Vitest configuration, or
  Playwright configuration are present.
- `npm run build` stalled during Next.js/Turbopack compilation in the audit;
  production-build status is therefore inconclusive.

## 9. Release Context

Historical tags are:

```text
v0.1.0  v0.2.0  v0.3.0  v0.4.0  v0.5.0
v0.6.0  v0.7.0  v0.8.0  v0.9.0  v0.10.0
```

`v1.0.0` remains a future release target and must not be created until the
security, authorization, test, build, and core-workflow gaps are resolved.

## 10. Recommended Next Milestone

**Authentication, authorization, and resume-access hardening.**

This milestone takes priority over new product features because it protects
every existing student and recruiter workflow. Its scope is defined in
`ROADMAP.md`; it includes credential remediation, OTP/JWT hardening,
server-side role enforcement, authorized recruiter resume access, and focused
test coverage.
