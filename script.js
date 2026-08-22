/* ==========================================================================
   YASITH MAVINDA - PORTFOLIO INTERACTIVITY SCRIPT (CLEAN BLUE THEME)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 1.5 Light / Dark Theme Switcher
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle-btn');
    const htmlElement = document.documentElement;

    // Load saved theme or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (mobileThemeToggleBtn) {
        mobileThemeToggleBtn.addEventListener('click', toggleTheme);
    }

    // 2. Mobile Menu Toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDropdown = document.getElementById('mobile-nav-dropdown');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (hamburgerBtn && mobileDropdown && hamburgerIcon) {
        hamburgerBtn.addEventListener('click', () => {
            mobileDropdown.classList.toggle('active');
            const isOpen = mobileDropdown.classList.contains('active');
            
            if (isOpen) {
                hamburgerIcon.setAttribute('data-lucide', 'x');
            } else {
                hamburgerIcon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });

        // Close mobile menu when links are clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileDropdown.classList.remove('active');
                hamburgerIcon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    // 3. Active Nav Scroll Spy
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 120;
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // 4. Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const successMsg = document.getElementById('contact-success-msg');
    const sendAnotherBtn = document.getElementById('send-another-btn');
    
    if (contactForm && successMsg) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Send Message';

            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending... <i data-lucide="loader"></i>';
                if (window.lucide) lucide.createIcons();
            }

            const formData = {
                name: document.getElementById('form-name')?.value || '',
                email: document.getElementById('form-email')?.value || '',
                subject: document.getElementById('form-project')?.value || '',
                message: document.getElementById('form-message')?.value || '',
                _subject: `New Portfolio Message from ${document.getElementById('form-name')?.value || 'Visitor'}`,
                _template: 'table',
                _captcha: 'false'
            };

            try {
                const response = await fetch('https://formsubmit.co/ajax/yasithmavinda@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    contactForm.classList.add('hidden');
                    successMsg.classList.remove('hidden');
                    if (window.lucide) {
                        lucide.createIcons();
                    }
                } else {
                    alert('Could not send message. Please try again or email yasithmavinda@gmail.com directly.');
                }
            } catch (err) {
                console.error('Submission error:', err);
                alert('An error occurred. Please try again later.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHtml;
                    if (window.lucide) lucide.createIcons();
                }
            }
        });

        if (sendAnotherBtn) {
            sendAnotherBtn.addEventListener('click', () => {
                successMsg.classList.add('hidden');
                contactForm.classList.remove('hidden');
                contactForm.reset();
            });
        }
    }

    // 5. Project Modal Logic
    const projectDetails = {
        'salon-booking-system': {
            title: 'Salon Booking Management System',
            badge: 'Java & MySQL',
            image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
            duration: 'Academic Project',
            type: 'Desktop Application',
            overview: 'A booking application developed to streamline salon operations and appointment scheduling.',
            highlights: [
                'Worked on the UI (user interface) part of the application.',
                'Designed and implemented the front-end screens for booking and appointment scheduling.',
                'Streamlined salon operations and appointment management flows.'
            ],
            tools: ['Java', 'MySQL', 'UI/UX Design', 'Desktop GUI']
        },
        'console-game-development': {
            title: 'Console-Based Game Development',
            badge: 'C++ Game',
            image: 'images/game_project_bw.png',
            duration: 'Team Project',
            type: 'Console Game',
            overview: 'A console-based game developed with a team, implementing gameplay logic, input handling, and flow control.',
            highlights: [
                'Collaborated with a team to build console-based game mechanics.',
                'Implemented gameplay logic, input handling, and control flow in C++.'
            ],
            tools: ['C++', 'Control Flow', 'Input Handling', 'Team Collaboration']
        },
        'taskora-task-management': {
            title: 'Taskora — Full-Stack Real-Time Task Management System',
            badge: 'Full-Stack & WebSockets',
            image: 'images/taskora_project_bw.png',
            duration: 'Course Module INTE 21323 (5-Person Team)',
            type: 'Full-Stack Web App',
            overview: 'A full-stack, real-time task and project management platform built from scratch for team collaboration. Enables planning, assigning, and tracking tasks with live updates across the whole team — no refreshing or polling, just instant sync over WebSockets the moment something changes. Features include Kanban boards, deadlines, a calendar view, comments, and role-based permissions (Admin, PM, Collaborator).',
            highlights: [
                'Designed and built the database layer — modeled the PostgreSQL schema in Prisma, structured the data relationships for tasks, users, roles, and permissions, and managed the database on Supabase.',
                'Built with React + Vite (frontend), Node.js + Express REST API, Socket.IO (real-time), PostgreSQL on Supabase with Prisma ORM.',
                'Secured with JWT + bcrypt authentication and role-based access control (Admin, PM, Collaborator).',
                'Containerized with Docker, CI/CD via GitHub Actions, deployed live on Render.'
            ],
            githubUrl: 'https://github.com/jayathilakasewmini440-beep/task-management-system',
            screenshots: [
                { src: 'images/taskora-login.png', title: 'Taskora — Login & Workspace Authentication' },
                { src: 'images/taskora-dashboard.png', title: 'Taskora — Workspace Dashboard Overview' },
                { src: 'images/taskora-calendar.png', title: 'Taskora — Interactive Calendar & Deadlines' },
                { src: 'images/taskora-tasks.png', title: 'Taskora — Kanban Task Board & Column Statuses' },
                { src: 'images/taskora-projects.png', title: 'Taskora — Projects Directory & Progress Tracking' },
                { src: 'images/taskora_project_bw.png', title: 'Taskora — Desktop Workspace Mockup' }
            ],
            tools: ['React + Vite', 'Node.js', 'Express', 'Socket.IO', 'PostgreSQL', 'Prisma ORM', 'Supabase', 'JWT + bcrypt', 'Docker', 'GitHub Actions', 'Render']
        },
        'figma-course': {
            title: 'DP Education IT Campus — Figma Course Certificate',
            badge: 'DP Education CERTIFIED',
            image: 'images/figma_certificate.png',
            duration: 'January 29, 2026',
            type: 'Verified Course Certificate',
            isCertificate: true,
            overview: 'Official Certificate of Completion awarded to <strong>Yasith Mavinda</strong> on January 29, 2026 by DP Education IT Campus (Dhammika &amp; Priscilla Perera Foundation) for successfully completing the Figma UI/UX Design Course.',
            highlights: [
                'Successfully passed and verified in the DP Education Figma UI/UX Design Certification Program.',
                'Mastered practical user interface design, wireframing, interactive prototyping, and component design systems.',
                'Signed by CEO Kawshi Amarasinghe (DP Education) &amp; Dhammika &amp; Priscilla Perera Foundation.'
            ],
            tools: ['Figma', 'UI/UX Design', 'Wireframing', 'Interactive Prototyping', 'Design Systems', 'Component Architecture']
        },
        'uom-web-design': {
            title: 'University of Moratuwa — Web Design for Beginners Certificate',
            badge: 'UoM CODL CERTIFIED',
            image: 'images/uom_web_design_certificate.png',
            duration: 'Verified Online Learning Programme',
            type: 'Official University Certificate',
            isCertificate: true,
            overview: 'Official E-Certificate awarded to <strong>Yasith Mavinda</strong> by the <strong>Centre for Open &amp; Distance Learning (CODL)</strong>, Department of Information Technology, Faculty of Information Technology, <strong>University of Moratuwa, Sri Lanka</strong> for successfully completing the <em>Web Design for Beginners</em> online programme.',
            highlights: [
                'Conducted by the Department of Information Technology, Faculty of Information Technology, University of Moratuwa.',
                'Mastered foundational web design concepts, HTML5 structure, CSS styling, responsive layout principles, and web standard compliance.',
                'Official Verification Code: <strong>RQRj3Axv3c</strong> (Verify at <a href="https://open.uom.lk/verify" target="_blank" style="color: #60a5fa; text-decoration: underline;">https://open.uom.lk/verify</a>).'
            ],
            tools: ['HTML5', 'CSS3', 'Web Design', 'Responsive Web Design', 'UI Layouts', 'University of Moratuwa']
        },
        'upgrad-supply-chain': {
            title: 'upGrad — Introduction to Supply Chain Management Certificate',
            badge: 'upGrad CERTIFIED',
            image: 'images/upgrad_supply_chain_certificate.png',
            duration: 'Issued 06 June, 2026',
            type: 'Professional Certification',
            isCertificate: true,
            overview: 'Official Certificate of Completion awarded to <strong>Yasith Mavinda</strong> by <strong>upGrad Education Private Limited</strong> on June 06, 2026 for successfully completing the course on <em>Introduction to Supply Chain Management</em>.',
            highlights: [
                'Gained comprehensive grounding in supply chain strategy, logistics optimization, inventory management, and demand forecasting.',
                'Learned core principles of end-to-end supply chain integration, procurement, vendor management, and distribution networks.',
                'Signed by Mayank Kumar (Co-founder &amp; MD, upGrad). Certificate UID: <strong>0GWEVXZUKCug04WT</strong>.'
            ],
            tools: ['Supply Chain Management', 'Logistics', 'Inventory Control', 'Operations Management', 'upGrad']
        },
        'hp-ai-course': {
            title: 'HP LIFE — AI for Business Professionals Certificate',
            badge: 'HP Foundation CERTIFIED',
            image: 'images/hp_ai_certificate.png',
            duration: 'January 26, 2026',
            type: 'Verified Online Certification',
            isCertificate: true,
            overview: 'Official Certificate of Completion awarded to <strong>Yasith Mavinda</strong> by HP LIFE &amp; HP Foundation for successfully completing the <em>AI for Business Professionals</em> online course. Learned AI\'s strategic role in modern business, standalone vs. integrated AI tools, prompt engineering, ethical AI practices, and leveraging AI for professional growth.',
            highlights: [
                'Learned AI\'s strategic role in business operations, workflow automation, and decision-making.',
                'Mastered effective prompt engineering techniques and ethical considerations for AI deployment.',
                'Signed by Stephanie Bormann (Deputy Director, HP Foundation). Certificate Serial No: 77901867-ed33-4d25-9449-0a3ef8da663d'
            ],
            tools: ['Artificial Intelligence', 'Prompt Engineering', 'Business Strategy', 'Ethical AI', 'HP LIFE', 'Workflow Automation']
        },
        'hp-critical-thinking': {
            title: 'HP LIFE — Critical Thinking in the AI Era Certificate',
            badge: 'HP Foundation CERTIFIED',
            image: 'images/hp_critical_thinking_certificate.png',
            duration: 'January 27, 2026',
            type: 'Verified Online Certification',
            isCertificate: true,
            overview: 'Official Certificate of Completion awarded to <strong>Yasith Mavinda</strong> by HP LIFE &amp; HP Foundation on January 27, 2026 for completing <em>Critical Thinking in the AI Era</em>. Learned how to use critical thinking to make better business decisions, understand AI distortion, counteract biases, and fact-check information.',
            highlights: [
                'Developed critical analysis skills to identify AI-generated content distortions and algorithmic biases in decision-making.',
                'Learned practical tools and techniques for rigorous information fact-checking and strategic data verification.',
                'Signed by Stephanie Bormann (Deputy Director, HP Foundation). Serial No: f0183e64-3b7f-4ac0-9e2e-9376c0a642df'
            ],
            tools: ['Critical Thinking', 'AI Ethics', 'Fact-Checking', 'Bias Mitigation', 'Data Verification', 'HP LIFE']
        },
        'hp-data-science': {
            title: 'HP LIFE — Data Science & Analytics Certificate',
            badge: 'HP Foundation CERTIFIED',
            image: 'images/hp_data_science_certificate.png',
            duration: 'January 31, 2026',
            type: 'Verified Online Certification',
            isCertificate: true,
            overview: 'Official Certificate of Completion awarded to <strong>Yasith Mavinda</strong> by HP LIFE &amp; HP Foundation on January 31, 2026 for successfully completing <em>Data Science &amp; Analytics</em>. Learned leading data science practices, methodologies, analytics tools, and data-driven business strategy.',
            highlights: [
                'Examined benefits and operational challenges of data-driven business strategies and analytical decision frameworks.',
                'Gained knowledge of key data science practices, statistical analytics methodologies, and business intelligence tools.',
                'Signed by Michele Malejki (Executive Director, HP Foundation). Serial No: deff5f2b-6908-406a-9d7a-881676bde851'
            ],
            tools: ['Data Science', 'Data Analytics', 'Business Intelligence', 'Data-Driven Decision Making', 'HP LIFE']
        },
        'english-certificate': {
            title: 'Intermediate English Course Certificate',
            badge: 'Language & Communication',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
            duration: '2024 (10-Week Course)',
            type: 'Academic Certification',
            isCertificate: true,
            overview: 'Comprehensive 10-week intensive English certificate program completed at Kekirawa English Academy focusing on professional business correspondence, technical writing, and public speaking.',
            highlights: [
                'Completed intensive business correspondence and technical communication modules.',
                'Developed public speaking, presentation, and formal reporting skills.',
                'Awarded official certificate upon successful completion of final evaluation.'
            ],
            tools: ['Business English', 'Technical Writing', 'Public Speaking', 'Professional Communication']
        },
        'about-me': {
            title: 'Yasith Mavinda',
            badge: 'BSc (Hons) MIT Undergraduate',
            image: 'images/profile.png',
            duration: 'University of Kelaniya',
            type: 'OSCM & Tech Specialist',
            overview: `I'm Yasith Mavinda, a BSc (Hons) Management and Information Technology (MIT) undergraduate at the University of Kelaniya, focused on Operations and Supply Chain Management (OSCM). I enjoy combining business strategy, design, and technology to build practical, impactful solutions.<br><br>I've worked on projects like a Salon Booking Management System (UI design) and Taskora, a full-stack real-time task management platform where I led the database design. I'm someone who values continuous learning — always looking to sharpen my skills and take on the next challenge.`,
            highlights: [
                'Specialising in Operations &amp; Supply Chain Management (OSCM) at the University of Kelaniya.',
                'Skilled in Business Analysis, Systems Design, UI/UX Wireframing, and Data Analytics.',
                'Completed professional certifications from HP LIFE Foundation, DP Education, and University of Moratuwa.',
                'Passionate about combining technology, business strategy, and analytical problem-solving to build high-impact solutions.'
            ],
            tools: ['OSCM Specialist', 'Systems Analysis', 'Python', 'Figma UI/UX', 'Business Strategy', 'Data Analytics', 'University of Kelaniya']
        }
    };

    const projectModal = document.getElementById('project-modal');
    const modalBackdrop = document.getElementById('project-modal-backdrop');
    const modalBody = document.getElementById('project-modal-body');
    const closeBtn = document.getElementById('close-project-modal');
    const openBtns = document.querySelectorAll('.open-project-btn');

    function openModal(projectId) {
        const details = projectDetails[projectId];
        if (!details || !modalBody || !projectModal) return;

        // Build HTML content for the modal
        let highlightsHtml = '';
        details.highlights.forEach(h => {
            highlightsHtml += `
                <li class="modal-highlight-item">
                    <i data-lucide="check"></i>
                    <span>${h}</span>
                </li>
            `;
        });

        let toolsHtml = '';
        details.tools.forEach(t => {
            toolsHtml += `<span class="modal-tool-badge">${t}</span>`;
        });

        let githubBtnHtml = '';
        if (details.githubUrl) {
            githubBtnHtml = `
                <a href="${details.githubUrl}" target="_blank" rel="noreferrer" class="btn btn-github-repo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon-svg">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    <span>View GitHub Repository</span>
                    <i data-lucide="arrow-up-right"></i>
                </a>
            `;
        }

        let screenshotsBtnHtml = '';
        if (details.screenshots && details.screenshots.length > 0) {
            screenshotsBtnHtml = `
                <button type="button" id="open-screenshots-btn" class="btn btn-screenshots-view">
                    <i data-lucide="images"></i>
                    <span>View App Screenshots (${details.screenshots.length})</span>
                    <i data-lucide="maximize-2"></i>
                </button>
            `;
        }

        let actionsRowHtml = '';
        if (githubBtnHtml || screenshotsBtnHtml) {
            actionsRowHtml = `
                <div class="modal-project-actions-row" style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
                    ${githubBtnHtml}
                    ${screenshotsBtnHtml}
                </div>
            `;
        }

        let certBtnHtml = '';
        if (details.isCertificate) {
            certBtnHtml = `
                <button type="button" id="open-cert-lightbox-btn" class="btn btn-cert-view-btn">
                    <i data-lucide="maximize-2"></i>
                    <span>View Certificate</span>
                </button>
            `;
        }

        if (projectId === 'about-me') {
            modalBody.innerHTML = `
                <div class="modal-split-layout about-modal-split">
                    <div class="modal-left-col about-modal-left text-center">
                        <div class="about-modal-avatar-container">
                            <div class="about-modal-avatar-ring">
                                <img src="${details.image}" alt="${details.title}" class="about-modal-avatar-img">
                            </div>
                            <span class="about-modal-status-badge">
                                <span class="status-pulse-dot"></span>
                                MIT Undergraduate
                            </span>
                        </div>
                        
                        <h3 class="about-modal-name">${details.title}</h3>
                        <p class="about-modal-tagline">BSc (Hons) MIT Student</p>
                        
                        <div class="about-modal-meta-list">
                            <div class="about-meta-chip">
                                <i data-lucide="graduation-cap"></i>
                                <span>University of Kelaniya</span>
                            </div>
                            <div class="about-meta-chip">
                                <i data-lucide="award"></i>
                                <span>OSCM &amp; Tech Specialist</span>
                            </div>
                            <div class="about-meta-chip">
                                <i data-lucide="map-pin"></i>
                                <span>Ampara, Sri Lanka</span>
                            </div>
                        </div>

                        <div class="about-modal-actions">
                            <a href="https://www.linkedin.com/in/yasith-mavinda-484a08352/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B1y82rL96R2KiBOh8vO5f0w%3D%3D" target="_blank" rel="noreferrer" class="btn btn-sm btn-solid-blue">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon-svg">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                    <rect x="2" y="9" width="4" height="12" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                                <span>LinkedIn</span>
                            </a>
                            <a href="https://wa.me/94769055019" target="_blank" rel="noreferrer" class="btn btn-sm btn-outline-blue">
                                <i data-lucide="message-circle"></i>
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    <div class="modal-right-col about-modal-right">
                        <span class="modal-project-badge">${details.badge}</span>
                        <h3 class="modal-project-title">${details.title}</h3>
                        
                        <div class="project-stats-row mb-4">
                            <div class="project-stat-item">
                                <i data-lucide="clock"></i>
                                <span>${details.duration}</span>
                            </div>
                            <div class="project-stat-item">
                                <i data-lucide="tag"></i>
                                <span>${details.type}</span>
                            </div>
                        </div>

                        <h4 class="modal-section-title">
                            <i data-lucide="user"></i>
                            About Me
                        </h4>
                        <p class="modal-project-overview">${details.overview}</p>

                        <h4 class="modal-section-title">
                            <i data-lucide="check-circle-2"></i>
                            Key Highlights
                        </h4>
                        <ul class="modal-highlights-list mb-4">
                            ${highlightsHtml}
                        </ul>

                        <h4 class="modal-section-title">
                            <i data-lucide="cpu"></i>
                            Skills &amp; Expertise
                        </h4>
                        <div class="modal-tools-grid">
                            ${toolsHtml}
                        </div>
                    </div>
                </div>
            `;
        } else {
            modalBody.innerHTML = `
                <div class="modal-split-layout">
                    <div class="modal-left-col text-center">
                        <div class="modal-img-container" style="position: relative; cursor: pointer;" id="cert-img-wrapper">
                            <img src="${details.image}" alt="${details.title}" class="modal-split-img">
                        </div>
                        ${certBtnHtml}
                    </div>
                    <div class="modal-right-col">
                        <span class="modal-project-badge">${details.badge}</span>
                        <h3 class="modal-project-title">${details.title}</h3>
                        
                        <div class="project-stats-row mb-4">
                            <div class="project-stat-item">
                                <i data-lucide="clock"></i>
                                <span>${details.duration}</span>
                            </div>
                            <div class="project-stat-item">
                                <i data-lucide="tag"></i>
                                <span>${details.type}</span>
                            </div>
                        </div>

                        <h4 class="modal-section-title">Overview</h4>
                        <p class="modal-project-overview">${details.overview}</p>

                        <h4 class="modal-section-title">Key Details &amp; Highlights</h4>
                        <ul class="modal-highlights-list mb-4">
                            ${highlightsHtml}
                        </ul>

                        <h4 class="modal-section-title">Tools &amp; Tech Stack</h4>
                        <div class="modal-tools-grid">
                            ${toolsHtml}
                        </div>
                        ${actionsRowHtml}
                    </div>
                </div>
            `;
        }

        // Attach listener for View Certificate / View Image lightbox
        const openCertBtn = document.getElementById('open-cert-lightbox-btn');
        const certImgWrapper = document.getElementById('cert-img-wrapper');
        const triggerCertLightbox = () => {
            if (details.screenshots && details.screenshots.length > 0) {
                openLightbox(details.screenshots, 0);
            } else {
                openLightbox([{ src: details.image, title: details.title }], 0);
            }
        };

        if (openCertBtn) openCertBtn.addEventListener('click', triggerCertLightbox);
        if (certImgWrapper) certImgWrapper.addEventListener('click', triggerCertLightbox);

        // Attach listener to Screenshots Button if available
        const openScreenshotsBtn = document.getElementById('open-screenshots-btn');
        if (openScreenshotsBtn && details.screenshots) {
            openScreenshotsBtn.addEventListener('click', () => {
                openLightbox(details.screenshots, 0);
            });
        }

        projectModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Stop scroll under modal

        // Initialize Lucide icons inside the modal
        if (window.lucide) {
            lucide.createIcons();
        }
    }

    function closeModal() {
        if (!projectModal) return;
        projectModal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Re-enable scroll
    }

    // 6. Lightbox Gallery Engine
    let currentGallery = [];
    let currentGalleryIndex = 0;

    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');
    const closeLightboxBtn = document.getElementById('close-lightbox-modal');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxMainImg = document.getElementById('lightbox-main-img');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxThumbs = document.getElementById('lightbox-thumbs');

    function updateLightboxDisplay() {
        if (!currentGallery || currentGallery.length === 0) return;
        const item = currentGallery[currentGalleryIndex];
        if (lightboxMainImg) {
            lightboxMainImg.src = item.src;
            lightboxMainImg.alt = item.title || 'App Screenshot';
        }
        if (lightboxTitle) {
            lightboxTitle.textContent = item.title || 'App Screenshot';
        }
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${currentGallery.length}`;
        }

        if (lightboxThumbs) {
            const thumbs = lightboxThumbs.querySelectorAll('.lightbox-thumb');
            thumbs.forEach((t, idx) => {
                if (idx === currentGalleryIndex) {
                    t.classList.add('active');
                } else {
                    t.classList.remove('active');
                }
            });
        }
    }

    function openLightbox(imagesList, startIndex = 0) {
        if (!lightboxModal || !imagesList || imagesList.length === 0) return;
        currentGallery = imagesList;
        currentGalleryIndex = startIndex;

        if (lightboxThumbs) {
            lightboxThumbs.innerHTML = '';
            currentGallery.forEach((img, idx) => {
                const thumb = document.createElement('img');
                thumb.src = img.src;
                thumb.alt = img.title || 'Thumbnail';
                thumb.className = `lightbox-thumb ${idx === startIndex ? 'active' : ''}`;
                thumb.addEventListener('click', () => {
                    currentGalleryIndex = idx;
                    updateLightboxDisplay();
                });
                lightboxThumbs.appendChild(thumb);
            });
        }

        updateLightboxDisplay();
        lightboxModal.classList.remove('hidden');

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.add('hidden');
    }

    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', closeLightbox);
    }
    if (lightboxBackdrop) {
        lightboxBackdrop.addEventListener('click', closeLightbox);
    }
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            currentGalleryIndex = (currentGalleryIndex - 1 + currentGallery.length) % currentGallery.length;
            updateLightboxDisplay();
        });
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            currentGalleryIndex = (currentGalleryIndex + 1) % currentGallery.length;
            updateLightboxDisplay();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightboxModal || lightboxModal.classList.contains('hidden')) return;
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            if (lightboxPrev) lightboxPrev.click();
        } else if (e.key === 'ArrowRight') {
            if (lightboxNext) lightboxNext.click();
        }
    });

    // Attach click events to open buttons
    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-project');
            openModal(id);
        });
    });

    // Attach click events to logo branding for About Me popup
    const logoBtns = document.querySelectorAll('.logo');
    logoBtns.forEach(logo => {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('about-me');
        });
    });

    // Close on X click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on backdrop click
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // 5. 3D Stacked Carousel Controller (Certificates)
    const stackedCards = document.querySelectorAll('.stacked-card');
    const dragSurface = document.getElementById('stacked-drag-surface');
    const prevBtn = document.getElementById('stacked-prev-btn');
    const nextBtn = document.getElementById('stacked-next-btn');
    const dotsContainer = document.getElementById('stacked-dots');

    if (stackedCards.length > 0) {
        let currentIndex = 0;
        const totalCards = stackedCards.length;

        // Render indicator dots
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalCards; i++) {
                const dot = document.createElement('div');
                dot.className = `stacked-dot ${i === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        function updateStackedCards() {
            const isMobile = window.innerWidth < 640;
            const xMultiplier = isMobile ? 80 : 160;
            const yMultiplier = isMobile ? 15 : 30;
            const rotateMultiplier = isMobile ? 6 : 10;
            const scaleReduction = isMobile ? 0.08 : 0.12;

            stackedCards.forEach((card, index) => {
                let offset = (index - currentIndex) % totalCards;
                if (offset > totalCards / 2) offset -= totalCards;
                if (offset < -totalCards / 2) offset += totalCards;

                const x = offset * xMultiplier;
                const y = Math.abs(offset) * yMultiplier;
                const rotate = offset * rotateMultiplier;
                const scale = 1 - Math.abs(offset) * scaleReduction;
                const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.25;
                const zIndex = Math.round(100 - Math.abs(offset) * 10);

                card.style.transform = `translate3d(${x}px, ${y}px, 0px) rotate(${rotate}deg) scale(${scale})`;
                card.style.opacity = opacity;
                card.style.zIndex = zIndex;
                card.style.pointerEvents = offset === 0 ? 'auto' : 'none';
            });

            // Update dots
            const dots = document.querySelectorAll('.stacked-dot');
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = (index + totalCards) % totalCards;
            updateStackedCards();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Touch & Mouse Drag / Swipe
        let startX = 0;
        let isDragging = false;

        if (dragSurface) {
            dragSurface.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const diffX = e.clientX - startX;
                if (Math.abs(diffX) > 50) {
                    if (diffX < 0) nextSlide();
                    else prevSlide();
                    isDragging = false;
                }
            });

            window.addEventListener('mouseup', () => {
                isDragging = false;
            });

            // Touch events for mobile
            dragSurface.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });

            dragSurface.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const diffX = endX - startX;
                if (Math.abs(diffX) > 40) {
                    if (diffX < 0) nextSlide();
                    else prevSlide();
                }
            }, { passive: true });
        }

        // Initialize positions
        updateStackedCards();
        window.addEventListener('resize', updateStackedCards);
    }

    // 7. Certificates See More / See Less Toggle
    const seeMoreCertsBtn = document.getElementById('see-more-certs-btn');
    const extraCerts = document.querySelectorAll('.certificate-extra');

    if (seeMoreCertsBtn && extraCerts.length > 0) {
        let isCertsExpanded = false;

        seeMoreCertsBtn.addEventListener('click', () => {
            isCertsExpanded = !isCertsExpanded;

            extraCerts.forEach(cert => {
                if (isCertsExpanded) {
                    cert.classList.remove('certificate-hidden');
                } else {
                    cert.classList.add('certificate-hidden');
                }
            });

            const btnText = seeMoreCertsBtn.querySelector('.btn-text');
            const btnIcon = seeMoreCertsBtn.querySelector('i');

            if (btnText) {
                btnText.textContent = isCertsExpanded ? 'See Less' : 'See More';
            }

            if (btnIcon) {
                btnIcon.setAttribute('data-lucide', isCertsExpanded ? 'chevron-up' : 'chevron-down');
                if (window.lucide) {
                    lucide.createIcons();
                }
            }
        });
    }

    // 7.5 Skills See More / See Less Toggle
    const seeMoreSkillsBtn = document.getElementById('see-more-skills-btn');
    const extraSkills = document.querySelectorAll('.skill-card-extra');

    if (seeMoreSkillsBtn && extraSkills.length > 0) {
        let isSkillsExpanded = false;

        seeMoreSkillsBtn.addEventListener('click', () => {
            isSkillsExpanded = !isSkillsExpanded;

            extraSkills.forEach(skillCard => {
                if (isSkillsExpanded) {
                    skillCard.classList.remove('skill-card-hidden');
                } else {
                    skillCard.classList.add('skill-card-hidden');
                }
            });

            const btnText = seeMoreSkillsBtn.querySelector('.btn-text');
            const btnIcon = seeMoreSkillsBtn.querySelector('i');

            if (btnText) {
                btnText.textContent = isSkillsExpanded ? 'See Less' : 'See More';
            }

            if (btnIcon) {
                btnIcon.setAttribute('data-lucide', isSkillsExpanded ? 'chevron-up' : 'chevron-down');
                if (window.lucide) {
                    lucide.createIcons();
                }
            }
        });
    }

    // 8. Request CV Modal Handling
    window.openRequestCvModal = function(e) {
        if (e) e.preventDefault();
        const requestCvModal = document.getElementById('request-cv-modal');
        const requestCvForm = document.getElementById('request-cv-form');
        const successMsg = document.getElementById('request-cv-success-msg');
        const formHeader = document.querySelector('#request-cv-modal .cv-modal-header');

        if (requestCvModal) {
            if (requestCvForm) requestCvForm.classList.remove('hidden');
            if (formHeader) formHeader.classList.remove('hidden');
            if (successMsg) successMsg.classList.add('hidden');

            requestCvModal.classList.remove('hidden');
            requestCvModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (window.lucide) {
                lucide.createIcons();
            }
        }
    };

    window.closeRequestCvModal = function() {
        const requestCvModal = document.getElementById('request-cv-modal');
        if (requestCvModal) {
            requestCvModal.classList.add('hidden');
            requestCvModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    };

    // Document-level click event delegation for Request CV buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.request-cv-btn');
        if (btn) {
            window.openRequestCvModal(e);
        }
    });

    const requestCvBackdrop = document.getElementById('cv-modal-backdrop');
    const closeCvModalBtn = document.getElementById('close-cv-modal-btn');
    const cancelCvModalBtn = document.getElementById('cancel-cv-modal-btn');
    const requestCvForm = document.getElementById('request-cv-form');

    if (closeCvModalBtn) {
        closeCvModalBtn.addEventListener('click', window.closeRequestCvModal);
    }
    if (cancelCvModalBtn) {
        cancelCvModalBtn.addEventListener('click', window.closeRequestCvModal);
    }
    if (requestCvBackdrop) {
        requestCvBackdrop.addEventListener('click', window.closeRequestCvModal);
    }

    document.addEventListener('keydown', (e) => {
        const requestCvModal = document.getElementById('request-cv-modal');
        if (e.key === 'Escape' && requestCvModal && !requestCvModal.classList.contains('hidden')) {
            window.closeRequestCvModal();
        }
    });

    if (requestCvForm) {
        requestCvForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = requestCvForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'Send Email Request';

            const name = document.getElementById('cv-req-name')?.value.trim() || 'Colleague';
            const email = document.getElementById('cv-req-email')?.value.trim() || '';
            const message = document.getElementById('cv-req-message')?.value.trim() || 'Requesting CV';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending Request...</span> <i data-lucide="loader"></i>';
                if (window.lucide) lucide.createIcons();
            }

            const publicCvUrl = 'https://yasithmavinda.github.io/assets/Yasith_Mavinda_CV.pdf';
            const gmailComposeLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent('Yasith Mavinda - Requested CV')}&body=${encodeURIComponent(`Hi ${name},\n\nThank you for reaching out and requesting my CV!\n\nYou can view and download my CV directly at:\n${publicCvUrl}\n\nPlease feel free to contact me if you have any questions.\n\nBest regards,\nYasith Mavinda\nBSc (Hons) MIT Undergraduate`)}`;

            const formData = {
                "Requester_Name": name,
                "Requester_Email": email,
                "Message_Reason": message,
                "Click_To_Send_CV": gmailComposeLink,
                "_replyto": email,
                "_subject": `📄 CV Request from ${name}`,
                "_autoresponse": `Hi ${name},\n\nThank you for requesting my CV!\n\nYou can view and download my CV using the link below:\n${publicCvUrl}\n\nBest regards,\nYasith Mavinda\nBSc (Hons) MIT Undergraduate`,
                "_template": "table",
                "_captcha": "false"
            };

            try {
                await fetch('https://formsubmit.co/ajax/yasithmavinda@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            } catch (err) {
                console.log('FormSubmit request notice:', err);
            }



            // Show success screen in modal
            const successMsg = document.getElementById('request-cv-success-msg');
            const formHeader = document.querySelector('#request-cv-modal .cv-modal-header');

            requestCvForm.classList.add('hidden');
            if (formHeader) formHeader.classList.add('hidden');
            if (successMsg) successMsg.classList.remove('hidden');
            if (window.lucide) lucide.createIcons();

            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
            }
        });
    }
});



