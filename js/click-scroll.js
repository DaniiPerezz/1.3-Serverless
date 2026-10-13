document.addEventListener('DOMContentLoaded', () => {
    const links = [...document.querySelectorAll('.navbar-nav .nav-link[href^="#section_"]')];
    const sections = links
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });

            const navbar = document.querySelector('#navbarNav');
            if (navbar.classList.contains('show')) {
                bootstrap.Collapse.getOrCreateInstance(navbar).hide();
            }
        });
    });

    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
            .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
        if (!visible) return;
        links.forEach((link) => {
            const active = link.hash === `#${visible.target.id}`;
            link.classList.toggle('active', active);
            link.classList.toggle('inactive', !active);
        });
    }, { rootMargin: '-88px 0px -65% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

    sections.forEach((section) => observer.observe(section));
});