# HireSphere Database & Project Setup Guide

## Quick Start (Using Docker & Maven)

### Prerequisites
- Docker installed and running
- Maven installed
- Java 11+

### Setup Steps

#### Step 1: Start MySQL with Docker
```bash
docker run -d --name hiresphere-db \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=hiresphere \
  -p 3306:3306 \
  mysql:8.0
```

#### Step 2: Wait for MySQL to Initialize
```bash
sleep 10
```

#### Step 3: Import Database Schema
```bash
docker exec -i hiresphere-db mysql -uroot -ppassword hiresphere < database.sql
```

#### Step 4: Build Project with Maven
```bash
cd /workspaces/HireSphere
mvn clean package -DskipTests
```

#### Step 5: Run Application
```bash
java -jar target/hiresphere-1.0.0.jar
```

### Expected Output
```
=== HireSphere Application ===

Recruiter registered: true
Job Seeker registered: true

Logged in as: John Recruiter (Recruiter)
Job posted: true

All Jobs:
- Java Developer at Tech Company
```

## Manual Setup (Without Docker)

### Database Setup (Local MySQL)

#### Step 1: Install MySQL
```bash
sudo apt-get install mysql-server mysql-client
```

#### Step 2: Create Database
```bash
mysql -u root -p < database.sql
```

#### Step 3: Verify Connection
Edit `src/dao/DBConnection.java`:
```java
private static final String URL = "jdbc:mysql://localhost:3306/hiresphere";
private static final String USER = "root";
private static final String PASSWORD = "your_password";
```

#### Step 4: Build with Maven
```bash
mvn clean package -DskipTests
```

#### Step 5: Run Application
```bash
java -jar target/hiresphere-1.0.0.jar
```

## Project Structure
```
HireSphere/
├── src/
│   ├── model/              # Data models (User, Job, Application)
│   ├── dao/                # Database access objects + DBConnection
│   ├── controller/         # Business logic (AuthController, JobController)
│   └── Main.java           # Entry point
├── bin/                    # Compiled classes (local compile)
├── target/                 # Maven build output
│   └── hiresphere-1.0.0.jar  # Executable JAR with dependencies
├── pom.xml                 # Maven configuration
├── database.sql            # Database schema
├── SETUP.md                # This file
└── README.md
```

## Features
- **User Management**: Register and login users (Recruiter/JobSeeker)
- **Job Posting**: Post job listings
- **Job Applications**: Apply for jobs
- **Job Search**: View all available jobs

## Database Credentials
- Username: `root`
- Password: `password`
- Database: `hiresphere`
- Host: `localhost:3306`

## Verify Database Setup

### Check Tables
```bash
docker exec hiresphere-db mysql -uroot -ppassword hiresphere -e "SHOW TABLES;"
```

### View Users
```bash
docker exec hiresphere-db mysql -uroot -ppassword hiresphere -e "SELECT * FROM users;"
```

### View Jobs
```bash
docker exec hiresphere-db mysql -uroot -ppassword hiresphere -e "SELECT * FROM jobs;"
```

## Stop Docker Container
```bash
docker stop hiresphere-db
docker rm hiresphere-db
```

## Dependencies (Automatically Managed by Maven)
- MySQL Connector/J 8.0.33
- Java 11+
- Spring Framework (optional, not currently used)

---
**Status**: ✅ Fully Tested and Working
**Last Verified**: February 17, 2026
