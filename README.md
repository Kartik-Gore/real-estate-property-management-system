# 🏡 Real Estate Property Management System

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring_Security-6.x-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/Database-MySQL_%7C_H2-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

A full-stack, enterprise-grade **Real Estate & Property Management Platform** built adhering to a clean **Layered Architecture**. The application provides end-to-end capabilities for listing, discovering, leasing, and managing residential and commercial properties, complete with role-based access control, booking lifecycle management, direct inquiry messaging, and a simulated payment gateway.

---

## 📌 Table of Contents

- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Demo Credentials](#-demo-credentials)
- [Database Schema & ER Model](#-database-schema--er-model)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start (Zero-Config H2 In-Memory)](#1-quick-start-zero-config-h2-in-memory)
  - [Production Start (MySQL Database)](#2-production-start-mysql-database)
- [Project Directory Structure](#-project-directory-structure)
- [Pushing to GitHub](#-pushing-to-github)
- [License](#-license)

---

## 🌟 Key Features

### 🔐 1. Authentication & Security
- **Stateless JWT Authentication**: Secure token generation, validation, and expiry handling.
- **Role-Based Access Control (RBAC)**: Segregated permissions for `ROLE_ADMIN`, `ROLE_OWNER`, and `ROLE_CUSTOMER`.
- **BCrypt Password Hashing**: Robust cryptographic protection for user passwords.
- **Convenient 1-Click Fast Login**: Fast demo role switching directly from the login page.

### 🏢 2. Property Catalog & Discovery
- **Comprehensive Listings**: Detailed properties with photos, type (Penthouse, Villa, Apartment, House, Commercial, Studio), pricing, bedrooms, bathrooms, square footage, address, and live availability status (`AVAILABLE`, `RENTED`, `SOLD`).
- **Dynamic Search & Filters**: Multi-parameter search by keyword, city, property type, price range, and bedroom count with instant sorting.
- **Owner Listing Management**: Property owners can create, modify, view, and delete their own properties with real-time status updates.

### 📅 3. Lease & Booking Workflow
- **Interactive Booking**: Date range selection, dynamic lease duration calculator, and automatic cost estimation.
- **Booking State Machine**: Full tracking of lifecycle stages (`PENDING` ➔ `APPROVED` / `REJECTED` ➔ `ACTIVE` ➔ `CANCELLED`).
- **Owner Decision Portal**: Property owners review tenant details and approve or reject booking requests.

### 💬 4. Inquiries & Direct Messaging
- **Direct Tenant-to-Owner Inquiries**: Customers can submit specific questions regarding any property listing.
- **Owner Inbox & Reply Modal**: Owners receive real-time notifications of questions and can post replies directly.
- **Thread Management**: Supports tracking unresolved queries and closing resolved discussions.

### 💳 5. Payment Gateway Simulator
- **Multi-Method Checkout**: Simulated transactions via Credit/Debit Cards, UPI / QR Codes, and Net Banking.
- **Instant Status Transition**: Upon successful mock payment, the booking status automatically converts to `ACTIVE` with unique transaction IDs and downloadable receipts.

### 📊 6. Role-Tailored Dashboards
- **System Admin Dashboard**: Platform-wide metrics, registered user directory with role modification/deletion, global property moderation, and system audit logs.
- **Property Owner Portal**: Inventory overview, rental earnings analytics, pending booking requests, and tenant inquiry management.
- **Customer / Tenant Hub**: Active leases, pending payments, booking history, submitted inquiries, and profile settings.

---

## 🏗 System Architecture

The application strictly implements an enterprise **4-Tier Layered Architecture**:

```
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                         PRESENTATION LAYER (Frontend)                       │
 │  • React 18 SPA + Vite                                                      │
 │  • Tailwind CSS + Lucide Icons                                              │
 │  • Axios Interceptors (JWT Bearer Token Injection)                          │
 │  • React Router DOM (Protected & Role-Guarded Routes)                       │
 └──────────────────────────────────────┬──────────────────────────────────────┘
                                        │ REST API (JSON over HTTP)
                                        ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                         APPLICATION LAYER (Spring Boot)                     │
 │  • Web / Controller Layer (@RestController, Request Validation @Valid)      │
 │  • Security Layer (Spring Security 6, JWT Filter, Method Security)          │
 │  • Business / Service Layer (Transaction Management, DTO Mapping)           │
 │  • Exception Handling (@ControllerAdvice, Standardized ApiResponse)         │
 └──────────────────────────────────────┬──────────────────────────────────────┘
                                        │ Object-Relational Mapping (Hibernate)
                                        ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                         DATA ACCESS LAYER (Spring Data JPA)                 │
 │  • CrudRepository / JpaRepository interfaces                                │
 │  • Custom Derived & JPQL Queries                                            │
 │  • Connection Pooling (HikariCP)                                            │
 └──────────────────────────────────────┬──────────────────────────────────────┘
                                        │ JDBC
                                        ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                         PERSISTENCE LAYER (Database)                        │
 │  • In-Memory Option: H2 Database (Default, Zero-Config Development)         │
 │  • Production Option: MySQL 8.x Database (Configurable via Profiles)        │
 └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide React, Axios, React Router 6 |
| **Backend** | Java 21, Spring Boot 3.3.4, Spring Web, Spring Security 6, Spring Data JPA |
| **Security & Auth** | JSON Web Tokens (`jjwt` 0.12.5), BCrypt Password Encoder, CORS Filter |
| **Databases** | H2 In-Memory Database (Development), MySQL 8.x (Production) |
| **Build Tools** | Maven 3.9+, Node.js 18+ / npm |

---

## 🔑 Demo Credentials

The backend includes a pre-configured database seeder (`DataInitializer`) that automatically provisions realistic demo listings and accounts upon startup:

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **System Admin** | `admin@realestate.com` | `Password@123` | Global analytics, user management, property moderation |
| **Property Owner** | `owner@realestate.com` | `Password@123` | Property CRUD, approve/reject bookings, answer inquiries |
| **Customer / Tenant** | `customer@realestate.com` | `Password@123` | Browse, lease booking, online checkout, submit inquiries |

> 💡 **Tip**: The login screen includes **1-Click Quick Fill** buttons for immediate testing with any role without manual typing.

---

## 🗄 Database Schema & ER Model

```
 ┌───────────────┐        1:N        ┌──────────────────┐
 │     USERS     │──────────────────<│    PROPERTIES    │
 └───────┬───────┘                   └─────────┬────────┘
         │                                     │
         │ 1:N                                 │ 1:N
         │                                     │
         ▼                                     ▼
 ┌───────────────┐        1:N        ┌──────────────────┐
 │   INQUIRIES   │>──────────────────│     BOOKINGS     │
 └───────────────┘                   └─────────┬────────┘
                                               │
                                               │ 1:1
                                               ▼
                                     ┌──────────────────┐
                                     │     PAYMENTS     │
                                     └──────────────────┘
```

- **User**: ID, Name, Email, Password, Phone, Role (`ADMIN`, `OWNER`, `CUSTOMER`), Created At.
- **Property**: ID, Title, Description, Type, Status, Price, Bedrooms, Bathrooms, Area (Sq. Ft.), Address, City, Image URL, Owner (FK).
- **Booking**: ID, Property (FK), Customer (FK), Start Date, End Date, Total Amount, Status (`PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`, `CANCELLED`).
- **Payment**: ID, Booking (FK), Customer (FK), Amount, Payment Method, Transaction ID, Status, Payment Date.
- **Inquiry**: ID, Property (FK), Customer (FK), Message, Response, Status (`OPEN`, `RESOLVED`), Created At.

---

## 🔌 API Endpoints Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate & obtain JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |

### 2. Properties (`/api/properties`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/properties` | Filter & paginate properties | Public |
| `GET` | `/api/properties/featured` | Fetch featured listings | Public |
| `GET` | `/api/properties/{id}` | Get property details | Public |
| `GET` | `/api/properties/my` | Get current owner's properties | Owner, Admin |
| `POST` | `/api/properties` | Create new listing | Owner, Admin |
| `PUT` | `/api/properties/{id}` | Update listing details | Owner, Admin |
| `DELETE` | `/api/properties/{id}` | Delete listing | Owner, Admin |

### 3. Bookings (`/api/bookings`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/bookings` | Create new booking request | Customer |
| `GET` | `/api/bookings/my` | View tenant bookings | Customer |
| `GET` | `/api/bookings/owner` | View received booking requests | Owner, Admin |
| `GET` | `/api/bookings/all` | List all system bookings | Admin |
| `PUT` | `/api/bookings/{id}/status`| Approve / Reject booking | Owner, Admin |
| `DELETE` | `/api/bookings/{id}` | Cancel booking | Customer, Admin |

### 4. Payments (`/api/payments`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/payments` | Process payment for booking | Customer |
| `GET` | `/api/payments/my` | Tenant payment history | Customer |
| `GET` | `/api/payments/owner` | Owner received payments | Owner, Admin |
| `GET` | `/api/payments/all` | All platform payments | Admin |

### 5. Inquiries (`/api/inquiries`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/inquiries` | Post inquiry to property owner | Customer |
| `GET` | `/api/inquiries/my` | View submitted inquiries | Customer |
| `GET` | `/api/inquiries/owner` | View received inquiries | Owner, Admin |
| `PUT` | `/api/inquiries/{id}/reply` | Reply to inquiry | Owner, Admin |
| `PUT` | `/api/inquiries/{id}/close` | Mark inquiry resolved | Customer, Admin |

### 6. Administration & Stats (`/api`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/stats/public` | Public counts (properties, cities) | Public |
| `GET` | `/api/admin/stats` | System KPI metrics | Admin |
| `GET` | `/api/owner/stats` | Owner income and property stats | Owner |
| `GET` | `/api/users` | List all users | Admin |
| `DELETE` | `/api/users/{id}` | Delete user | Admin |

---

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 21 or higher installed ([Download JDK 21](https://www.oracle.com/java/technologies/downloads/#java21))
- **Node.js**: v18.0 or higher ([Download Node.js](https://nodejs.org/))
- **Maven**: 3.9+ (or use the included Maven wrapper / batch scripts)
- **MySQL** *(Optional)*: Only needed if running the MySQL profile instead of H2.

---

### 1. Quick Start (Zero-Config H2 In-Memory)

The quickest way to get the system running without setting up any external database:

#### Step 1: Start Backend (Port 8080)
```powershell
# Double click or run:
.\start-backend.bat

# Or run via Maven directly:
cd backend
mvn spring-boot:run
```
- **Backend API**: `http://localhost:8080`
- **H2 Web Console**: `http://localhost:8080/h2-console`
  - **JDBC URL**: `jdbc:h2:mem:realestatedb`
  - **User**: `sa`
  - **Password**: `password`

#### Step 2: Start Frontend (Port 5173)
```powershell
# Double click or run:
.\start-frontend.bat

# Or run via npm directly:
cd frontend
npm install
npm run dev
```
- **Web App**: Open your browser at `http://localhost:5173`

---

### 2. Production Start (MySQL Database)

To run the application with a persistent MySQL database:

#### Step 1: Create Database
Open MySQL Workbench or MySQL CLI:
```sql
CREATE DATABASE IF NOT EXISTS realestate_db;
```
*(Optional: execute `application.sql` if you wish to run manual schema creation, or let Hibernate generate tables automatically).*

#### Step 2: Configure Credentials
Verify or update `backend/src/main/resources/application-mysql.properties` or `application-mysql.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/realestate_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
    username: root
    password: YOUR_MYSQL_PASSWORD
```

#### Step 3: Launch with MySQL Profile
```powershell
.\start-backend-mysql.bat

# Or via Maven command line:
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

---

## 📁 Project Directory Structure

```text
CAP-Gemmini/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/capgemini/realestate/
│   │   │   │   ├── config/            # Security, CORS, and DataInitializer
│   │   │   │   ├── controller/        # REST Controllers (Auth, Property, Booking, etc.)
│   │   │   │   ├── dto/               # Request & Response Data Transfer Objects
│   │   │   │   ├── entity/            # JPA Entities (User, Property, Booking, Payment, Inquiry)
│   │   │   │   ├── exception/         # Custom exceptions & global @ControllerAdvice
│   │   │   │   ├── repository/        # Spring Data JPA Repositories
│   │   │   │   ├── security/          # JWT Token Provider, Auth Filter & EntryPoint
│   │   │   │   ├── service/           # Business logic service implementations
│   │   │   │   └── RealEstateApplication.java # Spring Boot Main Class
│   │   │   └── resources/
│   │   │       ├── application.yml    # Default H2 configuration
│   │   │       └── application-mysql.yml # MySQL profile configuration
│   │   └── test/                      # Unit & Integration Tests
│   └── pom.xml                        # Maven Dependencies & Plugins
├── frontend/
│   ├── src/
│   │   ├── components/                # Reusable UI components (Navbar, Footer, Modals)
│   │   ├── context/                   # React Authentication & Global Context
│   │   ├── pages/                     # Routed pages (Home, Properties, Detail, Login, Register)
│   │   │   ├── admin/                 # Admin Dashboard & User Management
│   │   │   ├── owner/                 # Owner Listings & Booking Moderation
│   │   │   └── customer/              # Tenant Leases & Inquiries
│   │   ├── services/                  # Axios API client integrations
│   │   ├── App.jsx                    # Route registry & layout hierarchy
│   │   └── main.jsx                   # React root entry point
│   ├── package.json                   # Frontend dependencies & build scripts
│   ├── tailwind.config.js             # Tailwind CSS styling configuration
│   └── vite.config.js                 # Vite bundler configuration
├── application.sql                    # MySQL database schema & sample data script
├── start-backend.bat                  # One-click backend startup (H2)
├── start-backend-mysql.bat            # One-click backend startup (MySQL)
├── start-frontend.bat                 # One-click frontend startup
├── .gitignore                         # Git exclusion rules (node_modules, target, etc.)
└── README.md                          # Project documentation
```

---

## 📤 Pushing to GitHub

Follow these steps to upload this project to your GitHub account:

### 1. Initialize Git in the project root:
```powershell
git init
```

### 2. Stage files and make your initial commit:
```powershell
git add .
git commit -m "feat: initial commit - complete full-stack real estate property management system"
```

### 3. Rename branch to `main`:
```powershell
git branch -M main
```

### 4. Link your remote GitHub repository and push:
```powershell
# Replace with your actual GitHub repository URL:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

---

## 📄 License

This project was developed as a Capstone project demonstration. It is licensed under the [MIT License](LICENSE).
