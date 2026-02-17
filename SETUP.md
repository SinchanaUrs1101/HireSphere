# HireSphere Database & Project Setup Guide

## Database Setup

### Prerequisites
- MySQL Server installed and running
- MySQL Client utilities

### Step 1: Create Database
Run the following SQL commands:

```sql
CREATE DATABASE IF NOT EXISTS hiresphere;
USE hiresphere;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    role VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100),
    description TEXT,
    company VARCHAR(100),
    posted_by INT,
    FOREIGN KEY (posted_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    job_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);
```

### Step 2: Run SQL Script
Or use the provided script:
```bash
mysql -u root -p < database.sql
```

### Step 3: Update MySQL Connection (if needed)
Edit `src/dao/DBConnection.java` and update:
- URL: `jdbc:mysql://localhost:3306/hiresphere`
- USER: `root` (your MySQL username)
- PASSWORD: `password` (your MySQL password)

### Step 4: Compile Project
```bash
cd /workspaces/HireSphere
javac -d bin src/model/*.java src/dao/*.java src/controller/*.java src/*.java
```

### Step 5: Run Project
```bash
cd /workspaces/HireSphere
java -cp bin:mysql-connector-java-8.0.xx.jar Main
```

## Project Structure
```
HireSphere/
├── src/
│   ├── model/         # Data models (User, Job, Application)
│   ├── dao/           # Database access objects
│   ├── controller/    # Business logic (AuthController, JobController)
│   └── Main.java      # Entry point
├── bin/               # Compiled classes
├── database.sql       # Database schema
└── README.md          # This file
```

## Features
- **User Management**: Register and login users (Recruiter/JobSeeker)
- **Job Posting**: Post job listings (recruiters only)
- **Job Applications**: Job seekers can apply for jobs
- **Job Search**: View all available jobs

## Database Credentials (Default)
- Username: `root`
- Password: `password`
- Database: `hiresphere`
- Host: `localhost:3306`

## MySQL JDBC Driver
Download from: https://dev.mysql.com/downloads/connector/j/
Place the JAR in your classpath or appropriate location.

---
**Note**: Make sure MySQL is running before executing the project.
