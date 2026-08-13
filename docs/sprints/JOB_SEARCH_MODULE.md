# Job Search and Discovery Module

## Module Version

v0.10.0

## Status

Completed

## Overview

The Job Search and Discovery Module enables users to search and discover open placement opportunities using keyword search, location, company, employment type, experience level, salary range, and pagination.

The module extends the existing Job Management architecture and uses Spring Data JPA Specifications for dynamic database-level filtering.

---

## Objectives

- Search open jobs
- Search jobs using keywords
- Filter jobs by location
- Filter jobs by company
- Filter jobs by employment type
- Filter jobs by experience level
- Filter jobs by salary range
- Support pagination
- Sort results by creation date
- Return only currently open jobs
- Validate salary ranges
- Handle empty search results
- Avoid loading all jobs into application memory

---

## Architecture

The module follows the existing layered architecture:

Controller
↓
Service
↓
Specification
↓
Repository
↓
Database

Supporting components:

- Request DTO
- Response DTO
- JPA Specification
- Spring Data Pageable

---

## Search Request

`JobSearchRequest` represents the available search and filtering parameters.

Supported parameters:

- keyword
- location
- companyId
- employmentType
- experienceLevel
- minSalary
- maxSalary
- page
- size

Default pagination:

- page = 0
- size = 10

Maximum page size:

- 50

---

## Search Response

`JobSearchResponse` contains job information required for search results.

Fields include:

- Job ID
- Company ID
- Company name
- Recruiter profile ID
- Job title
- Description
- Location
- Employment type
- Experience level
- Minimum salary
- Maximum salary
- Number of openings
- Application deadline
- Job status
- Created timestamp
- Updated timestamp

Search results are returned using Spring Data `Page`.

---

## Dynamic Filtering

The module uses `JobSpecification` to construct database-level filtering conditions dynamically.

Supported specifications:

### Open Jobs

Only jobs with:

`JobStatus.OPEN`

are returned.

### Keyword

Keyword matching is performed against:

- Job title
- Job description

The search is case-insensitive.

### Location

Location filtering performs case-insensitive partial matching.

### Company

Jobs can be filtered using company ID.

### Employment Type

Jobs can be filtered using:

- FULL_TIME
- PART_TIME
- INTERNSHIP
- CONTRACT
- TEMPORARY

### Experience Level

Jobs can be filtered using the supported experience levels.

### Salary

Salary filtering supports minimum and maximum salary constraints.

A job is considered within the requested range when its salary range overlaps the requested salary range.

---

## Pagination

Search results use Spring Data pagination.

Example:

GET /api/v1/jobs/search?page=0&size=10

Default behavior:

- First page: 0
- Page size: 10

The maximum requested page size is limited to 50.

Results are ordered by:

`createdAt DESC`

Therefore, newer jobs appear first.

---

## REST API

### Search Open Jobs

```http
GET /api/v1/jobs/search
