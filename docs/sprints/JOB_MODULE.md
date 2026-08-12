# Job Management Module

## Module Version

v0.8.0

## Status

Completed

## Overview

The Job Management Module enables authenticated recruiter users to create,
view, update, and delete job postings for their associated companies.

The module extends the existing recruiter profile and company management
architecture and introduces the job lifecycle required for placement
opportunities.

The implementation follows the project's layered architecture:

Controller
↓
Service
↓
Repository
↓
Entity
↓
Database

The module also uses request/response DTOs and a mapper layer to maintain
separation between API contracts and persistence models.

---

## Objectives

The primary objectives of the Job Management Module are:

- Allow recruiters to create job opportunities.
- Allow recruiters to retrieve their job postings.
- Allow recruiters to update their job postings.
- Allow recruiters to delete their job postings.
- Associate every job with a company.
- Associate every job with the recruiter who created it.
- Enforce recruiter-only access.
- Enforce recruiter-company association.
- Enforce recruiter ownership for job modifications.
- Support job lifecycle states.
- Validate salary information.
- Validate application deadlines.
- Validate active recruiter profiles.
- Validate active companies.
- Maintain a clean separation of API, business, persistence, and mapping
  responsibilities.

---

# Architecture

The Job Management Module follows the existing layered architecture of the
Placement Intelligence Platform.

```text
                    REST API
                       |
                       v
              JobController
                       |
                       v
                 JobService
                       |
                       v
               JobServiceImpl
                       |
              +--------+--------+
              |                 |
              v                 v
      JobRepository       RecruiterProfileRepository
              |                 |
              |                 v
              |          CompanyRepository
              |                 |
              +--------+--------+
                       |
                       v
                    Job Entity
                       |
                       v
                    MySQL

Supporting layers:

CreateJobRequest
UpdateJobRequest
        |
        v
   Validation
        |
        v
   JobService
        |
        v
    JobMapper
        |
        v
   JobResponse
