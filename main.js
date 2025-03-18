document.addEventListener('DOMContentLoaded', function() {
    // Hide loader when DOM is ready
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }

    // Initialize other functionality after content is loaded
    initializeWebsite();
});

// Wait for all resources to load
window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
});

function initializeWebsite() {
    // Initialize AOS with reduced motion for better performance
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        disable: window.innerWidth < 768 // Disable on mobile for better performance
    });

    // Handle navigation menu
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.getElementById('nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const headerElement = document.querySelector('header');
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Ensure header is visible
    if (headerElement) {
        headerElement.style.visibility = 'visible';
        headerElement.style.opacity = '1';
    }
    
    // Ensure navigation is visible
    if (navLinks) {
        navLinks.style.visibility = 'visible';
        navLinks.style.opacity = '1';
    }

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Handle smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Handle scroll events
    window.addEventListener('scroll', function() {
        if (headerElement) {
            if (window.scrollY > 50) {
                headerElement.classList.add('scrolled');
            } else {
                headerElement.classList.remove('scrolled');
            }
        }
    });

    // Get header element once
    const header = document.querySelector('header');

    // Initialize GSAP
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // GSAP Animations
        gsap.from('.home-content', {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: '.home-content',
                start: 'top 80%',
            }
        });

        gsap.from('.home-image', {
            opacity: 0,
            x: 50,
            duration: 1,
            scrollTrigger: {
                trigger: '.home-image',
                start: 'top 80%',
            }
        });

        // Service cards animation
        gsap.utils.toArray('.service-card').forEach((card, i) => {
            gsap.from(card, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: i * 0.2,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                }
            });
        });
    }

    // Smooth scroll animation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80; // Height of fixed header
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu functionality
    const menuIconMobile = document.querySelector('.menu-icon');
    const navLinksMobile = document.getElementById('nav-links');

    if (menuIconMobile && navLinksMobile) {
        menuIconMobile.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinksMobile.classList.toggle('active');
            menuIconMobile.classList.toggle('active');
            document.body.style.overflow = navLinksMobile.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinksMobile.classList.contains('active') && 
                !navLinksMobile.contains(e.target) && 
                !menuIconMobile.contains(e.target)) {
                navLinksMobile.classList.remove('active');
                menuIconMobile.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        navLinksMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksMobile.classList.remove('active');
                menuIconMobile.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Form submission
    const form = document.forms['submit-to-google-sheet'];
    if (form) {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbz_ie87nxscsHVEQFZaBKKtA-VGK9_vUAuaaLzRZUc-2ZHEp3L9BNNa750JaR8_Ir0KSQ/exec';
        
        form.addEventListener('submit', e => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

            fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    form.reset();
                    alert('Message sent successfully!');
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert('There was an error sending your message. Please try again.');
                })
                .finally(() => {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Send Message';
                    }
                });
        });
    }

    // Initialize Swiper if element exists
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (testimonialSlider && typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.testimonials-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    // Enhanced image handling
    const profileImage = document.querySelector('.home-image img');
    if (profileImage) {
        profileImage.style.objectFit = 'cover';
        profileImage.style.objectPosition = 'center center';
        profileImage.style.margin = '0 auto';
        
        profileImage.addEventListener('load', function() {
            this.style.opacity = '1';
            // Ensure proper centering after load
            this.parentElement.style.display = 'flex';
            this.parentElement.style.justifyContent = 'center';
        });
        
        // Error handling
        profileImage.addEventListener('error', function() {
            this.src = 'placeholder.png';
            this.alt = 'Image not available';
        });
    }

    // Force all sections to be visible
    document.querySelectorAll('section').forEach(section => {
        section.style.visibility = 'visible';
        section.style.opacity = '1';
    });

    // Ensure all images are visible and properly loaded
    document.querySelectorAll('img').forEach(img => {
        img.style.visibility = 'visible';
        img.style.opacity = '1';
        
        img.addEventListener('load', function() {
            this.style.visibility = 'visible';
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            if (!this.src.includes('placeholder.png')) {
                console.log('Image failed to load:', this.src);
                this.src = 'placeholder.png';
                this.alt = 'Image not available';
            }
        });
    });

    // Disable animations on mobile for better performance
    if (window.innerWidth < 768) {
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => {
            el.removeAttribute('data-aos');
        });
    }

    // Enhanced responsive handling
    function handleResponsiveLayout() {
        const isMobile = window.innerWidth <= 768;
        const isLaptop = window.innerWidth > 992;
        
        // Update navigation
        const nav = document.querySelector('nav');
        if (nav) {
            nav.style.padding = isMobile ? '10px 20px' : '0 20px';
        }

        // Update home section layout
        const homeSection = document.querySelector('.home-section');
        if (homeSection) {
            homeSection.style.minHeight = isMobile ? 'auto' : '100vh';
            homeSection.style.padding = isMobile ? '100px 20px 60px' : '120px 40px';
        }

        // Center align content on mobile
        const homeContent = document.querySelector('.home-content');
        if (homeContent) {
            homeContent.style.textAlign = isMobile ? 'center' : 'left';
        }

        // Adjust service cards layout
        const servicesGrid = document.querySelector('.services-grid');
        if (servicesGrid) {
            servicesGrid.style.gridTemplateColumns = isMobile ? '1fr' : isLaptop ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)';
        }

        // Update skills container layout
        const skillsContainer = document.querySelector('.skills-container');
        if (skillsContainer) {
            skillsContainer.style.gridTemplateColumns = isMobile ? '1fr' : isLaptop ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)';
        }
    }

    // Initial responsive setup
    handleResponsiveLayout();

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            handleResponsiveLayout();
        }, 250);
    });

    // Enhanced Navigation Functionality
    document.addEventListener('DOMContentLoaded', function() {
        // Menu Toggle
        const menuIcon = document.querySelector('.menu-icon');
        const navLinks = document.getElementById('nav-links');
        const navLinksItems = document.querySelectorAll('.nav-link');
        const header = document.querySelector('header');
        const themeToggle = document.querySelector('.theme-toggle');

        // Menu Toggle Function
        function toggleMenu() {
            menuIcon.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        }

        // Menu Icon Click Event
        if (menuIcon) {
            menuIcon.addEventListener('click', toggleMenu);
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !menuIcon.contains(e.target)) {
                toggleMenu();
            }
        });

        // Active Link Handling
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                // Remove active class from all links
                navLinksItems.forEach(item => item.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        // Scroll Handling
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;

            // Update active link based on scroll position
            const sections = document.querySelectorAll('section[id]');
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                    navLinksItems.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${section.id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });

        // Theme Toggle
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                const icon = themeToggle.querySelector('i');
                if (document.body.classList.contains('dark-theme')) {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
                // Save theme preference
                localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
            });

            // Check for saved theme preference
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
                themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            }
        }
    });
}

// Enhanced image handling
document.addEventListener('DOMContentLoaded', function() {
    // Handle about section image
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) {
        // Force image to be visible
        aboutImage.style.opacity = '1';
        aboutImage.style.visibility = 'visible';
        
        // Log image loading status
        console.log('About image current src:', aboutImage.src);
        
        aboutImage.addEventListener('load', function() {
            console.log('About image loaded successfully');
            this.style.opacity = '1';
            this.style.visibility = 'visible';
            this.parentElement.style.background = '#FFB800';
        });
        
        aboutImage.addEventListener('error', function() {
            console.error('Error loading about image:', this.src);
            this.src = 'placeholder.png';
            this.alt = 'Image not available';
            this.parentElement.style.background = '#FFB800';
        });

        // Force reload the image
        const currentSrc = aboutImage.src;
        aboutImage.src = '';
        aboutImage.src = currentSrc;
    }

    // Handle all images
    const images = document.getElementsByTagName('img');
    for (let img of images) {
        img.style.opacity = '1';
        img.style.visibility = 'visible';
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.visibility = 'visible';
        });
        
        img.addEventListener('error', function() {
            console.log('Error loading image:', this.src);
            if (!this.src.includes('placeholder.png')) {
                this.src = 'placeholder.png';
                this.alt = 'Image not available';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initializeNavigation();
});

function initializeNavigation() {
    const sections = ['home', 'about', 'services', 'skills', 'portfolio', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navMenu = document.getElementById('nav-links');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    document.querySelector('.menu-icon').classList.remove('active');
                }
            }
        });
    });
    
    // Handle scroll-based active state
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                    current = sectionId;
                }
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.menu-icon');
    const navWrapper = document.querySelector('.nav-wrapper');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.classList.add('menu-overlay');
    document.body.appendChild(overlay);

    // Toggle menu
    menuIcon.addEventListener('click', function() {
        menuIcon.classList.toggle('active');
        navWrapper.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking overlay
    overlay.addEventListener('click', function() {
        menuIcon.classList.remove('active');
        navWrapper.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('menu-open');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuIcon.classList.remove('active');
            navWrapper.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 992 && navWrapper.classList.contains('active')) {
                menuIcon.classList.remove('active');
                navWrapper.classList.remove('active');
                overlay.classList.remove('active');
                body.classList.remove('menu-open');
            }
        }, 250);
    });

    // Active link handling
    function setActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);

            if (correspondingLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                correspondingLink.classList.add('active');
            }
        });
    }

    // Update active link on scroll
    window.addEventListener('scroll', setActiveLink);
    setActiveLink();

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}); 