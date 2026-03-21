document.addEventListener('DOMContentLoaded', () => {

    const glow = document.querySelector('.cursor-glow');
    const heroPic = document.getElementById('hero-pic');

    // 1. MOUSE INTERACTION (Glow + Floating Picture)
    document.addEventListener('mousemove', (e) => {
        // Update Mouse Glow Position
        if (glow) {
            glow.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, rgba(99, 102, 241, 0.18) 0%, transparent 65%)`;
        }

        // Update Picture Parallax (Floating Effect)
        if (heroPic) {
            // Calculates distance from the center of the screen
            // Increase the divisor (40) to make the movement subtler
            const moveX = (e.clientX - window.innerWidth / 2) / 40;
            const moveY = (e.clientY - window.innerHeight / 2) / 40;

            // Applies translation and a slight 3D rotation
            heroPic.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${-moveY/2}deg) rotateY(${moveX/2}deg)`;
        }
    });

    // 2. SCROLL REVEAL (Elements slide up as you scroll)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Targets all elements with the 'reveal' class
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // 3. CONTACT FORM HANDLING
  // Find the form in your script.js
const form = document.getElementById('collab-form');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Collect the data from the form
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            // 2. SEND the data to your Node.js server
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            // 3. Handle the result
            if (result.success) {
                alert(`Success! Data stored in MongoDB.`);
                form.reset();
            } else {
                alert("Server received it, but failed to save.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Could not connect to the server. Is node server.js running?");
        }
    });
}

    // Console log to confirm everything is running
    console.log("Code & Motion Portfolio: Interactive Systems Active.");
});