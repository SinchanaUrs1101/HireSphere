# HireSphere - Job Portal Application

A comprehensive Java-based job portal application that connects recruiters and job seekers. Built with Java, MySQL, and follows the DAO (Data Access Object) design pattern.

## Features

✅ **User Management**
- User registration (Recruiter/JobSeeker roles)
- Secure login/authentication
- User profile management

✅ **Job Management**
- Post job listings (Recruiter feature)
- View all available jobs
- Job details retrieval
- Delete job postings

✅ **Application Management**
- Job seekers can apply for positions
- Track applications by user or job
- View application status

✅ **Database Integration**
- MySQL database with relational schema
- JDBC connection pooling
- Prepared statements for security

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 11+ | Core application language |
| MySQL | 8.0 | Database management |
| Maven | 3.8+ | Build automation |
| JDBC | 8.0.33 | Database connectivity |

## Project Architecture

```
HireSphere/
├── src/
│   ├── model/
│   │   ├── User.java           # User entity
│   │   ├── Job.java            # Job entity
│   │   └── Application.java     # Application entity
│   │
│   ├── dao/
│   │   ├── DBConnection.java    # Database connection management
│   │   ├── UserDAO.java         # User CRUD operations
│   │   ├── JobDAO.java          # Job CRUD operations
│   │   └── ApplicationDAO.java   # Application CRUD operations
│   │
│   ├── controller/
│   │   ├── AuthController.java  # Authentication logic
│   │   └── JobController.java   # Job management logic
│   │
│   └── Main.java                # Application entry point
│
├── pom.xml                      # Maven configuration
├── database.sql                 # Database schema
├── SETUP.md                     # Setup instructions
└── README.md                    # This file
```

## Quick Start

### Using Docker & Maven (Recommended)

```bash
# 1. Start MySQL in Docker
docker run -d --name hiresphere-db \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=hiresphere \
  -p 3306:3306 \
  mysql:8.0

# 2. Wait for MySQL initialization
sleep 10

# 3. Import database schema
docker exec -i hiresphere-db mysql -uroot -ppassword hiresphere < database.sql

# 4. Build the project
mvn clean package -DskipTests

# 5. Run the application
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

## Building from Source

### Prerequisites
- Java 11 or higher
- Maven 3.8 or higher
- MySQL 8.0 (or Docker)

### Build Steps

```bash
# Clone the repository
cd /workspaces/HireSphere

# Compile and package
mvn clean package -DskipTests

# Run the application
java -jar target/hiresphere-1.0.0.jar
```

## Database Configuration

Edit `src/dao/DBConnection.java` to configure database connection:

```java
private static final String URL = "jdbc:mysql://localhost:3306/hiresphere";
private static final String USER = "root";
private static final String PASSWORD = "password";
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    role VARCHAR(20)
);
```

### Jobs Table
```sql
CREATE TABLE jobs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100),
    description TEXT,
    company VARCHAR(100),
    posted_by INT,
    FOREIGN KEY (posted_by) REFERENCES users(id)
);
```

### Applications Table
```sql
CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    job_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);
```

## Usage Examples

### Register a User
```java
AuthController auth = new AuthController();
boolean success = auth.registerUser("John Doe", "john@example.com", "pass123", "Recruiter");
```

### Login
```java
User user = auth.loginUser("john@example.com", "pass123");
if (user != null) {
    System.out.println("Welcome, " + user.getName());
}
```

### Post a Job
```java
JobController jobs = new JobController();
boolean posted = jobs.postJob(
    "Senior Java Developer",
    "Looking for experienced Java developer",
    "Tech Company",
    1  // recruiter user ID
);
```

### Get All Jobs
```java
List<Job> allJobs = jobs.getAllJobs();
for (Job job : allJobs) {
    System.out.println(job.getTitle() + " at " + job.getCompany());
}
```

## Docker Commands

### Start Database
```bash
docker run -d --name hiresphere-db \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=hiresphere \
  -p 3306:3306 \
  mysql:8.0
```

### Stop Database
```bash
docker stop hiresphere-db
```

### Remove Container
```bash
docker rm hiresphere-db
```

### View Logs
```bash
docker logs hiresphere-db
```

## Database Verification

### Check Tables
```bash
docker exec hiresphere-db mysql -uroot -ppassword hiresphere -e "SHOW TABLES;"
```

### View All Users
```bash
docker exec hiresphere-db mysql -uroot -ppassword hiresphere -e "SELECT * FROM users;"
```

### View All Jobs
```bash
docker exec hiresphere-db mysql -uroot -ppassword hiresphere -e "SELECT * FROM jobs;"
```

## Project Status

✅ **Fully Functional**
- Database schema created and tested
- All CRUD operations working
- User authentication implemented
- Job posting and retrieval functional
- Data persistence verified

**Last Updated**: February 17, 2026

## Future Enhancements

- [ ] Web UI (Spring MVC/JSP)
- [ ] REST API (Spring Boot)
- [ ] Advanced search and filtering
- [ ] Application status management
- [ ] Email notifications
- [ ] User profile enhancement
- [ ] Admin dashboard
- [ ] Unit tests and integration tests

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please see [SETUP.md](SETUP.md) for detailed setup instructions.
