// ==============================================
// Mobile Menu Slide from Right
// ==============================================
const menuBtn = document.getElementById('mobile-menu-btn');
const sidebar = document.getElementById('mobile-sidebar');
const closeBtn = document.getElementById('close-mobile-menu');
const overlay = document.getElementById('mobile-overlay');

// فتح القائمة
menuBtn.addEventListener('click', function () {
    sidebar.style.right = '0';
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
});

// إغلاق القائمة (زر × أو الـ overlay)
function closeMenu() {
    sidebar.style.right = '-100%';
    overlay.classList.add('hidden');
    document.body.style.overflow = ''; // رجوع التمرير
}

closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

// إغلاق لما تضغط على أي رابط في القائمة (اختياري)
sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});