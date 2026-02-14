// JavaScript for Hero Slider
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    
    if (slides.length === 0) {
        console.error('No slides found. Add <div class="slide"> elements in #home.');
        return;
    }
    
    let currentSlide = 0;
    const slideInterval = 5000;

    function showNextSlide() {
        slides[currentSlide].classList.remove('opacity-100');
        slides[currentSlide].classList.add('opacity-0');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.remove('opacity-0');
        slides[currentSlide].classList.add('opacity-100');
        updateDots();
    }

    let interval = setInterval(showNextSlide, slideInterval);

    const heroSection = document.querySelector('#home');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => clearInterval(interval));
        heroSection.addEventListener('mouseleave', () => interval = setInterval(showNextSlide, slideInterval));
    }

    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2';
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors';
        dot.setAttribute('aria-label', `الانتقال إلى الشريحة ${index + 1}`);
        dot.addEventListener('click', () => {
            clearInterval(interval);
            slides[currentSlide].classList.remove('opacity-100');
            slides[currentSlide].classList.add('opacity-0');
            currentSlide = index;
            slides[currentSlide].classList.remove('opacity-0');
            slides[currentSlide].classList.add('opacity-100');
            updateDots();
            interval = setInterval(showNextSlide, slideInterval);
        });
        dotsContainer.appendChild(dot);
    });
    heroSection.appendChild(dotsContainer);

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((dot, index) => {
            dot.classList.toggle('bg-white', index === currentSlide);
            dot.classList.toggle('bg-white/50', index !== currentSlide);
        });
    }
    updateDots();
});