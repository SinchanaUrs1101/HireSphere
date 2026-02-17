package dao;

import model.Application;
import java.sql.*;
import java.util.*;

public class ApplicationDAO {

    public boolean addApplication(Application application) {
        String sql = "INSERT INTO applications (job_seeker_id, job_id, status, applied_date) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, application.getJobSeekerId());
            pstmt.setInt(2, application.getJobId());
            pstmt.setString(3, application.getStatus());
            pstmt.setDate(4, java.sql.Date.valueOf(application.getAppliedDate()));
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Application> getApplicationsByJobSeekerId(int jobSeekerId) {
        List<Application> applications = new ArrayList<>();
        String sql = "SELECT * FROM applications WHERE job_seeker_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, jobSeekerId);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                Application app = new Application();
                app.setApplicationId(rs.getInt("application_id"));
                app.setJobSeekerId(rs.getInt("job_seeker_id"));
                app.setJobId(rs.getInt("job_id"));
                app.setStatus(rs.getString("status"));
                app.setAppliedDate(rs.getDate("applied_date").toLocalDate());
                applications.add(app);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return applications;
    }

    public List<Application> getApplicationsByJobId(int jobId) {
        List<Application> applications = new ArrayList<>();
        String sql = "SELECT * FROM applications WHERE job_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, jobId);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                Application app = new Application();
                app.setApplicationId(rs.getInt("application_id"));
                app.setJobSeekerId(rs.getInt("job_seeker_id"));
                app.setJobId(rs.getInt("job_id"));
                app.setStatus(rs.getString("status"));
                app.setAppliedDate(rs.getDate("applied_date").toLocalDate());
                applications.add(app);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return applications;
    }

    public boolean updateApplicationStatus(int applicationId, String status) {
        String sql = "UPDATE applications SET status = ? WHERE application_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, status);
            pstmt.setInt(2, applicationId);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
