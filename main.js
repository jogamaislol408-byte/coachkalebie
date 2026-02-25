function updateActiveLink() {
    var navLinks = document.querySelectorAll('.nav-links a');
    var path = window.location.pathname;
    navLinks.forEach(function (link) {
        link.classList.remove('active');
        var href = link.getAttribute('href');
        if (path.includes(href) && href !== 'index.html' && href !== '#') {
            link.classList.add('active');
        } else if (path.endsWith('/') || path.includes('index.html')) {
            if (href === 'index.html') link.classList.add('active');
        }
    });
}

(function () {
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenuContainer = document.getElementById('mobile-menu-container');
    var mobileOverlay = document.getElementById('mobile-menu-overlay');

    if (mobileMenuBtn && mobileMenuContainer) {
        mobileMenuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            mobileMenuBtn.classList.toggle('active');
            mobileMenuContainer.classList.toggle('active');
            if (mobileOverlay) mobileOverlay.classList.toggle('active');
        });

        mobileMenuContainer.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenuBtn.classList.remove('active');
                mobileMenuContainer.classList.remove('active');
                if (mobileOverlay) mobileOverlay.classList.remove('active');
            });
        });

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', function () {
                mobileMenuBtn.classList.remove('active');
                mobileMenuContainer.classList.remove('active');
                mobileOverlay.classList.remove('active');
            });
        }

        document.addEventListener('click', function (e) {
            if (!e.target.closest('nav') && mobileMenuContainer.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                mobileMenuContainer.classList.remove('active');
                if (mobileOverlay) mobileOverlay.classList.remove('active');
            }
        });
    }
})();

var logoClickCount = 0;
var logoClickTimer = null;
document.addEventListener('click', function (e) {
    var logo = e.target.closest('.logo');
    if (logo && !e.target.closest('.mobile-menu-btn')) {
        logoClickCount++;
        if (logoClickCount >= 3) {
            e.preventDefault();
            logoClickCount = 0;
            clearTimeout(logoClickTimer);
            showCouponModal();
        } else {
            clearTimeout(logoClickTimer);
            logoClickTimer = setTimeout(function () { logoClickCount = 0; }, 600);
        }
    }
});

function showCouponModal() {
    var modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:10000;animation:fadeIn .3s ease';

    var content = document.createElement('div');
    content.style.cssText = 'background:linear-gradient(135deg,rgba(15,15,15,.95),rgba(30,30,30,.95));border:2px solid var(--accent-red);border-radius:16px;padding:3rem;text-align:center;max-width:500px;box-shadow:0 0 50px rgba(225,6,0,.5),0 20px 60px rgba(0,0,0,.8);animation:scaleIn .4s ease';

    content.innerHTML =
        '<div style="font-size:3rem;margin-bottom:1rem">🎉</div>' +
        '<h2 style="font-family:Orbitron,sans-serif;color:#fff;font-size:2rem;margin-bottom:1rem;text-shadow:0 0 20px rgba(255,255,255,.3)">Easter Egg Encontrado!</h2>' +
        '<p style="color:#aaa;margin-bottom:2rem;font-size:1.1rem">Você descobriu um cupom secreto!</p>' +
        '<div style="background:rgba(225,6,0,.1);border:2px dashed var(--accent-red);border-radius:8px;padding:1.5rem;margin-bottom:2rem">' +
        '<div style="color:#666;font-size:.9rem;margin-bottom:.5rem">CUPOM DE DESCONTO</div>' +
        '<div id="coupon-code" style="font-family:Orbitron,sans-serif;color:var(--accent-red);font-size:2rem;font-weight:900;letter-spacing:3px;text-shadow:0 0 20px rgba(225,6,0,.6)">SAKAMOTO10%</div>' +
        '</div>' +
        '<button id="copy-coupon" style="background:var(--accent-red);color:#fff;border:none;padding:1rem 2rem;border-radius:8px;font-size:1rem;font-weight:800;cursor:pointer;transition:.3s ease;box-shadow:0 0 20px rgba(225,6,0,.5)"><i class="far fa-copy"></i> COPIAR CUPOM</button>' +
        '<button id="close-coupon" style="background:transparent;color:#666;border:1px solid #333;padding:1rem 2rem;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer;transition:.3s ease;margin-left:1rem">Fechar</button>';

    modal.appendChild(content);
    document.body.appendChild(modal);

    document.getElementById('copy-coupon').addEventListener('click', function () {
        navigator.clipboard.writeText('SAKAMOTO10%');
        var btn = document.getElementById('copy-coupon');
        btn.innerHTML = '<i class="fas fa-check"></i> COPIADO!';
        btn.style.background = '#00ff00';
        setTimeout(function () {
            btn.innerHTML = '<i class="far fa-copy"></i> COPIAR CUPOM';
            btn.style.background = 'var(--accent-red)';
        }, 2000);
    });

    document.getElementById('close-coupon').addEventListener('click', function () {
        modal.style.animation = 'fadeOut .3s ease';
        setTimeout(function () { modal.remove(); }, 300);
    });

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut .3s ease';
            setTimeout(function () { modal.remove(); }, 300);
        }
    });
}

var animStyle = document.createElement('style');
animStyle.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes fadeOut{from{opacity:1}to{opacity:0}}@keyframes scaleIn{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}';
document.head.appendChild(animStyle);

var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

function initAnimations() {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
        el.classList.remove('active');
        revealObserver.observe(el);
    });
}



document.addEventListener('click', function (e) {
    var openBtn = e.target.closest('.open-payment');
    if (openBtn) {
        var modal = document.getElementById('payment-modal');
        if (!modal) return;

        var plan = openBtn.getAttribute('data-plan');
        var price = openBtn.getAttribute('data-price');
        var installments = openBtn.getAttribute('data-installments');
        var link = openBtn.getAttribute('data-link');

        var planAccents = {
            'Aula gratuita': { color: '#C0C0C0', text: '#000', shimmer: 'rgba(192,192,192,.3)' },
            'Aula Avulsa': { color: '#E10600', text: '#fff', shimmer: 'rgba(225,6,0,.4)' },
            'Plano Mensal': { color: '#FFD700', text: '#000', shimmer: 'rgba(255,215,0,.4)' },
            'Plano Premium': { color: '#A020F0', text: '#fff', shimmer: 'rgba(160,32,240,.4)' },
            'Plano Coach': { color: '#FF8C00', text: '#fff', shimmer: 'rgba(255,140,0,.4)' }
        };

        var accent = planAccents[plan] || planAccents['Plano Mensal'];
        modal.style.setProperty('--modal-accent-color', accent.color);
        modal.style.setProperty('--modal-accent-shimmer', accent.shimmer);
        modal.style.setProperty('--modal-text-color', accent.text);
        modal.style.setProperty('--modal-accent-gradient', 'linear-gradient(to bottom,#fff,' + accent.color + ')');

        document.getElementById('modal-plan-name').innerText = plan;
        document.getElementById('modal-plan-price').innerText = price;
        document.getElementById('modal-plan-installments').innerText = installments;

        var finalBtn = modal.querySelector('.btn-final-action');
        var cardBoxFooter = modal.querySelector('.payment-box:last-child .payment-footer');

        if (plan === 'Aula gratuita') {
            finalBtn.href = 'https://wa.me/553597380206';
            finalBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Falar no WhatsApp para Agendar';
        } else if (link) {
            finalBtn.href = link;
            finalBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pagar no Cartão para Finalizar';
            if (cardBoxFooter) cardBoxFooter.innerText = 'Clique no botão abaixo para pagar no cartão via Mercado Pago.';
        } else {
            finalBtn.href = 'https://wa.me/553597380206';
            finalBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Falar no WhatsApp para Finalizar';
            if (cardBoxFooter) cardBoxFooter.innerText = 'Entre em contato no WhatsApp para pagar no cartão.';
        }

        var pixBox = modal.querySelector('.payment-box:first-child');
        var cardBox = modal.querySelector('.payment-box:last-child');
        if (plan === 'Aula gratuita' || plan === 'Coach Gratuito') {
            if (pixBox) pixBox.style.display = 'none';
            if (cardBox) cardBox.style.display = 'none';
        } else {
            if (pixBox) pixBox.style.display = 'block';
            if (cardBox) cardBox.style.display = 'block';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if (e.target.closest('.modal-close') || e.target.classList.contains('modal-overlay')) {
        var payModal = document.getElementById('payment-modal');
        if (payModal) {
            payModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    var copyBtn = e.target.closest('#copy-pix');
    if (copyBtn) {
        var input = document.getElementById('pix-key');
        if (input) {
            input.select();
            navigator.clipboard.writeText(input.value);
            var orig = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
            setTimeout(function () { copyBtn.innerHTML = '<i class="far fa-copy"></i> Copiar'; }, 2000);
        }
    }
});

if (typeof Swup !== 'undefined') {
    var swup = new Swup({ containers: ['#swup'] });
    swup.hooks.on('content:replace', function () {
        initAnimations();
        updateActiveLink();
        window.scrollTo(0, 0);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.classList.add('js-enabled');
    initAnimations();
    updateActiveLink();
    initProfileLightbox();
});

function initProfileLightbox() {
    var trigger = document.getElementById('profile-expand-trigger');
    if (!trigger) return;

    // Create lightbox element once
    var lightbox = document.createElement('div');
    lightbox.className = 'profile-lightbox';
    lightbox.innerHTML =
        '<div class="profile-lightbox-card">' +
        '<button class="profile-lightbox-close">&times;</button>' +
        '<img src="' + trigger.src + '" alt="' + trigger.alt + '">' +
        '<div class="profile-lightbox-info">' +
        '<h3>Challenger 1000+ LP</h3>' +
        '<p>Domínio total da fila Solo/Duo. Consistência comprovada no topo da tabela.</p>' +
        '</div>' +
        '</div>';
    document.body.appendChild(lightbox);

    function openLightbox() {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    trigger.addEventListener('click', openLightbox);

    // Close on overlay click (not card)
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    // Close on X button
    lightbox.querySelector('.profile-lightbox-close').addEventListener('click', closeLightbox);

    // Close on Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
}
