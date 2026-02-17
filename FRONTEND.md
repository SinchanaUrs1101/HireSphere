# HireSphere Web Application - Frontend Guide

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Web Browser (Client)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  HTML/CSS/JavaScript Frontend                        │   │
│  │  - Login Page (index.html)                           │   │
│  │  - Dashboard (dashboard.html)                        │   │
│  │  - Styling (css/style.css, dashboard.css)           │   │
│  │  - Logic (js/api.js, auth.js, dashboard.js)         │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓ HTTP/JSON                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────────┐
        │  Spring Boot REST API (Port 8080)         │
        │  ┌─────────────────────────────────────┐  │
        │  │ /api/auth (Authentication)          │  │
        │  │  - POST /register                   │  │
        │  │  - POST /login                      │  │
        │  │  - GET  /profile/{userId}           │  │
        │  └─────────────────────────────────────┘  │
        │  ┌─────────────────────────────────────┐  │
        │  │ /api/jobs (Job Management)          │  │
        │  │  - POST   /post                     │  │
        │  │  - GET    /all                      │  │
        │  │  - GET    /{jobId}                  │  │
        │  │  - DELETE /{jobId}                  │  │
        │  └─────────────────────────────────────┘  │
        └───────────────────────────────────────────┘
                            ↓ JDBC
        ┌───────────────────────────────────────────┐
        │  MySQL Database (Port 3306)               │
        │  - users table                            │
        │  - jobs table                             │
        │  - applications table                     │
        └───────────────────────────────────────────┘
```

## Frontend Files Structure

```
src/resources/static/
├── index.html                 # Login/Register page
├── dashboard.html             # Main dashboard page
├── css/
│   ├── style.css             # Global styles
│   └── dashboard.css         # Dashboard specific styles
└── js/
    ├── api.js                # API communication layer
    ├── auth.js               # Authentication functionality
    └── dashboard.js          # Dashboard functionality
```

## How to Use the Frontend

### 1. Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

### 2. Authentication

#### Register as a New User
1. Click "Register here" on the login page
2. Fill in the registration form:
   - Full Name
   - Email
   - Password
   - Role (Recruiter or Job Seeker)
3. Click "Register"

#### Login
1. Enter your email and password
2. Click "Login"
3. You will be redirected to the dashboard

### 3. Dashboard Features

#### For Job Seekers:
- **All Jobs**: View all available job listings
- **Job Details**: Click on any job card to view full details
- **Apply for Job**: Click "Apply for this Job" button in the job modal
- **Profile**: View your profile information

#### For Recruiters:
- **All Jobs**: View all job listings
- **Post Job**: 
  - Click on "Post Job" in the sidebar
  - Fill in job details (Title, Company, Description)
  - Click "Post Job"
- **Profile**: View your profile information

### 4. Local Storage

User login information is stored in browser's Local Storage:
- User ID
- Name
- Email
- Role

This allows persistent login across page refreshes until logout.

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Recruiter"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "data": null
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Recruiter"
  }
}
```

#### Get User Profile
```http
GET /api/auth/profile/1

Response:
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Recruiter"
  }
}
```

### Job Endpoints

#### Get All Jobs
```http
GET /api/jobs/all

Response:
{
  "success": true,
  "message": "Jobs retrieved",
  "data": [
    {
      "id": 1,
      "title": "Senior Java Developer",
      "description": "Looking for experienced Java developer...",
      "company": "Tech Company",
      "postedBy": 1
    },
    ...
  ]
}
```

#### Post New Job
```http
POST /api/jobs/post
Content-Type: application/json

{
  "title": "Senior Java Developer",
  "description": "Looking for experienced Java developer...",
  "company": "Tech Company",
  "postedBy": 1
}

Response:
{
  "success": true,
  "message": "Job posted successfully",
  "data": null
}
```

#### Get Job Details
```http
GET /api/jobs/1

Response:
{
  "success": true,
  "message": "Job details retrieved",
  "data": {
    "id": 1,
    "title": "Senior Java Developer",
    "description": "Looking for experienced Java developer...",
    "company": "Tech Company",
    "postedBy": 1
  }
}
```

#### Delete Job
```http
DELETE /api/jobs/1

Response:
{
  "success": true,
  "message": "Job deleted successfully",
  "data": null
}
```

## JavaScript Files Explanation

### api.js
Contains all API communication functions:
- `apiCall()` - Generic API call function
- `registerUser()` - Register new user
- `loginUser()` - User login
- `getUserProfile()` - Get user details
- `postJob()` - Post new job
- `getAllJobs()` - Fetch all jobs
- `getJobDetails()` - Fetch specific job
- `deleteJob()` - Delete a job
- Local storage helpers for user persistence

### auth.js
Handles authentication page functionality:
- Form validation
- Login/Register form handling
- Toggle between login and register forms
- Error/Success message display

### dashboard.js
Manages dashboard functionality:
- Dashboard initialization
- Tab switching (Jobs, Post Job, Profile)
- Job listing and display
- Job modal (detail view)
- Job posting
- User profile display
- Logout functionality

## Styling

### Global Styles (style.css)
- Authentication page design
- Form styling
- Button styles
- Message display (success/error/info)
- Responsive design

### Dashboard Styles (dashboard.css)
- Navbar styling
- Sidebar navigation
- Main content area layout
- Job cards grid layout
- Modal styling
- Profile information display
- Responsive grid layout for different screen sizes

## Features

✅ **User Authentication**
- Secure login/register
- Role-based access (Recruiter/JobSeeker)
- Session persistence via Local Storage

✅ **Job Management**
- Post new jobs (Recruiters)
- View all jobs
- View job details
- Delete jobs (Recruiters)

✅ **Responsive Design**
- Mobile-friendly interface
- Adapts to different screen sizes
- Touch-friendly buttons and forms

✅ **Real-time Updates**
- Jobs list updates after posting
- Profile updates
- Error handling with user-friendly messages

## Browser Compatibility

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### API Calls Not Working
- Ensure `//${API_BASE_URL}` is correct
- Check if Spring Boot server is running on port 8080
- Check browser console for CORS errors
- Verify database connection

### Login Issues
- Clear browser cookies and Local Storage
- Make sure database has user records
- Check if email and password are correct

### Jobs Not Showing
- Ensure database has job records
- Check if API is returning data
- Clear cache and reload page

### Style Issues
- Clear browser cache
- Check if CSS files are loading (F12 → Network tab)
- Verify CSS file paths are correct

## Performance Tips

1. **Images Optimization**: Use optimized images for faster loading
2. **Cache Busting**: Version CSS/JS files for cache busting
3. **Lazy Loading**: Consider implementing lazy loading for job cards
4. **Minification**: Minify CSS and JS for production

## Security Considerations

⚠️ **Important Notes**:
- Passwords are sent in plain text over HTTP. Use HTTPS in production
- Local Storage stores user info - not completely secure
- Implement JWT tokens for better security
- Add CSRF protection
- Use CORS whitelisting instead of `*`
- Add input validation and sanitization
- Implement rate limiting on API endpoints

## Enhancement Ideas

Future improvements for the frontend:
- [ ] Advanced job filtering and search
- [ ] Pagination for job listings
- [ ] User profile editing
- [ ] Application history and status tracking
- [ ] Email notifications
- [ ] Dark mode toggle
- [ ] Progressive Web App (PWA) features
- [ ] Real-time notifications with WebSockets
- [ ] File uploads (Resume/CV)
- [ ] Job recommendations

## Development Server

To start only the backend (already running):
```bash
java -jar target/hiresphere-1.0.0.jar
```

Access the frontend at:
```
http://localhost:8080
```

API Base URL:
```
http://localhost:8080/api
```

---

**Last Updated**: February 17, 2026
**Frontend Version**: 1.0.0
**Status**: Production Ready ✅
