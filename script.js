(function() {
    // ===================== CÁC LỚP =====================
    const classes = [
        "", "10TO", "10TI", "10LI", "10HO", "10SI", "10VA", "10SU", "10DI", "10TA1", "10TA2",
        "11TO", "11TI", "11LI", "11HO", "11SI", "11VA", "11SU", "11DI", "11TA1", "11TA2",
        "12TO", "12TI", "12LI", "12HO", "12SI", "12VA", "12SU", "12DI", "12TA"
    ];
    const N = classes.length - 1;

    // ⚠️ Ngày bắt đầu tuần 1
    const START_DATE = '2026-09-03';

    let selectedClassIndex = 1;
    let w = 1;                  
    let itemStep = 50;          
    let paddingTop = 0;         

    const scrollList = document.getElementById('scrollList');
    const scrollSelector = document.getElementById('scrollSelector');
    const weekValue = document.getElementById('weekValue');
    const showScheduleBtn = document.getElementById('showScheduleBtn');
    const modal = document.getElementById('myModal');
    const modalWeek = document.getElementById('modalWeek');
    const modalResult = document.getElementById('modalResult');

    function updateWeekFromDate() {
        const start = new Date(START_DATE);
        start.setHours(0,0,0,0);
        const today = new Date();
        today.setHours(0,0,0,0);
        const diffDays = Math.floor((today - start) / (1000*60*60*24));
        if (diffDays < 0) {
            w = 1;
        } else {
            w = Math.floor(diffDays / 7) + 1;
        }
        weekValue.textContent = w;
    }

    function initializeScrollList() {
        scrollList.innerHTML = '';
        classes.slice(1).forEach((className, index) => {
            const item = document.createElement('div');
            item.className = 'scroll-item';
            item.dataset.index = index + 1;
            item.textContent = className;
            scrollList.appendChild(item);
        });

        
        const firstItem = scrollList.querySelector('.scroll-item');
        if (firstItem) {
            const itemRect = firstItem.getBoundingClientRect();
            const itemHeight = itemRect.height;
            const itemMarginTop = parseFloat(getComputedStyle(firstItem).marginTop);
            const itemMarginBottom = parseFloat(getComputedStyle(firstItem).marginBottom);
            itemStep = itemHeight + itemMarginTop + itemMarginBottom;

            
            const containerHeight = scrollSelector.offsetHeight;
            paddingTop = Math.max(0, (containerHeight - itemHeight) / 2);
            
            scrollList.style.paddingTop = `${paddingTop}px`;
            scrollList.style.paddingBottom = `${paddingTop}px`;
        }

        updateScroll();
    }

    function updateScroll() {
        const items = scrollList.querySelectorAll('.scroll-item');
        items.forEach((item, idx) => {
            const index = idx + 1;
            item.classList.remove('active', 'previous', 'next', 'outer-previous', 'outer-next');
            if (index === selectedClassIndex) {
                item.classList.add('active');
            } else if (index === selectedClassIndex - 1) {
                item.classList.add('previous');
            } else if (index === selectedClassIndex + 1) {
                item.classList.add('next');
            } else if (index === selectedClassIndex - 2) {
                item.classList.add('outer-previous');
            } else if (index === selectedClassIndex + 2) {
                item.classList.add('outer-next');
            }
        });

        const containerHeight = scrollSelector.offsetHeight;
        const itemActive = scrollList.querySelector('.scroll-item.active');
        if (itemActive) {
            const itemActiveHeight = itemActive.getBoundingClientRect().height;
            const activeCenterFromTop = paddingTop + (selectedClassIndex - 1) * itemStep + itemActiveHeight / 2;
            const translateY = containerHeight / 2 - activeCenterFromTop;
            scrollList.style.transform = `translateY(${translateY}px)`;
        }
    }

    function moveClass(direction) {
        const newIndex = selectedClassIndex + direction;
        if (newIndex >= 1 && newIndex <= N) {
            selectedClassIndex = newIndex;
            updateScroll();
        }
    }

    // ===================== XỬ LÝ SỰ KIỆN =====================
    showScheduleBtn.addEventListener('click', () => {
        const class1 = classes[selectedClassIndex];
        const cycle = N - 1;                       
        const shift = ((w - 1) % cycle) + 1;       
        const nextIndex = ((selectedClassIndex - 1 + shift) % N) + 1;
        const class2 = classes[nextIndex];

        modalWeek.textContent = w;
        modalResult.innerHTML = `${class1} trực ${class2}`;
        modal.style.display = 'flex';
    });

    window.closeModal = function() {
        modal.style.display = 'none';
    };

    // Cuộn bằng chuột
    scrollSelector.addEventListener('wheel', (e) => {
        e.preventDefault();
        moveClass(e.deltaY > 0 ? 1 : -1);
    }, { passive: false });

    // Cuộn bằng cảm ứng
    let startY = 0;
    scrollSelector.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    }, { passive: true });
    scrollSelector.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const deltaY = e.touches[0].clientY - startY;
        if (Math.abs(deltaY) > 20) {
            moveClass(deltaY > 0 ? -1 : 1);
            startY = e.touches[0].clientY;
        }
    }, { passive: false });

    // Chọn bằng click
    scrollList.addEventListener('click', (e) => {
        const item = e.target.closest('.scroll-item');
        if (item) {
            const newIndex = parseInt(item.dataset.index, 10);
            if (newIndex !== selectedClassIndex) {
                selectedClassIndex = newIndex;
                updateScroll();
            }
        }
    });

    // Điều khiển bằng bàn phím
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            moveClass(-1);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            moveClass(1);
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Khởi tạo
    function init() {
        updateWeekFromDate();
        initializeScrollList();
        const container = document.getElementById('mainContainer');
        container.style.opacity = '1';
    }

    window.onload = init;
})();
