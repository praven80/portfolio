// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function printResume() {
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
    
    window.print();
    setTimeout(() => console.log('Print Instructions:', instructions), 100);
}

function switchToResume() {
    switchView('resume');
}

// ============================================================================
// MOBILE MENU
// ============================================================================

const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const navLinks = document.getElementById('nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link (but NOT the dropdown toggle)
    const navLinksItems = navLinks.querySelectorAll('a');
    navLinksItems.forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't close menu if clicking the dropdown toggle
            if (link.classList.contains('nav-dropdown-toggle')) {
                return;
            }
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Handle dropdown toggle on mobile
    const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', (e) => {
            const isPortraitMobile = window.innerWidth <= 768;
            const isLandscapeMobile = window.matchMedia('(orientation: landscape) and (max-width: 1024px)').matches || 
                                     window.matchMedia('(orientation: landscape) and (max-height: 600px)').matches;
            
            if (isPortraitMobile || isLandscapeMobile) {
                e.preventDefault();
                const dropdown = dropdownToggle.closest('.nav-dropdown');
                dropdown.classList.toggle('active');
            }
        });
    }
}

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const currentTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const theme = html.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ============================================================================
// VIEW SWITCHING
// ============================================================================

const toggleButtons = document.querySelectorAll('.toggle-btn');
const portfolioView = document.getElementById('portfolio-view');
const resumeView = document.getElementById('resume-view');

function switchView(viewName) {
    if (!portfolioView || !resumeView) return;
    
    const viewToggle = document.getElementById('view-toggle');
    
    if (viewName === 'portfolio') {
        portfolioView.classList.add('active');
        resumeView.classList.remove('active');
        toggleButtons[0].classList.add('active');
        toggleButtons[1].classList.remove('active');
        if (viewToggle) viewToggle.classList.remove('resume-active');
    } else if (viewName === 'resume') {
        portfolioView.classList.remove('active');
        resumeView.classList.add('active');
        toggleButtons[0].classList.remove('active');
        toggleButtons[1].classList.add('active');
        if (viewToggle) viewToggle.classList.add('resume-active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    localStorage.setItem('preferredView', viewName);
}

toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        switchView(view);
    });
});

const savedView = localStorage.getItem('preferredView');
if (savedView && portfolioView && resumeView) {
    switchView(savedView);
}

// ============================================================================
// NAVIGATION
// ============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

let lastScroll = 0;
const navbar = document.getElementById('navbar');

if (navbar && portfolioView) {
    window.addEventListener('scroll', () => {
        if (!portfolioView.classList.contains('active')) return;
        const currentScroll = window.pageYOffset;
        navbar.style.boxShadow = currentScroll <= 0 ? 'var(--shadow)' : 'var(--shadow-lg)';
        lastScroll = currentScroll;
    });
}

// ============================================================================
// ANIMATIONS
// ============================================================================

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

document.querySelectorAll('#portfolio-view .section, #portfolio-view .project-card, #portfolio-view .impact-card, #portfolio-view .skill-category, #portfolio-view .leadership-category').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});


// ============================================================================
// PROJECTS DATA
// ============================================================================

const projectsData = [
    {
        icon: '🔍',
        title: 'OptiX AI',
        type: 'Athena Query Analyzer',
        description: 'AI-powered Athena Query Analyzer deployed across multiple enterprise customers. Detects and optimizes inefficient queries with visual analytics including execution trends, data scanned, cost breakdowns, query volume, and performance-cost comparisons. Reduces query costs by up to 70% and improves execution performance by 3x.',
        tags: ['Query Analytics', 'Query Optimization', 'Cost Reduction'],
        link: 'https://drive.google.com/file/d/144VkVw2vttyF2HvBteWjPcRtKtbQVcvo/view?usp=drive_link',
        caseStudy: 'optix-ai-case-study.html'
    },
    {
        icon: '🤖',
        title: 'DevGenius',
        type: 'AI Solution Architect',
        description: 'AI-powered solution architect transforming conversational inputs or whiteboard drawings into production-ready AWS solutions with full architecture diagrams, complete cost analysis, IaC deployment code, and comprehensive documentation. Enables interactive refinement and single-click deployment to AWS accounts. Reduces architecture time by 80%.',
        tags: ['AI Architect', 'Solution Automation', 'Cost Prediction'],
        link: 'https://github.com/aws-samples/sample-devgenius-aws-solution-builder',
        caseStudy: 'devgenius-case-study.html'
    },
    {
        icon: '⚡',
        title: 'Atomix',
        type: 'OneClick Data Framework',
        description: 'Low-code/no-code data platform with marketplace experience for one-click data ingestion, data quality, transformations, and data sharing to multiple accounts enabling data mesh architecture. Complete end-to-end automation to create enterprise data platforms on cloud within minutes. Finalist in 2022 Gartner Eye on Innovation Award.',
        tags: ['Data Platform', 'Automation', 'Award Winner'],
        link: 'https://www.youtube.com/watch?v=xWIcPhimOaw',
        caseStudy: 'atomix-case-study.html'
    },
    {
        icon: '💡',
        title: 'Bedrock Sizing & Pricing AI',
        type: 'Capacity & Cost Planning Tool',
        description: 'Interactive tool for Amazon Bedrock capacity and cost estimation through conversational guidance. Includes calculator for all model types with technical details for capacity requests. Serving 3,000+ SAs across multiple customers with 20,000+ conversations, ensuring optimal planning to avoid throttling and maintain 24/7 availability.',
        tags: ['Capacity Planning', 'Cost Estimation', 'AI Scaling'],
        link: '',
        caseStudy: 'bedrocksizer-case-study.html'
    },
    {
        icon: '🚀',
        title: 'FloTorch',
        type: 'Open Source GenAI Accelerator',
        description: 'Contributed to open-source tool for rapid prototyping and optimization of RAG workloads. Enables systematic experimentation with hyperparameters, embedding models, and vector databases for cost, latency, and performance tuning. Saves weeks of development time while ensuring full data sovereignty.',
        tags: ['RAG Optimization', 'Experimentation', 'Performance Tuning'],
        link: 'https://aws.amazon.com/marketplace/pp/prodview-z5zcvloh7l3ky?applicationId=AWS-Marketplace-Console&ref_=beagle&sr=0-1'
    },
    {
        icon: '🛒',
        title: 'Market Basket Analysis AI',
        type: 'Customer & Profitability Analytics',
        description: 'AI-powered solution analyzing customer purchasing behavior and product associations to drive strategic decision-making. Enables precise profitability analysis and provides actionable insights for marketing and inventory optimization. Deployed at a top pet food company, empowering CEO-level insights on margins, directly influencing strategy.',
        tags: ['Customer Analytics', 'Profitability Analysis', 'Decision Support'],
        link: 'https://github.com/praven80/market_basket_analysis_ai',
        caseStudy: 'market-basket-analysis-case-study.html'
    },
    {
        icon: '👥',
        title: 'TeamLink AI',
        type: 'Multi-Agent Enterprise Assistant',
        description: 'AI-powered multi-agent virtual assistant helping employees instantly find answers across HR policies, benefits, payroll, IT support, and training resources. Built on Amazon Bedrock with intelligent agent-routing system directing queries to domain experts. Reduces employee support ticket volume by 60% while improving response accuracy.',
        tags: ['Multi-Agent System', 'Enterprise Assistant', 'Knowledge Retrieval'],
        link: 'https://github.com/aws-solutions-library-samples/guidance-for-multi-agent-employee-virtual-assistant-on-aws'
    },
    {
        icon: '🏨',
        title: 'Hotel Concierge AI',
        type: 'Voice-Enabled Hospitality Assistant',
        description: 'AI-powered voice assistant integrating LiveKit with AgentCore Runtime, Memory, Gateway, and Identity. Enables continuous conversations with context retrieval and real-time information access. Provides secure authentication for personalized guest interactions. Enhances hotel guest experience through intelligent, personalized concierge services.',
        tags: ['Voice Assistant', 'AgentCore', 'Hospitality AI'],
        link: 'https://github.com/praven80/hotel_concierge_ai'
    },
    {
        icon: '🚙',
        title: 'Fleet Management AI',
        type: 'AI-Powered Demand Prediction',
        description: 'AI-powered car rental demand prediction platform built on Amazon Bedrock AgentCore. Analyzes and predicts rental demand by integrating real-time data from multiple sources: fleet inventory, local events, national holidays, weather forecasts, and airline schedules. Enables optimal fleet allocation and resource planning for rental companies.',
        tags: ['Demand Forecasting', 'Fleet Optimization', 'Predictive Analytics'],
        link: 'https://github.com/praven80/fleet_management_ai'
    }
];


// Additional projects will be added here - continuing the array
const additionalProjects = [
    {
        icon: '🎯',
        title: 'Ground Truth Generator',
        type: 'Ground Truth Data Generation',
        description: 'AI-powered application for generating, managing, and evaluating high-quality ground truth data to test and improve GenAI applications. Generates large volumes of Q&A pairs from documents or knowledge bases in minutes with review and approve workflows. Generated 100 Q&A pairs in under 5 minutes. Supports RAGAS and Bedrock evaluation.',
        tags: ['Q&A Generation', 'Data Validation', 'Model Evaluation'],
        link: 'https://github.com/praven80/ground_truth_generator_ai'
    },
    {
        icon: '💻',
        title: 'AIGitHub',
        type: 'Conversational Code Analysis',
        description: 'AI-powered tool enabling conversational interaction with any public GitHub repository. Ask questions in plain English and get instant, contextual answers about repo structure, code logic, and purpose. Eliminates manual code reading for onboarding, code reviews, and exploration. Reduces codebase understanding time by 75%.',
        tags: ['Code Analysis', 'Developer Tools', 'Repository Intelligence'],
        link: 'https://github.com/praven80/ai_github'
    },
    {
        icon: '📈',
        title: 'Investor Stock Analysis AI',
        type: 'Multi-Agent Financial Intelligence',
        description: 'AI-powered multi-agent solution evaluating and forecasting stock performance through three specialized agents: Historical Stock Price Agent, Stock News Scraper Agent, and Stock Analyst Agent. Provides valuable insights and actionable recommendations to guide investment decisions. Accelerates analysis while enhancing decision confidence.',
        tags: ['Financial Analysis', 'Multi-Agent System', 'Investment Intelligence'],
        link: 'https://github.com/praven80/stock_analysis_ai'
    },
    {
        icon: '📚',
        title: 'IntelliLearn AI',
        type: 'Adaptive Educational Platform',
        description: 'AI-powered adaptive learning platform built on Amazon Q and Amazon Bedrock. Students learn through interactive engagement and self-evaluate before advancing chapters. Professors generate questions based on Bloom\'s Taxonomy. Implemented at Cornell University and institutions, enhancing learning outcomes through progressive assessment.',
        tags: ['Education Technology', 'Adaptive Learning', 'Assessment Automation'],
        link: 'https://github.com/praven80/intelli_learn_ai'
    },
    {
        icon: '🚗',
        title: 'Windshield Inspector',
        type: 'AI-Powered Damage Assessment',
        description: 'AI-powered application using Amazon Bedrock to assess windshield damage in real-time. Provides instant classification (Good / Damaged) with confidence scores and detailed explanations. Ideal for insurance companies and repair shops to streamline claims processing. Accelerates damage assessment while improving accuracy.',
        tags: ['Image Analysis', 'Damage Detection', 'Real-time Classification'],
        link: 'https://github.com/praven80/windshield_inspector'
    },
    {
        icon: '🎙️',
        title: 'DocTalk',
        type: 'AI Podcast & Video Generator',
        description: 'AI-powered app transforming documents and articles into engaging audio/video podcasts where two speakers discuss content as a conversational story. Makes lengthy, dense material easily consumable for educational content, business updates, and reports. Reduces content consumption time by 70% while improving comprehension and retention.',
        tags: ['Podcast Generation', 'Audio/Video Content', 'Learning Acceleration'],
        link: 'https://github.com/praven80/podcast_and_videocast_generator_ai'
    },
    {
        icon: '📹',
        title: 'Screen & Cam Capture AI',
        type: 'AI-Powered Visual Collaboration',
        description: 'AI-powered application simplifying collaboration through screen recording and webcam capture. Enables showcasing work, asking questions, and receiving actionable insights with real-time visual feedback. Combines visuals with AI-driven understanding to enhance communication and productivity. Reduces feedback cycles by 65%.',
        tags: ['Screen Capture', 'Webcam Recording', 'Visual Feedback'],
        link: 'https://github.com/praven80/screen_and_camera_capture_ai'
    },
    {
        icon: '🌐',
        title: 'Nova Act Web Parser',
        type: 'AI-Powered Web Data Extraction',
        description: 'AI-powered tool transforming any website into structured JSON data based on human instructions and custom schemas. Navigates websites like a human, extracting and formatting data automatically without complex coding. Ideal for price comparisons, market research, and data aggregation. Reduces web scraping time by 80%.',
        tags: ['Web Scraping', 'Data Extraction', 'Human-like Browsing'],
        link: 'https://github.com/praven80/novaact_web_data_parser'
    },
    {
        icon: '🔎',
        title: 'MetaSurfer',
        type: 'AI-Powered Semantic Search Platform',
        description: 'AI-powered platform streamlining enterprise data asset discovery through semantic search. Gathers metadata via Glue Databrew and converts to natural language embeddings stored in vector format. Enables business users to quickly find relevant data assets across sources through intelligent search and recommendations.',
        tags: ['Winner 2023', 'Semantic Search', 'Data Discovery'],
        link: ''
    },
    {
        icon: '🎤',
        title: 'Voice Enabled AI Assistant',
        type: 'Voice-Based Interaction Platform',
        description: 'AI-powered voice platform using Amazon Q, Amazon Transcribe, and Amazon Polly. Enables seamless conversations where users speak and receive text and voice responses in real-time. Leverages natural language processing for accurate answers. Ideal for hands-free environments and accessibility needs.',
        tags: ['Voice AI', 'Natural Language Processing', 'Customer Service'],
        link: 'https://github.com/praven80/voice_enabled_ai_assistant'
    },
    {
        icon: '🎨',
        title: 'MultiModal AI',
        type: 'Multi-Modal Content Generation',
        description: 'AI-powered application leveraging Amazon Nova models for diverse multi-modal use cases: text-to-text, image-to-text, video-to-text, text-to-image, image-to-image, text-to-video, and image-to-video. Transforms various inputs into engaging media for marketing campaigns. Accelerates promotional strategies for media and advertising companies.',
        tags: ['Multi-Modal AI', 'Content Generation', 'Amazon Nova'],
        link: 'https://github.com/praven80/nova_multimodal_ai'
    },
    {
        icon: '🖼️',
        title: 'Image Insights AI',
        type: 'Interactive Image Analysis',
        description: 'AI-powered application analyzing images to provide detailed insights through interactive Q&A. Leverages advanced image recognition to extract meaningful data and automate classification processes. Enables damage assessment, quality inspection, and visual verification across industries. Reduces manual review time and improves accuracy.',
        tags: ['Image Analysis', 'Visual Intelligence', 'Automated Classification'],
        link: 'https://github.com/praven80/image_insights'
    },
    {
        icon: '📄',
        title: 'Document Data Extractor AI',
        type: 'Intelligent Document Processing',
        description: 'AI-powered application using Amazon Bedrock Data Automation to transform unstructured data from documents, images, and forms into structured, actionable insights. Extracts key information from financial documents, pay slips, and handwritten forms. Enables workflow automation and informed decision-making. Accelerates document processing efficiency.',
        tags: ['Document Processing', 'Data Extraction', 'Workflow Automation'],
        link: 'https://github.com/praven80/structured_data_extraction_from_unstructured_documents_ai'
    },
    {
        icon: '🎥',
        title: 'YouTube Intelligence AI',
        type: 'Video Content Discovery',
        description: 'AI-powered tool aggregating and processing YouTube videos with transcript extraction, summarization, and intelligent search capabilities. Enables users to quickly find specific topics, access relevant video links, and jump to exact timestamps of key moments. Saves significant time by eliminating manual video browsing.',
        tags: ['Video Intelligence', 'Transcript Search', 'Content Navigation'],
        link: 'https://github.com/praven80/search_youtube_videos_ai'
    },
    {
        icon: '🔧',
        title: 'GitLab AI Assistant',
        type: 'DevOps Collaboration Platform',
        description: 'AI-powered tool automating GitLab command creation through natural language, eliminating the need to memorize complex commands. Users interact with GitLab using plain English to execute repository tasks, manage workflows, and automate DevOps processes. Accelerates development cycles and reduces learning curve for GitLab operations.',
        tags: ['DevOps Automation', 'Natural Language Interface', 'GitLab Integration'],
        link: 'https://github.com/praven80/gitlab_ai_assistant'
    },
    {
        icon: '🧘',
        title: 'Mindful Moments',
        type: 'AI-Powered Mental Wellness',
        description: 'AI-powered web application supporting mental health and emotional well-being through interactive conversations. Users engage with the app to ask questions about positive thinking, managing mental health, and finding encouragement. Leverages Amazon Bedrock Claude AI to provide compassionate, personalized responses.',
        tags: ['Mental Wellness', 'AI Chatbot', 'Emotional Support'],
        link: 'https://github.com/praven80/mindful_moments'
    },
    {
        icon: '🔄',
        title: 'Bedrock Rerank',
        type: 'RAG Enhancement Tool',
        description: 'AI-powered tool demonstrating knowledge-based response generation with three reranking approaches: direct retrieval without reranking, Cohere rerank model, and Amazon rerank model. Enables comparison of reranking strategies to optimize retrieval accuracy. Provides configuration breakdowns for implementing reranking in RAG applications.',
        tags: ['RAG Optimization', 'Reranking Models', 'Retrieval Enhancement'],
        link: 'https://github.com/praven80/bedrock_rerank'
    },
    {
        icon: '🤖',
        title: 'DeepSeek AI',
        type: 'Model Deployment Tool',
        description: 'AI model deployment tool providing scripts for deploying and interacting with DeepSeek-R1-Distill-Llama-8B using Amazon SageMaker and Amazon Bedrock. SageMaker script enables model deployment with RESTful API inference. Bedrock notebook guides through cloning from Hugging Face, S3 upload, and model import. Simplifies model deployment workflow.',
        tags: ['Model Deployment', 'SageMaker', 'Amazon Bedrock'],
        link: 'https://github.com/praven80/deepseek_ai'
    }
];

// Merge all projects
projectsData.push(...additionalProjects);

// ============================================================================
// PROJECTS RENDERING & PAGINATION
// ============================================================================

const PROJECTS_PER_PAGE = 9;
let currentProjectPage = 1;

function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) {
        return; // Silently return if container doesn't exist (e.g., on case study pages)
    }
    
    const startIndex = (currentProjectPage - 1) * PROJECTS_PER_PAGE;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    const projectsToShow = projectsData.slice(startIndex, endIndex);
    
    container.innerHTML = projectsToShow.map(project => {
        const linkTarget = project.isExternal === false ? '_self' : '_blank';
        const linkHtml = project.link ? `<a href="${project.link}" target="${linkTarget}">${project.title}</a>` : project.title;
        
        // Add case study button aligned with title for OptiX AI
        const caseStudyButton = project.caseStudy ? 
            `<a href="${project.caseStudy}" class="case-study-btn-inline" title="View Case Study">📖</a>` : '';
        
        return `
        <div class="project-card">
            <h3 style="display: flex; align-items: center; justify-content: space-between;">
                <span style="display: flex; align-items: center;">
                    <span class="project-icon">${project.icon}</span>${linkHtml}
                </span>
                ${caseStudyButton}
            </h3>
            <p class="project-type">${project.type}</p>
            <p>${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `}).join('');
    
    updateProjectsPagination();
}

function updateProjectsPagination() {
    const totalPages = Math.ceil(projectsData.length / PROJECTS_PER_PAGE);
    const controls = document.querySelector('.projects-pagination-controls');
    
    if (!controls) {
        return; // Silently return if controls don't exist (e.g., on case study pages)
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

function changeProjectPage(direction) {
    const totalPages = Math.ceil(projectsData.length / PROJECTS_PER_PAGE);
    currentProjectPage += direction;
    
    if (currentProjectPage < 1) currentProjectPage = 1;
    if (currentProjectPage > totalPages) currentProjectPage = totalPages;
    
    renderProjects();
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
});
