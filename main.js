// Utility: Active Link Updater
function updateActiveLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const path = window.location.pathname;
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (path.includes(href) && href !== 'index.html' && href !== '#') {
            link.classList.add('active');
        } else if (path.endsWith('/') || path.includes('index.html')) {
            if (href === 'index.html') link.classList.add('active');
        }
    });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuContainer = document.getElementById('mobile-menu-container');
const mobileOverlay = document.getElementById('mobile-menu-overlay');

if (mobileMenuBtn && mobileMenuContainer) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        const isActive = mobileMenuContainer.classList.contains('active');

        mobileMenuBtn.classList.toggle('active');
        mobileMenuContainer.classList.toggle('active');

        if (mobileOverlay) {
            mobileOverlay.classList.toggle('active');
        }
    });

    // Close menu when clicking on a link
    mobileMenuContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenuContainer.classList.remove('active');
            if (mobileOverlay) {
                mobileOverlay.classList.remove('active');
            }
        });
    });

    // Close menu when clicking overlay
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenuContainer.classList.remove('active');
            mobileOverlay.classList.remove('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && mobileMenuContainer.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            mobileMenuContainer.classList.remove('active');
            if (mobileOverlay) {
                mobileOverlay.classList.remove('active');
            }
        }
    });
}

// Easter Egg: Logo Click for Coupon
let logoClickCount = 0;
document.addEventListener('click', (e) => {
    const logo = e.target.closest('.logo');
    // Don't trigger if clicking mobile menu button
    if (logo && !e.target.closest('.mobile-menu-btn')) {
        e.preventDefault();
        logoClickCount++;

        if (logoClickCount === 1) {
            // Show coupon modal
            showCouponModal();
            logoClickCount = 0; // Reset counter
        }
    }
});

function showCouponModal() {
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: linear-gradient(135deg, rgba(15, 15, 15, 0.95), rgba(30, 30, 30, 0.95));
        border: 2px solid var(--accent-red);
        border-radius: 16px;
        padding: 3rem;
        text-align: center;
        max-width: 500px;
        box-shadow: 0 0 50px rgba(225, 6, 0, 0.5), 0 20px 60px rgba(0, 0, 0, 0.8);
        animation: scaleIn 0.4s ease;
    `;

    content.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
        <h2 style="font-family: 'Orbitron', sans-serif; color: #fff; font-size: 2rem; margin-bottom: 1rem; text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);">
            Easter Egg Encontrado!
        </h2>
        <p style="color: #aaa; margin-bottom: 2rem; font-size: 1.1rem;">
            Você descobriu um cupom secreto!
        </p>
        <div style="background: rgba(225, 6, 0, 0.1); border: 2px dashed var(--accent-red); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
            <div style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">CUPOM DE DESCONTO</div>
            <div id="coupon-code" style="font-family: 'Orbitron', sans-serif; color: var(--accent-red); font-size: 2rem; font-weight: 900; letter-spacing: 3px; text-shadow: 0 0 20px rgba(225, 6, 0, 0.6);">
                SAKAMOTO10%
            </div>
        </div>
        <button id="copy-coupon" style="background: var(--accent-red); color: #fff; border: none; padding: 1rem 2rem; border-radius: 8px; font-size: 1rem; font-weight: 800; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 0 20px rgba(225, 6, 0, 0.5);">
            <i class="far fa-copy"></i> COPIAR CUPOM
        </button>
        <button id="close-coupon" style="background: transparent; color: #666; border: 1px solid #333; padding: 1rem 2rem; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-left: 1rem;">
            Fechar
        </button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Copy button
    document.getElementById('copy-coupon').addEventListener('click', () => {
        navigator.clipboard.writeText('SAKAMOTO10%');
        const btn = document.getElementById('copy-coupon');
        btn.innerHTML = '<i class="fas fa-check"></i> COPIADO!';
        btn.style.background = '#00ff00';
        setTimeout(() => {
            btn.innerHTML = '<i class="far fa-copy"></i> COPIAR CUPOM';
            btn.style.background = 'var(--accent-red)';
        }, 2000);
    });

    // Close button
    document.getElementById('close-coupon').addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => modal.remove(), 300);
    });

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    });
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes scaleIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Reveal Animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, observerOptions);

function initAnimations() {
    document.querySelectorAll('[data-reveal]').forEach(el => {
        el.classList.remove('active');
        revealObserver.observe(el);
    });
}

// Modal logic (Event Delegation for Swup compatibility)
function initModal() {
    // Only handling one-time setups if needed, but primarily relying on delegation below
}

// Global Event Delegation
document.addEventListener('click', (e) => {
    // Open Payment Modal
    const openBtn = e.target.closest('.open-payment');
    if (openBtn) {
        const modal = document.getElementById('payment-modal');
        if (!modal) return;

        const plan = openBtn.getAttribute('data-plan');
        const price = openBtn.getAttribute('data-price');
        const installments = openBtn.getAttribute('data-installments');

        const planAccents = {
            'Coach Gratuito': { color: '#C0C0C0', text: '#000', shimmer: 'rgba(192, 192, 192, 0.3)' },
            'Aula Avulsa': { color: '#E10600', text: '#fff', shimmer: 'rgba(225, 6, 0, 0.4)' },
            'Plano Semanal': { color: '#FFD700', text: '#000', shimmer: 'rgba(255, 215, 0, 0.4)' },
            'Plano Premium': { color: '#A020F0', text: '#fff', shimmer: 'rgba(160, 32, 240, 0.4)' },
            'Plano Vitalício': { color: '#00F3FF', text: '#000', shimmer: 'rgba(0, 243, 255, 0.4)' }
        };

        const accent = planAccents[plan] || planAccents['Plano Semanal'];
        modal.style.setProperty('--modal-accent-color', accent.color);
        modal.style.setProperty('--modal-accent-shimmer', accent.shimmer);
        modal.style.setProperty('--modal-text-color', accent.text);
        modal.style.setProperty('--modal-accent-gradient', `linear-gradient(to bottom, #fff, ${accent.color})`);

        document.getElementById('modal-plan-name').innerText = plan;
        document.getElementById('modal-plan-price').innerText = price;
        document.getElementById('modal-plan-installments').innerText = installments;

        // Hide payment sections for free plan
        const pixBox = modal.querySelector('.payment-box:first-child');
        const cardBox = modal.querySelector('.payment-box:last-child');
        if (plan === 'Coach Gratuito') {
            if (pixBox) pixBox.style.display = 'none';
            if (cardBox) cardBox.style.display = 'none';
        } else {
            if (pixBox) pixBox.style.display = 'block';
            if (cardBox) cardBox.style.display = 'block';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close Modal
    if (e.target.closest('.modal-close') || e.target.classList.contains('modal-overlay')) {
        const modal = document.getElementById('payment-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Pix Copy
    const copyBtn = e.target.closest('#copy-pix');
    if (copyBtn) {
        const input = document.getElementById('pix-key');
        if (input) {
            input.select();
            navigator.clipboard.writeText(input.value);
            const originalContent = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            setTimeout(() => { copyBtn.innerHTML = '<i class="far fa-copy"></i> Copiar'; }, 2000);
        }
    }
});

// SWUP Setup
if (typeof Swup !== 'undefined') {
    const swup = new Swup({ containers: ['#swup'] });
    swup.on('contentReplaced', () => {
        initAnimations();
        initModal();
        updateActiveLink();
        window.scrollTo(0, 0);
    });
}

// Lifecycle
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js-enabled');
    initAnimations();
    initModal();
    updateActiveLink();

});
