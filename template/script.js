// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// DOM Elements
const urlForm = document.getElementById('urlForm');
const targetUrlInput = document.getElementById('targetUrl');
const resultContainer = document.getElementById('resultContainer');
const shortUrlInput = document.getElementById('shortUrl');
const adminUrlSpan = document.getElementById('adminUrl');
const copyBtn = document.getElementById('copyBtn');
const visitShortenedUrlBtn = document.getElementById('visitShortenedUrlBtn'); // New button

const adminKeyInput = document.getElementById('adminKey');
const loadUrlBtn = document.getElementById('loadUrlBtn');
const urlManagement = document.getElementById('urlManagement');
const originalUrlSpan = document.getElementById('originalUrl');
const shortenedUrlSpan = document.getElementById('shortenedUrl');
const clickCountSpan = document.getElementById('clickCount');
const urlStatusSpan = document.getElementById('urlStatus');
const copyShortUrlBtn = document.getElementById('copyShortUrlBtn');
const visitUrlBtn = document.getElementById('visitUrlBtn');
const deleteUrlBtn = document.getElementById('deleteUrlBtn');

// Global variables
let currentUrlData = null;

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeNavigation();
});

function initializeEventListeners() {
    // URL shortening form
    urlForm.addEventListener('submit', handleUrlShortening);
    copyBtn.addEventListener('click', copyShortUrl);
    visitShortenedUrlBtn.addEventListener('click', visitShortenedUrlFromCreation); // New event listener
    
    // URL management
    loadUrlBtn.addEventListener('click', loadUrlByAdminKey);
    copyShortUrlBtn.addEventListener('click', copyShortUrlFromManagement);
    visitUrlBtn.addEventListener('click', visitShortUrl);
    deleteUrlBtn.addEventListener('click', deleteUrl);
    
    // Enter key support for admin key input
    adminKeyInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loadUrlByAdminKey();
        }
    });
}

// Navigation Functions
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// URL Shortening Functions
async function handleUrlShortening(e) {
    e.preventDefault();
    
    const targetUrl = targetUrlInput.value.trim();
    
    if (!targetUrl) {
        showToast('Please enter a URL', 'error');
        return;
    }
    
    if (!isValidUrl(targetUrl)) {
        showToast('Please enter a valid URL', 'error');
        return;
    }
    
    try {
        showLoadingState();
        
        const response = await fetch(`${API_BASE_URL}/url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                target_url: targetUrl
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to shorten URL');
        }
        
        const data = await response.json();
        displayShortenedUrl(data);
        showToast('URL shortened successfully!', 'success');
        
    } catch (error) {
        console.error('Error shortening URL:', error);
        showToast(error.message || 'Failed to shorten URL', 'error');
    } finally {
        hideLoadingState();
    }
}

function displayShortenedUrl(data) {
    shortUrlInput.value = data.url;
    adminUrlSpan.textContent = data.admin_url;
    resultContainer.classList.remove('hidden');
    
    // Store admin key for potential future use
    const adminKey = data.admin_url.split('/admin/')[1];
    localStorage.setItem('lastAdminKey', adminKey);
}

// URL Management Functions
async function loadUrlByAdminKey() {
    const adminKey = adminKeyInput.value.trim();
    
    if (!adminKey) {
        showToast('Please enter an admin key', 'error');
        return;
    }
    
    try {
        showLoadingState();
        
        const response = await fetch(`${API_BASE_URL}/admin/${adminKey}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('URL not found. Please check your admin key.');
            }
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to load URL');
        }
        
        const data = await response.json();
        displayUrlManagement(data);
        showToast('URL loaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error loading URL:', error);
        showToast(error.message || 'Failed to load URL', 'error');
        urlManagement.classList.add('hidden');
    } finally {
        hideLoadingState();
    }
}

function displayUrlManagement(data) {
    currentUrlData = data;
    
    originalUrlSpan.textContent = data.target_url;
    shortenedUrlSpan.textContent = data.url;
    clickCountSpan.textContent = data.clicks;
    urlStatusSpan.textContent = data.is_active ? 'Active' : 'Inactive';
    urlStatusSpan.className = `status ${data.is_active ? 'active' : 'inactive'}`;
    
    urlManagement.classList.remove('hidden');
}

async function deleteUrl() {
    if (!currentUrlData) {
        showToast('No URL loaded to delete', 'error');
        return;
    }
    
    const adminKey = currentUrlData.admin_url.split('/admin/')[1];
    
    if (!confirm('Are you sure you want to delete this URL? This action cannot be undone.')) {
        return;
    }
    
    try {
        showLoadingState();
        
        const response = await fetch(`${API_BASE_URL}/admin/${adminKey}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to delete URL');
        }
        
        const data = await response.json();
        showToast(data.detail || 'URL deleted successfully!', 'success');
        
        // Clear the management section
        urlManagement.classList.add('hidden');
        adminKeyInput.value = '';
        currentUrlData = null;
        
    } catch (error) {
        console.error('Error deleting URL:', error);
        showToast(error.message || 'Failed to delete URL', 'error');
    } finally {
        hideLoadingState();
    }
}

// Utility Functions
function copyShortUrl() {
    const shortUrl = shortUrlInput.value;
    if (shortUrl) {
        copyToClipboard(shortUrl);
        showToast('Short URL copied to clipboard!', 'success');
    }
}

function copyShortUrlFromManagement() {
    if (currentUrlData && currentUrlData.url) {
        copyToClipboard(currentUrlData.url);
        showToast('Short URL copied to clipboard!', 'success');
    }
}

function visitShortUrl() {
    if (currentUrlData && currentUrlData.url) {
        window.open(currentUrlData.url, '_blank');
    }
}

function visitShortenedUrlFromCreation() {
    const shortUrl = shortUrlInput.value;
    if (shortUrl) {
        window.open(shortUrl, '_blank');
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set icon based on type
    if (type === 'success') {
        toastIcon.className = 'toast-icon fas fa-check-circle';
        toast.className = 'toast success';
    } else {
        toastIcon.className = 'toast-icon fas fa-exclamation-circle';
        toast.className = 'toast error';
    }
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Loading States
function showLoadingState() {
    // Disable form elements
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.6';
    });
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.disabled = true;
    });
}

function hideLoadingState() {
    // Re-enable form elements
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.disabled = false;
    });
}

// Auto-fill last admin key if available
document.addEventListener('DOMContentLoaded', function() {
    const lastAdminKey = localStorage.getItem('lastAdminKey');
    if (lastAdminKey) {
        adminKeyInput.value = lastAdminKey;
    }
});

// Handle URL parameters for direct admin access
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    
    if (adminParam) {
        let keyToLoad = adminParam;
        // If the admin parameter is a full URL, extract the secret key
        if (adminParam.includes('/admin/')) {
            keyToLoad = adminParam.split('/admin/')[1];
        }
        adminKeyInput.value = keyToLoad;
        loadUrlByAdminKey();
    }
});

// Add some visual feedback for form interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add focus effects to inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
            this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '#e1e8ed';
            this.style.boxShadow = 'none';
        });
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-1px)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
});
