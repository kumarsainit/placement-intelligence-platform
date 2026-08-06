# 🚀 Placement Intelligence Platform

> **An Enterprise-Level Placement Analytics Platform** built using **Java, Spring Boot, MySQL, JWT, React, Docker, and AWS** following production-grade software engineering practices.

---

## 📌 Overview

Placement Intelligence Platform is a scalable full-stack web application designed to simplify and automate the complete placement process for students, placement coordinators, and recruiters.

Unlike traditional placement portals, this platform focuses on **analytics**, **resume intelligence**, **company eligibility**, **placement insights**, and **secure authentication**, while following modern software architecture and clean coding principles.

This project is being developed using an **industry-standard SDLC approach**, where every sprint is documented, version-controlled, tested, and deployed.

---

# 🎯 Problem Statement

Most college placement systems only allow students to apply for companies.

They generally lack:

- Resume analysis
- Placement analytics
- Eligibility prediction
- Dashboard insights
- Placement statistics
- Secure authentication
- Recruiter management
- Data visualization

This project aims to solve all these problems in a single enterprise-level platform.

---

# ✨ Planned Features

## 🔐 Authentication & Security

- JWT Authentication
- Role Based Authorization
- Refresh Token
- Secure Password Encryption
- Protected REST APIs

---

## 👨‍🎓 Student Module

- Student Registration
- Profile Management
- Academic Details
- Skills Management
- Resume Upload
- Resume Score Analysis
- Company Eligibility Checker
- Placement History

---

## 🏢 Company Module

- Company Registration
- Job Posting
- Eligibility Criteria
- Package Details
- Recruitment Timeline

---

## 📈 Placement Analytics

- Department-wise Placements
- Package Distribution
- Highest Package
- Average Package
- Branch Comparison
- Company Statistics
- Hiring Trends
- Placement Percentage

---

## 📄 Resume Intelligence

- Resume Upload
- Resume Score
- Missing Skills Detection
- ATS Readiness
- Resume Improvement Suggestions

---

## 📊 Dashboard

- Admin Dashboard
- Student Dashboard
- Placement Coordinator Dashboard
- Company Dashboard

---

## 📬 Notifications

- Application Status
- Interview Schedule
- Offer Updates
- Deadline Alerts

---

## 📑 Reports

- Placement Reports
- Excel Export
- PDF Export
- Graphical Analytics

---

# 🛠️ Tech Stack

## Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Flyway
- REST APIs
- JWT Authentication

---

## Database

- MySQL

---

## Frontend

- React.js
- Tailwind CSS
- Axios

---

## DevOps

- Docker
- Git
- GitHub
- GitHub Actions

---

## Cloud

- AWS (Future)

---

# 📂 Project Structure

```text
placement-intelligence-platform/

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
└── README.md
```

---

# 🏗️ Software Architecture

The project follows **Layered Architecture**.

```text
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

Business logic is completely separated from presentation and persistence layers to ensure maintainability and scalability.

---

# 🗄️ Database Management

Database changes are managed using **Flyway Migration**.

Advantages:

- Version Controlled Schema
- Safe Database Updates
- Rollback Support
- Team Collaboration
- Production Ready

---

# 🔒 Security

The project will implement:

- JWT Authentication
- Role Based Access Control
- Password Encryption
- Secure REST APIs
- Input Validation
- Exception Handling

---

# 🚀 Current Development Status

## Sprint 1 – Backend Foundation

### ✅ Completed

- Project Structure
- Git Workflow
- Spring Boot Setup
- Multi Profile Configuration
- MySQL Integration
- Flyway Migration
- Hibernate Configuration
- Application Startup
- Dedicated Database User

---

### 🔄 In Progress

- API Response Wrapper
- Global Exception Handler
- Health API
- Swagger Documentation

---

### ⏳ Planned

- JWT Authentication
- User Module
- Student Module
- Company Module
- Placement Analytics
- Resume Intelligence
- Dashboard
- Deployment

---

# ⚙️ Getting Started

## Clone Repository

```bash
git clone https://github.com/kumarsainit/placement-intelligence-platform.git
```

---

## Backend

```bash
cd backend
```

Run

```bash
./mvnw spring-boot:run
```

---

## Database

Create database

```sql
CREATE DATABASE placement_intelligence;
```

---

# 📚 Documentation

Detailed documentation will be available inside:

```text
docs/
```

including:

- Architecture
- Database Design
- API Documentation
- Deployment Guide
- Sprint Reports

---

# 📅 Roadmap

## Sprint 1

- Backend Foundation

## Sprint 2

- Authentication
- Authorization

## Sprint 3

- User Module

## Sprint 4

- Student Module

## Sprint 5

- Company Module

## Sprint 6

- Placement Analytics

## Sprint 7

- Resume Intelligence

## Sprint 8

- Dashboard

## Sprint 9

- Deployment

---

# 🌟 Future Enhancements

- AI Resume Analysis
- ATS Resume Score
- Interview Question Recommendation
- Placement Prediction
- Company Recommendation Engine
- Email Notifications
- Mobile Application
- AWS Deployment

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**G V S Sai Kumar**

M.Tech – Mathematics & Computing  
Dr. B.R. Ambedkar National Institute of Technology, Jalandhar

---

## ⭐ If you like this project, don't forget to star the repository.
