<script>
// Simple search button alert
const searchBtn = document.querySelector(".btn-search");
if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    alert("Searching for best travel packages...");
  });
}

// Elements to animate
const elements = document.querySelectorAll(".animate-left, .animate-right");

// Intersection Observer to reveal elements on scroll
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);

// Observe each element
elements.forEach(el => observer.observe(el));

// Repeat animation every 5 seconds
setInterval(() => {
  elements.forEach(el => {
    el.classList.remove("show"); // reset
    void el.offsetWidth;         // trigger reflow
    el.classList.add("show");    // re-apply animation
  });
}, 5000);

// Enquiry form submission (demo)
const enquiryForm = document.querySelector(".enquiry-form");
if (enquiryForm) {
  enquiryForm.addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Thank you! Your enquiry has been submitted.");
  });
}

// Button hover ripple effect
const btn = document.querySelector(".btn-submit");
if (btn) {
  btn.addEventListener("mousemove", function(e) {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btn.style.setProperty("--x", `${x}px`);
    btn.style.setProperty("--y", `${y}px`);
  });
}

// Promo cards scroll animation
const wrapper = document.querySelector(".promo-cards-wrapper");
if (wrapper) {
  // Duplicate cards for seamless scroll
  const cards = wrapper.innerHTML;
  wrapper.innerHTML += cards;

  let scrollAmount = 0;
  setInterval(() => {
    scrollAmount += 310; // card width + gap
    if (scrollAmount >= wrapper.scrollWidth / 2) scrollAmount = 0;
    wrapper.scrollTo({
      left: scrollAmount,
      behavior: "smooth"
    });
  }, 5000);
}

// Smooth scroll navigation
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offset = 70; // adjust based on navbar height
      const bodyRect = document.body.getBoundingClientRect().top;
      const targetRect = target.getBoundingClientRect().top;
      const scrollPosition = targetRect - bodyRect - offset;

      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth"
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector(".contact-form");
  const feedbackEl = document.getElementById("responseMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const apiBase = "https://travel-n-tour-api.onrender.com"; // backend URL

      feedbackEl.innerText = "⏳ Sending message...";
      feedbackEl.style.color = "#1976d2";

      try {
        const response = await fetch(`${apiBase}/send-contact`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }

        const result = await response.json();
        console.log("📨 API Response:", result); // 👀 Debug

        if (result.status === "success") {
          feedbackEl.innerText =
            "✅ Your message has been successfully received. Our team will contact you shortly.";
          feedbackEl.style.color = "#0a7d0a";
          contactForm.reset();
        } else {
          feedbackEl.innerText = "❌ " + result.message;
          feedbackEl.style.color = "#d32f2f";
        }
      } catch (error) {
        feedbackEl.innerText =
          "⚠️ Something went wrong while sending your message. Please try again later.";
        feedbackEl.style.color = "#ff9800";
        console.error(error);
      }
    });
  }
});
