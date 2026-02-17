package api;

import model.Job;
import controller.JobController;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobRestController {

    private JobController jobController = new JobController();

    @PostMapping("/post")
    public ApiResponse postJob(@RequestBody PostJobRequest request) {
        try {
            boolean success = jobController.postJob(
                request.getTitle(),
                request.getDescription(),
                request.getCompany(),
                request.getPostedBy()
            );
            if (success) {
                return new ApiResponse(true, "Job posted successfully", null);
            } else {
                return new ApiResponse(false, "Failed to post job", null);
            }
        } catch (Exception e) {
            return new ApiResponse(false, "Error: " + e.getMessage(), null);
        }
    }

    @GetMapping("/all")
    public ApiResponse getAllJobs() {
        try {
            List<Job> jobs = jobController.getAllJobs();
            return new ApiResponse(true, "Jobs retrieved", jobs);
        } catch (Exception e) {
            return new ApiResponse(false, "Error: " + e.getMessage(), null);
        }
    }

    @GetMapping("/{jobId}")
    public ApiResponse getJobDetails(@PathVariable int jobId) {
        try {
            Job job = jobController.getJobDetails(jobId);
            if (job != null) {
                return new ApiResponse(true, "Job details retrieved", job);
            } else {
                return new ApiResponse(false, "Job not found", null);
            }
        } catch (Exception e) {
            return new ApiResponse(false, "Error: " + e.getMessage(), null);
        }
    }

    @DeleteMapping("/{jobId}")
    public ApiResponse deleteJob(@PathVariable int jobId) {
        try {
            boolean success = jobController.removeJob(jobId);
            if (success) {
                return new ApiResponse(true, "Job deleted successfully", null);
            } else {
                return new ApiResponse(false, "Failed to delete job", null);
            }
        } catch (Exception e) {
            return new ApiResponse(false, "Error: " + e.getMessage(), null);
        }
    }
}

class PostJobRequest {
    public String title;
    public String description;
    public String company;
    public int postedBy;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public int getPostedBy() { return postedBy; }
    public void setPostedBy(int postedBy) { this.postedBy = postedBy; }
}
