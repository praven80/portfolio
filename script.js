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


// Projects Data
const projectsData = [
    // Original 6 projects - Page 1
    {
        icon: '🔍',
        title: 'OptiX AI',
        type: 'Athena Query Analyzer',
        description: 'AI-powered enterprise-grade application that helps organizations detect, analyze, and optimize inefficient queries, deployed across multiple enterprise customers.',
        tags: ['Analytics', 'Optimization', 'Enterprise'],
        link: 'https://drive.google.com/file/d/144VkVw2vttyF2HvBteWjPcRtKtbQVcvo/view?usp=drive_link'
    },
    {
        icon: '⚡',
        title: 'Atomix',
        type: 'OneClick Data Framework',
        description: 'One-click cloud data framework that streamlines and accelerates enterprise data platform development. Finalist in 2022 Gartner Eye on Innovation Award.',
        tags: ['Data Platform', 'Automation', 'Award Winner'],
        link: 'https://www.youtube.com/watch?v=xWIcPhimOaw'
    },
    {
        icon: '🤖',
        title: 'DevGenius',
        type: 'AI Solution Architect',
        description: 'AI-powered solution architect that transforms conversational inputs or whiteboard drawings into fully automated AWS architectures with IaC. Reduces architecture time by 80%.',
        tags: ['AI Hackathon', 'Runner-up 2024', 'IaC'],
        link: 'https://github.com/aws-samples/sample-devgenius-aws-solution-builder'
    },
    {
        icon: '💡',
        title: 'Bedrock Sizer & Pricing AI Assistant',
        type: 'Customer Enablement Tool',
        description: 'Significantly reduced turnaround time for customer RPM/TPM requests. Serving 2,000+ SAs with 9,000+ conversations, accelerating customer AI adoption.',
        tags: ['AI Assistant', 'Bedrock', 'Scale'],
        link: ''
    },
    {
        icon: '🚀',
        title: 'FloTorch',
        type: 'Open Source GenAI Accelerator',
        description: 'Contributed to FloTorch, a GenAI accelerator designed to optimize Retrieval-Augmented Generation (RAG) workloads in AWS Marketplace, advancing AI toolsets in the cloud ecosystem.',
        tags: ['GenAI', 'RAG', 'AWS Marketplace'],
        link: 'https://aws.amazon.com/marketplace/pp/prodview-z5zcvloh7l3ky?applicationId=AWS-Marketplace-Console&ref_=beagle&sr=0-1'
    },
    {
        icon: '🔎',
        title: 'MetaSurfer',
        type: 'Metadata Management Platform',
        description: 'AI-powered platform that streamlines data curation. Automated metadata processing for 10K+ datasets, improved search accuracy by 95%, reduced discovery time by 75%.',
        tags: ['Winner 2023', 'Data Discovery', 'AI'],
        link: ''
    },
    // Additional projects from user's list
    {
        icon: '🎙️',
        title: 'DocTalk - Podcast and Videocast Generator',
        type: 'Content Generation',
        description: 'Transforms documents and web articles into engaging podcast-style conversations using Amazon Bedrock and Amazon Polly. Supports both audio and video output formats with AI-generated visuals.',
        tags: ['GenAI', 'Amazon Bedrock', 'Amazon Polly'],
        link: 'https://github.com/praven80/podcast_and_videocast_generator_ai'
    },
    {
        icon: '📹',
        title: 'Screen And Camera Capture AI',
        type: 'Video Analysis',
        description: 'A Streamlit-based application for recording screen and camera footage with real-time video analysis powered by Amazon Bedrock.',
        tags: ['Video Analysis', 'Amazon Bedrock', 'Streamlit'],
        link: 'https://github.com/praven80/screen_and_camera_capture_ai'
    },
    {
        icon: '🎯',
        title: 'Ground Truth Generator',
        type: 'Data Generation',
        description: 'A comprehensive GenAI application for generating and managing ground truth data using Amazon Bedrock models. Facilitates creation, management, and evaluation of Q&A pairs for training and testing language models.',
        tags: ['GenAI', 'Amazon Bedrock', 'Training Data'],
        link: 'https://github.com/praven80/ground_truth_generator_ai'
    },
    {
        icon: '🛒',
        title: 'Market Basket Analysis AI',
        type: 'Analytics Platform',
        description: 'A serverless application that converts natural language questions into SQL queries for market basket analysis, built with AWS CDK, Streamlit, and various AWS services.',
        tags: ['NLP', 'SQL', 'AWS CDK'],
        link: 'https://github.com/praven80/market_basket_analysis_ai'
    },
    {
        icon: '👥',
        title: 'Employee Virtual Assistant',
        type: 'Enterprise AI Assistant',
        description: 'A sophisticated AI-powered assistant that helps employees find information about HR policies, benefits, payroll, IT support, and training resources using Amazon Bedrock AgentCore.',
        tags: ['AI Assistant', 'AgentCore', 'Enterprise'],
        link: 'https://github.com/aws-solutions-library-samples/guidance-for-multi-agent-employee-virtual-assistant-on-aws'
    },
    {
        icon: '💻',
        title: 'AI GitHub',
        type: 'Code Analysis',
        description: 'Chat with GitHub Repositories - allows users to have natural language conversations about any GitHub repository using AI. Analyzes repository structure, code, documentation, issues, and other metadata.',
        tags: ['GitHub', 'Code Analysis', 'AI'],
        link: 'https://github.com/praven80/ai_github'
    },
    {
        icon: '🌐',
        title: 'Nova Act Web Parser',
        type: 'Data Extraction',
        description: 'NovaAct Web Data Parser is a simple, AI-powered Streamlit application that turns any website into structured JSON data based on your instructions and schema.',
        tags: ['Web Scraping', 'JSON', 'AI'],
        link: 'https://github.com/praven80/novaact_web_data_parser'
    },
    {
        icon: '📈',
        title: 'Investor Stock Analysis AI',
        type: 'Financial Analysis',
        description: 'A sophisticated stock analysis platform powered by Amazon Bedrock Agents, providing real-time market insights and analysis through a user-friendly Streamlit interface.',
        tags: ['Finance', 'Amazon Bedrock', 'Real-time'],
        link: 'https://github.com/praven80/stock_analysis_ai'
    },
    {
        icon: '📚',
        title: 'IntelliLearn AI',
        type: 'Educational Platform',
        description: 'An educational technology solution that leverages AWS services to provide an interactive learning experience. Includes authentication, course Q&A capabilities, quiz generation, and knowledge assessment features.',
        tags: ['Education', 'AWS', 'Interactive'],
        link: 'https://github.com/praven80/intelli_learn_ai'
    },
    {
        icon: '🎨',
        title: 'MultiModal AI',
        type: 'Chatbot Platform',
        description: 'A sophisticated chatbot application leveraging Amazon Bedrock\'s Nova models to handle multiple types of media interactions including text, image, and video processing.',
        tags: ['Multimodal', 'Amazon Nova', 'Chatbot'],
        link: 'https://github.com/praven80/nova_multimodal_ai'
    },
    {
        icon: '🎤',
        title: 'Voice Enabled AI Assistant',
        type: 'Voice Interface',
        description: 'A real-time voice interaction platform powered by Amazon Q, AWS Transcribe, and Amazon Polly. Enables voice-based conversations with an AI assistant, providing both text and speech responses.',
        tags: ['Voice', 'Amazon Q', 'Real-time'],
        link: 'https://github.com/praven80/voice_enabled_ai_assistant'
    },
    {
        icon: '🖼️',
        title: 'Image Insights AI',
        type: 'Image Analysis',
        description: 'A serverless application that uses Amazon Bedrock to process images and answer questions about them.',
        tags: ['Computer Vision', 'Amazon Bedrock', 'Serverless'],
        link: 'https://github.com/praven80/image_insights'
    },
    {
        icon: '🚗',
        title: 'Windshield Inspector',
        type: 'Computer Vision',
        description: 'An AI-powered application that uses computer vision and Amazon Bedrock to assess windshield damage, providing real-time classification and analysis of windshield conditions.',
        tags: ['Computer Vision', 'Amazon Bedrock', 'Classification'],
        link: 'https://github.com/praven80/windshield_inspector'
    },
    {
        icon: '📄',
        title: 'Structured Data Extraction From Unstructured Documents',
        type: 'Document Processing',
        description: 'An automated document processing platform built with Amazon Bedrock Data Automation and Streamlit, designed to extract structured data from various documents.',
        tags: ['Document AI', 'Data Extraction', 'Amazon Bedrock'],
        link: 'https://github.com/praven80/structured_data_extraction_from_unstructured_documents_ai'
    },
    {
        icon: '🔄',
        title: 'Bedrock Rerank',
        type: 'RAG Enhancement',
        description: 'Demonstrates how to use the Amazon Bedrock service to retrieve and generate knowledge-based responses with optional reranking using different models.',
        tags: ['RAG', 'Reranking', 'Amazon Bedrock'],
        link: 'https://github.com/praven80/bedrock_rerank'
    },
    {
        icon: '🧘',
        title: 'Mindful Moments',
        type: 'Mental Health',
        description: 'A web-based application designed to support mental health and promote emotional well-being.',
        tags: ['Mental Health', 'Wellness', 'Web App'],
        link: 'https://github.com/praven80/mindful_moments'
    },
    {
        icon: '🔧',
        title: 'GitLab AI Assistant',
        type: 'DevOps Tool',
        description: 'Demonstrates an integration of Amazon Q, AWS services, and GitLab for managing Git commands and automating repository tasks.',
        tags: ['GitLab', 'Amazon Q', 'DevOps'],
        link: 'https://github.com/praven80/gitlab_ai_assistant'
    },
    {
        icon: '🤖',
        title: 'DeepSeek AI',
        type: 'Model Deployment',
        description: 'Contains two scripts for deploying and interacting with the DeepSeek AI model using Amazon SageMaker and Amazon Bedrock.',
        tags: ['DeepSeek', 'SageMaker', 'Bedrock'],
        link: 'https://github.com/praven80/deepseek_ai'
    },
    {
        icon: '🏨',
        title: 'Hotel Concierge AI',
        type: 'Voice Assistant',
        description: 'Voice assistant for hotel concierge services.',
        tags: ['Voice', 'Hospitality', 'AI Assistant'],
        link: 'https://github.com/praven80/hotel_concierge_ai'
    },
    {
        icon: '🚙',
        title: 'Fleet Management AI',
        type: 'Predictive Analytics',
        description: 'A comprehensive AI-powered car rental demand prediction and fleet management platform built on AWS using Amazon Bedrock AgentCore.',
        tags: ['Fleet Management', 'Predictive', 'AgentCore'],
        link: 'https://github.com/praven80/fleet_management_ai'
    },
    {
        icon: '🎥',
        title: 'Search YouTube Videos AI',
        type: 'Video Processing',
        description: 'A comprehensive Python tool for processing YouTube video data, including transcript extraction, summarization, and data storage using AWS services.',
        tags: ['YouTube', 'Transcription', 'AWS'],
        link: 'https://github.com/praven80/search_youtube_videos_ai'
    }
];

// Pagination settings
const PROJECTS_PER_PAGE = 6;
let currentProjectPage = 1;

// Render projects
function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) {
        console.error('Projects container not found');
        return;
    }
    
    const startIndex = (currentProjectPage - 1) * PROJECTS_PER_PAGE;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    const projectsToShow = projectsData.slice(startIndex, endIndex);
    
    container.innerHTML = projectsToShow.map(project => `
        <div class="project-card">
            <div class="project-icon">${project.icon}</div>
            <h3>${project.link ? `<a href="${project.link}" target="_blank">${project.title}</a>` : project.title}</h3>
            <p class="project-type">${project.type}</p>
            <p>${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
    
    updateProjectsPagination();
}

// Update pagination controls
function updateProjectsPagination() {
    const totalPages = Math.ceil(projectsData.length / PROJECTS_PER_PAGE);
    const controls = document.querySelector('.projects-pagination-controls');
    
    if (!controls) {
        console.error('Pagination controls container not found');
        return;
    }
    
    controls.innerHTML = `
        <button class="pagination-btn" onclick="changeProjectPage(-1)" ${currentProjectPage === 1 ? 'disabled' : ''}>
            ← Previous
        </button>
        <span class="pagination-info">Page ${currentProjectPage} of ${totalPages}</span>
        <button class="pagination-btn" onclick="changeProjectPage(1)" ${currentProjectPage === totalPages ? 'disabled' : ''}>
            Next →
        </button>
    `;
}

// Change page
function changeProjectPage(direction) {
    const totalPages = Math.ceil(projectsData.length / PROJECTS_PER_PAGE);
    currentProjectPage += direction;
    
    if (currentProjectPage < 1) currentProjectPage = 1;
    if (currentProjectPage > totalPages) currentProjectPage = totalPages;
    
    renderProjects();
    
    // Scroll to projects section
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize projects on page load
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
});
