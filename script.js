// State Management
const state = {
    currentSection: 'home',
    isMenuOpen: false,
    isDarkMode: true
};

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker başarıyla kaydedildi:', registration);
            })
            .catch(error => {
                console.log('Service Worker kaydı başarısız:', error);
            });
    });
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initSidebar();
    initTypewriter();
    initTerminal();
    initCodeRain();
    initMorphingShapes();
    initScrollAnimations();
    initProjectInteractions();
    initCodeEditorInteractions();
    initSkillTagAnimations();
    initSkillModal();
    initStarCounters();
    initScrollSectionTransition();
    initProjectModal();
    initScrollProgress();
    initContactForm();
    initParticleEffects();
    initScrollReveal();
    initInteractiveHovers();
    initFormAnimations();
    setActiveSection('home');
});

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            setActiveSection(target);
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Sidebar Navigation
function initSidebar() {
    const folderItems = document.querySelectorAll('.folder-item');
    
    folderItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            setActiveSection(section);
        });
    });

    // Scroll-based sidebar update
    const sections = document.querySelectorAll('.content-section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                setActiveSection(sectionId);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// Set Active Section
function setActiveSection(sectionId) {
    // Update state
    state.currentSection = sectionId;

    // Get all sections
    const allSections = document.querySelectorAll('.content-section');
    const targetSection = document.getElementById(sectionId);
    
    if (!targetSection) return;

    // Exit current section smoothly
    allSections.forEach(section => {
        if (section.classList.contains('active')) {
            section.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            section.style.opacity = '0';
            section.style.transform = 'translateY(-10px) scale(0.98)';
            
            setTimeout(() => {
                section.classList.remove('active');
                section.style.transition = '';
            }, 200);
        }
    });

    // Enter new section smoothly
    setTimeout(() => {
        targetSection.style.opacity = '0';
        targetSection.style.transform = 'translateY(10px) scale(0.98)';
        targetSection.classList.add('active');
        
        requestAnimationFrame(() => {
            targetSection.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0) scale(1)';
        });
    }, 200);

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Update sidebar with correct folder icons
    document.querySelectorAll('.folder-item').forEach(item => {
        const icon = item.querySelector('i');
        item.classList.remove('active');
        
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
            // Change icon to open folder
            if (icon) {
                icon.classList.remove('fa-folder');
                icon.classList.add('fa-folder-open');
            }
        } else {
            // Change icon to closed folder
            if (icon) {
                icon.classList.remove('fa-folder-open');
                icon.classList.add('fa-folder');
            }
        }
    });

    // Update breadcrumb
    updateBreadcrumb(sectionId);
}

// Update Breadcrumb
function updateBreadcrumb(sectionId) {
    const breadcrumbs = document.querySelectorAll('.breadcrumb');
    breadcrumbs.forEach(breadcrumb => {
        const lastSpan = breadcrumb.querySelector('span:last-child');
        if (lastSpan) {
            lastSpan.textContent = sectionId;
        }
    });
}

// Typewriter Effect
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;

    const texts = [
        'Hello, World!',
        'Building with Code',
        'Creating Solutions',
        'Crafting Experiences'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.project-item, .skill-category, .contact-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in-up', 'visible');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });
}

// Project Interactions
function initProjectInteractions() {
    const projects = document.querySelectorAll('.project-item');
    
    projects.forEach(project => {
        project.style.cursor = 'pointer';
        
        project.addEventListener('mouseenter', () => {
            project.style.transform = 'translateY(-4px) scale(1.01)';
        });

        project.addEventListener('mouseleave', () => {
            project.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Project Modal
function initProjectModal() {
    const projects = document.querySelectorAll('.project-item');
    const modal = document.getElementById('projectModal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    const modalTitle = document.getElementById('modalProjectName');
    const modalDesc = document.getElementById('modalProjectDesc');
    const modalTech = document.getElementById('modalProjectTech');
    const modalStars = document.getElementById('modalProjectStars');
    const modalCommits = document.getElementById('modalProjectCommits');
    const modalViews = document.getElementById('modalProjectViews');
    const modalWikiLink = document.getElementById('modalProjectWikiLink');

    // Project data with detailed tech descriptions
    const projectData = {
        '1': {
            name: 'CodeCollab',
            desc: 'Gerçek zamanlı kod editörü ve işbirliği platformu. Ekip üyeleri aynı anda kod yazabilir, değişiklikleri anlık görüntüleyebilir ve yorum ekleyebilir. WebSocket tabanlı gerçek zamanlı senkronizasyon, syntax highlighting, otomatik kaydetme ve versiyon kontrol entegrasyonu özellikleri içerir.',
            tech: [
                { name: 'React', desc: 'Kullanıcı arayüzü için modern ve reaktif bir JavaScript kütüphanesi. Component tabanlı yapısı sayesinde kod tekrarını azaltır ve bakımı kolaylaştırır.' },
                { name: 'Node.js', desc: 'Sunucu tarafı JavaScript runtime ortamı. Asenkron I/O ve event-driven mimarisi ile yüksek performanslı uygulamalar geliştirmeye olanak sağlar.' },
                { name: 'MongoDB', desc: 'NoSQL veritabanı sistemi. Esnek şema yapısı ve horizontal scaling özellikleri ile büyük ölçekli uygulamalar için idealdir.' },
                { name: 'Socket.io', desc: 'Gerçek zamanlı, bidirectional ve event-based iletişim kütüphanesi. WebSocket protokolü üzerinde çalışarak düşük gecikme süreli veri aktarımı sağlar.' },
                { name: 'Express', desc: 'Minimal ve esnek Node.js web uygulama framework\'ü. RESTful API geliştirmek için hızlı ve kolay bir yol sunar.' }
            ],
            stars: 342,
            commits: 127,
            views: '12.5k',
            wiki: 'https://en.wikipedia.org/wiki/Web_application'
        },
        '2': {
            name: 'MicroFlow Engine',
            desc: 'Mikroservis mimarisi için ölçeklenebilir backend motoru. Yüksek kullanılabilirlik, otomatik yük dengeleme ve container orchestration özellikleri ile enterprise seviyesinde uygulamalar için tasarlandı. Service discovery, circuit breaker pattern ve distributed tracing desteği içerir.',
            tech: [
                { name: 'Python', desc: 'Yüksek seviyeli, genel amaçlı programlama dili. Okunabilir sözdizimi ve zengin kütüphane ekosistemi ile hızlı geliştirme imkanı sunar.' },
                { name: 'Docker', desc: 'Containerization platformu. Uygulamaları izole ortamlarda çalıştırarak tutarlılık ve taşınabilirlik sağlar.' },
                { name: 'PostgreSQL', desc: 'Güçlü, açık kaynaklı ilişkisel veritabanı. ACID uyumluluğu, gelişmiş indeksleme ve JSON desteği ile enterprise uygulamalar için idealdir.' },
                { name: 'Kubernetes', desc: 'Container orchestration platformu. Otomatik ölçeklendirme, self-healing ve service discovery özellikleri ile mikroservis mimarilerini yönetmeyi kolaylaştırır.' },
                { name: 'Redis', desc: 'In-memory veri yapısı deposu. Cache, session storage ve message broker olarak kullanılabilir. Yüksek performanslı veri erişimi sağlar.' }
            ],
            stars: 228,
            commits: 89,
            views: '8.9k',
            wiki: 'https://en.wikipedia.org/wiki/Microservices'
        },
        '3': {
            name: 'DesignSystem Pro',
            desc: 'Mobil öncelikli, erişilebilir tasarım sistemi ve UI component kütüphanesi. WCAG 2.1 AA standartlarına uyumlu, cross-browser uyumlu ve responsive component\'ler içerir. Storybook entegrasyonu ile component dokümantasyonu ve test ortamı sağlar.',
            tech: [
                { name: 'Vue.js', desc: 'Progressive JavaScript framework. Reaktif veri bağlama ve component sistemi ile interaktif kullanıcı arayüzleri geliştirmeyi kolaylaştırır.' },
                { name: 'SCSS', desc: 'CSS preprocessor. Değişkenler, nesting, mixin\'ler ve fonksiyonlar ile daha organize ve bakımı kolay stil kodları yazmayı sağlar.' },
                { name: 'Webpack', desc: 'Module bundler. JavaScript, CSS ve diğer asset\'leri optimize ederek production-ready bundle\'lar oluşturur.' },
                { name: 'Jest', desc: 'JavaScript test framework. Unit test, integration test ve snapshot test özellikleri ile kod kalitesini artırır.' },
                { name: 'Storybook', desc: 'UI component geliştirme ve test ortamı. Component\'leri izole ortamda görselleştirip test etmeyi sağlar.' }
            ],
            stars: 156,
            commits: 45,
            views: '4.5k',
            wiki: 'https://en.wikipedia.org/wiki/Responsive_web_design'
        },
        '4': {
            name: 'TaskFlow Pro',
            desc: 'Ekip işbirliği odaklı görev yönetim platformu. Gerçek zamanlı güncellemeler, kanban board, sprint planlama, zaman takibi ve detaylı raporlama özellikleri içerir. Slack, GitHub ve Jira gibi popüler araçlarla entegrasyon desteği sunar.',
            tech: [
                { name: 'Next.js', desc: 'React tabanlı full-stack framework. Server-side rendering, static site generation ve API routes ile performanslı web uygulamaları geliştirmeyi sağlar.' },
                { name: 'Prisma', desc: 'Modern ORM (Object-Relational Mapping) aracı. Type-safe veritabanı sorguları ve otomatik migration desteği ile veritabanı yönetimini kolaylaştırır.' },
                { name: 'WebSocket', desc: 'Full-duplex iletişim protokolü. Sunucu ve istemci arasında gerçek zamanlı, iki yönlü veri aktarımı sağlar.' },
                { name: 'TypeScript', desc: 'JavaScript\'e tip güvenliği ekleyen programlama dili. Compile-time hata yakalama ve daha iyi IDE desteği sağlar.' },
                { name: 'Tailwind CSS', desc: 'Utility-first CSS framework. Hızlı UI geliştirme için hazır utility class\'ları ile responsive ve modern tasarımlar oluşturmayı kolaylaştırır.' }
            ],
            stars: 467,
            commits: 124,
            views: '21.3k',
            wiki: 'https://en.wikipedia.org/wiki/Project_management_software'
        },
        '5': {
            name: 'CloudSync Secure',
            desc: 'Uçtan uca şifrelemeli dosya senkronizasyon servisi. Güvenli bulut depolama çözümü, otomatik yedekleme, versiyon kontrolü ve dosya paylaşım özellikleri içerir. Zero-knowledge encryption ile kullanıcı verilerinin gizliliğini garanti eder.',
            tech: [
                { name: 'FastAPI', desc: 'Modern, hızlı Python web framework. Otomatik API dokümantasyonu, async/await desteği ve yüksek performans ile RESTful API geliştirmeyi hızlandırır.' },
                { name: 'Redis', desc: 'In-memory veri yapısı deposu. Cache, session storage ve message broker olarak kullanılabilir. Yüksek performanslı veri erişimi sağlar.' },
                { name: 'AWS S3', desc: 'Amazon Web Services object storage servisi. Ölçeklenebilir, güvenilir ve düşük maliyetli dosya depolama çözümü.' },
                { name: 'PostgreSQL', desc: 'Güçlü, açık kaynaklı ilişkisel veritabanı. ACID uyumluluğu, gelişmiş indeksleme ve JSON desteği ile enterprise uygulamalar için idealdir.' },
                { name: 'Docker', desc: 'Containerization platformu. Uygulamaları izole ortamlarda çalıştırarak tutarlılık ve taşınabilirlik sağlar.' }
            ],
            stars: 589,
            commits: 231,
            views: '35.7k',
            wiki: 'https://en.wikipedia.org/wiki/Cloud_storage'
        },
        '6': {
            name: 'DevTools Suite',
            desc: 'Geliştiriciler için kapsamlı araç koleksiyonu. Kod formatlama, API test, veritabanı yönetimi, JSON/XML dönüştürücü, regex tester, color picker ve daha fazlası. Electron tabanlı desktop uygulaması olarak çalışır ve offline kullanım desteği sunar.',
            tech: [
                { name: 'Electron', desc: 'Cross-platform desktop uygulama framework. Web teknolojileri (HTML, CSS, JavaScript) kullanarak masaüstü uygulamaları geliştirmeyi sağlar.' },
                { name: 'React', desc: 'Kullanıcı arayüzü için modern ve reaktif bir JavaScript kütüphanesi. Component tabanlı yapısı sayesinde kod tekrarını azaltır ve bakımı kolaylaştırır.' },
                { name: 'SQLite', desc: 'Hafif, dosya tabanlı ilişkisel veritabanı. Kurulum gerektirmez ve küçük-orta ölçekli uygulamalar için idealdir.' },
                { name: 'Node.js', desc: 'Sunucu tarafı JavaScript runtime ortamı. Asenkron I/O ve event-driven mimarisi ile yüksek performanslı uygulamalar geliştirmeye olanak sağlar.' },
                { name: 'Material-UI', desc: 'React için hazır component kütüphanesi. Google Material Design prensiplerine uygun, modern ve erişilebilir UI component\'leri sağlar.' }
            ],
            stars: 824,
            commits: 218,
            views: '18.2k',
            wiki: 'https://en.wikipedia.org/wiki/Software_development_tool'
        }
    };

    // Open modal on project click
    projects.forEach(projectElement => {
        projectElement.addEventListener('click', () => {
            // Confetti ekle
            const rect = projectElement.getBoundingClientRect();
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    createConfetti(
                        rect.left + rect.width / 2 + (Math.random() - 0.5) * 100,
                        rect.top
                    );
                }, i * 50);
            }
            
            const projectId = projectElement.getAttribute('data-project');
            const projectInfo = projectData[projectId];
            
            if (projectInfo) {
                modalTitle.textContent = projectInfo.name;
                modalDesc.textContent = projectInfo.desc;
                modalStars.textContent = projectInfo.stars;
                modalCommits.textContent = projectInfo.commits;
                modalViews.textContent = projectInfo.views;
                modalWikiLink.href = projectInfo.wiki;
                
                // Clear and populate tech tags with descriptions
                modalTech.innerHTML = '';
                projectInfo.tech.forEach(techItem => {
                    const techName = typeof techItem === 'string' ? techItem : techItem.name;
                    const techDesc = typeof techItem === 'object' ? techItem.desc : '';
                    
                    const techContainer = document.createElement('div');
                    techContainer.className = 'tech-item-container';
                    
                    const tag = document.createElement('span');
                    tag.className = 'modal-tech-tag';
                    tag.textContent = techName;
                    tag.title = techDesc;
                    
                    if (techDesc) {
                        tag.addEventListener('mouseenter', () => {
                            showTechTooltip(tag, techDesc);
                        });
                        tag.addEventListener('mouseleave', () => {
                            hideTechTooltip();
                        });
                    }
                    
                    techContainer.appendChild(tag);
                    modalTech.appendChild(techContainer);
                });
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Tech tooltip functions
    let tooltip = null;
    function showTechTooltip(element, text) {
        hideTechTooltip();
        tooltip = document.createElement('div');
        tooltip.className = 'tech-tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        });
    }

    function hideTechTooltip() {
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(5px)';
            setTimeout(() => {
                if (tooltip && tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
                tooltip = null;
            }, 200);
        }
    }
}

// Scroll to Section
function scrollToSection(sectionId) {
    // Disable scroll transition temporarily
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => {
        s.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
    
    setActiveSection(sectionId);
    
    // Ensure section is visible
    setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0) scale(1)';
        }
    }, 50);
}

// Make scrollToSection global
window.scrollToSection = scrollToSection;

// Code Rain Animation
function initCodeRain() {
    const canvas = document.getElementById('codeRain');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const codeChars = '01{}[]()<>;:,.+-*/=!@#$%^&*_|\\/"\'`~';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(88, 166, 255, 0.3)';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = codeChars[Math.floor(Math.random() * codeChars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillText(text, x, y);
            
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 50);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Morphing Shapes Scroll Animation
function initMorphingShapes() {
    const shapes = document.querySelectorAll('.morph-shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3;
            shape.style.transform = `translate(${Math.sin(rate * speed) * 50}px, ${Math.cos(rate * speed) * 50}px) rotate(${rate * speed}deg)`;
        });
    });
}

// Code Editor Interactions
function initCodeEditorInteractions() {
    const codeLines = document.querySelectorAll('.code-line');
    
    codeLines.forEach((line, index) => {
        line.addEventListener('mouseenter', () => {
            line.style.transform = 'translateX(10px)';
            line.style.background = 'rgba(88, 166, 255, 0.15)';
        });
        
        line.addEventListener('mouseleave', () => {
            line.style.transform = 'translateX(0)';
            line.style.background = 'transparent';
        });
    });
}

// Skill Tag Animations
function initSkillTagAnimations() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach((tag, index) => {
        tag.style.cursor = 'pointer';
        
        tag.addEventListener('mouseenter', () => {
            tag.style.animation = 'skillPulse 0.5s ease';
        });
        
        // Stagger animation on load
        setTimeout(() => {
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0.8)';
            tag.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'scale(1)';
            }, index * 50);
        }, 100);
    });
}

// Skill Modal with Info
function initSkillModal() {
    const skillTags = document.querySelectorAll('.skill-tag');
    const modal = document.getElementById('skillModal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    const modalTitle = document.getElementById('modalSkillName');
    const modalDescription = document.getElementById('modalDescription');
    const modalWikiLink = document.getElementById('modalWikiLink');

    // Skill data with descriptions and Wikipedia links
    const skillData = {
        'react': {
            name: 'React',
            description: 'React, kullanıcı arayüzü oluşturmak için kullanılan açık kaynaklı bir JavaScript kütüphanesidir. Facebook tarafından geliştirilmiştir ve component-based mimarisi ile modern web uygulamaları geliştirmeyi kolaylaştırır. Virtual DOM kullanarak yüksek performans sağlar.',
            wiki: 'https://en.wikipedia.org/wiki/React_(JavaScript_library)'
        },
        'vue': {
            name: 'Vue.js',
            description: 'Vue.js, ilerici bir JavaScript framework\'üdür. Kullanıcı arayüzleri oluşturmak için kullanılır. Öğrenmesi kolay, esnek ve performanslı bir yapıya sahiptir. Tek dosya component\'leri ve reaktif veri bağlama özellikleri ile öne çıkar.',
            wiki: 'https://en.wikipedia.org/wiki/Vue.js'
        },
        'ts': {
            name: 'TypeScript',
            description: 'TypeScript, Microsoft tarafından geliştirilen, JavaScript\'e tip güvenliği ekleyen bir programlama dilidir. Büyük ölçekli uygulamalarda hata ayıklamayı kolaylaştırır ve daha iyi IDE desteği sağlar.',
            wiki: 'https://en.wikipedia.org/wiki/TypeScript'
        },
        'scss': {
            name: 'SCSS',
            description: 'SCSS (Sassy CSS), CSS\'in bir preprocessor\'ıdır. Değişkenler, nesting, mixin\'ler ve fonksiyonlar gibi özellikler sunarak CSS yazmayı daha verimli hale getirir.',
            wiki: 'https://en.wikipedia.org/wiki/Sass_(stylesheet_language)'
        },
        'webpack': {
            name: 'Webpack',
            description: 'Webpack, modern JavaScript uygulamaları için bir modül paketleyicisidir. Dosyaları birleştirir, optimize eder ve production-ready bundle\'lar oluşturur.' },
        'node': {
            name: 'Node.js',
            description: 'Node.js, Chrome\'un V8 JavaScript motoru üzerine kurulu, sunucu tarafında JavaScript çalıştırmayı sağlayan bir runtime ortamıdır. Asenkron ve event-driven mimarisi ile yüksek performanslı uygulamalar geliştirmeye olanak tanır.',
            wiki: 'https://en.wikipedia.org/wiki/Node.js'
        },
        'python': {
            name: 'Python',
            description: 'Python, yüksek seviyeli, genel amaçlı bir programlama dilidir. Okunabilir sözdizimi ve güçlü kütüphaneleri ile web geliştirme, veri bilimi, yapay zeka ve otomasyon gibi birçok alanda kullanılır.',
            wiki: 'https://en.wikipedia.org/wiki/Python_(programming_language)'
        },
        'express': {
            name: 'Express',
            description: 'Express.js, Node.js için minimal ve esnek bir web uygulama framework\'üdür. RESTful API\'ler ve web uygulamaları geliştirmek için yaygın olarak kullanılır.',
            wiki: 'https://en.wikipedia.org/wiki/Express.js'
        },
        'django': {
            name: 'Django',
            description: 'Django, Python ile yazılmış yüksek seviyeli bir web framework\'üdür. Hızlı geliştirme ve temiz tasarım prensipleri ile güvenli ve ölçeklenebilir web uygulamaları oluşturmayı kolaylaştırır.',
            wiki: 'https://en.wikipedia.org/wiki/Django_(web_framework)'
        },
        'api': {
            name: 'REST APIs',
            description: 'REST (Representational State Transfer), web servisleri için bir mimari stildir. HTTP protokolü üzerinden kaynaklara erişim sağlar ve stateless, cacheable bir yapı sunar.',
            wiki: 'https://en.wikipedia.org/wiki/Representational_state_transfer'
        },
        'git': {
            name: 'Git',
            description: 'Git, dağıtık versiyon kontrol sistemidir. Kod değişikliklerini takip eder, branch\'ler oluşturmayı sağlar ve ekip çalışmasını kolaylaştırır.',
            wiki: 'https://en.wikipedia.org/wiki/Git'
        },
        'docker': {
            name: 'Docker',
            description: 'Docker, uygulamaları container\'larda paketleyip çalıştırmayı sağlayan bir platformdur. Geliştirme, test ve production ortamlarında tutarlılık sağlar.',
            wiki: 'https://en.wikipedia.org/wiki/Docker_(software)'
        },
        'aws': {
            name: 'AWS',
            description: 'Amazon Web Services (AWS), bulut bilişim hizmetleri sağlayan bir platformdur. Sunucu, depolama, veritabanı ve daha birçok bulut hizmeti sunar.',
            wiki: 'https://en.wikipedia.org/wiki/Amazon_Web_Services'
        },
        'cicd': {
            name: 'CI/CD',
            description: 'CI/CD (Continuous Integration/Continuous Deployment), kod değişikliklerini otomatik olarak test edip deploy etmeyi sağlayan bir yazılım geliştirme pratiğidir.',
            wiki: 'https://en.wikipedia.org/wiki/CI/CD'
        },
        'linux': {
            name: 'Linux',
            description: 'Linux, açık kaynaklı bir Unix-benzeri işletim sistemi çekirdeğidir. Sunucular, gömülü sistemler ve masaüstü bilgisayarlarda yaygın olarak kullanılır.',
            wiki: 'https://en.wikipedia.org/wiki/Linux'
        }
    };

    // Open modal on skill tag click
    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const skillKey = tag.getAttribute('data-skill');
            const skill = skillData[skillKey];
            
            if (skill) {
                modalTitle.textContent = skill.name;
                modalDescription.textContent = skill.description;
                modalWikiLink.href = skill.wiki;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Star Counters Animation
function initStarCounters() {
    const starNumbers = document.querySelectorAll('.star-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target, parseInt(entry.target.textContent));
            }
        });
    }, { threshold: 0.5 });
    
    starNumbers.forEach(num => observer.observe(num));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// Terminal Animation with Flowing Commands
function initTerminal() {
    const terminalCommand = document.querySelector('.terminal-command');
    const terminalOutput = document.querySelector('.terminal-output');
    if (!terminalCommand || !terminalOutput) return;

    const commands = [
        { cmd: 'npm run dev', output: '> portfolio@1.0.0 dev\n> vite\n\n  VITE v5.0.0  ready in 234 ms\n\n  ➜  Local:   http://localhost:5173/' },
        { cmd: 'git status', output: 'On branch main\nYour branch is up to date with origin/main.\n\nnothing to commit, working tree clean' },
        { cmd: 'ls -la', output: 'total 48\ndrwxr-xr-x  8 user  staff   256 Dec 15 10:30 .\ndrwxr-xr-x  5 user  staff   160 Dec 15 10:30 ..\n-rw-r--r--  1 user  staff  1234 Dec 15 10:30 package.json' },
        { cmd: 'cat package.json', output: '{\n  "name": "portfolio",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  }\n}' },
        { cmd: 'code .', output: 'Opening VS Code...' },
        { cmd: 'npm install', output: 'added 245 packages in 12s' },
        { cmd: 'git log --oneline', output: 'a1b2c3d feat: Add new features\nb2c3d4e fix: Resolve bugs\nc3d4e5f chore: Update dependencies' }
    ];

    let commandIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isShowingOutput = false;
    let outputIndex = 0;
    let typingSpeed = 80;

    function typeCommand() {
        const currentCommand = commands[commandIndex];
        
        if (isDeleting) {
            terminalCommand.textContent = currentCommand.cmd.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 30;
            
            if (charIndex === 0) {
                isDeleting = false;
                commandIndex = (commandIndex + 1) % commands.length;
                typingSpeed = 500;
            }
        } else {
            terminalCommand.textContent = currentCommand.cmd.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
            
            if (charIndex === currentCommand.cmd.length) {
                isDeleting = true;
                isShowingOutput = true;
                showOutput(currentCommand.output);
                typingSpeed = 2000;
            }
        }
        
        setTimeout(typeCommand, typingSpeed);
    }

    function showOutput(output) {
        terminalOutput.innerHTML = '';
        const lines = output.split('\n');
        lines.forEach((line, index) => {
            setTimeout(() => {
                const outputLine = document.createElement('div');
                outputLine.className = 'terminal-output-line';
                outputLine.textContent = line || ' '; // Handle empty lines
                terminalOutput.appendChild(outputLine);
                
                // Auto scroll to bottom
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }, index * 60);
        });

        setTimeout(() => {
            isShowingOutput = false;
            outputIndex = 0;
            // Clear output after delay
            setTimeout(() => {
                if (terminalOutput.children.length > 0) {
                    Array.from(terminalOutput.children).forEach((child, idx) => {
                        setTimeout(() => {
                            child.style.opacity = '0';
                            child.style.transform = 'translateX(-10px)';
                            setTimeout(() => child.remove(), 300);
                        }, idx * 30);
                    });
                }
            }, 3000);
        }, lines.length * 60 + 2000);
    }

    typeCommand();
}

// Scroll Section Transition with Enhanced Animations
function initScrollSectionTransition() {
    const sections = document.querySelectorAll('.content-section');
    const contentArea = document.querySelector('.content-area');
    let currentSectionIndex = 0;
    let isScrolling = false;

    // Add a flag element at the end of each section
    sections.forEach(section => {
        const flag = document.createElement('div');
        flag.className = 'section-flag';
        flag.style.position = 'absolute';
        flag.style.bottom = '0';
        flag.style.height = '1px';
        flag.style.width = '100%';
        section.appendChild(flag);
    });

    function isAtSectionBoundary(direction) {
        // Always allow transitions without restrictions
        return true;
    }

    window.addEventListener('wheel', (e) => {
        if (isScrolling) return;

        const delta = e.deltaY;
        if (Math.abs(delta) < 100) return;

        if (delta > 0 && currentSectionIndex < sections.length - 1) {
            if (isAtSectionBoundary('down')) {
                isScrolling = true;
                currentSectionIndex++;
                transitionToSection(currentSectionIndex, 'down');
            }
        } else if (delta < 0 && currentSectionIndex > 0) {
            if (isAtSectionBoundary('up')) {
                isScrolling = true;
                currentSectionIndex--;
                transitionToSection(currentSectionIndex, 'up');
            }
        }
    }, { passive: true });
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Smooth sidebar transitions
const sidebar = document.querySelector('.sidebar');
if (sidebar) {
    const folderItems = sidebar.querySelectorAll('.folder-item');
    folderItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.05}s`;
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const sections = ['home', 'projects', 'skills', 'contact'];
    const currentIndex = sections.indexOf(state.currentSection);
    
    if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
        e.preventDefault();
        setActiveSection(sections[currentIndex + 1]);
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        setActiveSection(sections[currentIndex - 1]);
    }
});

// Mobile sidebar toggle
const hamburger = document.querySelector('.hamburger');
if (hamburger && window.innerWidth <= 768) {
    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// Close sidebar when clicking outside (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// Performance: Debounce scroll events
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Scroll-based updates here
            ticking = false;
        });
        ticking = true;
    }
});

// Add smooth transitions to all interactive elements
document.querySelectorAll('button, a, .folder-item, .project-item').forEach(el => {
    el.style.transition = 'all 0.2s ease';
});

// ===== THEME TOGGLE =====
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    setTheme(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('class');
            const newTheme = currentTheme === 'dark-mode' ? 'light-mode' : 'dark-mode';
            setTheme(newTheme);
        });
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('class', theme);
    localStorage.setItem('theme', theme);
    
    const themeToggle = document.querySelector('.theme-toggle i');
    if (themeToggle) {
        if (theme === 'dark-mode') {
            themeToggle.classList.remove('fa-sun');
            themeToggle.classList.add('fa-moon');
        } else {
            themeToggle.classList.remove('fa-moon');
            themeToggle.classList.add('fa-sun');
        }
    }
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            console.log('Form submitted:', formData);
            
            // Confetti animasyonu oluştur
            const submitBtn = contactForm.querySelector('button');
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    createConfetti(
                        submitBtn.getBoundingClientRect().left + submitBtn.offsetWidth / 2,
                        submitBtn.getBoundingClientRect().top
                    );
                }, i * 30);
            }
            
            alert('Teşekkürler! Mesajınız alındı. Yakında sizinle iletişime geçeceğim.');
            contactForm.reset();
        });
    }
}

// ===== DOWNLOAD RESUME =====
function downloadResume() {
    // Basit CV indirme simülasyonu
    const cvData = 'data:text/plain;charset=utf-8,Portfolio%20CV%0A%0AName%3A%20Developer%0AEmail%3A%20hello%40example.com%0AExperience%3A%208%2B%20years';
    const element = document.createElement('a');
    element.setAttribute('href', cvData);
    element.setAttribute('download', 'CV.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// ===== CUSTOM CURSOR TRAIL ===== (DISABLED)
// Farenin peşinden iz efekti kaldırıldı

// ===== CONFETTI ANIMATION =====
function createConfetti(x, y) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = x + 'px';
    confetti.style.top = y + 'px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = ['#58a6ff', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 3)];
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    document.body.appendChild(confetti);
    
    const duration = 2000;
    const startTime = Date.now();
    const vx = (Math.random() - 0.5) * 8;
    const vy = -Math.random() * 8;
    
    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;
        
        if (progress >= 1) {
            confetti.remove();
            return;
        }
        
        confetti.style.left = (x + vx * elapsed / 100) + 'px';
        confetti.style.top = (y + vy * elapsed / 100 + (elapsed / 100) * 2) + 'px';
        confetti.style.opacity = 1 - progress;
        
        requestAnimationFrame(animate);
    };
    
    animate();
}

// ===== PROJECT SEARCH & FILTER =====
function filterProjects(technology) {
    const projects = document.querySelectorAll('.project-item');
    
    projects.forEach(project => {
        if (technology === 'all') {
            project.style.display = 'block';
            project.classList.add('animate-slide-in-up');
        } else {
            const techs = project.querySelectorAll('.tech-tag');
            let hasMatch = false;
            techs.forEach(tech => {
                if (tech.textContent.toLowerCase().includes(technology.toLowerCase())) {
                    hasMatch = true;
                }
            });
            project.style.display = hasMatch ? 'block' : 'none';
            if (hasMatch) {
                project.classList.add('animate-slide-in-up');
            }
        }
    });
}

// ===== GITHUB STATS API =====
function initGitHubStats() {
    // GitHub API'den istatistikleri çek
    fetch('https://api.github.com/users/username')
        .then(response => response.json())
        .then(data => {
            console.log('GitHub Stats:', data);
            // İstatistikleri güncelle
        })
        .catch(err => console.log('GitHub API hatası:', err));
}

// ===== INTERSECTION OBSERVER =====
function initIntersectionAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-fade-in, .stats-card, .blog-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K : Tema değiştir
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('.theme-toggle').click();
    }
    
    // Esc : Modalı kapat
    if (e.key === 'Escape') {
        document.querySelectorAll('.skill-modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// ===== LIVE STATS UPDATE =====
function animateStats() {
    const stats = document.querySelectorAll('.stat-value, .stats-number');
    stats.forEach(stat => {
        if (stat.textContent.includes('+')) {
            const baseNumber = parseInt(stat.textContent);
            const targetNumber = baseNumber + Math.floor(Math.random() * 100);
            let current = baseNumber;
            const increment = Math.ceil((targetNumber - baseNumber) / 50);
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= targetNumber) {
                    current = targetNumber;
                    clearInterval(counter);
                }
                stat.textContent = current.toLocaleString() + '+';
            }, 30);
        }
    });
}

// Sayfaya yüklendiğinde animasyonları başlat
window.addEventListener('load', () => {
    initIntersectionAnimations();
    animateStats();
});

// Desktop ve tablet için cursor trail ekle
if (window.innerWidth > 768) {
    // initCursorTrail(); // İsteğe bağlı
}

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', () => {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page Load Time:', pageLoadTime + 'ms');
        
        // Core Web Vitals
        if ('web-vital' in window) {
            console.log('Web Vitals:', window['web-vital']);
        }
    }
});

// ===== ERROR TRACKING =====
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
});

// ===== BLOG FEATURES INITIALIZATION =====
function initBlogFeatures() {
    const blogTags = document.querySelectorAll('.tag');
    const pdfButtons = document.querySelectorAll('.export-btn');
    
    pdfButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            createConfetti(event.clientX, event.clientY);
            alert('📥 PDF indirme başlıyor...');
        });
    });
}

// ===== MONETIZATION FEATURES =====
function initMonetization() {
    const priceButtons = document.querySelectorAll('.price-btn');
    const newsInput = document.querySelector('.newsletter-input');
    const newsBtn = document.querySelector('.newsletter-btn');
    const socialBtns = document.querySelectorAll('.social-btn');

    priceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = btn.dataset.amount;
            createConfetti(event.clientX, event.clientY);
            alert(`☕ ${amount}₺ destek için teşekkürler!`);
        });
    });

    if (newsBtn) {
        newsBtn.addEventListener('click', () => {
            const email = newsInput.value;
            if (email) {
                createConfetti(event.clientX, event.clientY);
                alert(`📧 ${email} adresine abone olundu!`);
                newsInput.value = '';
            }
        });
    }

    socialBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const platforms = ['Twitter', 'LinkedIn', 'Facebook'];
            const platform = platforms[Array.from(socialBtns).indexOf(btn)] || 'Sosyal Ağ';
            alert(`${platform}'da paylaşılıyor...`);
        });
    });
}

// ===== PERFORMANCE & ANALYTICS FEATURES =====
function initPerformanceAnalytics() {
    // Sayfa yükleme süresini ölç
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        const resourceTime = perfData.responseEnd - perfData.fetchStart;
        
        console.log('Sayfa Yüklenme Süresi:', loadTime + 'ms');
        console.log('Kaynak Yüklenme Süresi:', resourceTime + 'ms');
    });

    // Scroll Analytics
    let lastScrollTime = Date.now();
    window.addEventListener('scroll', () => {
        const currentTime = Date.now();
        if (currentTime - lastScrollTime > 1000) {
            lastScrollTime = currentTime;
            // Scroll event tracking
        }
    });

    // Click Analytics
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('analytics-track')) {
            // Analytics tracking
        }
    });
}

// ===== INTERACTIVE FEATURES =====
function initInteractiveFeatures() {
    const searchDemo = document.getElementById('searchDemo');
    const lightboxDemo = document.getElementById('lightboxDemo');
    const favoritesDemo = document.getElementById('favoritesDemo');
    const shareDemo = document.getElementById('shareDemo');
    const codeDemo = document.getElementById('codeDemo');
    const bookmarkDemo = document.getElementById('bookmarkDemo');

    // Search Demo
    if (searchDemo) {
        searchDemo.addEventListener('click', () => {
            alert('🔍 Gelişmiş arama etkinleştirildi!\n\nÖzellikleri:\n• Gerçek zamanlı filtreleme\n• Etiket bazlı arama\n• Tarih aralığı seçimi');
        });
    }

    // Lightbox Demo
    if (lightboxDemo) {
        lightboxDemo.addEventListener('click', () => {
            alert('🖼️ Lightbox Galerisi Demo\n\nGalerisi Özelikleri:\n• Swipe navigasyonu\n• Fullscreen modu\n• Kısayol tuşları');
        });
    }

    // Favorites Demo
    if (favoritesDemo) {
        favoritesDemo.addEventListener('click', () => {
            createConfetti(event.clientX, event.clientY);
            alert('⭐ Favoriler özelliği aktif!\n\nFavorileri yönet:\n• Çift tıkla favoriye ekle\n• localStorage ile kaydet\n• "Favoriler" sekmesini gör');
        });
    }

    // Share Demo
    if (shareDemo) {
        shareDemo.addEventListener('click', () => {
            alert('🔗 Hızlı Paylaşım Demo\n\nPaylaşım Seçenekleri:\n• Twitter\n• LinkedIn\n• Facebook\n• WhatsApp');
        });
    }

    // Code Copy Demo
    if (codeDemo) {
        codeDemo.addEventListener('click', () => {
            alert('📋 Kod Kopyala\n\nKopya Özellikleri:\n• Bir klik kopyala\n• Syntax highlight\n• Otomatik format');
        });
    }

    // Bookmark Demo
    if (bookmarkDemo) {
        bookmarkDemo.addEventListener('click', () => {
            createConfetti(event.clientX, event.clientY);
            alert('🔖 Yer İşareti Eklendi!\n\nYer İşaretleri:\n• Hızlı erişim\n• localStorage ile senkron\n• Bulut senkronizasyonu');
        });
    }

    // View options
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Sort select
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            console.log('Sıralama değiştirildi:', e.target.value);
        });
    }

    // Filter input
    const filterInput = document.querySelector('.filter-input');
    const filterBtn = document.querySelector('.filter-btn');
    
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            const searchTerm = filterInput.value;
            alert(`🔍 "${searchTerm}" için aranıyor...`);
        });
    }
}

// ===== MONETIZATION STATS ANIMATION =====
function animateMonetizationStats() {
    const statBoxes = document.querySelectorAll('.monetization-stats .stat-box');
    
    statBoxes.forEach(box => {
        const value = box.querySelector('.stat-value');
        const originalText = value.textContent;
        
        box.addEventListener('mouseenter', () => {
            // Animate number
            if (originalText.includes('₺')) {
                value.style.animation = 'none';
                setTimeout(() => {
                    value.style.animation = 'pulse 0.5s ease';
                }, 10);
            }
        });
    });
}

// ===== PERFORMANCE METRIC ANIMATIONS =====
function animatePerformanceMetrics() {
    const metricFills = document.querySelectorAll('.metric-fill');
    
    metricFills.forEach(fill => {
        const percentage = fill.style.width;
        fill.style.width = '0';
        
        setTimeout(() => {
            fill.style.width = percentage;
        }, 100);
    });
}

// ===== ANALYTICS CARD HOVER =====
function initAnalyticsHover() {
    const analyticsCards = document.querySelectorAll('.analytics-card');
    
    analyticsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, var(--bg-secondary), var(--accent))';
            this.style.opacity = '0.8';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)';
            this.style.opacity = '1';
        });
    });
}

// ===== INTERACTIVE STAT CARDS =====
function initInteractiveStatCards() {
    const statCards = document.querySelectorAll('.interactive-stat-grid .stat-card');
    
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'slideIn 0.5s ease';
    });
}

// ===== PARTICLE EFFECTS =====
function initParticleEffects() {
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            createParticles(e.clientX, e.clientY);
        });
    });
}

function createParticles(x, y) {
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.pointerEvents = 'none';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.background = `hsl(${Math.random() * 60 + 200}, 100%, 60%)`;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 12px rgba(88, 166, 255, 0.8)';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.zIndex = '9999';
        
        document.body.appendChild(particle);
        
        const angle = (i / 12) * Math.PI * 2;
        const velocity = 4 + Math.random() * 4;
        let vx = Math.cos(angle) * velocity;
        let vy = Math.sin(angle) * velocity;
        let opacity = 1;
        let life = 1;
        
        const animate = () => {
            life -= 0.02;
            opacity -= 0.02;
            vx *= 0.98;
            vy *= 0.98;
            vy += 0.1;
            
            particle.style.transform = `translate(${vx}px, ${vy}px)`;
            particle.style.opacity = opacity;
            
            if (life > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        animate();
    }
}

// ===== MOUSE TRAIL =====

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.project-item, .skill-category, .contact-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== INTERACTIVE HOVERS =====
function initInteractiveHovers() {
    const cards = document.querySelectorAll('.project-item, .skill-category, .contact-card, .blog-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        });
    });
}

// ===== FORM ANIMATIONS =====
function initFormAnimations() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 0 0 3px rgba(88, 166, 255, 0.25)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// Slideın animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(88, 166, 255, 0.5); }
        50% { box-shadow: 0 0 20px rgba(88, 166, 255, 0.8); }
    }
`;
document.head.appendChild(style);

// Initialize new features
document.addEventListener('DOMContentLoaded', () => {
    initBlogFeatures();
    initMonetization();
    initPerformanceAnalytics();
    initInteractiveFeatures();
    animateMonetizationStats();
    animatePerformanceMetrics();
    initAnalyticsHover();
    initInteractiveStatCards();
});

