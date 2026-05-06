(function () {
    const THEME_STORAGE_KEY = 'ycsun-theme-mode';
    const THEME_MODES = ['auto', 'light', 'dark'];
    const AUTO_DAY_START = 7;
    const AUTO_NIGHT_START = 19;

    let container, scrollContent, scrollThumb, scrollTrack;
    let themeToggleButton, themeToggleIcon, themeToggleText;

    function getStoredThemeMode() {
        try {
            const storedMode = localStorage.getItem(THEME_STORAGE_KEY) || 'auto';
            return THEME_MODES.includes(storedMode) ? storedMode : 'auto';
        } catch (error) {
            return 'auto';
        }
    }

    function saveThemeMode(mode) {
        try {
            if (mode === 'auto') {
                localStorage.removeItem(THEME_STORAGE_KEY);
                return;
            }

            localStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (error) {
            console.warn('Theme preference could not be saved:', error);
        }
    }

    function getAutoTheme() {
        const hour = new Date().getHours();
        return hour >= AUTO_DAY_START && hour < AUTO_NIGHT_START ? 'light' : 'dark';
    }

    function getThemeState(mode, resolvedTheme) {
        if (mode === 'auto') {
            return {
                icon: resolvedTheme === 'light' ? '☀' : '☾',
                label: 'Auto'
            };
        }

        if (mode === 'light') {
            return {
                icon: '☀',
                label: 'Day'
            };
        }

        return {
            icon: '☾',
            label: 'Night'
        };
    }

    function getNextThemeMode(mode) {
        const currentIndex = THEME_MODES.indexOf(mode);
        return THEME_MODES[(currentIndex + 1) % THEME_MODES.length];
    }

    function applyThemeMode(mode) {
        const safeMode = THEME_MODES.includes(mode) ? mode : 'auto';
        const resolvedTheme = safeMode === 'auto' ? getAutoTheme() : safeMode;

        document.documentElement.dataset.themeMode = safeMode;
        document.documentElement.dataset.theme = resolvedTheme;
        updateThemeToggle(safeMode, resolvedTheme);

        return resolvedTheme;
    }

    function updateThemeToggle(mode, resolvedTheme) {
        if (!themeToggleButton || !themeToggleIcon || !themeToggleText) {
            return;
        }

        const currentState = getThemeState(mode, resolvedTheme);
        const nextMode = getNextThemeMode(mode);
        const nextState = getThemeState(nextMode, nextMode === 'auto' ? getAutoTheme() : nextMode);

        themeToggleButton.dataset.mode = mode;
        themeToggleButton.title = `Theme mode: ${currentState.label}. Click to switch to ${nextState.label}.`;
        themeToggleButton.setAttribute('aria-label', `Theme mode: ${currentState.label}. Click to switch to ${nextState.label}.`);
        themeToggleIcon.textContent = currentState.icon;
        themeToggleText.textContent = currentState.label;
    }

    function refreshAutoTheme() {
        const currentMode = document.documentElement.dataset.themeMode || getStoredThemeMode();

        if (currentMode === 'auto') {
            applyThemeMode('auto');
        }
    }

    function initThemeToggle() {
        themeToggleButton = document.getElementById('themeToggle');
        themeToggleIcon = document.getElementById('themeToggleIcon');
        themeToggleText = document.getElementById('themeToggleText');

        if (!themeToggleButton || !themeToggleIcon || !themeToggleText) {
            return;
        }

        applyThemeMode(getStoredThemeMode());

        themeToggleButton.addEventListener('click', () => {
            const currentMode = document.documentElement.dataset.themeMode || getStoredThemeMode();
            const nextMode = getNextThemeMode(currentMode);

            saveThemeMode(nextMode);
            applyThemeMode(nextMode);
        });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                refreshAutoTheme();
            }
        });

        window.addEventListener('focus', refreshAutoTheme);
    }

    function initScrollbar() {
        container = document.querySelector('.research-container');
        scrollContent = document.getElementById('researchScroll');
        scrollThumb = document.querySelector('.scrollbar-thumb');
        scrollTrack = document.querySelector('.scrollbar-track');

        if (!container || !scrollContent) {
            console.error('Required elements not found');
            return;
        }

        // 初始化视频点击放大功能
        initVideoModal();

        if (scrollThumb && scrollTrack) {
            updateThumbSize();
            updateScrollbar();
            container.addEventListener('scroll', updateScrollbar);

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    updateThumbSize();
                    updateScrollbar();
                }, 100);
            });

            let isDragging = false;
            let startX, startScrollLeft;

            scrollThumb.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
                startScrollLeft = container.scrollLeft;
                document.body.style.userSelect = 'none';
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const deltaX = e.clientX - startX;
                const maxScroll = scrollContent.scrollWidth - container.offsetWidth;
                const thumbMaxMove = scrollTrack.offsetWidth - scrollThumb.offsetWidth;
                const newScrollLeft = startScrollLeft + (deltaX / thumbMaxMove) * maxScroll;
                container.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                document.body.style.userSelect = '';
            });

            scrollThumb.addEventListener('touchstart', (e) => {
                isDragging = true;
                startX = e.touches[0].clientX;
                startScrollLeft = container.scrollLeft;
            });

            document.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const deltaX = e.touches[0].clientX - startX;
                const maxScroll = scrollContent.scrollWidth - container.offsetWidth;
                const thumbMaxMove = scrollTrack.offsetWidth - scrollThumb.offsetWidth;
                const newScrollLeft = startScrollLeft + (deltaX / thumbMaxMove) * maxScroll;
                container.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
            });

            document.addEventListener('touchend', () => {
                isDragging = false;
            });
        }
    }

    function updateThumbSize() {
        if (!container || !scrollContent || !scrollThumb || !scrollTrack) return;
        const containerWidth = container.offsetWidth;
        const contentWidth = scrollContent.scrollWidth;
        const thumbWidth = Math.max((containerWidth / contentWidth) * 100, 10);
        scrollThumb.style.width = `${thumbWidth}%`;
    }

    function updateScrollbar() {
        if (!container || !scrollContent || !scrollThumb || !scrollTrack) return;
        const maxScroll = scrollContent.scrollWidth - container.offsetWidth;
        if (maxScroll <= 0) {
            scrollThumb.style.display = 'none';
            return;
        }
        scrollThumb.style.display = 'block';
        const scrollRatio = container.scrollLeft / maxScroll;
        const thumbMaxMove = scrollTrack.offsetWidth - scrollThumb.offsetWidth;
        scrollThumb.style.left = `${scrollRatio * thumbMaxMove}px`;
    }

    function initVideoModal() {
        const modal = document.getElementById('videoModal');
        const modalVideo = document.getElementById('modalVideo');
        const closeBtn = document.querySelector('.close');

        if (!modal || !modalVideo || !closeBtn) {
            console.error('Modal elements not found');
            return;
        }

        document.querySelectorAll('.research-item video').forEach(video => {
            video.addEventListener('click', function () {
                const source = this.querySelector('source').src;
                console.log('播放视频:', source); // 调试视频路径
                modalVideo.src = source;
                modalVideo.load();
                modalVideo.play();
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeModal() {
            modalVideo.pause();
            modalVideo.src = ''; // 清空源以释放内存
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        });

        // 阻止模态框内容点击事件冒泡
        document.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Intersection Observer - 智能加载视频
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // 视频进入视口时开始播放
                if (video.paused) {
                    video.play().catch(err => console.log('Video play failed:', err));
                }
            } else {
                // 视频离开视口时暂停
                video.pause();
            }
        });
    }, {
        threshold: 0.5, // 50% 可见时触发
        rootMargin: '50px' // 提前50px开始加载
    });

    // 监听所有 research 区域的视频
    document.addEventListener('DOMContentLoaded', () => {
        const videos = document.querySelectorAll('#research .media');
        videos.forEach(video => {
            videoObserver.observe(video);

            // 移除 autoplay，改为手动控制
            video.removeAttribute('autoplay');
        });

        initThemeToggle();
    });

    document.addEventListener('DOMContentLoaded', initScrollbar);
})();
