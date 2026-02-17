package controller;

import dao.JobDAO;
import model.Job;
import java.util.List;

public class JobController {
    private JobDAO jobDAO;

    public JobController() {
        this.jobDAO = new JobDAO();
    }

    public boolean postJob(String title, String description, String company, String location, double salary, int recruiterId) {
        if (title == null || title.isEmpty() || description == null || description.isEmpty() || 
            company == null || company.isEmpty() || location == null || location.isEmpty() || salary <= 0) {
            System.out.println("Invalid input: All fields are required and salary must be positive.");
            return false;
        }

        Job job = new Job(title, description, company, location, salary, recruiterId);
        return jobDAO.addJob(job);
    }

    public List<Job> getAllJobs() {
        return jobDAO.getAllJobs();
    }

    public Job getJobDetails(int jobId) {
        return jobDAO.getJobById(jobId);
    }

    public boolean removeJob(int jobId) {
        return jobDAO.deleteJob(jobId);
    }
}
