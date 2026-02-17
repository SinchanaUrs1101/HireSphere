#!/bin/bash

# HireSphere - Complete Setup and Execution Guide
# Updated: February 17, 2026

echo "=========================================="
echo "HireSphere Project Setup & Execution"
echo "=========================================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."
echo ""

if command_exists docker; then
    echo "✓ Docker is installed"
else
    echo "✗ Docker is required but not installed"
    exit 1
fi

if command_exists mvn; then
    echo "✓ Maven is installed"
else
    echo "✗ Maven is required but not installed"
    exit 1
fi

if command_exists java; then
    echo "✓ Java is installed"
else
    echo "✗ Java is required but not installed"
    exit 1
fi

echo ""
echo "=========================================="
echo "Starting HireSphere Setup..."
echo "=========================================="
echo ""

# Step 1: Start MySQL Docker container
echo "Step 1: Starting MySQL Docker container..."
docker run -d --name hiresphere-db \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=hiresphere \
  -p 3306:3306 \
  mysql:8.0

echo "MySQL container started (ID: hiresphere-db)"
echo ""

# Step 2: Wait for MySQL to be ready
echo "Step 2: Waiting for MySQL to initialize (10 seconds)..."
sleep 10
echo "✓ MySQL ready"
echo ""

# Step 3: Import database schema
echo "Step 3: Importing database schema..."
docker exec -i hiresphere-db mysql -uroot -ppassword hiresphere < database.sql
echo "✓ Database schema imported"
echo ""

# Step 4: Verify tables
echo "Step 4: Verifying database tables..."
docker exec hiresphere-db mysql -uroot -ppassword hiresphere -e "SHOW TABLES;"
echo ""

# Step 5: Build project
echo "Step 5: Building project with Maven..."
mvn clean package -DskipTests
echo "✓ Build complete"
echo ""

# Step 6: Run application
echo "Step 6: Running HireSphere application..."
echo "=========================================="
echo ""
java -jar target/hiresphere-1.0.0.jar
echo ""
echo "=========================================="
echo "Application execution complete!"
echo "=========================================="
echo ""

# Verify data persistence
echo "Verifying data persistence..."
echo ""

echo "Users in database:"
docker exec hiresphere-db mysql -uroot -ppassword hiresphere -e "SELECT id, name, email, role FROM users;"
echo ""

echo "Jobs in database:"
docker exec hiresphere-db mysql -uroot -ppassword hiresphere -e "SELECT id, title, company, posted_by FROM jobs;"
echo ""

echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Database Connection Details:"
echo "  Host: localhost:3306"
echo "  Database: hiresphere"
echo "  User: root"
echo "  Password: password"
echo ""
echo "To stop the database, run:"
echo "  docker stop hiresphere-db"
echo "  docker rm hiresphere-db"
echo ""
