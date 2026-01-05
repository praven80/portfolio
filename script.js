// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function printResume() {
    // Create and show print options modal
    showPrintModal();
}

function showPrintModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('print-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'print-modal';
        modal.className = 'print-modal';
        modal.innerHTML = `
            <div class="print-modal-content">
                <h3>Print Options</h3>
                <p>Select page format:</p>
                <div class="print-options">
                    <label class="print-option">
                        <input type="radio" name="pageCount" value="1">
                        <span>1 Page (Compact)</span>
                    </label>
                    <label class="print-option">
                        <input type="radio" name="pageCount" value="2" checked>
                        <span>2 Pages (Readable)</span>
                    </label>
                </div>
                <div class="print-modal-buttons">
                    <button class="btn-print-ok" onclick="executePrint()">Print</button>
                    <button class="btn-print-cancel" onclick="closePrintModal()">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.classList.add('active');
}

function closePrintModal() {
    const modal = document.getElementById('print-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function executePrint() {
    const isMobile = /iphone|ipad|ipod|android|mobile/i.test(navigator.userAgent.toLowerCase());
    const selectedOption = document.querySelector('input[name="pageCount"]:checked');
    const pageCount = selectedOption ? selectedOption.value : '2';
    
    closePrintModal();
    
    // Remove any existing print classes
    document.body.classList.remove('print-two-page');
    document.body.classList.remove('mobile-print');
    
    if (pageCount === '1') {
        // 1-page uses base styles (already compact)
        if (isMobile) {
            document.body.classList.add('mobile-print');
        }
    } else {
        // 2-page uses relaxed styles
        document.body.classList.add('print-two-page');
    }
    
    setTimeout(() => {
        window.print();
        
        setTimeout(() => {
            document.body.classList.remove('mobile-print');
            document.body.classList.remove('print-two-page');
        }, 1000);
    }, 100);
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
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>OptiX AI – Athena Query Analyzer</strong> is a powerful tool designed to help customers effortlessly identify, analyze, and resolve slow-running and costly Athena queries.</p>

<h3>🔧 Advanced Filtering</h3>
<p>Configurable filtering options enable users to precisely isolate problematic queries:</p>
<ul>
    <li>Query status</li>
    <li>Execution duration</li>
    <li>Cost thresholds</li>
    <li>Workgroups</li>
    <li>Date ranges</li>
</ul>

<h3>📊 Visual Analytics</h3>
<p>Rich visual analytics empower data teams with deep insights:</p>
<ul>
    <li>Execution time trends</li>
    <li>Data scanned over time</li>
    <li>Cost breakdowns</li>
    <li>Query volume analysis</li>
    <li>Performance vs. cost comparisons</li>
</ul>

<h3>🚀 Query Optimization</h3>
<p>Beyond diagnostics, OptiX AI delivers:</p>
<ul>
    <li><strong>Bottleneck identification</strong> – Pinpoint performance issues</li>
    <li><strong>Optimization suggestions</strong> – Tailored recommendations</li>
    <li><strong>Query rewrites</strong> – Multiple alternatives with metrics on execution time, data scanned, and cost improvements</li>
</ul>

<h3>✨ Additional Features</h3>
<ul>
    <li><strong>Natural Language SQL</strong> – Build queries using plain English</li>
    <li><strong>Query Formatter</strong> – Reformat and clean up SQL for readability</li>
    <li><strong>Cost Analysis</strong> – Top 10 most expensive queries</li>
    <li><strong>Raw Metadata</strong> – Filter and slice across multiple dimensions</li>
</ul>

<h3>📋 Prebuilt Query Templates</h3>
<p>Accelerate development with best-practice patterns:</p>
<div class="template-grid">
    <span class="template-tag">Partitioned Data</span>
    <span class="template-tag">Optimized Joins</span>
    <span class="template-tag">Incremental Processing</span>
    <span class="template-tag">Columnar Format</span>
    <span class="template-tag">Smart Sampling</span>
    <span class="template-tag">Window Functions</span>
    <span class="template-tag">Cohort Analysis</span>
    <span class="template-tag">Data Profiling</span>
    <span class="template-tag">Anomaly Detection</span>
    <span class="template-tag">Time Series Trends</span>
    <span class="template-tag">Materialized Views</span>
</div>

<h3>💡 Business Impact</h3>
<p>Organizations can significantly <strong>enhance query efficiency</strong>, <strong>reduce costs by up to 70%</strong>, and <strong>improve performance by 3x</strong> with confidence.</p>
`,
        tags: ['Query Analytics', 'Query Optimization', 'Cost Reduction'],
        link: 'https://drive.google.com/file/d/144VkVw2vttyF2HvBteWjPcRtKtbQVcvo/view?usp=sharing',
        demo: 'https://drive.google.com/file/d/144VkVw2vttyF2HvBteWjPcRtKtbQVcvo/view?usp=sharing',
        caseStudy: 'optix-ai-case-study.html'
    },
    {
        icon: '🤖',
        title: 'DevGenius',
        type: 'AI Solution Architect',
        description: 'AI-powered solution architect transforming conversational inputs or whiteboard drawings into production-ready AWS solutions with full architecture diagrams, complete cost analysis, IaC deployment code, and comprehensive documentation. Enables interactive refinement and single-click deployment to AWS accounts. Reduces architecture time by 80%.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>DevGenius</strong> is an AI-powered companion for AWS solution architecture, designed to simplify and enhance any solution architecture and development process.</p>

<h3>💬 Conversational Architecture Building</h3>
<p>DevGenius enables customers to design solution architectures conversationally:</p>
<ul>
    <li>Create architecture diagrams (in draw.io format)</li>
    <li>Refine designs interactively</li>
    <li>Generate end-to-end code automation using <strong>CDK</strong> or <strong>CloudFormation</strong></li>
    <li>Deploy to AWS account with a <strong>single click</strong></li>
    <li>Receive cost estimates for production</li>
    <li>Get detailed documentation for the solution</li>
</ul>

<h3>🖼️ Whiteboard to Architecture</h3>
<p>For customers with existing architecture images (e.g., whiteboard drawings):</p>
<ul>
    <li><strong>Upload the image</strong> – AI analyzes the architecture</li>
    <li><strong>Get detailed explanation</strong> – Understand the design</li>
    <li><strong>Refine conversationally</strong> – Iterate on the design</li>
    <li><strong>Generate automation</strong> – CDK or CloudFormation templates</li>
    <li><strong>Cost estimates & documentation</strong> – Complete package</li>
</ul>

<h3>✨ Key Features</h3>
<div class="template-grid">
    <span class="template-tag">Architecture Diagrams</span>
    <span class="template-tag">CDK Generation</span>
    <span class="template-tag">CloudFormation</span>
    <span class="template-tag">Cost Estimation</span>
    <span class="template-tag">One-Click Deploy</span>
    <span class="template-tag">Image Analysis</span>
    <span class="template-tag">Documentation</span>
</div>

<h3>💡 Business Impact</h3>
<p>Reduces architecture time by <strong>80%</strong>, enabling rapid prototyping and deployment of AWS solutions.</p>
`,
        tags: ['AI Architect', 'Solution Automation', 'Cost Prediction'],
        link: 'https://drive.google.com/file/d/1rF6Uy53xWc63ziZLmKqEGhS3zusnO6-0/view?usp=sharing',
        demo: 'https://drive.google.com/file/d/1rF6Uy53xWc63ziZLmKqEGhS3zusnO6-0/view?usp=sharing',
        github: 'https://github.com/aws-samples/sample-devgenius-aws-solution-builder',
        caseStudy: 'devgenius-case-study.html'
    },
    {
        icon: '⚡',
        title: 'Atomix',
        type: 'OneClick Data Framework',
        description: 'Low-code/no-code data platform with marketplace experience for one-click data ingestion, data quality, transformations, and data sharing to multiple accounts enabling data mesh architecture. Complete end-to-end automation to create enterprise data platforms on cloud within minutes. Finalist in 2022 Gartner Eye on Innovation Award.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>Atomix</strong> is a One-Click Data Framework designed to simplify and accelerate the process of building enterprise data platforms on the cloud.</p>

<h3>🛒 Self-Service Portal</h3>
<p>Atomix allows customers to configure and deploy an end-to-end data platform with just a few clicks, eliminating the months or years of effort typically required.</p>

<h3>✨ Key Capabilities</h3>
<ul>
    <li><strong>Data ingestion</strong> – One-click setup</li>
    <li><strong>Data standardization</strong> – Automated quality</li>
    <li><strong>Lineage creation</strong> – Track data flow</li>
    <li><strong>Governance</strong> – Built-in compliance</li>
    <li><strong>Data sharing</strong> – Multiple consumer accounts</li>
    <li><strong>Data mesh</strong> – Enable distributed architecture</li>
</ul>

<h3>🏗️ Platform Support</h3>
<ul>
    <li>Build <strong>data lakes</strong></li>
    <li>Build <strong>data warehouses</strong></li>
    <li>Create enterprise data platforms within <strong>minutes</strong></li>
</ul>

<h3>🏆 Recognition</h3>
<p>Finalist in <strong>2022 Gartner Eye on Innovation Award</strong></p>

<h3>💡 Business Impact</h3>
<p>Implemented by several enterprise customers, helping them build scalable, efficient data solutions while providing easy access to available data and facilitating seamless data requests.</p>
`,
        tags: ['Data Platform', 'Automation', 'Award Winner'],
        link: 'https://www.youtube.com/watch?v=xWIcPhimOaw',
        demo: 'https://www.youtube.com/watch?v=xWIcPhimOaw',
        caseStudy: 'atomix-case-study.html'
    },
    {
        icon: '💡',
        title: 'Bedrock Sizing & Pricing AI',
        type: 'Capacity & Cost Planning Tool',
        description: 'Interactive tool for Amazon Bedrock capacity and cost estimation through conversational guidance. Includes calculator for all model types with technical details for capacity requests. Serving 3,000+ SAs across multiple customers with 20,000+ conversations, ensuring optimal planning to avoid throttling and maintain 24/7 availability.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>Bedrock Sizing & Pricing AI Assistant</strong> is an interactive tool designed to help you accurately assess Amazon Bedrock capacity requirements and estimate overall costs for your use case.</p>

<h3>💬 Conversational Guidance</h3>
<p>Simply describe your use case in a conversational manner, and the assistant guides you through appropriate sizing of Bedrock models—ensuring optimal performance and cost-efficiency.</p>

<h3>🧮 Comprehensive Calculator</h3>
<p>The app includes a manual calculator covering all model types:</p>
<ul>
    <li><strong>On-demand models</strong></li>
    <li><strong>Provisioned throughput</strong></li>
    <li><strong>Embedding models</strong></li>
    <li><strong>Image/video models</strong></li>
</ul>

<h3>📋 Matador Request Support</h3>
<p>Provides all necessary technical details and cost estimates required to raise a <strong>Bedrock Matador Request</strong> for capacity provisioning, ensuring you're fully prepared to submit accurate and complete requests on behalf of your customer.</p>

<h3>💡 Business Impact</h3>
<ul>
    <li>Serving <strong>3,000+ SAs</strong> across multiple customers</li>
    <li><strong>20,000+ conversations</strong> processed</li>
    <li>Ensures optimal planning to avoid throttling</li>
    <li>Maintains <strong>24/7 availability</strong></li>
</ul>
`,
        tags: ['Capacity Planning', 'Cost Estimation', 'AI Scaling'],
        link: 'https://drive.google.com/file/d/18UjH4h-D3JHDkUy3ocQwzi204e4wCShT/view?usp=sharing',
        demo: 'https://drive.google.com/file/d/18UjH4h-D3JHDkUy3ocQwzi204e4wCShT/view?usp=sharing',
        caseStudy: 'bedrocksizer-case-study.html'
    },
    {
        icon: '🚀',
        title: 'FloTorch',
        type: 'Open Source GenAI Accelerator',
        description: 'Contributed to open-source tool for rapid prototyping and optimization of RAG workloads. Enables systematic experimentation with hyperparameters, embedding models, and vector databases for cost, latency, and performance tuning. Saves weeks of development time while ensuring full data sovereignty.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>FloTorch</strong> is an open-source tool for rapid prototyping and optimization of RAG workloads, enabling systematic experimentation and tuning.</p>

<h3>🔬 Experimentation Capabilities</h3>
<ul>
    <li><strong>Hyperparameters</strong> - Tune for optimal performance</li>
    <li><strong>Embedding Models</strong> - Compare different options</li>
    <li><strong>Vector Databases</strong> - Evaluate storage solutions</li>
    <li><strong>Retrieval Strategies</strong> - Optimize search approaches</li>
</ul>

<h3>📊 Optimization Metrics</h3>
<div class="template-grid">
    <span class="template-tag">Cost</span>
    <span class="template-tag">Latency</span>
    <span class="template-tag">Performance</span>
    <span class="template-tag">Accuracy</span>
</div>

<h3>🔒 Data Sovereignty</h3>
<p>Full control over your data with on-premises or private cloud deployment options.</p>

<h3>💡 Business Impact</h3>
<p>Saves weeks of development time while ensuring full data sovereignty and optimal RAG performance.</p>
`,
        tags: ['RAG Optimization', 'Experimentation', 'Performance Tuning'],
        link: 'https://aws.amazon.com/marketplace/pp/prodview-z5zcvloh7l3ky?applicationId=AWS-Marketplace-Console&ref_=beagle&sr=0-1'
    },
    {
        icon: '🛒',
        title: 'Market Basket Analysis AI',
        type: 'Customer & Profitability Analytics',
        description: 'AI-powered solution analyzing customer purchasing behavior and product associations to drive strategic decision-making. Enables precise profitability analysis and provides actionable insights for marketing and inventory optimization. Deployed at a top pet food company, empowering CEO-level insights on margins, directly influencing strategy.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p>The <strong>Market Basket Analysis AI</strong> solution was developed to address business challenges and empower data-driven decision-making, significantly improving operational efficiency and profitability.</p>

<h3>🧠 AI-Powered Insights</h3>
<ul>
    <li>Enhances decision-making accuracy</li>
    <li>Deeper insights into <strong>customer purchasing behavior</strong></li>
    <li>Analyzes <strong>product associations</strong></li>
    <li>Precise <strong>profitability analysis</strong></li>
    <li>Actionable, intelligent business guidance</li>
</ul>

<h3>📊 Business Applications</h3>
<ul>
    <li>Optimize product offerings</li>
    <li>Improve marketing strategies</li>
    <li>Enhance inventory management</li>
    <li>Understand product margins and profits</li>
</ul>

<h3>🏆 Implementation Success</h3>
<p>Implemented in one of the <strong>top pet food companies</strong>, the solution was used by the CEO to gain a clearer understanding of product margins and profits, directly influencing strategic decisions.</p>

<h3>💡 Business Impact</h3>
<p>Helps businesses make <strong>smarter, data-backed decisions</strong>, positioning them for more effective and profitable outcomes in a competitive market.</p>
`,
        tags: ['Customer Analytics', 'Profitability Analysis', 'Decision Support'],
        link: 'https://drive.google.com/file/d/15EX1a1knVH4xdcq9FgMU6AuMOvfO3tM0/view?usp=sharing',
        demo: 'https://drive.google.com/file/d/15EX1a1knVH4xdcq9FgMU6AuMOvfO3tM0/view?usp=sharing',
        github: 'https://github.com/praven80/market_basket_analysis_ai',
        caseStudy: 'market-basket-analysis-case-study.html'
    },
    {
        icon: '👥',
        title: 'TeamLink AI',
        type: 'Multi-Agent Enterprise Assistant',
        description: 'AI-powered multi-agent virtual assistant helping employees instantly find answers across HR policies, benefits, payroll, IT support, and training resources. Built on Amazon Bedrock with intelligent agent-routing system directing queries to domain experts. Reduces employee support ticket volume by 60% while improving response accuracy.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>TeamLink AI</strong> is an advanced, multi-agent virtual assistant designed to help employees instantly find answers across multiple domains.</p>

<h3>📚 Knowledge Domains</h3>
<div class="template-grid">
    <span class="template-tag">HR Policies</span>
    <span class="template-tag">Benefits</span>
    <span class="template-tag">Payroll</span>
    <span class="template-tag">IT Support</span>
    <span class="template-tag">Training Resources</span>
    <span class="template-tag">Web Search</span>
</div>

<h3>🏗️ Architecture</h3>
<ul>
    <li>Built on <strong>Amazon Bedrock</strong> with powerful LLMs</li>
    <li><strong>RAG-based architecture</strong> for accurate, context-aware responses</li>
    <li><strong>Smart web search agent</strong> that understands queries and fetches external information</li>
</ul>

<h3>🤖 Intelligent Routing</h3>
<p>The intelligent agent-routing system automatically directs queries to the right domain expert:</p>
<ul>
    <li>HR Agent</li>
    <li>Benefits Agent</li>
    <li>Payroll Agent</li>
    <li>IT Agent</li>
    <li>Training Agent</li>
    <li>Web Search Agent</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Reduces employee support ticket volume by <strong>60%</strong> while improving response accuracy.</p>
`,
        tags: ['Multi-Agent System', 'Enterprise Assistant', 'Knowledge Retrieval'],
        link: 'https://drive.google.com/file/d/1cx83GnaQm_0tLa8pFO_gjOyN6QghIno4/view?usp=sharing',
        demo: 'https://drive.google.com/file/d/1cx83GnaQm_0tLa8pFO_gjOyN6QghIno4/view?usp=sharing',
        github: 'https://github.com/aws-solutions-library-samples/guidance-for-multi-agent-employee-virtual-assistant-on-aws'
    },
    {
        icon: '🏨',
        title: 'Hotel Concierge AI',
        type: 'Voice-Enabled Hospitality Assistant',
        description: 'AI-powered voice assistant integrating LiveKit with AgentCore Runtime, Memory, Gateway, and Identity. Enables continuous conversations with context retrieval and real-time information access. Provides secure authentication for personalized guest interactions. Enhances hotel guest experience through intelligent, personalized concierge services.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p>This application integrates <strong>LiveKit</strong> with <strong>Nova Sonic & Amazon Bedrock AgentCore</strong>, showcasing how real-time, conversational agents can be built and deployed using AgentCore services.</p>

<h3>🏗️ Architecture</h3>
<ul>
    <li><strong>AgentCore Runtime</strong> – Host AI agents securely</li>
    <li><strong>AgentCore Identity</strong> – Secure user authentication</li>
    <li><strong>AgentCore Memory</strong> – Retain and retrieve conversational context</li>
    <li><strong>AgentCore Gateway</strong> – Connect with external APIs and databases</li>
</ul>

<h3>✨ Key Capabilities</h3>
<ul>
    <li>Seamless and continuous interactions across sessions</li>
    <li>Access to real-time data and dynamic responses</li>
    <li>Secure authentication for personalized guest interactions</li>
    <li>Scalable and production-ready pattern</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Highlights a scalable and production-ready pattern for building <strong>interactive, stateful, and secure agent-based applications</strong> in the hospitality industry.</p>
`,
        tags: ['Voice Assistant', 'AgentCore', 'Hospitality AI'],
        link: 'https://github.com/praven80/hotel_concierge_ai'
    },
    {
        icon: '🚙',
        title: 'Fleet Management AI',
        type: 'AI-Powered Demand Prediction',
        description: 'AI-powered car rental demand prediction platform built on Amazon Bedrock AgentCore. Analyzes and predicts rental demand by integrating real-time data from multiple sources: fleet inventory, local events, national holidays, weather forecasts, and airline schedules. Enables optimal fleet allocation and resource planning for rental companies.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p>This application delivers an <strong>AI-powered rental demand forecasting solution</strong> for Hertz Fleet Management, designed to enable proactive and data-driven fleet planning.</p>

<h3>📊 Data Integration</h3>
<p>Analyzes internal fleet inventory data combined with external data sources in real time using MCP servers:</p>
<ul>
    <li><strong>Local events</strong></li>
    <li><strong>National holiday calendars</strong></li>
    <li><strong>Weather forecasts</strong></li>
    <li><strong>Airline arrival and departure information</strong></li>
</ul>

<h3>🚀 Key Benefits</h3>
<ul>
    <li>Accurately predicts rental demand patterns across locations</li>
    <li>Optimizes fleet allocation</li>
    <li>Improves vehicle utilization</li>
    <li>Reduces shortages during peak demand periods</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Enhances operational efficiency and supports better customer experiences through <strong>intelligent, AI-driven decision-making</strong>.</p>
`,
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
        detailedDescription: `
<h3>🎯 Overview</h3>
<p>Effortlessly generate, manage, and evaluate <strong>High-Quality Ground Truth Data</strong> to test, validate, and improve your Gen AI applications.</p>

<h3>⚡ Speed</h3>
<p>Generated <strong>100 ground truth Q/A pairs</strong> based on Bedrock documentation in under <strong>5 minutes</strong>!</p>

<h3>✨ Key Features</h3>
<ul>
    <li>Choose any <strong>Bedrock LLM</strong> to generate ground truth data</li>
    <li>Generate Q&A pairs from <strong>documents</strong> (PDF, DOCX, TXT) or <strong>Bedrock knowledge bases</strong></li>
    <li>Specify <strong>topics</strong> to focus ground truth generation</li>
    <li>Configure the <strong>number of Q&A pairs</strong> per topic</li>
    <li><strong>Interactive data grid</strong> with filtering & sorting for efficient review</li>
    <li><strong>Customizable</strong> model & prompt templates</li>
</ul>

<h3>📤 Export Options</h3>
<p>Export in multiple formats, including:</p>
<div class="template-grid">
    <span class="template-tag">RAGAS Format</span>
    <span class="template-tag">Bedrock Evaluation</span>
    <span class="template-tag">Custom Formats</span>
</div>

<h3>💡 Workflow</h3>
<p><strong>Review, Edit, and Approve</strong> generated Q&A pairs before use!</p>
`,
        tags: ['Q&A Generation', 'Data Validation', 'Model Evaluation'],
        link: 'https://drive.google.com/file/d/1OUHV8Kzh90cWi_NGb8wqiqjugcqOL5TZ/view?usp=sharing',
        demo: 'https://drive.google.com/file/d/1OUHV8Kzh90cWi_NGb8wqiqjugcqOL5TZ/view?usp=sharing',
        github: 'https://github.com/praven80/ground_truth_generator_ai'
    },
    {
        icon: '💻',
        title: 'AIGitHub',
        type: 'Conversational Code Analysis',
        description: 'AI-powered tool enabling conversational interaction with any public GitHub repository. Ask questions in plain English and get instant, contextual answers about repo structure, code logic, and purpose. Eliminates manual code reading for onboarding, code reviews, and exploration. Reduces codebase understanding time by 75%.',
        detailedDescription: `
<h3>🤔 The Problem</h3>
<ul>
    <li>Ever come across a public GitHub repository and struggled to understand what it actually does?</li>
    <li>Wished the repo's author was right beside you to walk you through the code?</li>
    <li>What if you could just <strong>chat with the repository</strong>?</li>
</ul>

<h3>🎯 The Solution</h3>
<p><strong>AIGitHub</strong> is an AI-powered tool that lets you interact conversationally with any public GitHub repository. Instead of manually reading through code and documentation, you can ask questions in plain English and get instant, contextual answers.</p>

<h3>✨ Key Features</h3>
<ul>
    <li>Ask questions about <strong>repo structure</strong></li>
    <li>Understand <strong>code logic</strong> and purpose</li>
    <li>Get <strong>instant, contextual answers</strong></li>
    <li>Perfect for <strong>onboarding</strong> to new projects</li>
    <li>Streamline <strong>code reviews</strong></li>
    <li>Explore open-source code effortlessly</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Reduces codebase understanding time by <strong>75%</strong>, making complex codebases faster and easier to understand.</p>
`,
        tags: ['Code Analysis', 'Developer Tools', 'Repository Intelligence'],
        link: 'https://drive.google.com/file/d/1K6a7FTKzqb_s1tYIPs4rFboa56OIDecb/view?usp=sharing',
        demo: 'https://drive.google.com/file/d/1K6a7FTKzqb_s1tYIPs4rFboa56OIDecb/view?usp=sharing',
        github: 'https://github.com/praven80/ai_github'
    },
    {
        icon: '📈',
        title: 'Investor Stock Analysis AI',
        type: 'Multi-Agent Financial Intelligence',
        description: 'AI-powered multi-agent solution evaluating and forecasting stock performance through three specialized agents: Historical Stock Price Agent, Stock News Scraper Agent, and Stock Analyst Agent. Provides valuable insights and actionable recommendations to guide investment decisions. Accelerates analysis while enhancing decision confidence.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p>The <strong>Stock Analysis AI App</strong> is a multi-agent AI solution designed to evaluate and forecast the performance of stocks.</p>

<h3>🤖 Three Specialized Agents</h3>
<ul>
    <li><strong>Historical Stock Price Agent</strong> – Retrieves past stock prices</li>
    <li><strong>Stock News Scraper Agent</strong> – Gathers relevant news and financial data (company performance, forecasts, market outlooks)</li>
    <li><strong>Stock Analyst Agent</strong> – Analyzes combined data to provide insights and future stock predictions</li>
</ul>

<h3>✨ Key Capabilities</h3>
<ul>
    <li>Evaluate stock performance more effectively</li>
    <li>Valuable insights and recommendations</li>
    <li>Guide investment decisions for clients</li>
    <li>Accelerate analysis while enhancing decision confidence</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Implemented in an investment analysis company, helping analysts make <strong>data-driven investment decisions</strong> with confidence.</p>
`,
        tags: ['Financial Analysis', 'Multi-Agent System', 'Investment Intelligence'],
        link: 'https://github.com/praven80/stock_analysis_ai'
    },
    {
        icon: '📚',
        title: 'IntelliLearn AI',
        type: 'Adaptive Educational Platform',
        description: 'AI-powered adaptive learning platform built on Amazon Q and Amazon Bedrock. Students learn through interactive engagement and self-evaluate before advancing chapters. Professors generate questions based on Bloom\'s Taxonomy. Implemented at Cornell University and institutions, enhancing learning outcomes through progressive assessment.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p>This AI app, developed using <strong>Amazon Q</strong> and <strong>Amazon Bedrock</strong>, has been successfully showcased at various student forums, town halls, and educational workshops.</p>

<h3>👨‍🎓 For Students</h3>
<ul>
    <li>Interactive learning experience</li>
    <li>Self-evaluate before advancing chapters</li>
    <li>Progress through levels based on performance</li>
</ul>

<h3>👨‍🏫 For Professors</h3>
<ul>
    <li>Create a wide range of question types</li>
    <li>Questions across <strong>Bloom's Taxonomy</strong> levels (simple to complex)</li>
    <li>Questions stored in a repository</li>
    <li>Progressive student evaluation</li>
</ul>

<h3>🏆 Implementation</h3>
<p>Implemented at <strong>Cornell University</strong> and several other educational institutions, driving broader adoption and improving learning outcomes.</p>

<h3>💡 Business Impact</h3>
<p>Enhances the educational experience by integrating AI into the learning and assessment process.</p>
`,
        tags: ['Education Technology', 'Adaptive Learning', 'Assessment Automation'],
        link: 'https://github.com/praven80/intelli_learn_ai'
    },
    {
        icon: '🚗',
        title: 'Windshield Inspector',
        type: 'AI-Powered Damage Assessment',
        description: 'AI-powered application using Amazon Bedrock to assess windshield damage in real-time. Provides instant classification (Good / Damaged) with confidence scores and detailed explanations. Ideal for insurance companies and repair shops to streamline claims processing. Accelerates damage assessment while improving accuracy.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>Windshield Inspector</strong> is an AI-powered application that uses Amazon Bedrock to assess windshield damage in real-time, providing instant and accurate damage classification.</p>

<h3>🔍 Key Capabilities</h3>
<ul>
    <li><strong>Instant Classification</strong> - Good / Damaged status</li>
    <li><strong>Confidence Scores</strong> - Reliability metrics for each assessment</li>
    <li><strong>Detailed Explanations</strong> - AI-generated reasoning for decisions</li>
    <li><strong>Real-time Processing</strong> - Immediate results from image upload</li>
</ul>

<h3>🏢 Use Cases</h3>
<ul>
    <li><strong>Insurance Companies</strong> - Streamline claims processing</li>
    <li><strong>Repair Shops</strong> - Quick damage assessment</li>
    <li><strong>Fleet Management</strong> - Vehicle inspection automation</li>
    <li><strong>Rental Companies</strong> - Pre/post rental inspections</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Accelerates damage assessment while improving accuracy, reducing manual review time and enabling faster claims processing.</p>
`,
        tags: ['Image Analysis', 'Damage Detection', 'Real-time Classification'],
        link: 'https://github.com/praven80/windshield_inspector'
    },
    {
        icon: '🎙️',
        title: 'DocTalk',
        type: 'AI Podcast & Video Generator',
        description: 'AI-powered app transforming documents and articles into engaging audio/video podcasts where two speakers discuss content as a conversational story. Makes lengthy, dense material easily consumable for educational content, business updates, and reports. Reduces content consumption time by 70% while improving comprehension and retention.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>DocTalk</strong> is an AI-powered application that transforms documents and articles into engaging audio and video podcasts, featuring two speakers discussing the content as a conversational story.</p>

<h3>🎧 Content Transformation</h3>
<ul>
    <li><strong>Documents to Podcasts</strong> - Convert PDFs, articles, reports</li>
    <li><strong>Two-Speaker Format</strong> - Natural conversational flow</li>
    <li><strong>Audio & Video Output</strong> - Multiple format options</li>
    <li><strong>Storytelling Approach</strong> - Engaging narrative style</li>
</ul>

<h3>📚 Use Cases</h3>
<ul>
    <li><strong>Educational Content</strong> - Make learning materials accessible</li>
    <li><strong>Business Updates</strong> - Transform reports into digestible content</li>
    <li><strong>Research Papers</strong> - Simplify complex academic material</li>
    <li><strong>Training Materials</strong> - Create engaging onboarding content</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Reduces content consumption time by <strong>70%</strong> while improving comprehension and retention, making lengthy, dense material easily consumable.</p>
`,
        tags: ['Podcast Generation', 'Audio/Video Content', 'Learning Acceleration'],
        link: 'https://github.com/praven80/podcast_and_videocast_generator_ai'
    },
    {
        icon: '📹',
        title: 'Screen & Cam Capture AI',
        type: 'AI-Powered Visual Collaboration',
        description: 'AI-powered application simplifying collaboration through screen recording and webcam capture. Enables showcasing work, asking questions, and receiving actionable insights with real-time visual feedback. Combines visuals with AI-driven understanding to enhance communication and productivity. Reduces feedback cycles by 65%.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>Screen & Cam Capture AI</strong> simplifies collaboration through intelligent screen recording and webcam capture, combining visuals with AI-driven understanding.</p>

<h3>📹 Key Features</h3>
<ul>
    <li><strong>Screen Recording</strong> - Capture your work in action</li>
    <li><strong>Webcam Capture</strong> - Add personal context</li>
    <li><strong>AI Analysis</strong> - Get actionable insights from recordings</li>
    <li><strong>Real-time Feedback</strong> - Instant visual understanding</li>
</ul>

<h3>🤝 Collaboration Benefits</h3>
<ul>
    <li>Showcase work visually</li>
    <li>Ask questions with context</li>
    <li>Receive AI-powered insights</li>
    <li>Enhance communication clarity</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Reduces feedback cycles by <strong>65%</strong> while improving communication and productivity through visual context.</p>
`,
        tags: ['Screen Capture', 'Webcam Recording', 'Visual Feedback'],
        link: 'https://github.com/praven80/screen_and_camera_capture_ai'
    },
    {
        icon: '🌐',
        title: 'Nova Act Web Parser',
        type: 'AI-Powered Web Data Extraction',
        description: 'AI-powered tool transforming any website into structured JSON data based on human instructions and custom schemas. Navigates websites like a human, extracting and formatting data automatically without complex coding. Ideal for price comparisons, market research, and data aggregation. Reduces web scraping time by 80%.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>Nova Act Web Parser</strong> transforms any website into structured JSON data based on human instructions and custom schemas, navigating websites like a human.</p>

<h3>🔧 Key Capabilities</h3>
<ul>
    <li><strong>Human-like Navigation</strong> - Browses websites naturally</li>
    <li><strong>Custom Schemas</strong> - Define your data structure</li>
    <li><strong>Natural Language Instructions</strong> - No complex coding required</li>
    <li><strong>Structured JSON Output</strong> - Clean, formatted data</li>
</ul>

<h3>📊 Use Cases</h3>
<ul>
    <li><strong>Price Comparisons</strong> - Aggregate pricing data</li>
    <li><strong>Market Research</strong> - Collect competitive intelligence</li>
    <li><strong>Data Aggregation</strong> - Consolidate information sources</li>
    <li><strong>Content Monitoring</strong> - Track website changes</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Reduces web scraping time by <strong>80%</strong> while eliminating the need for complex coding or technical expertise.</p>
`,
        tags: ['Web Scraping', 'Data Extraction', 'Human-like Browsing'],
        link: 'https://github.com/praven80/novaact_web_data_parser'
    },
    {
        icon: '🔎',
        title: 'MetaSurfer',
        type: 'AI-Powered Semantic Search Platform',
        description: 'AI-powered platform streamlining enterprise data asset discovery through semantic search. Gathers metadata via Glue Databrew and converts to natural language embeddings stored in vector format. Enables business users to quickly find relevant data assets across sources through intelligent search and recommendations.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>MetaSurfer</strong> is an AI-powered platform that streamlines enterprise data asset discovery through semantic search, enabling business users to quickly find relevant data assets.</p>

<h3>🏗️ Architecture</h3>
<ul>
    <li><strong>Glue Databrew</strong> - Metadata gathering</li>
    <li><strong>Natural Language Embeddings</strong> - Semantic understanding</li>
    <li><strong>Vector Storage</strong> - Efficient similarity search</li>
    <li><strong>Intelligent Recommendations</strong> - Suggested data assets</li>
</ul>

<h3>🔍 Key Features</h3>
<ul>
    <li>Semantic search across data sources</li>
    <li>Natural language queries</li>
    <li>Intelligent recommendations</li>
    <li>Cross-source data discovery</li>
</ul>

<h3>🏆 Recognition</h3>
<p><strong>Winner 2023</strong> - Recognized for innovation in data discovery</p>

<h3>💡 Business Impact</h3>
<p>Enables business users to quickly find relevant data assets across sources, reducing time spent searching for data.</p>
`,
        tags: ['Winner 2023', 'Semantic Search', 'Data Discovery'],
        link: ''
    },
    {
        icon: '🎤',
        title: 'Voice Enabled AI Assistant',
        type: 'Voice-Based Interaction Platform',
        description: 'AI-powered voice platform using Amazon Q, Amazon Transcribe, and Amazon Polly. Enables seamless conversations where users speak and receive text and voice responses in real-time. Leverages natural language processing for accurate answers. Ideal for hands-free environments and accessibility needs.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>Voice Enabled AI Assistant</strong> is an AI-powered voice platform enabling seamless conversations where users speak and receive text and voice responses in real-time.</p>

<h3>🏗️ Technology Stack</h3>
<ul>
    <li><strong>Amazon Q</strong> - Intelligent responses</li>
    <li><strong>Amazon Transcribe</strong> - Speech-to-text conversion</li>
    <li><strong>Amazon Polly</strong> - Text-to-speech synthesis</li>
    <li><strong>Natural Language Processing</strong> - Accurate understanding</li>
</ul>

<h3>✨ Key Features</h3>
<ul>
    <li>Real-time voice conversations</li>
    <li>Text and voice response options</li>
    <li>Natural language understanding</li>
    <li>Seamless interaction flow</li>
</ul>

<h3>🎯 Use Cases</h3>
<ul>
    <li><strong>Hands-free Environments</strong> - Warehouses, manufacturing</li>
    <li><strong>Accessibility</strong> - Vision-impaired users</li>
    <li><strong>Customer Service</strong> - Voice-based support</li>
    <li><strong>Mobile Workers</strong> - On-the-go assistance</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Enables accessible, hands-free AI interactions for diverse environments and user needs.</p>
`,
        tags: ['Voice AI', 'Natural Language Processing', 'Customer Service'],
        link: 'https://github.com/praven80/voice_enabled_ai_assistant'
    },
    {
        icon: '🎨',
        title: 'MultiModal AI',
        type: 'Multi-Modal Content Generation',
        description: 'AI-powered application leveraging Amazon Nova models for diverse multi-modal use cases: text-to-text, image-to-text, video-to-text, text-to-image, image-to-image, text-to-video, and image-to-video. Transforms various inputs into engaging media for marketing campaigns. Accelerates promotional strategies for media and advertising companies.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>MultiModal AI</strong> leverages Amazon Nova models for diverse multi-modal content generation, transforming various inputs into engaging media.</p>

<h3>🔄 Supported Transformations</h3>
<div class="template-grid">
    <span class="template-tag">Text to Text</span>
    <span class="template-tag">Image to Text</span>
    <span class="template-tag">Video to Text</span>
    <span class="template-tag">Text to Image</span>
    <span class="template-tag">Image to Image</span>
    <span class="template-tag">Text to Video</span>
    <span class="template-tag">Image to Video</span>
</div>

<h3>🎯 Use Cases</h3>
<ul>
    <li><strong>Marketing Campaigns</strong> - Generate engaging visuals</li>
    <li><strong>Content Creation</strong> - Transform ideas into media</li>
    <li><strong>Advertising</strong> - Accelerate promotional strategies</li>
    <li><strong>Media Production</strong> - Streamline content workflows</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Accelerates promotional strategies for media and advertising companies through rapid, AI-powered content generation.</p>
`,
        tags: ['Multi-Modal AI', 'Content Generation', 'Amazon Nova'],
        link: 'https://github.com/praven80/nova_multimodal_ai'
    },
    {
        icon: '🖼️',
        title: 'Image Insights AI',
        type: 'Interactive Image Analysis',
        description: 'AI-powered application analyzing images to provide detailed insights through interactive Q&A. Leverages advanced image recognition to extract meaningful data and automate classification processes. Enables damage assessment, quality inspection, and visual verification across industries. Reduces manual review time and improves accuracy.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>Image Insights AI</strong> analyzes images to provide detailed insights through interactive Q&A, leveraging advanced image recognition technology.</p>

<h3>🔍 Key Capabilities</h3>
<ul>
    <li><strong>Interactive Q&A</strong> - Ask questions about images</li>
    <li><strong>Advanced Recognition</strong> - Extract meaningful data</li>
    <li><strong>Automated Classification</strong> - Categorize images intelligently</li>
    <li><strong>Detailed Insights</strong> - Comprehensive analysis results</li>
</ul>

<h3>🏢 Industry Applications</h3>
<ul>
    <li><strong>Damage Assessment</strong> - Insurance, automotive</li>
    <li><strong>Quality Inspection</strong> - Manufacturing, retail</li>
    <li><strong>Visual Verification</strong> - Compliance, security</li>
    <li><strong>Content Moderation</strong> - Media, social platforms</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Reduces manual review time and improves accuracy across diverse visual analysis use cases.</p>
`,
        tags: ['Image Analysis', 'Visual Intelligence', 'Automated Classification'],
        link: 'https://github.com/praven80/image_insights'
    },
    {
        icon: '📄',
        title: 'Document Data Extractor AI',
        type: 'Intelligent Document Processing',
        description: 'AI-powered application using Amazon Bedrock Data Automation to transform unstructured data from documents, images, and forms into structured, actionable insights. Extracts key information from financial documents, pay slips, and handwritten forms. Enables workflow automation and informed decision-making. Accelerates document processing efficiency.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>Document Data Extractor AI</strong> uses Amazon Bedrock Data Automation to transform unstructured data from documents, images, and forms into structured, actionable insights.</p>

<h3>📑 Supported Document Types</h3>
<div class="template-grid">
    <span class="template-tag">Financial Documents</span>
    <span class="template-tag">Pay Slips</span>
    <span class="template-tag">Handwritten Forms</span>
    <span class="template-tag">Invoices</span>
    <span class="template-tag">Contracts</span>
    <span class="template-tag">Applications</span>
</div>

<h3>🔧 Key Capabilities</h3>
<ul>
    <li><strong>Data Extraction</strong> - Pull key information automatically</li>
    <li><strong>Structure Conversion</strong> - Transform to actionable formats</li>
    <li><strong>Workflow Automation</strong> - Integrate with business processes</li>
    <li><strong>Handwriting Recognition</strong> - Process handwritten content</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Accelerates document processing efficiency, enabling workflow automation and informed decision-making.</p>
`,
        tags: ['Document Processing', 'Data Extraction', 'Workflow Automation'],
        link: 'https://github.com/praven80/structured_data_extraction_from_unstructured_documents_ai'
    },
    {
        icon: '🎥',
        title: 'YouTube Intelligence AI',
        type: 'Video Content Discovery',
        description: 'AI-powered tool aggregating and processing YouTube videos with transcript extraction, summarization, and intelligent search capabilities. Enables users to quickly find specific topics, access relevant video links, and jump to exact timestamps of key moments. Saves significant time by eliminating manual video browsing.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>YouTube Intelligence AI</strong> aggregates and processes YouTube videos with transcript extraction, summarization, and intelligent search capabilities.</p>

<h3>🔍 Key Features</h3>
<ul>
    <li><strong>Transcript Extraction</strong> - Pull text from videos</li>
    <li><strong>Summarization</strong> - Get key points quickly</li>
    <li><strong>Intelligent Search</strong> - Find specific topics</li>
    <li><strong>Timestamp Navigation</strong> - Jump to exact moments</li>
</ul>

<h3>📊 Use Cases</h3>
<ul>
    <li>Research and learning</li>
    <li>Content curation</li>
    <li>Knowledge extraction</li>
    <li>Video content analysis</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Saves significant time by eliminating manual video browsing, enabling quick access to relevant content and key moments.</p>
`,
        tags: ['Video Intelligence', 'Transcript Search', 'Content Navigation'],
        link: 'https://github.com/praven80/search_youtube_videos_ai'
    },
    {
        icon: '🔧',
        title: 'GitLab AI Assistant',
        type: 'DevOps Collaboration Platform',
        description: 'AI-powered tool automating GitLab command creation through natural language, eliminating the need to memorize complex commands. Users interact with GitLab using plain English to execute repository tasks, manage workflows, and automate DevOps processes. Accelerates development cycles and reduces learning curve for GitLab operations.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>GitLab AI Assistant</strong> automates GitLab command creation through natural language, eliminating the need to memorize complex commands.</p>

<h3>💬 Natural Language Interface</h3>
<ul>
    <li>Interact with GitLab using plain English</li>
    <li>Execute repository tasks naturally</li>
    <li>Manage workflows conversationally</li>
    <li>Automate DevOps processes</li>
</ul>

<h3>🔧 Key Capabilities</h3>
<ul>
    <li><strong>Command Generation</strong> - Create GitLab commands from text</li>
    <li><strong>Repository Management</strong> - Handle repos without memorizing syntax</li>
    <li><strong>Workflow Automation</strong> - Streamline CI/CD processes</li>
    <li><strong>DevOps Integration</strong> - Connect with existing pipelines</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Accelerates development cycles and reduces learning curve for GitLab operations, making DevOps accessible to all team members.</p>
`,
        tags: ['DevOps Automation', 'Natural Language Interface', 'GitLab Integration'],
        link: 'https://github.com/praven80/gitlab_ai_assistant'
    },
    {
        icon: '🧘',
        title: 'Mindful Moments',
        type: 'AI-Powered Mental Wellness',
        description: 'AI-powered web application supporting mental health and emotional well-being through interactive conversations. Users engage with the app to ask questions about positive thinking, managing mental health, and finding encouragement. Leverages Amazon Bedrock Claude AI to provide compassionate, personalized responses.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>Mindful Moments</strong> is an AI-powered web application supporting mental health and emotional well-being through interactive, compassionate conversations.</p>

<h3>💬 Conversation Topics</h3>
<ul>
    <li>Positive thinking strategies</li>
    <li>Managing mental health</li>
    <li>Finding encouragement</li>
    <li>Emotional well-being support</li>
</ul>

<h3>🏗️ Technology</h3>
<ul>
    <li><strong>Amazon Bedrock</strong> - AI foundation</li>
    <li><strong>Claude AI</strong> - Compassionate responses</li>
    <li><strong>Personalization</strong> - Tailored interactions</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Provides accessible mental wellness support through AI-powered, compassionate conversations.</p>
`,
        tags: ['Mental Wellness', 'AI Chatbot', 'Emotional Support'],
        link: 'https://github.com/praven80/mindful_moments'
    },
    {
        icon: '🔄',
        title: 'Bedrock Rerank',
        type: 'RAG Enhancement Tool',
        description: 'AI-powered tool demonstrating knowledge-based response generation with three reranking approaches: direct retrieval without reranking, Cohere rerank model, and Amazon rerank model. Enables comparison of reranking strategies to optimize retrieval accuracy. Provides configuration breakdowns for implementing reranking in RAG applications.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>Bedrock Rerank</strong> demonstrates knowledge-based response generation with multiple reranking approaches to optimize retrieval accuracy in RAG applications.</p>

<h3>🔄 Reranking Approaches</h3>
<ul>
    <li><strong>Direct Retrieval</strong> - Without reranking (baseline)</li>
    <li><strong>Cohere Rerank</strong> - Third-party reranking model</li>
    <li><strong>Amazon Rerank</strong> - Native AWS reranking</li>
</ul>

<h3>📊 Comparison Features</h3>
<ul>
    <li>Side-by-side strategy comparison</li>
    <li>Retrieval accuracy metrics</li>
    <li>Configuration breakdowns</li>
    <li>Implementation guidance</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Enables optimization of RAG applications through informed reranking strategy selection and implementation.</p>
`,
        tags: ['RAG Optimization', 'Reranking Models', 'Retrieval Enhancement'],
        link: 'https://github.com/praven80/bedrock_rerank'
    },
    {
        icon: '🤖',
        title: 'DeepSeek AI',
        type: 'Model Deployment Tool',
        description: 'AI model deployment tool providing scripts for deploying and interacting with DeepSeek-R1-Distill-Llama-8B using Amazon SageMaker and Amazon Bedrock. SageMaker script enables model deployment with RESTful API inference. Bedrock notebook guides through cloning from Hugging Face, S3 upload, and model import. Simplifies model deployment workflow.',
        detailedDescription: `
<h3>🎯 Overview</h3>
<p><strong>DeepSeek AI</strong> provides scripts for deploying and interacting with DeepSeek-R1-Distill-Llama-8B using Amazon SageMaker and Amazon Bedrock.</p>

<h3>🏗️ Deployment Options</h3>
<ul>
    <li><strong>Amazon SageMaker</strong> - Model deployment with RESTful API inference</li>
    <li><strong>Amazon Bedrock</strong> - Custom model import workflow</li>
</ul>

<h3>📋 Bedrock Workflow</h3>
<ul>
    <li>Clone from Hugging Face</li>
    <li>Upload to S3</li>
    <li>Import model to Bedrock</li>
    <li>Ready for inference</li>
</ul>

<h3>💡 Business Impact</h3>
<p>Simplifies model deployment workflow, enabling rapid deployment of DeepSeek models on AWS infrastructure.</p>
`,
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
        
        // Add info button if detailed description exists
        const infoButton = project.detailedDescription ? 
            `<button class="case-study-btn-inline info-btn" title="More Info" onclick="showProjectModal('${project.title}')">ℹ️</button>` : '';
        
        // Add demo button if demo link exists
        const demoButton = project.demo ? 
            `<a href="${project.demo}" target="_blank" class="case-study-btn-inline demo-btn" title="Watch Demo">🎬</a>` : '';
        
        // Add case study button aligned with title
        const caseStudyButton = project.caseStudy ? 
            `<a href="${project.caseStudy}" class="case-study-btn-inline" title="View Case Study">📖</a>` : '';
        
        // Add GitHub button if link is a GitHub repo OR if separate github field exists
        const githubUrl = project.github || (project.link && project.link.includes('github.com') ? project.link : null);
        const githubButton = githubUrl ? 
            `<a href="${githubUrl}" target="_blank" class="case-study-btn-inline github-btn" title="View GitHub Repo"><svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg></a>` : '';
        
        return `
        <div class="project-card">
            <h3 style="display: flex; align-items: center; justify-content: space-between;">
                <span style="display: flex; align-items: center;">
                    <span class="project-icon">${project.icon}</span>${linkHtml}
                </span>
                <span style="display: flex; align-items: center; gap: 0.75rem;">
                    ${infoButton}${demoButton}${caseStudyButton}${githubButton}
                </span>
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


// ============================================================================
// PROJECT MODAL
// ============================================================================

function showProjectModal(projectTitle) {
    const project = projectsData.find(p => p.title === projectTitle);
    if (!project || !project.detailedDescription) return;
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('project-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'project-modal';
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="project-modal-content">
                <button class="project-modal-close" onclick="closeProjectModal()">&times;</button>
                <h2 id="project-modal-title"></h2>
                <div id="project-modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeProjectModal();
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeProjectModal();
        });
    }
    
    // Populate modal content
    document.getElementById('project-modal-title').textContent = project.title;
    document.getElementById('project-modal-body').innerHTML = project.detailedDescription;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
