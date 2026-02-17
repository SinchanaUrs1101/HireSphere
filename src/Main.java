import controller.AuthController;
import controller.JobController;
import model.User;
import model.Job;

public class Main {

    public static void main(String[] args) {
        // Initialize controllers
        AuthController authController = new AuthController();
        JobController jobController = new JobController();

        // Example: Register a user
        System.out.println("=== HireSphere Application ===\n");

        // Register a recruiter
        boolean recruiterRegistered = authController.registerUser("John Recruiter", "john@company.com", "pass123", "Recruiter");
        System.out.println("Recruiter registered: " + recruiterRegistered);

        // Register a job seeker
        boolean jobSeekerRegistered = authController.registerUser("Jane JobSeeker", "jane@email.com", "pass456", "JobSeeker");
        System.out.println("Job Seeker registered: " + jobSeekerRegistered);

        // Login user
        User loggedInUser = authController.loginUser("john@company.com", "pass123");
        if (loggedInUser != null) {
            System.out.println("\nLogged in as: " + loggedInUser.getName() + " (" + loggedInUser.getUserType() + ")");
        }

        // Post a job
        if (loggedInUser != null && loggedInUser.getUserType().equals("Recruiter")) {
            boolean jobPosted = jobController.postJob(
                "Java Developer",
                "We are looking for an experienced Java developer.",
                "Tech Company",
                "New York",
                120000,
                loggedInUser.getUserId()
            );
            System.out.println("Job posted: " + jobPosted);
        }

        // Get all jobs
        System.out.println("\nAll Jobs:");
        jobController.getAllJobs().forEach(job -> 
            System.out.println("- " + job.getTitle() + " at " + job.getCompany())
        );
    }
}
