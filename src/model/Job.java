package model;

public class Job {
    private int id;
    private String title;
    private String description;
    private String company;
    private int postedBy;

    public Job() {
    }

    public Job(String title, String description, String company, int postedBy) {
        this.title = title;
        this.description = description;
        this.company = company;
        this.postedBy = postedBy;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public int getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(int postedBy) {
        this.postedBy = postedBy;
    }
}
