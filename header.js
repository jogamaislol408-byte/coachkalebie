document.addEventListener('DOMContentLoaded', function () {
    var nav = document.getElementById('navbar');
    if (!nav) {
        setTimeout(function () {
            nav = document.getElementById('navbar');
            if (nav) initScroll();
        }, 500);
    } else {
        initScroll();
    }

    function initScroll() {
        function handleScroll() {
            var scrollY = window.scrollY || window.pageYOffset;
            if (scrollY > 40) {
                if (!nav.classList.contains('scrolled')) nav.classList.add('scrolled');
            } else {
                if (nav.classList.contains('scrolled')) nav.classList.remove('scrolled');
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }
});
