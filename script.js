// =============================
// Multi-step logic for Course Registration
// =============================
const courseForm = document.getElementById('courseForm');
if (courseForm) {
  const courseSteps = courseForm.querySelectorAll('.form-step');
  const nextBtns = courseForm.querySelectorAll('.next-btn');
  const prevBtns = courseForm.querySelectorAll('.prev-btn');
  const courseProgress = document.getElementById('courseProgress');
  const courseCircles = document.querySelectorAll('.course-progress-bar .step');
  const courseResponseEl = document.getElementById('courseResponseMessage');

  let courseStepIndex = 0;

  function updateCourseForm() {
    courseSteps.forEach((step, index) => {
      step.classList.toggle('active', index === courseStepIndex);
    });

    if (courseCircles.length && courseProgress) {
      courseCircles.forEach((circle, index) => {
        circle.classList.toggle('active', index === courseStepIndex);
        circle.classList.toggle('completed', index < courseStepIndex);
      });
      courseProgress.style.width = `${(courseStepIndex / (courseSteps.length - 1)) * 100}%`;
    }
  }

  nextBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      if (courseStepIndex < courseSteps.length - 1) {
        courseStepIndex++;
        updateCourseForm();
      }
    })
  );

  prevBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      if (courseStepIndex > 0) {
        courseStepIndex--;
        updateCourseForm();
      }
    })
  );

  updateCourseForm();

  // ----------------------------
  // Course Form Submission
  // ----------------------------
  courseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(courseForm);

    if (courseResponseEl) {
      courseResponseEl.innerText = "⏳ Submitting your course registration...";
      courseResponseEl.style.color = "#1976d2";
    }

    try {
      const response = await fetch("https://bentjun-tt-backend.onrender.com/course-registration", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const result = await response.json();

      if (result.status === "success") {
        courseResponseEl.innerText = "✅ Registration submitted successfully! We’ll contact you soon.";
        courseResponseEl.style.color = "#0a7d0a";
        courseForm.reset();
        courseStepIndex = 0;
        updateCourseForm();
      } else {
        courseResponseEl.innerText = "❌ " + (result.message || "Submission failed");
        courseResponseEl.style.color = "#d32f2f";
      }
    } catch (err) {
      courseResponseEl.innerText = "⚠️ Something went wrong. Try again later.";
      courseResponseEl.style.color = "#ff9800";
      console.error("Course form error:", err);
    }
  });
}



// =============================
// Main Script for Site
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const apiBase = "https://bentjun-tt-backend.onrender.com";

  // ----------------------------
  // Hero Video Autoplay
  // ----------------------------
  const heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.autoplay = true;
    heroVideo.loop = true;
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.warn("Autoplay blocked, waiting for user interaction.");
      });
    }
  }

  // ----------------------------
  // Search Button Alert
  // ----------------------------
  const searchBtn = document.querySelector(".btn-search");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      alert("Searching for best travel packages...");
    });
  }

  // ----------------------------
  // Animate Elements on Scroll
  // ----------------------------
  const elements = document.querySelectorAll(".animate-left, .animate-right");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    },
    { threshold: 0.2 }
  );
  elements.forEach(el => observer.observe(el));

  // Repeat animation every 5s
  setInterval(() => {
    elements.forEach(el => {
      el.classList.remove("show");
      void el.offsetWidth;
      el.classList.add("show");
    });
  }, 5000);

  // ----------------------------
  // Button Hover Ripple
  // ----------------------------
  const btn = document.querySelector(".btn-submit");
  if (btn) {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      btn.style.setProperty("--x", `${x}px`);
      btn.style.setProperty("--y", `${y}px`);
    });
  }

  // ----------------------------
  // Promo Cards Scroll
  // ----------------------------
const wrapper = document.querySelector(".promo-cards-wrapper");
if (wrapper) {
  const scrollStep = 310; // Adjust for your card width + margin
  let scrollAmount = 0;

  setInterval(() => {
    scrollAmount += scrollStep;
    // Smooth scroll within existing cards only
    if (scrollAmount >= wrapper.scrollWidth - wrapper.clientWidth) {
      scrollAmount = 0; // Reset to start
    }
    wrapper.scrollTo({ left: scrollAmount, behavior: "smooth" });
  }, 5000);
}

  // ----------------------------
  // Smooth Scroll Navigation
  // ----------------------------
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offset = 70;
        const bodyRect = document.body.getBoundingClientRect().top;
        const targetRect = target.getBoundingClientRect().top;
        const scrollPosition = targetRect - bodyRect - offset;
        window.scrollTo({ top: scrollPosition, behavior: "smooth" });
      }
    });
  });

  // ----------------------------
  // Contact Form Submission
  // ----------------------------
  const contactForm = document.getElementById("contactForm");
  const feedbackEl = document.getElementById("feedback");

  if (contactForm && feedbackEl) {
    contactForm.setAttribute("action", "javascript:void(0)");

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);

      feedbackEl.innerText = "⏳ Sending message...";
      feedbackEl.style.color = "#1976d2";

      try {
        const response = await fetch(`${apiBase}/send-contact`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        const result = await response.json();

        if (result.status === "success") {
          feedbackEl.innerText = "✅ Message sent successfully!";
          feedbackEl.style.color = "#0a7d0a";
          contactForm.reset();
        } else {
          feedbackEl.innerText = "❌ " + result.message;
          feedbackEl.style.color = "#d32f2f";
        }
      } catch (err) {
        feedbackEl.innerText = "⚠️ Something went wrong. Try again later.";
        feedbackEl.style.color = "#ff9800";
        console.error("Contact form error:", err);
      }
    });
  }

  // ----------------------------
  // Visa Form Multi-Step
  // ----------------------------
  const visaForm = document.getElementById("visaForm");
  if (visaForm) {
    const steps = visaForm.querySelectorAll(".form-step");
    const nextBtns = visaForm.querySelectorAll(".next-btn");
    const prevBtns = visaForm.querySelectorAll(".prev-btn");
    const progress = document.getElementById("progress");
    const stepCircles = document.querySelectorAll(".progress-bar .step");
    const visaFeedbackEl = document.getElementById("visaResponseMessage");
    let currentStep = 0;

    function updateForm() {
      steps.forEach((step, index) => {
        step.classList.toggle("active", index === currentStep);
      });

      stepCircles.forEach((circle, index) => {
        circle.classList.toggle("active", index === currentStep);
        circle.classList.toggle("completed", index < currentStep);
      });

      progress.style.width = `${(currentStep / (steps.length - 1)) * 100}%`;
    }

    nextBtns.forEach(btn =>
      btn.addEventListener("click", () => {
        if (currentStep < steps.length - 1) {
          currentStep++;
          updateForm();
        }
      })
    );

    prevBtns.forEach(btn =>
      btn.addEventListener("click", () => {
        if (currentStep > 0) {
          currentStep--;
          updateForm();
        }
      })
    );

    updateForm();

    // ----------------------------
    // Visa Form Submission
    // ----------------------------
    visaForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(visaForm);

      if (visaFeedbackEl) {
        visaFeedbackEl.innerText = "⏳ Submitting your application...";
        visaFeedbackEl.style.color = "#1976d2";
      }

      try {
        const response = await fetch(`${apiBase}/send-application`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        const result = await response.json();

        if (result.status === "success") {
          visaFeedbackEl.innerText = "✅ Application submitted successfully!";
          visaFeedbackEl.style.color = "#0a7d0a";
          visaForm.reset();
          currentStep = 0;
          updateForm();
        } else {
          visaFeedbackEl.innerText = "❌ " + (result.message || "Submission failed");
          visaFeedbackEl.style.color = "#d32f2f";
        }
      } catch (err) {
        visaFeedbackEl.innerText = "⚠️ Something went wrong. Try again.";
        visaFeedbackEl.style.color = "#ff9800";
        console.error("Visa form error:", err);
      }
    });
  }
});
