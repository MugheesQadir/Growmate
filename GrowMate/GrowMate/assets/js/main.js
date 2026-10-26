/* =========================================
   GROWMATE - MAIN JAVASCRIPT
   Navbar & Footer Loader + Active Link Handler
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {

    // ===== 1. LOAD NAVBAR =====
    const navbarPlaceholder = document.getElementById('navbar-placeholder');

    if (navbarPlaceholder) {
        fetch('components/navbar.html')
            .then(response => {
                if (!response.ok) throw new Error('Navbar not found');
                return response.text();
            })
            .then(data => {
                navbarPlaceholder.innerHTML = data;
                setActiveLink(); // Navbar load hone ke baad active link set karein
            })
            .catch(error => {
                console.error('Navbar load error:', error);
                navbarPlaceholder.innerHTML = '<p style="color:red;text-align:center;padding:20px;">Navbar load nahi hua. Live Server use karein.</p>';
            });
    }

    // ===== 2. LOAD FOOTER =====
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (footerPlaceholder) {
        fetch('components/footer.html')
            .then(response => {
                if (!response.ok) throw new Error('Footer not found');
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => {
                console.error('Footer load error:', error);
                footerPlaceholder.innerHTML = '<p style="color:red;text-align:center;padding:20px;">Footer load nahi hua. Live Server use karein.</p>';
            });
    }

    // ===== 3. SET ACTIVE LINK (Navbar) =====
    function setActiveLink() {
        // Current page ka filename nikalein (jaise "services.html")
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // Navbar ke saare links ko select karein
        const navLinks = document.querySelectorAll('#navbar-placeholder .nav-link');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');

            // Agar link ka href current page se match kare toh active class add karein
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ===== 4. NAVBAR SCROLL EFFECT (Optional) =====
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        }
    });


    // ===== 5. BACK TO TOP =====
    const topBtn = document.createElement('button');
    topBtn.className = 'to-top';
    topBtn.setAttribute('aria-label', 'Back to top');
    topBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(topBtn);
    window.addEventListener('scroll', () => topBtn.classList.toggle('show', window.scrollY > 400));

    // ===== 6. COOKIE NOTICE (UK) =====
    try {
        if (!localStorage.getItem('gm-cookie-ok')) {
            const bar = document.createElement('div');
            bar.className = 'cookie-bar';
            bar.innerHTML = '<p class="mb-2">We use only essential cookies to make this site work. See our <a href="privacy.html">Privacy Policy</a>.</p><button class="btn btn-primary-custom btn-sm">OK, got it</button>';
            bar.querySelector('button').addEventListener('click', () => {
                localStorage.setItem('gm-cookie-ok', '1');
                bar.remove();
            });
            document.body.appendChild(bar);
        }
    } catch (e) { /* storage blocked, skip notice */ }

});
