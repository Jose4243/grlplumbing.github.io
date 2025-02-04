// Hamburger menu functionality
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!e.target.closest('.navbar')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Lightbox functionality
class Lightbox {
    constructor() {
        this.init();
    }

    init() {
        this.container = document.createElement('div');
        this.container.id = 'lightbox';
        this.container.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
                <div class="lightbox-image-container">
                    <img src="" alt="">
                    <div class="lightbox-caption"></div>
                </div>
            </div>
        `;
        document.body.appendChild(this.container);
        this.bindEvents();
    }

    bindEvents() {
        // Gallery click events
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => this.open(item));
        });

        // Lightbox controls
        this.container.querySelector('.lightbox-close').addEventListener('click', () => this.close());
        this.container.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
        this.container.querySelector('.lightbox-next').addEventListener('click', () => this.next());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.container.classList.contains('active')) return;
            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }

    open(item) {
        this.currentItem = item;
        const image = item.querySelector('img');
        const caption = item.querySelector('.gallery-item-overlay');

        this.container.classList.add('active');
        this.container.querySelector('img').src = image.src;
        this.container.querySelector('.lightbox-caption').innerHTML = caption.innerHTML;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.container.classList.remove('active');
        document.body.style.overflow = '';
    }

    prev() {
        const prev = this.currentItem.previousElementSibling || 
                    this.currentItem.parentElement.lastElementChild;
        this.open(prev);
    }

    next() {
        const next = this.currentItem.nextElementSibling || 
                    this.currentItem.parentElement.firstElementChild;
        this.open(next);
    }
}

// Observe elements with animation classes
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.feature-card, .services-overview, .section-title').forEach(el => {
        observer.observe(el);
    });

    // Check if business hours need to be updated
    if (typeof checkBusinessHours === 'function') {
        checkBusinessHours();
    }

    // Initialize any maps if they exist
    if (typeof initMap === 'function') {
        initMap();
    }

    new Lightbox();

    // Add lazy loading to gallery images
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.loading = 'lazy';
    });

    if (document.querySelector('.gallery-filters')) {
        initGallery();
        initLoadMore();
    }

    initContactForm();
});

// Add scroll-based navbar styling
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(5px)';
    } else {
        navbar.style.background = 'white';
        navbar.style.backdropFilter = 'none';
    }
});

// Gallery Filtering
function initGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter gallery items
            const filter = button.dataset.filter;
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Load More Functionality
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.gallery-load-more button');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Add your load more logic here
            // This is where you would typically fetch more images from a server
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            setTimeout(() => {
                loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> All Projects Loaded';
                loadMoreBtn.disabled = true;
            }, 1500);
        });
    }
}

// Contact Form Validation and Submission
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea, select');
    const submitButton = form.querySelector('button[type="submit"]');

    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
            updateSubmitButton();
        });
    });

    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

function validateInput(input) {
    const errorElement = document.getElementById(`${input.id}Error`);
    let isValid = true;
    let errorMessage = '';

    switch(input.id) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'phone':
            const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            if (!phoneRegex.test(input.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            break;

        case 'message':
            if (input.value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }
            break;

        default:
            if (!input.value.trim()) {
                isValid = false;
                errorMessage = 'This field is required';
            }
    }

    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = isValid ? 'none' : 'block';
    }

    input.classList.toggle('error', !isValid);
    return isValid;
}

function updateSubmitButton() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, textarea, select');
    
    const allValid = Array.from(inputs).every(input => validateInput(input));
    submitButton.disabled = !allValid;
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const loadingSpinner = submitButton.querySelector('.loading-spinner');

    // Disable form during submission
    submitButton.disabled = true;
    loadingSpinner.style.display = 'inline-block';

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Thank you! We'll get back to you shortly.
        `;
        form.insertBefore(successMessage, form.firstChild);

        // Reset form
        form.reset();
        setTimeout(() => successMessage.remove(), 5000);
    } catch (error) {
        console.error('Form submission error:', error);
        // Show error message
    } finally {
        submitButton.disabled = false;
        loadingSpinner.style.display = 'none';
    }
}

// Google Maps Integration
function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    const location = { lat: 34.1015, lng: -84.5194 }; // Woodstock, GA coordinates
    const mapOptions = {
        zoom: 15,
        center: location,
        styles: [
            {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#e5e5e5' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#c1d1d6' }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#b5d6b0' }]
            }
        ]
    };

    const map = new google.maps.Map(mapElement, mapOptions);
    
    // Custom marker
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'GRL Plumbing',
        animation: google.maps.Animation.DROP,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#2d5a27',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        }
    });

    // Info window
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 1rem;">
                <h3 style="color: #2d5a27; margin: 0 0 0.5rem;">GRL Plumbing</h3>
                <p style="margin: 0;">123 Plumber Street<br>Woodstock, GA 30188</p>
            </div>
        `
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
} 