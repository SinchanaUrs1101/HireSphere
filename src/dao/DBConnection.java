package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DBConnection {
    private static final String MYSQL_URL = "jdbc:mysql://localhost:3306/hiresphere";
    private static final String MYSQL_USER = "root";
    private static final String MYSQL_PASSWORD = "password";

    private static final String H2_URL = "jdbc:h2:mem:hiresphere;DB_CLOSE_DELAY=-1;MODE=MySQL;DATABASE_TO_UPPER=false";
    private static final String H2_USER = "sa";
    private static final String H2_PASSWORD = "";

    private static volatile boolean h2Initialized = false;

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(MYSQL_URL, MYSQL_USER, MYSQL_PASSWORD);
            System.out.println("Successfully connected to MySQL database.");
            return conn;
        } catch (Exception mysqlEx) {
            System.out.println("Could not connect to MySQL; falling back to embedded H2 database. Error: " + mysqlEx.getMessage());
            mysqlEx.printStackTrace();
            return getH2Connection();
        }
    }

    private static Connection getH2Connection() throws SQLException {
        try {
            Class.forName("org.h2.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("H2 database driver not found", e);
        }

        Connection connection = DriverManager.getConnection(H2_URL, H2_USER, H2_PASSWORD);
        if (!h2Initialized) {
            synchronized (DBConnection.class) {
                if (!h2Initialized) {
                    initializeH2Schema(connection);
                    h2Initialized = true;
                }
            }
        }
        return connection;
    }

    private static void initializeH2Schema(Connection connection) throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(100), role VARCHAR(20));");
            stmt.execute("CREATE TABLE IF NOT EXISTS jobs (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(100), description TEXT, company VARCHAR(100), posted_by INT, FOREIGN KEY (posted_by) REFERENCES users(id));");
            stmt.execute("CREATE TABLE IF NOT EXISTS applications (id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, job_id INT, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (job_id) REFERENCES jobs(id));");
        }
    }
}
