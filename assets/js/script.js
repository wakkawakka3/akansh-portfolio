const updateLastUpdateTime = () => {
    const el = document.getElementById('lastUpdate');
    if (!el) return;

    const stored = localStorage.getItem('lastUpdate') || new Date().toISOString();
    if (!localStorage.getItem('lastUpdate')) {
        localStorage.setItem('lastUpdate', stored);
    }

    const lastDate = new Date(stored);
    const diff = Date.now() - lastDate.getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    let text = 'just now';
    if (days > 0) text = `updated ${days} day${days > 1 ? 's' : ''} ago`;
    else if (hours > 0) text = `updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
    else if (minutes > 0) text = `updated ${minutes} minute${minutes > 1 ? 's' : ''} ago`;

    el.textContent = `last update: ${text}`;
};

updateLastUpdateTime();
setInterval(updateLastUpdateTime, 60000);

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target && link.getAttribute('href') !== '#') {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
