gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // Cursor Follower
    const glow = document.querySelector('.cursor-glow');
    window.addEventListener('mousemove', (e) => {
        gsap.to(glow, { x: e.clientX, y: e.clientY, duration: 0.8 });
    });

    // Reveal Animation
    const reveals = document.querySelectorAll('[data-reveal]');
    reveals.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
            },
            y: 30,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    // Magnetic Button Effect
    const btn = document.querySelector('.btn-gold');
    if (btn) {
        btn.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = btn.getBoundingClientRect();
            const x = e.clientX - left - width/2;
            const y = e.clientY - top - height/2;
            gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.3 });
        });
    }
});

const contactForm = document.getElementById('portfolioContactForm');
const responseMsg = document.getElementById('formResponse');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Page refresh hone se rokta hai

    // Form se data nikalna
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        responseMsg.style.color = "white";
        responseMsg.innerText = "Sending... Please wait.";
        
        // Backend API ko call karna (Render URL added here)
        const response = await fetch('https://nexuss-portfolio-api.onrender.com/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            responseMsg.style.color = "#d4af37"; // Gold color
            responseMsg.innerText = "Message sent successfully! ✅";
            contactForm.reset(); // Form khali kar dena
        } else {
            responseMsg.style.color = "red";
            responseMsg.innerText = "Error: " + result.message;
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        responseMsg.style.color = "red";
        responseMsg.innerText = "Could not connect to server. ❌";
    }
});