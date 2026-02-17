// Check if user is already logged in
window.addEventListener('DOMContentLoaded', function() {
    if (isLoggedIn()) {
        window.location.href = '/dashboard.html';
    }
});

// Toggle between login and register forms
function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.classList.toggle('active');
    registerForm.classList.toggle('active');

    // Clear messages when switching
    clearMessage('loginMessage');
    clearMessage('registerMessage');
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const messageDiv = document.getElementById('loginMessage');
    messageDiv.innerHTML = 'Logging in...';
    messageDiv.className = 'message info';

    const response = await loginUser(email, password);

    if (response.success) {
        setCurrentUser(response.data);
        showMessage('loginMessage', 'Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1500);
    } else {
        showMessage('loginMessage', response.message, 'error');
    }
}

// Handle registration
async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;

    if (!role) {
        showMessage('registerMessage', 'Please select a role', 'error');
        return;
    }

    const messageDiv = document.getElementById('registerMessage');
    messageDiv.innerHTML = 'Registering...';
    messageDiv.className = 'message info';

    const response = await registerUser(name, email, password, role);

    if (response.success) {
        showMessage('registerMessage', 'Registration successful! Please login.', 'success');
        // Clear form
        document.getElementById('regName').value = '';
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';
        document.getElementById('regRole').value = '';
        
        // Switch to login form
        setTimeout(() => {
            toggleForms();
        }, 1500);
    } else {
        showMessage('registerMessage', response.message, 'error');
    }
}

// Show message helper
function showMessage(elementId, message, type) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.innerHTML = message;
    messageDiv.className = `message ${type}`;
}

// Clear message helper
function clearMessage(elementId) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.innerHTML = '';
    messageDiv.className = 'message';
}
