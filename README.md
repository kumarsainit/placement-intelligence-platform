# 🚀 Placement Intelligence Platform

> **An Enterprise-Level Placement Intelligence & Analytics Platform**
> built using **Java, Spring Boot, MySQL, Next.js, React, TypeScript,
> JWT, Docker, and AWS**, following production-grade software
> engineering practices.

------------------------------------------------------------------------

## 📌 Overview

Placement Intelligence Platform is a scalable full-stack web application
designed to simplify, manage, and analyze the complete placement
lifecycle for students, placement coordinators, and recruiters.

Unlike traditional placement portals, this platform focuses on secure
authentication, student profile management, education and skills
management, project and resume management, company and recruiter
management, job discovery, job application tracking, placement
analytics, resume intelligence, eligibility analysis, and data-driven
placement insights.

The project is being developed using an **industry-standard SDLC
approach** with modular architecture, version control, automated
validation, documented milestones, and production-oriented engineering
practices.

------------------------------------------------------------------------

# 🎯 Problem Statement

Most college placement systems primarily focus on allowing students to
apply for companies.

They generally lack:

-   Centralized student profiles
-   Resume intelligence
-   Skill analysis
-   Eligibility analysis
-   Placement analytics
-   Application tracking
-   Recruiter management
-   Job discovery
-   Data visualization
-   Secure authentication

This project aims to solve these problems through a single
enterprise-level placement intelligence platform.

------------------------------------------------------------------------

# ✨ Core Features

## 🔐 Authentication & Security

-   Phone number based authentication
-   OTP verification
-   JWT access token
-   JWT refresh token
-   Persistent authentication session
-   Protected frontend routes
-   Spring Security
-   CORS configuration
-   Stateless authentication
-   Input validation
-   Global exception handling
-   Standardized API responses

## 👨‍🎓 Student / User Module

-   User profile management
-   Academic details
-   Skills management
-   Project management
-   Resume management
-   Primary resume selection
-   Resume file access
-   User-specific job applications
-   Application status tracking

## 🏢 Company Module

-   Company management
-   Company information
-   Recruiter profile management
-   Recruiter job management
-   Company-specific job listings

## 💼 Job Module

-   Job creation
-   Job updates
-   Job deletion
-   Job details
-   Job listing
-   Job search
-   Job discovery
-   Employment type
-   Experience level
-   Job status

## 📬 Job Application Module

-   Apply for jobs
-   View user applications
-   View individual application
-   Recruiter application management
-   Application status updates
-   Application tracking

## 📄 Resume Intelligence

Planned intelligent resume capabilities include:

-   Resume upload
-   Resume scoring
-   ATS readiness analysis
-   Missing skills detection
-   Resume improvement suggestions
-   Job-resume matching

## 📈 Placement Analytics

Planned analytics capabilities include:

-   Department-wise placement statistics
-   Package distribution
-   Highest package
-   Average package
-   Branch comparison
-   Company statistics
-   Hiring trends
-   Placement percentage
-   Placement insights

## 📊 Dashboard

The platform will provide role-specific dashboards for students,
recruiters, placement coordinators, and administrators.

The student dashboard foundation is already implemented.

## 📑 Reports

Planned reporting capabilities include:

-   Placement reports
-   Application reports
-   Company reports
-   Excel export
-   PDF export
-   Graphical analytics

------------------------------------------------------------------------

# 🛠️ Tech Stack

## Frontend

-   Next.js 16
-   React 19
-   TypeScript
-   Tailwind CSS
-   TanStack Query
-   Zustand
-   React Hook Form
-   Zod
-   ESLint
-   React Compiler

### Frontend Architecture

``` text
frontend/
└── src/
    ├── app/
    ├── components/
    ├── config/
    ├── features/
    ├── hooks/
    ├── lib/
    ├── providers/
    ├── stores/
    └── types/
```

Feature-specific functionality is organized inside `src/features/`,
while reusable infrastructure is maintained inside `src/lib/`,
`src/providers/`, `src/stores/`, and `src/types/`.

## Backend

-   Java 21
-   Spring Boot
-   Spring Security
-   Spring Data JPA
-   Hibernate
-   Flyway
-   REST APIs
-   JWT
-   Bean Validation
-   Maven

## Database

-   MySQL
-   Flyway Database Migrations

## DevOps

-   Git
-   GitHub
-   GitHub Actions
-   Docker
-   Docker Compose

## Cloud

-   AWS

AWS deployment is planned for a later milestone.

------------------------------------------------------------------------

# 🏗️ Software Architecture

The backend follows a layered architecture:

``` text
Client
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
```

The frontend follows a feature-oriented architecture:

``` text
Next.js App Router
        ↓
Feature Modules
        ↓
API Layer
        ↓
Central API Client
        ↓
Spring Boot REST API
        ↓
Spring Security / JWT
        ↓
Service Layer
        ↓
Repository
        ↓
MySQL
```

------------------------------------------------------------------------

# 🔒 Security Architecture

The platform uses stateless JWT-based authentication.

``` text
Phone Number
      ↓
Send OTP
      ↓
OTP Verification
      ↓
JWT Access Token
      +
JWT Refresh Token
      ↓
Persisted Client Session
      ↓
Authorization: Bearer <JWT>
      ↓
Spring Security
      ↓
JWT Authentication Filter
      ↓
Protected REST API
```

Public endpoints include:

``` text
GET  /api/v1/health
POST /api/v1/auth/send-otp
POST /api/v1/auth/verify-otp
```

Protected endpoints require JWT authentication.

------------------------------------------------------------------------

# 🗄️ Database Management

Database changes are managed using **Flyway migrations**.

Migration files are maintained under:

``` text
backend/src/main/resources/db/migration/
```

Advantages:

-   Version-controlled schema
-   Repeatable development environments
-   Safe database evolution
-   Team collaboration
-   Production-ready migration workflow

------------------------------------------------------------------------

# 📂 Project Structure

``` text
placement-intelligence-platform/
│
├── backend/
├── frontend/
├── database/
├── docker/
├── infra/
├── docs/
├── postman/
├── demo/
├── screenshots/
├── scripts/
├── docker-compose.yml
├── LICENSE
└── README.md
```

------------------------------------------------------------------------

# 📅 Sprint & Milestone History

The project follows an incremental sprint-based development workflow.
Each completed sprint is validated, documented, merged into `develop`,
and associated with a milestone/version where applicable.

## Sprint 1 --- Backend Foundation

### Status: ✅ Complete

### Version: `v0.1.0`

Completed:

-   Project structure
-   Git workflow
-   Spring Boot setup
-   Java 21 configuration
-   Multi-profile configuration
-   MySQL integration
-   Dedicated database user
-   Flyway migration setup
-   Hibernate/JPA configuration
-   Application startup configuration
-   Common project configuration
-   Initial database schema

------------------------------------------------------------------------

## Sprint 2 --- Core Backend Platform Modules

### Status: ✅ Complete

This sprint established the major backend domain modules required by the
platform.

### `v0.2.0` --- User Profile

-   User profile management
-   Profile API
-   Profile DTOs
-   Profile entity
-   Profile repository
-   Profile service
-   Profile update operations

### `v0.3.0` --- Resume Management

-   Resume upload
-   Resume metadata management
-   Resume retrieval
-   Resume file access
-   Primary resume selection
-   Resume deletion
-   Resume APIs

### `v0.4.0` --- Skills Management

-   Skill management
-   Skill CRUD operations
-   User-skill mapping
-   User skill CRUD operations
-   Skill APIs

### `v0.5.0` --- User Projects

-   Project management
-   Project CRUD operations
-   User-project mapping
-   Project APIs

### `v0.6.0` --- Company Management

-   Company entity
-   Company APIs
-   Company creation
-   Company listing
-   Company details
-   Company persistence

### `v0.7.0` --- Recruiter Profile

-   Recruiter profile management
-   Recruiter profile APIs
-   Recruiter-company relationship
-   Recruiter profile CRUD operations

### `v0.8.0` --- Job Management

-   Job creation
-   Job listing
-   Job details
-   Job updates
-   Job deletion
-   Recruiter job management
-   Job status
-   Employment type
-   Experience level

### `v0.9.0` --- Job Application Management

-   Student job applications
-   Application retrieval
-   Individual application details
-   Recruiter application management
-   Application status updates
-   Application tracking

### `v0.10.0` --- Job Search & Discovery

-   Job search API
-   Job discovery
-   Search filters
-   Job search response model
-   Search service integration

------------------------------------------------------------------------

## Sprint 3 --- Frontend Foundation & Authentication

### Status: ✅ Complete

### Frontend Foundation

-   Next.js App Router
-   React 19
-   TypeScript
-   Tailwind CSS
-   ESLint
-   React Compiler
-   Environment configuration
-   Feature-based frontend architecture
-   Central API client
-   API error abstraction
-   TanStack Query provider
-   Zustand state management
-   Zod validation
-   React Hook Form integration

### Authentication

-   Phone number login
-   OTP request
-   OTP verification
-   JWT access token integration
-   JWT refresh token integration
-   Persistent Zustand authentication session
-   Authentication hydration handling
-   Protected routes
-   AuthGuard
-   `/auth` route
-   `/dashboard` route
-   Current-user API integration
-   Logout
-   Frontend/backend CORS integration
-   Spring Security JWT authentication integration

### Authentication Flow

``` text
Phone Number
      ↓
Send OTP
      ↓
Verify OTP
      ↓
JWT Session
      ↓
Persist Session
      ↓
AuthGuard
      ↓
Dashboard
      ↓
GET /api/v1/users/me
```

### Validation

``` text
Frontend lint       ✅
Frontend build      ✅
OTP authentication  ✅
JWT authentication  ✅
CORS                ✅
Current user API    ✅
Protected route     ✅
Dashboard           ✅
Logout              ✅
```

Sprint 3 authentication work has been merged into `develop`.

------------------------------------------------------------------------

# 🚀 Current Development Status

## Completed

-   [x] Backend Foundation
-   [x] User Profile Backend
-   [x] Resume Management Backend
-   [x] Skills Management Backend
-   [x] User Projects Backend
-   [x] Company Management Backend
-   [x] Recruiter Profile Backend
-   [x] Job Management Backend
-   [x] Job Application Management Backend
-   [x] Job Search & Discovery Backend
-   [x] Next.js Frontend Foundation
-   [x] Frontend Architecture
-   [x] OTP Authentication
-   [x] JWT Session Management
-   [x] Protected Dashboard
-   [x] Current User Integration
-   [x] Frontend/Backend CORS Integration

## Next Development Milestone

### Sprint 4 --- Student Profile & Placement Workspace

Planned:

-   [ ] Student profile UI
-   [ ] Education management UI
-   [ ] Skills management UI
-   [ ] Projects management UI
-   [ ] Resume management UI
-   [ ] Profile completion experience
-   [ ] Student dashboard data integration

------------------------------------------------------------------------

# 🗺️ Roadmap

## Phase 1 --- Backend Core

-   [x] Backend Foundation
-   [x] User Profile
-   [x] Resume Management
-   [x] Skills Management
-   [x] User Projects
-   [x] Company Management
-   [x] Recruiter Profile
-   [x] Job Management
-   [x] Job Applications
-   [x] Job Search & Discovery

## Phase 2 --- Frontend Core

-   [x] Next.js Frontend Foundation
-   [x] Frontend Architecture
-   [x] OTP Authentication
-   [x] JWT Session Management
-   [x] Protected Dashboard
-   [ ] User Profile UI
-   [ ] Education UI
-   [ ] Skills UI
-   [ ] Projects UI
-   [ ] Resume Management UI

## Phase 3 --- Placement Platform

-   [ ] Company UI
-   [ ] Recruiter UI
-   [ ] Job Discovery UI
-   [ ] Job Application UI
-   [ ] Application Tracking
-   [ ] Eligibility Checker
-   [ ] Placement Dashboard

## Phase 4 --- Intelligence & Analytics

-   [ ] Placement Analytics
-   [ ] Resume Scoring
-   [ ] ATS Analysis
-   [ ] Missing Skills Detection
-   [ ] Resume Improvement Suggestions
-   [ ] Job-Resume Matching
-   [ ] Placement Prediction
-   [ ] Company Recommendation Engine

## Phase 5 --- Production & Deployment

-   [ ] Docker Production Setup
-   [ ] CI/CD Pipeline
-   [ ] AWS Infrastructure
-   [ ] Production Database
-   [ ] Monitoring
-   [ ] Logging
-   [ ] Production Deployment

------------------------------------------------------------------------

# 📚 Documentation

Detailed project documentation is maintained inside:

``` text
docs/
```

including:

-   Architecture
-   Architecture Decision Records
-   Database Design
-   API Documentation
-   Deployment Guide
-   Sprint Documentation
-   Research
-   Diagrams
-   Meeting Notes

------------------------------------------------------------------------

# 🔄 Development Workflow

Every feature follows the same engineering workflow:

``` text
Design
  ↓
Implement
  ↓
Run
  ↓
Verify
  ↓
Document
  ↓
Commit
  ↓
Pull Request
  ↓
Merge into develop
  ↓
Version Milestone
```

### Git Branch Strategy

``` text
main
 │
 └── Stable Releases

develop
 │
 ├── feature/frontend-foundation
 ├── feature/frontend-architecture
 ├── feature/frontend-auth
 └── feature/frontend-profile
```

### Branch Rules

-   `main` → stable production releases
-   `develop` → integration/development branch
-   `feature/*` → individual modules/features
-   Features are merged into `develop` through Pull Requests
-   Completed milestones are version tagged
-   README documentation is updated whenever a sprint/milestone is
    completed

------------------------------------------------------------------------

# 🧪 Quality & Validation

Before completing a milestone, the project follows a verification
process.

### Frontend

``` bash
npm run lint
npm run build
```

### Backend

``` bash
./mvnw clean test
```

Additional API verification is performed using Postman and direct HTTP
testing where required.

------------------------------------------------------------------------

# ⚙️ Getting Started

## Clone Repository

``` bash
git clone https://github.com/kumarsainit/placement-intelligence-platform.git
cd placement-intelligence-platform
```

## Backend

``` bash
cd backend
./mvnw spring-boot:run
```

## Frontend

``` bash
cd frontend
npm install
npm run dev
```

Frontend:

``` text
http://localhost:3000
```

Backend API:

``` text
http://localhost:8080/api
```

## Database

``` sql
CREATE DATABASE placement_intelligence;
```

Configure the required database credentials and environment-specific
settings before starting the backend.

------------------------------------------------------------------------

# 🔮 Future Enhancements

-   AI Resume Analysis
-   ATS Resume Score
-   Interview Question Recommendation
-   Placement Prediction
-   Company Recommendation Engine
-   Personalized Job Recommendations
-   Email Notifications
-   Advanced Placement Analytics
-   Mobile Application
-   AWS Production Deployment

------------------------------------------------------------------------

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

Please follow the established development workflow and branch strategy
when contributing to the project.

------------------------------------------------------------------------

# 📄 License

This project is licensed under the MIT License.

------------------------------------------------------------------------

# 👨‍💻 Author

**G V S Sai Kumar**

M.Tech -- Mathematics & Computing\
Dr. B.R. Ambedkar National Institute of Technology, Jalandhar

------------------------------------------------------------------------

## ⭐ Support

If you find this project useful or interesting, consider giving the
repository a ⭐ on GitHub.
