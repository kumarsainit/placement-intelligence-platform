# Recruiter Profile Management Module

## Module Version

v0.7.0

## Status

Completed

## Overview

The Recruiter Profile Management Module enables authenticated recruiter users
to create, view, and update their recruiter-specific professional profile.

The module connects recruiter users with companies and extends the existing
user and company management architecture.

The implementation follows the project's layered architecture:

Controller
    ↓
Service
    ↓
Repository
    ↓
Database

---

# Objectives

The primary objectives of this module are:

- Enable recruiter users to create recruiter profiles
- Allow recruiters to view their own recruiter profile
- Allow recruiters to update their recruiter profile
- Associate recruiters with an existing company
- Maintain a one-to-one relationship between users and recruiter profiles
- Enforce recruiter-only access
- Validate recruiter profile input
- Handle duplicate recruiter profiles
- Handle invalid or inactive companies
- Maintain consistent API responses
- Maintain database-level referential integrity

---

# Database Design

## Recruiter Profiles Table

Migration:

`V12__create_recruiter_profiles_table.sql`

The recruiter profile contains:

- id
- user_id
- company_id
- designation
- department
- employee_id
- created_at
- updated_at

### Relationships

Recruiter Profile → User

Each recruiter profile belongs to one user.

Recruiter Profile → Company

Each recruiter profile belongs to one company.

The relationships ensure that recruiter information remains connected
to the platform's existing user and company entities.

---

# Entity Layer

## RecruiterProfile

Location:

`entity/RecruiterProfile.java`

Responsibilities:

- Represent recruiter profile data
- Maintain user relationship
- Maintain company relationship
- Store professional recruiter information
- Maintain creation and update timestamps

---

# Repository Layer

## RecruiterProfileRepository

Location:

`repository/RecruiterProfileRepository.java`

Responsibilities:

- Persist recruiter profiles
- Retrieve recruiter profiles
- Check whether a recruiter profile already exists
- Support user-based recruiter profile lookup

The repository layer uses Spring Data JPA.

---

# Mapper Layer

## RecruiterProfileMapper

Location:

`mapper/RecruiterProfileMapper.java`

Responsibilities:

- Convert RecruiterProfile entities into response DTOs
- Keep entity-to-DTO conversion separate from service logic
- Prevent persistence entities from being directly exposed through APIs

---

# DTO Layer

## CreateRecruiterProfileRequest

Location:

`dto/request/CreateRecruiterProfileRequest.java`

Fields:

- companyId
- designation
- department
- employeeId

Validation includes:

- Company ID is required
- Designation maximum length validation
- Department maximum length validation
- Employee ID maximum length validation

---

## UpdateRecruiterProfileRequest

Location:

`dto/request/UpdateRecruiterProfileRequest.java`

Fields:

- companyId
- designation
- department
- employeeId

The same input validation rules are applied during profile updates.

---

## RecruiterProfileResponse

Location:

`dto/response/RecruiterProfileResponse.java`

The response provides recruiter profile information including:

- profile ID
- user ID
- username
- company ID
- company name
- designation
- department
- employee ID
- created timestamp
- updated timestamp

---

# Service Layer

## RecruiterProfileService

Location:

`service/RecruiterProfileService.java`

Exposes the following operations:

### Create Profile

Creates a recruiter profile for the authenticated recruiter.

### Get Current Profile

Retrieves the recruiter profile associated with the authenticated user.

### Update Profile

Updates the authenticated recruiter's profile.

---

# Service Implementation

## RecruiterProfileServiceImpl

Location:

`service/impl/RecruiterProfileServiceImpl.java`

The implementation handles:

- Authenticated user lookup
- Recruiter role validation
- Existing profile validation
- Company lookup
- Active company validation
- Recruiter profile creation
- Recruiter profile retrieval
- Recruiter profile updates
- Business exception handling
- Entity-to-response mapping

---

# API Endpoints

Base path:

`/api/v1/users/recruiter-profile`

## 1. Create Recruiter Profile

### Endpoint

`POST /api/v1/users/recruiter-profile`

### Authentication

Required.

Only authenticated users with the `RECRUITER` role can access this endpoint.

### Request

```json
{
  "companyId": 1,
  "designation": "Software Engineer",
  "department": "Engineering",
  "employeeId": "USER-REC-001"
}
