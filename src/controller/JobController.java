package controller;

import dao.JobDAO;
import model.Job;
import java.util.List;

public class JobController {
    private JobDAO jobDAO;

    public JobController() {
        this.jobDAO = new JobDAO();
    }

    public boolean postJob(String title, String description, String company, int postedBy) {
        if (title == null || title.isEmpty() || description == null || description.isEmpty() || 
            company == null || company.isEmpty() || postedBy <= 0) {
            System.out.println("Invalid input: All fields are required.");
            return false;
        }

        Job job = new Job(title, description, company, postedBy);
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
