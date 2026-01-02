// Print function with instructions
function printResume() {
    // Show alert with instructions
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = '';
    
    if (userAgent.indexOf('chrome') > -1 || userAgent.indexOf('edge') > -1) {
        instructions = 'In the print dialog:\n1. Click "More settings"\n2. Uncheck "Headers and footers"\n3. Click "Save" or "Print"';
    } else if (userAgent.indexOf('firefox') > -1) {
        instructions = 'In the print dialog:\n1. Uncheck "Print headers and footers"\n2. Click "Save" or "Print"';
    } else if (userAgent.indexOf('safari') > -1) {
        instructions = 'In the print dialog:\n1. Click "Show Details"\n2. Uncheck "Print headers and footers"\n3. Click "Save as PDF" or "Print"';
    } else {
        instructions = 'In the print dialog, please disable "Headers and footers" option before saving.';
    }
    
    // Open print dialog
    window.print();
    
    // Show instructions after a brief delay
    setTimeout(() => {
        console.log('Print Instructions:', instructions);
    }, 100);
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// View Switching
const toggleButtons = document.querySelectorAll('.toggle-btn');
const portfolioView = document.getElementById('portfolio-view');
const resumeView = document.getElementById('resume-view');

function switchView(viewName) {
    if (viewName === 'portfolio') {
        portfolioView.classList.add('active');
        resumeView.classList.remove('active');
        toggleButtons[0].classList.add('active');
        toggleButtons[1].classList.remove('active');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewName === 'resume') {
        portfolioView.classList.remove('active');
        resumeView.classList.add('active');
        toggleButtons[0].classList.remove('active');
        toggleButtons[1].classList.add('active');
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Save preference
    localStorage.setItem('preferredView', viewName);
}

// Global function for button onclick
function switchToResume() {
    switchView('resume');
}

// Toggle button click handlers
toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        switchView(view);
    });
});

// Load saved view preference
const savedView = localStorage.getItem('preferredView');
if (savedView) {
    switchView(savedView);
}

// Smooth scroll for navigation links (portfolio view only)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect (portfolio view only)
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (!portfolioView.classList.contains('active')) return;
    
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'var(--shadow)';
    } else {
        navbar.style.boxShadow = 'var(--shadow-lg)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations (portfolio view only)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards in portfolio view
document.querySelectorAll('#portfolio-view .section, #portfolio-view .project-card, #portfolio-view .impact-card, #portfolio-view .skill-category, #portfolio-view .leadership-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
