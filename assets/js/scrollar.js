(function () {
    let container, scrollContent, scrollThumb, scrollTrack;

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

    document.addEventListener('DOMContentLoaded', initScrollbar);
})();
