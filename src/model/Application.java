package model;

import java.time.LocalDate;

public class Application {
    private int applicationId;
    private int jobSeekerId;
    private int jobId;
    private String status; // "Pending", "Accepted", "Rejected"
    private LocalDate appliedDate;

    public Application() {
    }

    public Application(int jobSeekerId, int jobId, String status, LocalDate appliedDate) {
        this.jobSeekerId = jobSeekerId;
        this.jobId = jobId;
        this.status = status;
        this.appliedDate = appliedDate;
    }

    public int getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(int applicationId) {
        this.applicationId = applicationId;
    }

    public int getJobSeekerId() {
        return jobSeekerId;
    }

    public void setJobSeekerId(int jobSeekerId) {
        this.jobSeekerId = jobSeekerId;
    }

    public int getJobId() {
        return jobId;
    }

    public void setJobId(int jobId) {
        this.jobId = jobId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(LocalDate appliedDate) {
        this.appliedDate = appliedDate;
    }
}
