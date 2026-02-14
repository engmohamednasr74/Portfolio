// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');

mobileMenuButton.addEventListener('click', () => {
    // تبديل الفتح/الإغلاق
    mobileMenu.classList.toggle('max-h-0');
    mobileMenu.classList.toggle('max-h-screen'); // قيمة كبيرة عشان تفتح كامل

    // تبديل الأيقونة (من menu إلى X والعكس)
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
});

// إغلاق المنيو لما تضغط على أي لينك داخلها (اختياري لتجربة أفضل)
mobileMenu.querySelectorAll('button, a').forEach(item => {
    item.addEventListener('click', () => {
        mobileMenu.classList.add('max-h-0');
        mobileMenu.classList.remove('max-h-screen');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    });
});