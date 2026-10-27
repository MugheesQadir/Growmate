/* =========================================================
   GROWMATE IT COMPANY - MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('motion-ready');

    /* ---------- 1. ACTIVE NAV LINK ---------- */
    var currentPage = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    document.querySelectorAll('.site-nav .nav-link').forEach(function (link) {
        if (link.getAttribute('href').toLowerCase() === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    /* ---------- 2. NAVBAR SHADOW + BACK TO TOP ---------- */
    var nav = document.querySelector('.site-nav');
    var topBtn = document.getElementById('backToTop');
    var scrollFrame = 0;

    function onScroll() {
        if (scrollFrame) return;
        scrollFrame = window.requestAnimationFrame(function () {
            var y = window.scrollY || document.documentElement.scrollTop;
            if (nav) nav.classList.toggle('scrolled', y > 20);
            if (topBtn) topBtn.classList.toggle('show', y > 500);
            scrollFrame = 0;
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (topBtn) {
        topBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    /* ---------- 3. CLOSE MOBILE MENU ON LINK CLICK ---------- */
    var menu = document.getElementById('navbarNav');
    if (menu) {
        menu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                if (menu.classList.contains('show') && window.bootstrap) {
                    window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
                }
            });
        });
    }

    /* ---------- 4. SCROLL REVEAL ANIMATION ---------- */
    document.querySelectorAll('.page-hero .container, .error-box .container').forEach(function (el) {
        el.classList.add('page-enter');
    });
    document.querySelectorAll('main > .section > .container > .text-center, main > .section-soft > .container > .text-center').forEach(function (el) {
        el.classList.add('reveal');
    });
    var revealItems = document.querySelectorAll('.reveal');
    if (!reduceMotion && 'IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
        revealItems.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealItems.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---------- 5. NUMBER COUNTERS ---------- */
    var counters = document.querySelectorAll('[data-count]');
    function runCounter(el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        if (!Number.isFinite(target)) {
            console.error('Invalid data-count value:', el.getAttribute('data-count'));
            return;
        }
        if (reduceMotion) {
            el.textContent = target + suffix;
            return;
        }
        var duration = 1000;
        var start = null;
        function tick(ts) {
            if (!start) start = ts;
            var rawProgress = Math.min((ts - start) / duration, 1);
            var progress = 1 - Math.pow(1 - rawProgress, 3);
            el.textContent = Math.floor(progress * target) + suffix;
            if (rawProgress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target + suffix;
            }
        }
        requestAnimationFrame(tick);
    }
    if (!reduceMotion && 'IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    runCounter(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(function (el) { counterObserver.observe(el); });
    } else {
        counters.forEach(function (el) {
            el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
        });
    }

    /* ---------- 6. PORTFOLIO FILTER ---------- */
    var filterButtons = document.querySelectorAll('.filter-btn');
    var portfolioItems = document.querySelectorAll('.portfolio-item');
    var portfolioFilterStatus = document.getElementById('portfolioFilterStatus');
    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = btn.getAttribute('data-filter');
            filterButtons.forEach(function (b) {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            var visibleCount = 0;
            portfolioItems.forEach(function (item) {
                var show = filter === 'all' || item.getAttribute('data-category') === filter;
                item.classList.toggle('hide', !show);
                item.classList.remove('filter-in');
                if (show && !reduceMotion) {
                    window.requestAnimationFrame(function () {
                        item.classList.add('filter-in');
                    });
                }
                if (show) visibleCount += 1;
            });
            if (portfolioFilterStatus) {
                portfolioFilterStatus.textContent = visibleCount + (visibleCount === 1 ? ' project shown.' : ' projects shown.');
            }
        });
    });

    /* ---------- 7. COOKIE BANNER ---------- */
    var banner = document.getElementById('cookieBanner');
    if (banner) {
        var saved = null;
        try { saved = localStorage.getItem('growmate_cookie_choice'); } catch (e) { saved = null; }
        if (!saved) {
            setTimeout(function () { banner.classList.add('show'); }, 1200);
        }
        banner.querySelectorAll('[data-cookie]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                try { localStorage.setItem('growmate_cookie_choice', btn.getAttribute('data-cookie')); } catch (e) { /* ignore */ }
                banner.classList.remove('show');
            });
        });
    }
    portfolioItems.forEach(function (item) {
        item.addEventListener('animationend', function (event) {
            if (event.animationName === 'portfolio-enter') item.classList.remove('filter-in');
        });
    });

    /* ---------- 8. FOOTER YEAR ---------- */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 9. CONTACT FORM (Web3Forms) ---------- */
    var form = document.getElementById('contactForm');
    if (form) {
        var status = document.getElementById('formStatus');
        var submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            var formData = new FormData(form);
            var accessKey = formData.get('access_key');
            if (!accessKey || accessKey === 'PASTE_YOUR_ACCESS_KEY_HERE') {
                status.textContent = 'The enquiry form is not configured yet. Please call 07913 174310 or email growmate35@gmail.com instead.';
                status.className = 'form-status error';
                return;
            }

            var originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            form.setAttribute('aria-busy', 'true');
            submitBtn.innerHTML = 'Sending...';
            status.className = 'form-status';

            var json = JSON.stringify(Object.fromEntries(formData));

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: json
            })
                .then(function (res) {
                    if (!res.ok) throw new Error('Contact form service returned HTTP ' + res.status);
                    return res.json();
                })
                .then(function (data) {
                    if (data.success) {
                        status.textContent = 'Thank you! Your message has been sent. We will reply within 24 hours.';
                        status.className = 'form-status success';
                        form.reset();
                        form.classList.remove('was-validated');
                    } else {
                        throw new Error(data.message || 'Failed');
                    }
                })
                .catch(function (error) {
                    console.error('Contact form submission failed:', error);
                    status.textContent = 'Sorry, something went wrong. Please call 07913 174310 or email growmate35@gmail.com.';
                    status.className = 'form-status error';
                })
                .finally(function () {
                    submitBtn.disabled = false;
                    form.removeAttribute('aria-busy');
                    submitBtn.innerHTML = originalText;
                });
        });
    }
});
