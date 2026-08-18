/* Shared day/night theme toggle. Used by index.html and simple.html. */
(function () {
    const THEME_STORAGE_KEY = 'ycsun-theme-mode';
    const THEMES = ['light', 'dark'];
    const TOGGLE_INTERVAL = 300;

    let toggleButton, toggleIcon, toggleText;
    let lastToggleAt = 0;

    function getSystemTheme() {
        try {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } catch (error) {
            return 'light';
        }
    }

    function getStoredTheme() {
        try {
            const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            return THEMES.includes(storedTheme) ? storedTheme : null;
        } catch (error) {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (error) {
            console.warn('Theme preference could not be saved:', error);
        }
    }

    function getThemeState(theme) {
        return theme === 'dark'
            ? { icon: '☾', label: 'Night' }
            : { icon: '☀', label: 'Day' };
    }

    function applyTheme(theme) {
        const safeTheme = THEMES.includes(theme) ? theme : getSystemTheme();

        document.documentElement.dataset.theme = safeTheme;
        updateToggle(safeTheme);

        return safeTheme;
    }

    function updateToggle(theme) {
        if (!toggleButton) {
            return;
        }

        const currentState = getThemeState(theme);
        const nextState = getThemeState(theme === 'dark' ? 'light' : 'dark');
        const description = `${currentState.label} mode. Click to switch to ${nextState.label}.`;

        toggleButton.dataset.mode = theme;
        toggleButton.title = description;
        toggleButton.setAttribute('aria-label', description);

        if (toggleIcon) {
            toggleIcon.textContent = currentState.icon;
        }

        if (toggleText) {
            toggleText.textContent = currentState.label;
        }
    }

    function initThemeToggle() {
        toggleButton = document.getElementById('themeToggle');
        toggleIcon = document.getElementById('themeToggleIcon');
        toggleText = document.getElementById('themeToggleText');

        applyTheme(document.documentElement.dataset.theme || getStoredTheme() || getSystemTheme());

        if (!toggleButton) {
            return;
        }

        function switchTheme() {
            const now = Date.now();

            if (now - lastToggleAt < TOGGLE_INTERVAL) {
                return;
            }

            lastToggleAt = now;
            const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';

            saveTheme(nextTheme);
            applyTheme(nextTheme);
        }

        toggleButton.addEventListener('click', switchTheme);
        toggleButton.addEventListener('touchend', (event) => {
            event.preventDefault();
            switchTheme();
        }, { passive: false });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeToggle);
    } else {
        initThemeToggle();
    }
})();
