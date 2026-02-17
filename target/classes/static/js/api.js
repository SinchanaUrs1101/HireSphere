// API Base URL
const API_BASE_URL = 'http://localhost:8080/api';

// API utility functions
async function apiCall(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('API Error:', error);
        return {
            success: false,
            message: 'Network error. Please try again.',
            data: null
        };
    }
}

// Auth API calls
async function registerUser(name, email, password, role) {
    return apiCall('/auth/register', 'POST', {
        name: name,
        email: email,
        password: password,
        role: role
    });
}

async function loginUser(email, password) {
    return apiCall('/auth/login', 'POST', {
        email: email,
        password: password
    });
}

async function getUserProfile(userId) {
    return apiCall(`/auth/profile/${userId}`, 'GET');
}

// Job API calls
async function postJob(title, description, company, postedBy) {
    return apiCall('/jobs/post', 'POST', {
        title: title,
        description: description,
        company: company,
        postedBy: postedBy
    });
}

async function getAllJobs() {
    return apiCall('/jobs/all', 'GET');
}

async function getJobDetails(jobId) {
    return apiCall(`/jobs/${jobId}`, 'GET');
}

async function deleteJob(jobId) {
    return apiCall(`/jobs/${jobId}`, 'DELETE');
}

// Local Storage helpers
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

function isLoggedIn() {
    return getCurrentUser() !== null;
}
