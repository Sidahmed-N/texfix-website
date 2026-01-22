// --- LOADER LOGIC ---
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loader-text');

let progress = 0;
const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 10) + 1;
    if (progress > 100) progress = 100;
    loaderText.innerText = progress < 100 ? `0${progress}` : '100';

    if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => {
            loader.style.transform = 'translateY(-100%)';
            document.body.classList.remove('loading');
        }, 500);
    }
}, 30);

// --- MOBILE MENU LOGIC ---
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerLines = document.querySelectorAll('.hamburger-line');

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.toggle('hidden');
        
        if (isHidden) {
            mobileMenu.style.maxHeight = '0';
            hamburgerLines[0].style.transform = 'none';
            hamburgerLines[1].style.opacity = '1';
            hamburgerLines[2].style.transform = 'none';
        } else {
            mobileMenu.style.maxHeight = '300px';
            hamburgerLines[0].style.transform = 'rotate(45deg) translateY(8px)';
            hamburgerLines[1].style.opacity = '0';
            hamburgerLines[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        }
    });
    
    // Close menu when a link is clicked
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.style.maxHeight = '0';
            hamburgerLines[0].style.transform = 'none';
            hamburgerLines[1].style.opacity = '1';
            hamburgerLines[2].style.transform = 'none';
        });
    });
}

// --- CURSOR LOGIC ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (window.matchMedia("(pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

        // For Bento hover effect
        document.querySelectorAll('.bento-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    const animateRing = () => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Interactive Elements interactions
    document.querySelectorAll('a, button, .glass-card, .bento-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.style.width = '50px';
            cursorRing.style.height = '50px';
            cursorRing.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
            cursorRing.style.borderColor = 'transparent';
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.style.width = '20px';
            cursorRing.style.height = '20px';
            cursorRing.style.backgroundColor = 'transparent';
            cursorRing.style.borderColor = 'rgba(59, 130, 246, 0.5)';
        });
    });
}

// --- GSAP ANIMATIONS ---
gsap.registerPlugin(ScrollTrigger);

// Project Cards Staggered Fade In
gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power3.out"
    });
});

// Bento Cards Staggered Fade In
gsap.utils.toArray('.bento-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: "#about",
            start: "top 70%",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.1,
        ease: "power2.out"
    });
});

// Process Steps Slide In
gsap.utils.toArray('.process-step').forEach((step, i) => {
    gsap.to(step, {
        scrollTrigger: {
            trigger: step,
            start: "top 80%",
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: i * 0.2,
        ease: "power2.out"
    });
});

// Hover Tilt Effect (Vanilla JS)
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// Service Cards Accordion Functionality
const serviceToggles = {
    automation: {
        toggle: document.querySelector('[data-automation="toggle"]'),
        details: document.getElementById('automation-details'),
        chevron: document.querySelector('.automation-chevron')
    },
    customDev: {
        toggle: document.querySelector('[data-custom-dev="toggle"]'),
        details: document.getElementById('custom-dev-details'),
        chevron: document.querySelector('.custom-dev-chevron')
    },
    mobileWeb: {
        toggle: document.querySelector('[data-mobile-web="toggle"]'),
        details: document.getElementById('mobile-web-details'),
        chevron: document.querySelector('.mobile-web-chevron')
    },
    analytics: {
        toggle: document.querySelector('[data-analytics="toggle"]'),
        details: document.getElementById('analytics-details'),
        chevron: document.querySelector('.analytics-chevron')
    }
};

let currentOpenService = null;

// Helper function to close a service
function closeService(key) {
    const service = serviceToggles[key];
    if (service && service.details) {
        service.details.style.maxHeight = '0';
        service.chevron.style.transform = 'rotate(0deg)';
        setTimeout(() => {
            service.details.classList.add('hidden');
        }, 500);
    }
}

// Helper function to open a service
function openService(key) {
    const service = serviceToggles[key];
    if (service && service.details) {
        service.details.classList.remove('hidden');
        service.details.offsetHeight;
        service.details.style.maxHeight = service.details.scrollHeight + 'px';
        service.chevron.style.transform = 'rotate(180deg)';
    }
}

// Attach click handlers to all service cards
Object.keys(serviceToggles).forEach(key => {
    const service = serviceToggles[key];
    if (service.toggle) {
        service.toggle.addEventListener('click', () => {
            // Preserve scroll position
            const scrollPos = window.scrollY;
            
            // If a different service is open, close it
            if (currentOpenService && currentOpenService !== key) {
                closeService(currentOpenService);
            }

            // Toggle current service
            if (currentOpenService === key) {
                // Closing the current service
                closeService(key);
                currentOpenService = null;
            } else {
                // Opening a new service
                openService(key);
                currentOpenService = key;
            }
            
            // Restore scroll position after a brief delay
            setTimeout(() => {
                window.scrollY = scrollPos;
            }, 10);
        });
    }
});

// --- PROJECT MODAL LOGIC ---
const projectModal = document.getElementById('project-modal');
const modalCloseBtn = document.getElementById('modal-close');
const projectCards = document.querySelectorAll('.project-card');

// Project data
const projectsData = {
    1: {
        title: "Inventory & Operations Management",
        description: "A comprehensive business platform designed to streamline inventory tracking, order management, and operational workflows for mid-sized enterprises.",
        features: ["Real-time inventory tracking", "Automated order processing", "Multi-location support", "Analytics dashboard"],
        tech: ["React", "Node.js", "PostgreSQL", "Redis"],
        results: "Reduced inventory costs by 35% and improved order fulfillment time by 48%"
    },
    2: {
        title: "OptiFlow Pro - CRM Platform",
        description: "Advanced customer relationship management system built for sales teams to manage leads, track interactions, and close deals faster.",
        features: ["Lead scoring & segmentation", "Pipeline management", "Automated follow-ups", "Performance analytics"],
        tech: ["Vue.js", "Express.js", "MongoDB", "Socket.io"],
        results: "Increased sales conversion by 42% and reduced sales cycle by 3 weeks"
    },
    3: {
        title: "ClientHub X - Business Intelligence",
        description: "Powerful BI platform providing real-time data visualization and insights for data-driven decision making across organizations.",
        features: ["Custom dashboard builder", "Real-time data sync", "Predictive analytics", "Report generation"],
        tech: ["React", "Python", "BigQuery", "D3.js"],
        results: "Improved decision-making speed by 60% with 99.9% uptime"
    },
    4: {
        title: "DataInsight Suite - Analytics Engine",
        description: "Enterprise-grade analytics solution capturing, processing, and visualizing massive datasets for actionable business intelligence.",
        features: ["Data pipeline automation", "Real-time processing", "Custom metrics", "Multi-source integration"],
        tech: ["Apache Spark", "Python", "Elasticsearch", "Grafana"],
        results: "Processed 500M+ records daily with 200ms average query response"
    },
    5: {
        title: "TradeVault - E-Commerce Platform",
        description: "Full-featured e-commerce platform with integrated payment processing, inventory management, and customer engagement tools.",
        features: ["Payment gateway integration", "Inventory sync", "Customer loyalty program", "Order tracking"],
        tech: ["Next.js", "Stripe API", "Firebase", "Tailwind CSS"],
        results: "Generated $2.5M revenue in first year with 15K+ active customers"
    }
};

// Function to populate modal with project data
function populateModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    const modal = projectModal;
    
    // Set background image
    const modalImage = modal.querySelector('[id="modal-image"]');
    if (modalImage) {
        modalImage.style.backgroundImage = `url('data/project${projectId}.jpg')`;
    }
    
    // Update title
    const titleEl = modal.querySelector('[data-modal-title]');
    if (titleEl) titleEl.textContent = project.title;

    // Update description
    const descEl = modal.querySelector('[data-modal-description]');
    if (descEl) descEl.textContent = project.description;

    // Update features
    const featuresEl = modal.querySelector('[data-modal-features]');
    if (featuresEl) {
        featuresEl.innerHTML = project.features
            .map(feature => `<li class="flex items-start gap-3">
                <iconify-icon icon="lucide:check" class="text-signal flex-shrink-0 mt-1"></iconify-icon>
                <span>${feature}</span>
            </li>`)
            .join('');
    }

    // Update tech stack
    const techEl = modal.querySelector('[data-modal-tech]');
    if (techEl) {
        techEl.innerHTML = project.tech
            .map(tech => `<span class="px-3 py-1 bg-signal/10 border border-signal/30 rounded text-signal text-sm">${tech}</span>`)
            .join('');
    }

    // Update results
    const resultsEl = modal.querySelector('[data-modal-results]');
    if (resultsEl) resultsEl.textContent = project.results;
}

// Function to open modal
function openProjectModal(projectId) {
    populateModal(projectId);
    projectModal.classList.remove('hidden');
    projectModal.style.animation = 'fadeIn 0.3s ease-out';
}

// Function to close modal
function closeProjectModal() {
    projectModal.classList.add('hidden');
}

// Attach click handlers to project cards
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project');
        if (projectId) {
            openProjectModal(projectId);
        }
    });
});

// Close modal button
if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
}

// Close modal when clicking backdrop
if (projectModal) {
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });
}
