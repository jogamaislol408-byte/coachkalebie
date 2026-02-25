(function () {
    var STORAGE_KEY = 'kalebie_intro_v6';
    var DURATION_TEXT = 3700;
    var DURATION_CURTAIN = 1500;

    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, 'true');

    document.body.style.overflow = 'hidden';

    var container = document.createElement('div');
    container.id = 'intro-overlay';
    container.innerHTML =
        '<div class="curtain curtain-left"></div>' +
        '<div class="curtain curtain-right"></div>' +
        '<div class="intro-text-container">' +
        '<h1 class="intro-text">NÃO É SORTE.<br>É <span style="color:#E10600;">TÉCNICA</span>.</h1>' +
        '</div>';
    document.body.prepend(container);

    window._musicPlayRequested = true;

    if (window._musicReady && window.musicApp && window.musicApp.player) {
        window.musicApp.forcePlay();
    }

    var musicCheck = setInterval(function () {
        if (window._musicReady && window.musicApp && window.musicApp.player) {
            clearInterval(musicCheck);
            window.musicApp.forcePlay();
        }
    }, 50);

    setTimeout(function () { clearInterval(musicCheck); }, 15000);

    requestAnimationFrame(function () {
        var text = container.querySelector('.intro-text');
        text.classList.add('visible');

        setTimeout(function () {
            text.classList.remove('visible');
            text.classList.add('fade-out');
        }, DURATION_TEXT);

        setTimeout(function () {
            container.querySelector('.curtain-left').style.transform = 'translateX(-100%)';
            container.querySelector('.curtain-right').style.transform = 'translateX(100%)';

            setTimeout(function () {
                container.style.opacity = '0';
                setTimeout(function () {
                    if (container.parentNode) container.parentNode.removeChild(container);
                    document.body.style.overflow = '';
                }, 500);
            }, DURATION_CURTAIN);
        }, DURATION_TEXT + 500);
    });
})();
