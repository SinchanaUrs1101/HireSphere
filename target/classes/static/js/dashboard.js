let currentUser = null;
let selectedJobId = null;
let selectedJob = null;
let allJobs = [];
let notifications = [];

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

    // Load notifications first so new jobs can be synced
    loadNotifications();
    syncJobSeekerNotifications();
    renderNotifications();

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
    const jobsCountLabel = document.getElementById('jobsCount');
    jobsList.innerHTML = '<p>Loading jobs...</p>';

    const response = await getAllJobs();

    if (response.success && response.data) {
        allJobs = response.data;
        jobsList.innerHTML = '';
        jobsCountLabel.textContent = response.data.length;
        
        if (response.data.length === 0) {
            jobsList.innerHTML = '<p>No jobs available at the moment.</p>';
            return;
        }

        response.data.forEach(job => {
            const jobCard = createJobCard(job);
            jobsList.appendChild(jobCard);
        });
    } else {
        allJobs = [];
        jobsCountLabel.textContent = '0';
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
    selectedJob = allJobs.find(j => j.id === jobId);
    const modal = document.getElementById('jobModal');

    if (selectedJob) {
        const jobDetailsDiv = document.getElementById('jobDetails');
        jobDetailsDiv.innerHTML = `
            <h2>${selectedJob.title}</h2>
            <p class="company-name">${selectedJob.company}</p>
            <p class="description">${selectedJob.description}</p>
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

// Close job modal
function closeJobModal() {
    const modal = document.getElementById('jobModal');
    modal.classList.remove('active');
    selectedJobId = null;
    document.getElementById('applyMessage').innerHTML = '';
}

// Handle apply job
async function handleApplyJob() {
    if (!selectedJob || !selectedJobId) {
        return;
    }

    if (currentUser.role !== 'JobSeeker') {
        alert('Only job seekers can apply for jobs.');
        return;
    }

    const messageDiv = document.getElementById('applyMessage');
    messageDiv.innerHTML = 'Sending application...';
    messageDiv.className = 'message info';

    const job = selectedJob;
    await notifyRecruiterAboutApplication(job);

    messageDiv.innerHTML = 'Application submitted successfully! The recruiter has been notified.';
    messageDiv.className = 'message success';

    setTimeout(() => {
        closeJobModal();
        renderNotifications();
    }, 1800);
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
        event.target.reset();
        addGlobalJobEvent({
            title,
            company,
            recruiterId: currentUser.id,
            recruiterName: currentUser.name,
            createdAt: Date.now()
        });

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

// Notification helpers
function getNotificationStorageKey(userId) {
    return `notifications_${userId}`;
}

function getGlobalJobEventsKey() {
    return 'jobPostEvents';
}

function getLastJobEventSeenKey(userId) {
    return `jobEventSeenAt_${userId}`;
}

function loadNotifications() {
    const raw = localStorage.getItem(getNotificationStorageKey(currentUser.id));
    notifications = raw ? JSON.parse(raw) : [];
}

function saveNotifications() {
    localStorage.setItem(getNotificationStorageKey(currentUser.id), JSON.stringify(notifications));
}

function addNotificationForUser(userId, notification) {
    const key = getNotificationStorageKey(userId);
    const raw = localStorage.getItem(key);
    const existing = raw ? JSON.parse(raw) : [];
    existing.unshift(notification);
    localStorage.setItem(key, JSON.stringify(existing));

    if (userId === currentUser.id) {
        notifications = existing;
    }
}

function getGlobalJobEvents() {
    const raw = localStorage.getItem(getGlobalJobEventsKey());
    return raw ? JSON.parse(raw) : [];
}

function setGlobalJobEvents(events) {
    localStorage.setItem(getGlobalJobEventsKey(), JSON.stringify(events));
}

function addGlobalJobEvent(event) {
    const events = getGlobalJobEvents();
    events.unshift(event);
    setGlobalJobEvents(events);
}

function getLastSeenJobEventTimestamp() {
    return Number(localStorage.getItem(getLastJobEventSeenKey(currentUser.id))) || 0;
}

function setLastSeenJobEventTimestamp(timestamp) {
    localStorage.setItem(getLastJobEventSeenKey(currentUser.id), timestamp.toString());
}

function syncJobSeekerNotifications() {
    if (currentUser.role !== 'JobSeeker') {
        return;
    }

    const lastSeen = getLastSeenJobEventTimestamp();
    const events = getGlobalJobEvents().filter(event => event.createdAt > lastSeen);
    if (events.length === 0) {
        return;
    }

    events.reverse().forEach(event => {
        addNotificationForUser(currentUser.id, {
            id: `job-${event.createdAt}`,
            message: `New job posted: ${event.title} at ${event.company}`,
            createdAt: event.createdAt,
            type: 'job',
            read: false
        });
    });

    if (events.length > 0) {
        setLastSeenJobEventTimestamp(Date.now());
    }
}

async function notifyRecruiterAboutApplication(job) {
    const profileResponse = await getUserProfile(job.postedBy);
    const recruiterName = profileResponse.success && profileResponse.data ? profileResponse.data.name : 'Recruiter';
    addNotificationForUser(job.postedBy, {
        id: `application-${job.id}-${Date.now()}`,
        message: `${currentUser.name} applied for "${job.title}" at ${job.company}.`, 
        createdAt: Date.now(),
        type: 'application',
        read: false
    });

    if (job.postedBy === currentUser.id) {
        loadNotifications();
    }
}

function renderNotifications() {
    const list = document.getElementById('notificationsList');
    const badge = document.getElementById('notificationCount');
    const unreadCount = notifications.filter(notification => !notification.read).length;

    if (!list) return;

    list.innerHTML = '';
    if (notifications.length === 0) {
        list.innerHTML = '<p class="no-notifications">No new notifications</p>';
    } else {
        notifications.slice(0, 5).forEach(notification => {
            const item = document.createElement('div');
            item.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
            item.innerHTML = `
                <div class="notification-text">${notification.message}</div>
                <div class="notification-meta">${new Date(notification.createdAt).toLocaleString()}</div>
            `;
            list.appendChild(item);
        });

        if (notifications.length > 5) {
            const more = document.createElement('p');
            more.className = 'notification-more';
            more.textContent = `Showing ${Math.min(5, notifications.length)} of ${notifications.length} notifications`;
            list.appendChild(more);
        }
    }

    if (badge) {
        badge.textContent = unreadCount > 0 ? unreadCount : '';
        badge.classList.toggle('hidden', unreadCount === 0);
    }
}

function markAllNotificationsRead() {
    notifications = notifications.map(notification => ({ ...notification, read: true }));
    saveNotifications();
    renderNotifications();
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
