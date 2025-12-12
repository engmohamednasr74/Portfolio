// Certifications data
const certifications = [
  {
    id: 0,
    title: "React Certified Developer",
    issuer: "Coursera",
    date: "2023",
    description:
      "Earned after 100+ hours of intensive training covering React fundamentals, hooks, state management, and building production-ready applications.",
  },
  {
    id: 1,
    title: "Laravel Expert",
    issuer: "Laracasts",
    date: "2024",
    description:
      "Advanced certification demonstrating proficiency in Laravel framework, including Eloquent ORM, API development, and testing strategies.",
  },
  {
    id: 2,
    title: "Figma UI Design",
    issuer: "Udemy",
    date: "2025",
    description:
      "Comprehensive certification covering UI design principles, prototyping, design systems, and collaboration workflows in Figma.",
  },
  {
    id: 3,
    title: "Full-Stack Bootcamp",
    issuer: "freeCodeCamp",
    date: "2022",
    description:
      "Intensive full-stack development program covering front-end, back-end, databases, and deployment strategies.",
  },
  {
    id: 4,
    title: "MySQL Database Administration",
    issuer: "Oracle",
    date: "2023",
    description: "Professional certification for database design, optimization, and administration using MySQL.",
  },
  {
    id: 5,
    title: "Adobe Creative Suite",
    issuer: "Adobe",
    date: "2024",
    description: "Proficiency certification for Photoshop, Illustrator, and XD creative tools.",
  },
]

// Typewriter effect
const roles = ["Font-End Developer", "Back-End Developer", "UI/UX Web Designer", "Full-Stack Web Developer"]
let currentRole = 0
let charIndex = 0
let isDeleting = false
const typewriterEl = document.getElementById("typewriter")

function typewriter() {
  const currentText = roles[currentRole]

  if (!isDeleting) {
    typewriterEl.textContent = currentText.substring(0, charIndex + 1)
    charIndex++

    if (charIndex === currentText.length) {
      setTimeout(() => {
        isDeleting = true
      }, 750)
    }
  } else {
    typewriterEl.textContent = currentText.substring(0, charIndex - 1)
    charIndex--

    if (charIndex === 0) {
      isDeleting = false
      currentRole = (currentRole + 1) % roles.length
    }
  }

  setTimeout(typewriter, isDeleting ? 50 : 100)
}

typewriter()

// Counter animation
function animateCounters() {
  const counters = document.querySelectorAll(".counter")

  counters.forEach((counter) => {
    const target = Number.parseInt(counter.dataset.target)
    const duration = 500
    const steps = 30
    const increment = target / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        counter.textContent = target
        clearInterval(timer)
      } else {
        counter.textContent = Math.floor(current)
      }
    }, duration / steps)
  })
}
window.addEventListener("DOMContentLoaded", animateCounters)

// Active nav link on scroll
const sections = ["home", "skills", "services", "projects", "certifications", "contact"]
const navLinks = document.querySelectorAll(".nav-link")

window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY + window.innerHeight / 2

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = document.getElementById(sections[i])
    if (section && scrollPos >= section.offsetTop) {
      navLinks.forEach((link) => link.classList.remove("active"))
      const targetSection = sections[i].charAt(0).toUpperCase() + sections[i].slice(1)
      const targetLink = document.querySelector(`[data-section="${targetSection}"]`)
      if (targetLink) {
        targetLink.classList.add("active")
      }
      break
    }
  }
})

// Project filtering
const filterTabs = document.querySelectorAll(".filter-tab")
const projectCards = document.querySelectorAll("#project-card")

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    filterTabs.forEach((t) => t.classList.remove("active"))
    tab.classList.add("active")

    const filter = tab.dataset.filter

    projectCards.forEach((card) => {
      if (filter === "All" || card.dataset.category === filter) {
        card.classList.remove("hidden")
      } else {
        card.classList.add("hidden")
      }
    })
  })
})

// Contact form
const contactForm = document.getElementById("contact-form")
const successModal = document.getElementById("success-modal")

contactForm.addEventListener("submit", (e) => {
  e.preventDefault()
  successModal.classList.add("active")

  setTimeout(() => {
    successModal.classList.remove("active")
    contactForm.reset()
  }, 3000)
})

// Create particles
const particlesContainer = document.getElementById("particles")
for (let i = 0; i < 50; i++) {
  const particle = document.createElement("div")
  particle.className = "particle"
  particle.style.left = Math.random() * 100 + "%"
  particle.style.top = Math.random() * 100 + "%"
  particle.style.animationDelay = Math.random() * 5 + "s"
  particle.style.animationDuration = 3 + Math.random() * 4 + "s"
  particlesContainer.appendChild(particle)
}

// Add this to your script.js for interactive certificates (lightbox on click)
document.querySelectorAll('.cert-img').forEach(img => {
  img.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'cert-lightbox';
    modal.innerHTML = `
      <div class="lightbox-content">
        <img src="${img.src}" alt="${img.alt}">
        <button class="lightbox-close">&times;</button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.lightbox-close').addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  });
});
