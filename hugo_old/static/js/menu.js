document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('menu-toggle');
    const overlay = document.getElementById('menu-overlay');
    const close = document.getElementById('menu-close');

    function openMenu() {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (toggle && overlay) {
        toggle.addEventListener('click', openMenu);
        if (close) close.addEventListener('click', closeMenu);
        overlay.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeMenu();
        });
    }
});
