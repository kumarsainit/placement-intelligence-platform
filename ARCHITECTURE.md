# Architecture — Placement Intelligence Platform

> Audited and reconciled for Release v1.0.0
>
> The repository is authoritative. This document describes the complete implemented architecture
> of the Placement Intelligence Platform across backend, frontend, security, and data layers.

## 1. Architectural Principles

- Preserve the existing feature-oriented frontend and layered backend.
- Keep typed API boundaries, reusable UI, validation, and server/client state separate.
- Enforce authorization at the backend boundary as well as in frontend route guards.
- Server is the single source of truth for authorization, compatibility matching, and business rules.
- Maintain strict multi-tenant recruiter isolation and role-based access control.
- Prefer incremental, testable changes and free/open-source infrastructure.

## 2. Implemented System Shape

```text
Next.js 16.3 App Router frontend
  ├── feature API functions, hooks, schemas, types, and components
  ├── TanStack Query server state & automatic invalidation
  └── Zustand persisted authentication state
            │ Bearer JWT over /api/v1
            ▼
Spring Boot 4.1 / Java 21 backend
  ├── controllers (REST API under /api/v1)
  ├── services (business logic, security checks, scoring engine)
  ├── repositories and JPA entities
  ├── LocalFileStorageService (canonicalized path storage)
  └── Flyway migrations (V1 through V14)
            ▼
MySQL
```

## 3. Frontend Architecture

### Stack

- Next.js 16.3 App Router, React 19, TypeScript
- TanStack Query / React Query for server state management and caching
- Zustand for persisted client authentication state
- React Hook Form and Zod for forms and validation
- Tailwind CSS 4 and ESLint

### Route and UI Structure

`frontend/src/app/(student)` provides student-facing workflows:

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

`frontend/src/app/recruiter` provides recruiter workflows:

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

`frontend/src/app/admin` provides administrative workflows:

```text
/admin/dashboard
/admin/users
/admin/companies
/admin/jobs
```

Student, recruiter, and admin layouts use a shared application shell and client-side `AuthGuard`:
- `StudentLayout`: `<AuthGuard allowedRole="USER">`
- `RecruiterLayout`: `<AuthGuard allowedRole="RECRUITER">`
- `AdminLayout`: `<AuthGuard allowedRole={["ADMIN", "SUPER_ADMIN"]}>`

Feature folders use the established shape:

```text
features/<feature>/
  api/
  components/
  hooks/
  schemas/
  types/
```

The central API client (`apiClient`) attaches the stored Bearer token. Specialized download and upload helpers handle binary blobs and multipart form uploads.

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

The application uses the `/api` servlet context path and versioned controller routes under `/v1`. Core API domains include authentication, user/profile, education, projects, skills, resumes, companies, recruiter profiles, jobs, job search, student applications, recruiter applications, admin governance/analytics, and placement intelligence recommendations.

### Data Layer

Flyway migrations `V1` through `V14` define the active schema:
- `V1`: Initial schema
- `V2`: Users table with role enum (`USER`, `RECRUITER`, `ADMIN`, `SUPER_ADMIN`)
- `V3`: OTP verifications table with attempt count and hash
- `V5`: User profiles table
- `V6`: User resumes table
- `V7`: Skills and user skills tables
- `V8`: User educations table
- `V9`: Fix user education year types
- `V10`: User projects table
- `V11`: Companies table
- `V12`: Recruiter profiles table
- `V13`: Jobs table
- `V14`: Job applications table

Resume file metadata is stored in MySQL while the file itself is canonicalized and stored locally by `LocalFileStorageService`.

## 5. Roles and Authorization

The backend role enum defines:

```text
USER          (Student candidate)
RECRUITER     (Company hiring representative)
ADMIN         (Placement coordinator / governance admin)
SUPER_ADMIN   (System administrator)
```

Authorization is enforced at the backend service layer using caller authentication identity from `Authentication.getName()`:
- `USER`: Accesses personal student profile, education, skills, projects, resumes, job search, applications, and placement recommendations.
- `RECRUITER`: Accesses recruiter profile, authorized companies, owned jobs, and applications submitted to owned jobs.
- `ADMIN` & `SUPER_ADMIN`: Accesses administrative analytics overview, user role/status governance, company directory management, job status governance, and placement governance.

## 6. Authentication and Session Model

The implemented authentication flow is:

```text
phone number → OTP request → OTP verification → JWT access and refresh tokens
             → persisted Zustand session → Bearer token → Spring Security
```

- Public endpoints: `/v1/auth/send-otp`, `/v1/auth/verify-otp`, `/v1/auth/refresh-token`, `/v1/health`.
- OTP codes are bcrypt-hashed, single-use (`verified = true` upon use), expire after 5 minutes, and enforce a 3-attempt limit (`MAX_OTP_ATTEMPTS = 3`).
- In development, `DevOtpDeliveryService` outputs the generated code to the console for testing; in production, `NoOpOtpDeliveryService` delegates to external SMS providers.
- JWT tokens distinguish `ACCESS` vs `REFRESH` types via claims. Access tokens expire in 30 minutes (configurable), and refresh tokens expire in 7 days. Refresh tokens cannot be used as Bearer tokens for resource APIs.

## 7. Resume Access Boundary

- Student resume files are accessed via authenticated ownership-verified endpoint `GET /v1/users/resumes/{resumeId}/file`.
- Recruiter resume downloads use the authorized endpoint `GET /v1/recruiter/applications/{applicationId}/resume`, which validates that the requesting recruiter owns the job associated with the application.
- Path traversal protection is enforced by `LocalFileStorageService` using path normalization and directory boundary validation.

## 8. Placement Intelligence & Recommendation Engine

- Heuristic compatibility scoring engine computes deterministic match scores (0–100) and grades (`EXCELLENT_FIT`, `GOOD_FIT`, `POTENTIAL_FIT`, `NEEDS_PREPARATION`).
- Evaluates skill overlaps using boundary-safe regex pattern matching against candidate profile skills and project technologies.
- Computes placement readiness metrics, profile completeness, and in-demand placement skills.
- Endpoints strictly accessible only by authenticated `USER` role callers.

## 9. Testing and Validation Architecture

- Comprehensive Spring Boot integration test suite (`BackendApplicationTests.java`) covers OTP lifecycle, JWT authentication, RBAC boundaries, student workflows, recruiter workflows, admin governance, and placement intelligence.
- Automated tests run against an isolated in-memory H2 database (`application-test.yaml`).
- Frontend quality is verified through ESLint, TypeScript compiler (`tsc --noEmit`), and Next.js webpack production builds.

## 10. Configuration and Deployment State

- `application-dev.yaml`: Configured for local development.
- `application-prod.yaml`: Externalized configuration reading credentials from environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`).
- Global transaction boundaries configured with `open-in-view: false`.
