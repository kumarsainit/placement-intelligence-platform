# Project Engineering Decisions

This document records major architectural and engineering decisions made during the development of the Placement Intelligence Platform.

The purpose of this document is to maintain a clear engineering history and explain why important technologies, architectural patterns, and implementation decisions were selected.

---

# 1. Backend Framework

## Decision

Use Spring Boot for backend development.

## Reason

Spring Boot provides:

- Production-ready REST API development
- Dependency injection
- Spring Security integration
- Spring Data JPA
- Validation support
- Configuration management
- Easy integration with MySQL
- Strong ecosystem and enterprise adoption

---

# 2. Programming Language

## Decision

Use Java 21.

## Reason

Java provides:

- Strong object-oriented programming support
- Type safety
- Mature ecosystem
- Excellent Spring Boot compatibility
- Good performance
- Long-term maintainability

Java 21 also provides modern language and JVM improvements while being an LTS release.

---

# 3. Architecture

## Decision

Use layered architecture.

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
