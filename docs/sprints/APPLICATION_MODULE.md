# Job Application Management Module

## Overview

The Job Application Management Module allows students to apply for open placement opportunities and allows recruiters to manage applications submitted for their jobs.

The module provides the complete application lifecycle from submission through recruiter review and final selection/rejection.

---

## Objectives

- Allow students to apply for open jobs
- Associate applications with a specific job and applicant
- Allow applicants to select one of their uploaded resumes
- Store resume metadata with the application
- Support optional cover letters
- Prevent duplicate applications for the same job
- Allow applicants to view their applications
- Allow recruiters to view applications for their jobs
- Allow recruiters to view individual applications
- Allow recruiters to update application status
- Enforce recruiter ownership of job applications
- Validate job availability before application submission
- Validate resume ownership before submission
- Enforce valid application status transitions
- Maintain application creation and update timestamps
- Provide standardized API responses and exception handling

---

## Architecture

The module follows the existing layered Spring Boot architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Entity
    ↓
Database
