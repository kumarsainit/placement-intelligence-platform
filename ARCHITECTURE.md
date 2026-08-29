# Architecture — Placement Intelligence Platform

> Audited and reconciled: 2026-08-29
>
> The repository is authoritative. This document describes the architecture
> that is currently implemented, including known gaps that must be resolved
> before a production release.

## 1. Architectural Principles

- Preserve the existing feature-oriented frontend and layered backend.
- Keep typed API boundaries, reusable UI, validation, and server/client state
  separate.
- Enforce authorization at the backend boundary as well as in frontend route
  guards.
- Prefer incremental, testable changes and free/open-source infrastructure.
- Do not introduce a parallel framework or abstraction where the repository
  already has a pattern.

## 2. Implemented System Shape

```text
Next.js 16.3 App Router frontend
  ├── feature API functions, hooks, schemas, types, and components
  ├── TanStack Query server state
  └── Zustand persisted authentication state
            │ Bearer JWT over /api/v1
            ▼
Spring Boot 4.1 / Java 21 backend
  ├── controllers
  ├── services
  ├── repositories and JPA entities
  └── Flyway migrations
            ▼
MySQL

Resume files are stored on the backend filesystem.
```

## 3. Frontend Architecture

### Stack

- Next.js 16.3 App Router, React 19, TypeScript
- TanStack Query / React Query
- Zustand
- React Hook Form and Zod
- Tailwind CSS 4 and ESLint

Vitest, Playwright, and shadcn/ui are not currently configured dependencies.

### Route and UI Structure

`frontend/src/app/(student)` is a pathless group for student-facing routes:

```text
/dashboard
/profile
/education
/projects
/skills
/resume
/jobs
/jobs/[jobId]
/applications
/applications/[applicationId]
```

`frontend/src/app/recruiter` provides:

```text
/recruiter/dashboard
/recruiter/profile
/recruiter/companies
/recruiter/companies/new
/recruiter/companies/[companyId]
/recruiter/jobs
/recruiter/jobs/new
/recruiter/jobs/[jobId]
/recruiter/jobs/[jobId]/applications
/recruiter/applications/[applicationId]
```

Student and recruiter layouts use a shared application shell and client-side
`AuthGuard`. The current guard recognizes `USER` and `RECRUITER`.

Feature folders use the established shape below where needed:

```text
features/<feature>/
  api/
  components/
  hooks/
  schemas/
  types/
```

The central API client adds the stored Bearer token; resume upload/download
uses dedicated request helpers for multipart and blob responses.

### Current Frontend Gaps

- The committed `/jobs` page incorrectly renders job-detail behavior. The
  current uncommitted user-owned edit changes it to the expected search/list
  page and must be preserved.
- `recruiter/jobs/[jobId]` is a placeholder, so the recruiter View / Edit
  link and navigation from recruiter application pages do not complete a job
  management flow.
- The recruiter dashboard aggregates application requests per job in the
  client, producing an N+1 request pattern.
- There is no configured frontend test runner or end-to-end suite.

## 4. Backend Architecture

### Stack and Layers

- Spring Boot 4.1, Java 21, Maven
- Spring MVC, Spring Security, Spring Data JPA, Hibernate, Bean Validation
- MySQL, Flyway, JJWT, MapStruct

The backend follows:

```text
Controller → Service → Repository → MySQL
                 ↓
             DTO / Mapper
```

The application uses the `/api` servlet context path and versioned controller
routes under `/v1`. Core API areas are authentication, current user/profile,
education, projects, skills, resumes, companies, recruiter profiles, jobs,
job search, student applications, and recruiter applications.

### Data Layer

Flyway migrations `V1` through `V14` define the active schema. The database
contains users, OTP verifications, user profiles, resumes, skills and user
skills, education, projects, companies, recruiter profiles, jobs, and job
applications. Resume file metadata is persisted in MySQL while the PDF itself
is stored locally by `LocalFileStorageService`.

## 5. Roles and Authorization

The backend role enum is:

```text
USER
RECRUITER
ADMIN
SUPER_ADMIN
```

`USER` serves the current student workflow. The frontend does not yet model
`ADMIN` or `SUPER_ADMIN` routes.

All non-public backend routes require authentication. Service-level role and
ownership checks exist for recruiter profiles, recruiter jobs, recruiter
application actions, and user application submission. They are incomplete:

- authenticated non-recruiters can create companies;
- authenticated users can manage the global skill catalog;
- student-owned profile, education, project, skill, and resume operations use
  ownership checks but do not consistently require the `USER` role;
- no audited UI or API provisions a user as `RECRUITER`.

Backend authorization must be the source of truth; hiding a frontend route is
not sufficient protection.

## 6. Authentication and Session Model

The implemented flow is:

```text
phone number → OTP request → OTP verification → JWT access and refresh tokens
             → persisted Zustand session → Bearer token → Spring Security
```

`/v1/auth/send-otp` and `/v1/auth/verify-otp` are public. `/v1/users/me`
returns the currently authenticated user and role. New verified users are
created as `USER` and receive an empty profile.

Known deficiencies are part of the current architecture, not acceptable
production behavior:

- development database credentials and a JWT secret are tracked in backend
  configuration;
- raw OTPs, Authorization headers, and JWTs are logged;
- OTP attempts are not bounded, a valid OTP is replayable before expiry, and
  no rate limit or delivery adapter exists;
- invalid OTP conditions become generic server errors;
- refresh tokens have no endpoint, rotation, revocation, retry behavior, or
  token-type distinction;
- access and refresh tokens are persisted by the frontend auth store.

## 7. Resume Access Boundary

Student resume metadata is mapped to the authenticated resume-file endpoint,
and the student UI fetches that endpoint as a blob. Job application records,
however, snapshot and return the stored backend file path. Recruiter
application screens link to that path directly.

This exposes an internal path and does not provide the recruiter a properly
authorized file-download boundary. The replacement must be an explicit,
ownership-checked recruiter resume-download API, used by the frontend rather
than a direct stored-file URL.

## 8. Testing and Validation Architecture

Current automated coverage consists of one Spring context-load test, which
uses the local development MySQL database and Flyway migrations. It is not
isolated and does not test behavior. There are no frontend test files and no
configured Vitest or Playwright tooling.

The audited lint command passed. The audited production build did not complete
because Next.js/Turbopack compilation stalled, so build health is inconclusive.

The next milestone must add focused OTP, JWT, authorization, and resume-access
tests, together with an isolated backend test configuration.

## 9. Configuration and Deployment State

The backend development profile is configured for local MySQL and local resume
storage. The production profile reads database settings from environment
variables. CORS currently permits only `http://localhost:3000`.

No usable Docker Compose services, CI workflow, production deployment, or
observability configuration was found in the audit. These are future
production-readiness concerns, not implemented architecture.

## 10. Change Policy

The next work must harden the established authentication and authorization
architecture rather than redesign it. Any changes to role semantics, token
storage, OTP delivery, or resume access must preserve typed API contracts,
add targeted tests, and update this document and `PROJECT_STATUS.md`.
