document.addEventListener('DOMContentLoaded', () => {

    const glow = document.querySelector('.cursor-glow');
    const heroPic = document.getElementById('hero-pic');

    // 1. MOUSE INTERACTION (Glow + Floating Picture)
    document.addEventListener('mousemove', (e) => {
        if (glow) {
            glow.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, rgba(99, 102, 241, 0.18) 0%, transparent 65%)`;
        }

        if (heroPic) {
            const moveX = (e.clientX - window.innerWidth / 2) / 40;
            const moveY = (e.clientY - window.innerHeight / 2) / 40;

            heroPic.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${-moveY/2}deg) rotateY(${moveX/2}deg)`;
        }
    });

    // 2. SCROLL REVEAL
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // 3. CONTACT FORM
    const form = document.getElementById('collab-form');
    console.log('🔍 Form element found:', form ? 'YES ✓' : 'NO ✗');

    if (form) {
        console.log('📝 Form event listener attached');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('📤 Form submit event triggered');

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            console.log('📋 Form Data:', { name, email, message });

            try {
                // If the page was opened via file://, the browser treats it as a different origin
                // and cannot contact the local backend. Instruct the user to open via HTTP server.
                if (location.protocol === 'file:') {
                    console.error('⚠️ Page served from file:// — cannot contact backend.');
                    alert('Server error: page was opened directly from the filesystem.\nStart the server and open http://localhost:3000 instead.');
                    return;
                }

                const apiUrl = `${location.origin}/api/contact`;
                console.log('🚀 Sending request to backend at', apiUrl);

                const res = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                console.log('📡 Response status:', res.status, res.statusText);

                const data = await res.json();
                console.log('✅ Response data:', data);

                if (data.success) {
                    alert(data.message);
                    form.reset();
                } else {
                    alert("Error: " + (data.error || "Unknown error"));
                }

            } catch (err) {
                console.error('❌ FETCH ERROR:', err);
                alert("Server error: " + err.message);
            }
        });

    } else {
        console.error('❌ Form not found');
    }

    console.log("Code & Motion Portfolio: Interactive Systems Active.");
});