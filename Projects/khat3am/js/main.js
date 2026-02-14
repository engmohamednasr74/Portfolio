function updateCartCount() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const latestCart = JSON.parse(localStorage.getItem('khtaam_cart')) || [];
        const totalItems = latestCart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// دالة إضافة للمنتج
function addToCart(id, name, price, img) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, img, quantity: 1 });
    }
    localStorage.setItem('khtaam_cart', JSON.stringify(cart));
    updateCartCount();
}

// تشغيل عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (typeof lucide !== 'undefined') { lucide.createIcons(); }
});