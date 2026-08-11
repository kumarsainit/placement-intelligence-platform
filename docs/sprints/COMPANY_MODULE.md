# Company Management Module

## Status

Completed

## Version

v0.6.0

## Branch

feature/company-module

## Overview

The Company Management module introduces the initial company
management capabilities required by the Placement Intelligence
Platform.

The module provides a centralized representation of companies
that can later be associated with recruiters, job postings,
placements, and other placement-related entities.

## Implemented Components

- Company database migration
- Company entity
- Company repository
- Create Company request DTO
- Company response DTO
- MapStruct company mapper
- Company service
- Company service implementation
- Company REST controller

## Database

Migration:

`V11__create_companies_table.sql`

Table:

`companies`

The migration was successfully executed through Flyway.

## Company Fields

- `id`
- `name`
- `website`
- `industry`
- `description`
- `location`
- `is_active`
- `created_at`
- `updated_at`

## APIs

### Create Company

```http
POST /v1/companies
