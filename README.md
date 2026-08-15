# 🔐 Password Vault - Secure Credential Management System

A full-stack Password Vault application that enables users to securely store, manage, and share credentials with role-based access control. The system ensures secure authentication, encrypted credential management, and controlled sharing through permission-based authorization.

---

## 📌 Project Overview

Managing passwords across multiple platforms can be difficult and insecure. This application provides a centralized and secure vault where users can:

- Store credentials securely
- Manage passwords efficiently
- Share credentials with other users
- Control access using permission-based authorization
- Protect resources using JWT authentication

---

## ✨ Key Features

### 🔑 Authentication & Authorization
- User Registration
- User Login
- JWT Token Authentication
- Protected APIs using Spring Security
- Role-Based Access Control

### 🔐 Credential Management
- Add Credentials
- View Credentials
- Update Credentials
- Delete Credentials
- Secure Password Storage

### 🤝 Credential Sharing
Users can share credentials with other registered users and assign permission levels.

| Permission Level | View | Edit | Delete | Manage Sharing |
|-----------------|------|------|---------|---------------|
| View Only 
| Edit Access 
| Full Management 

---

## 🔄 Permission & Access Control Workflow

### Step 1: Select Shared Credential
The credential owner selects an existing credential.

### Step 2: Assign Permission
The owner chooses one permission level:

- View Only
- Edit Access
- Full Management

### Step 3: User Accesses Credential
The recipient logs into the system and opens the shared credential.

### Step 4: System Validates Permission
Before every operation, the system checks the assigned permission.

### Step 5: Allow or Deny Action

| Permission | Allowed Actions |
|------------|----------------|
| View Only | View |
| Edit Access | View + Edit |
| Full Management | View + Edit + Delete + Manage Sharing |

---

## 🏗 System Architecture

```text
┌─────────────────┐
│ React Frontend  │
└────────┬────────┘
         │ REST APIs
         ▼
┌─────────────────┐
│ Spring Boot API │
└────────┬────────┘
         │
 ┌───────┼────────┐
 ▼       ▼        ▼
JWT   Services   JPA
Auth  Layer      Layer
         │
         ▼
 ┌──────────────┐
 │ PostgreSQL DB│
 └──────────────┘
```

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- Lombok

### Database
- PostgreSQL

### Tools
- Git
- GitHub
- Postman
- IntelliJ IDEA
- VS Code

---

## 📂 Project Structure

### Backend

```text
src/main/java/com/passwordvault

├── controller
├── service
├── repository
├── entity
├── dto
├── security
├── config
└── PasswordVaultApplication
```

### Frontend

```text
src

├── components
├── pages
├── services
├── utils
├── assets
└── App.jsx
```

---

## 🔗 REST API Endpoints

### Authentication

| Method | Endpoint |
|----------|----------|
| POST | /auth/register |
| POST | /auth/login |

### Credential Management

| Method | Endpoint |
|----------|----------|
| GET | /credentials |
| POST | /credentials |
| PUT | /credentials/{id} |
| DELETE | /credentials/{id} |

### Credential Sharing

| Method | Endpoint |
|----------|----------|
| POST | /share |
| GET | /share/my-shares |
| DELETE | /share/revoke/{id} |

---

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone https://github.com/yourusername/password-vault.git
```

---

### Backend Setup

```bash
cd backend

mvn clean install

mvn spring-boot:run
```

### Configure Database

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/passwordvault
spring.datasource.username=postgres
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update

jwt.secret=your-secret-key
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 📸 Application Screenshots

### Login Page

<img width="800" alt="Login" src="screenshots/login.png">

### Dashboard

<img width="800" alt="Dashboard" src="screenshots/dashboard.png">

### Add Credential

<img width="800" alt="Credential" src="screenshots/credential.png">

### Share Credential

<img width="800" alt="Share" src="screenshots/share.png">

---

## 🔒 Security Features

- JWT Authentication
- Password Encryption
- Protected Endpoints
- Access Control Validation
- Permission-Based Sharing
- Secure Session Handling

---

## 🚀 Future Enhancements

- Multi-Factor Authentication (MFA)
- Password Strength Analyzer
- Credential Expiry Alerts
- Audit Logging
- Activity Monitoring
- Email Notifications
- Password Generator

---

## 👩‍💻 Author

### Saloni Kumari

Java Full Stack Developer

- Java
- Spring Boot
- React
- PostgreSQL
- REST APIs

LinkedIn:
www.linkedin.com/in/salonikumari20

GitHub:
https://github.com/HumAurCode