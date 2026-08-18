/* View switching for simple.html. Each nav item is a view; only one renders at a
   time. The hash keeps views linkable and the back button working. Without
   JavaScript every view stays visible, which reads as one plain long page. */
(function () {
    const VIEWS = {
        readme: 'README',
        papers: 'SELECTED PAPERS'
    };
    const DEFAULT_VIEW = 'readme';
    const NAME = 'Yichong SUN (孙艺崇)';

    let heading, sections, links, sidebar;

    function viewFromHash() {
        const name = (window.location.hash || '').replace('#', '');
        return Object.prototype.hasOwnProperty.call(VIEWS, name) ? name : DEFAULT_VIEW;
    }

    function showView(name) {
        const view = VIEWS[name] ? name : DEFAULT_VIEW;

        sections.forEach((section) => {
            section.toggleAttribute('data-active', section.dataset.view === view);
        });

        links.forEach((link) => {
            const isCurrent = link.getAttribute('href') === '#' + view;

            link.toggleAttribute('data-active', isCurrent);

            if (isCurrent) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        if (sidebar) {
            sidebar.toggleAttribute('data-active', view === DEFAULT_VIEW);
        }

        heading.textContent = VIEWS[view];
        document.title = VIEWS[view] + ' | ' + NAME;
    }

    function init() {
        heading = document.querySelector('main h1');
        sections = Array.from(document.querySelectorAll('.view'));
        links = Array.from(document.querySelectorAll('header nav a[href^="#"]'));
        sidebar = document.querySelector('.sidebar');

        if (!heading || !sections.length) {
            return;
        }

        links.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const name = link.getAttribute('href').slice(1);

                if (name !== viewFromHash()) {
                    window.history.pushState({ view: name }, '', '#' + name);
                }

                showView(name);
                window.scrollTo(0, 0);
            });
        });

        /* Sections carry data-view rather than a matching id, so the hash never names
           a real element and the browser has nothing to scroll to on load. */
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        window.addEventListener('popstate', () => showView(viewFromHash()));

        /* Covers a hash edited in the address bar and stale links such as #elsewhere,
           which viewFromHash falls back to the default for. pushState above does not
           fire this event, so there is no double handling. */
        window.addEventListener('hashchange', () => showView(viewFromHash()));
        showView(viewFromHash());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
