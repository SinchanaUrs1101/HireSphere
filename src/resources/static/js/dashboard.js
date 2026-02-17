let currentUser = null;
let selectedJobId = null;

// Initialize dashboard
window.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isLoggedIn()) {
        window.location.href = '/index.html';
        return;
    }

    currentUser = getCurrentUser();
    initializeDashboard();
});

// Initialize dashboard
function initializeDashboard() {
    // Update user greeting
    document.getElementById('userGreeting').textContent = `Welcome, ${currentUser.name}!`;
    
    // Update profile section
    updateProfileDisplay();
    
    // Show/hide post job tab based on role
    const postJobTab = document.getElementById('postJobTab');
    if (currentUser.role === 'Recruiter') {
        postJobTab.classList.remove('hidden');
    } else {
        postJobTab.classList.add('hidden');
    }

    // Load jobs
    loadJobs();

    // Apply body class
    document.body.classList.add('dashboard-body');
}

// Update profile display
function updateProfileDisplay() {
    // Sidebar profile
    document.getElementById('avatarInitial').textContent = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileRole').textContent = currentUser.role;

    // Profile tab
    document.getElementById('profileNameDisplay').textContent = currentUser.name;
    document.getElementById('profileEmailDisplay').textContent = currentUser.email;
    document.getElementById('profileRoleDisplay').textContent = currentUser.role;
}

// Load all jobs
async function loadJobs() {
    const jobsList = document.getElementById('jobsList');
    jobsList.innerHTML = '<p>Loading jobs...</p>';

    const response = await getAllJobs();

    if (response.success && response.data) {
        jobsList.innerHTML = '';
        
        if (response.data.length === 0) {
            jobsList.innerHTML = '<p>No jobs available at the moment.</p>';
            return;
        }

        response.data.forEach(job => {
            const jobCard = createJobCard(job);
            jobsList.appendChild(jobCard);
        });
    } else {
        jobsList.innerHTML = '<p>Error loading jobs. Please try again.</p>';
    }
}

// Create job card element
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.onclick = () => showJobDetails(job.id);

    card.innerHTML = `
        <h3>${job.title}</h3>
        <p class="company">${job.company}</p>
        <p class="description">${job.description}</p>
        <p class="posted-by">Posted by: User ${job.postedBy}</p>
    `;

    return card;
}

// Show job details in modal
function showJobDetails(jobId) {
    selectedJobId = jobId;
    const modal = document.getElementById('jobModal');

    // Find job from loaded jobs
    const response = getAllJobs().then(res => {
        if (res.success && res.data) {
            const job = res.data.find(j => j.id === jobId);
            if (job) {
                const jobDetailsDiv = document.getElementById('jobDetails');
                jobDetailsDiv.innerHTML = `
                    <h2>${job.title}</h2>
                    <p class="company-name">${job.company}</p>
                    <p class="description">${job.description}</p>
                `;

                // Hide apply button for recruiters
                const applySection = document.querySelector('.apply-section');
                if (currentUser.role === 'Recruiter') {
                    applySection.style.display = 'none';
                } else {
                    applySection.style.display = 'block';
                }

                modal.classList.add('active');
            }
        }
    });
}

// Close job modal
function closeJobModal() {
    const modal = document.getElementById('jobModal');
    modal.classList.remove('active');
    selectedJobId = null;
    document.getElementById('applyMessage').innerHTML = '';
}

// Handle apply job
function handleApplyJob() {
    if (selectedJobId) {
        const messageDiv = document.getElementById('applyMessage');
        messageDiv.innerHTML = 'Application submitted successfully!';
        messageDiv.className = 'message success';

        setTimeout(() => {
            closeJobModal();
        }, 2000);
    }
}

// Handle post job
async function handlePostJob(event) {
    event.preventDefault();

    if (currentUser.role !== 'Recruiter') {
        alert('Only recruiters can post jobs');
        return;
    }

    const title = document.getElementById('jobTitle').value;
    const description = document.getElementById('jobDescription').value;
    const company = document.getElementById('jobCompany').value;

    const messageDiv = document.getElementById('postJobMessage');
    messageDiv.innerHTML = 'Posting job...';
    messageDiv.className = 'message info';

    const response = await postJob(title, description, company, currentUser.id);

    if (response.success) {
        showMessage('postJobMessage', 'Job posted successfully!', 'success');
        
        // Clear form
        event.target.reset();

        // Reload jobs
        setTimeout(() => {
            loadJobs();
            switchTab(null, 'jobs');
        }, 1500);
    } else {
        showMessage('postJobMessage', response.message, 'error');
    }
}

// Switch tabs
function switchTab(event, tabName) {
    if (event) {
        event.preventDefault();
    }

    // Hide all tabs
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked nav item
    event?.target.closest('.nav-item')?.classList.add('active');

    // If jobs tab, make sure it's marked active
    if (tabName === 'jobs') {
        document.querySelector('[data-tab="jobs"]').classList.add('active');
    }
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        clearCurrentUser();
        window.location.href = '/index.html';
    }
}

// Show message helper
function showMessage(elementId, message, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.innerHTML = message;
    messageDiv.className = `message ${type}`;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('jobModal');
    if (event.target === modal) {
        closeJobModal();
    }
}
