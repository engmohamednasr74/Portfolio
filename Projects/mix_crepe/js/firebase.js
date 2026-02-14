// Firebase Config (نفس اللي في admin.html)
const firebaseConfig = {
    apiKey: "AIzaSyDyTNELJ64dENsrxrg_AKlNgwZwjB2tDv0",
    authDomain: "mix-crepe-zayat.firebaseapp.com",
    databaseURL: "https://mix-crepe-zayat-default-rtdb.firebaseio.com",
    projectId: "mix-crepe-zayat",
    storageBucket: "mix-crepe-zayat.firebasestorage.app",
    messagingSenderId: "94038086017",
    appId: "1:94038086017:web:333933ab60bd944e0c1880"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// تحميل المنيو real-time
function loadMenu() {
    const loading = document.getElementById('loading');
    const tabsContainer = document.getElementById('menu-tabs');
    const itemsContainer = document.getElementById('menu-items');

    // تحميل الأصناف (categories)
    db.collection('categories').orderBy('name').onSnapshot(categoriesSnapshot => {
        tabsContainer.innerHTML = '';
        if (categoriesSnapshot.empty) {
            loading.textContent = 'لا يوجد أصناف في المنيو حالياً';
            tabsContainer.classList.add('hidden');
            return;
        }

        categoriesSnapshot.forEach(catDoc => {
            const catData = catDoc.data();
            const tabBtn = document.createElement('button');
            tabBtn.textContent = catData.name;
            tabBtn.className = 'px-6 py-3 bg-gray-200 rounded-full hover:bg-red-600 hover:text-white transition mx-2 my-2';
            tabBtn.onclick = () => {
                // إضافة active class للـ tab المختار
                document.querySelectorAll('#menu-tabs button').forEach(btn => btn.classList.remove('bg-red-600', 'text-white'));
                tabBtn.classList.add('bg-red-600', 'text-white');
                showCategory(catDoc.id);
            };
            tabsContainer.appendChild(tabBtn);
        });

        // إخفاء الـ loading وإظهار الـ tabs
        loading.classList.add('hidden');
        tabsContainer.classList.remove('hidden');

        // عرض أول صنف تلقائياً
        if (categoriesSnapshot.size > 0) {
            const firstCatId = categoriesSnapshot.docs[0].id;
            document.querySelector('#menu-tabs button').classList.add('bg-red-600', 'text-white');
            showCategory(firstCatId);
        }
    }, error => {
        loading.textContent = 'خطأ في تحميل المنيو: ' + error.message;
    });

    // دالة عرض عناصر الصنف (real-time كمان)
    function showCategory(catId) {
        itemsContainer.innerHTML = '<p class="text-center text-gray-600 col-span-full">جاري تحميل المنيو...</p>';

        db.collection('menuItems')
            .where('categoryId', '==', catId)
            .onSnapshot(itemsSnapshot => {
                itemsContainer.innerHTML = '';
                if (itemsSnapshot.empty) {
                    itemsContainer.innerHTML = '<p class="text-center text-gray-600 col-span-full text-xl">لا يوجد منيو حالياً</p>';
                    return;
                }

                itemsSnapshot.forEach(itemDoc => {
                    const item = itemDoc.data();
                    const card = document.createElement('div');
                    card.className = 'bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow';
                    card.innerHTML = `
                            <img src="${item.imageUrl || 'placeholder.jpg'}" alt="${item.name}" class="w-full h-48 object-cover rounded mb-4">
                            <h3 class="text-2xl font-bold mb-2">${item.name}</h3>
                            <p class="text-gray-600 mb-4">${item.description || ''}</p>
                            <p class="text-xl font-bold text-red-600">${item.price} جنيه</p>
                        `;
                    itemsContainer.appendChild(card);
                });
            }, error => {
                itemsContainer.innerHTML = '<p class="text-center text-red-500 col-span-full">خطأ: ' + error.message + '</p>';
            });
    }
}

function loadOffers() {
    const loading = document.getElementById('offers-loading');
    const itemsContainer = document.getElementById('offers-items');

    db.collection('offers').orderBy('name').onSnapshot(snapshot => {
        itemsContainer.innerHTML = '';
        if (snapshot.empty) {
            itemsContainer.innerHTML = '<p class="text-center text-gray-600 col-span-full text-xl">لا يوجد عروض حالياً</p>';
            loading.classList.add('hidden');
            return;
        }

        snapshot.forEach(doc => {
            const offer = doc.data();
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow';
            card.innerHTML = `
                        <img src="${offer.imageUrl || 'placeholder.jpg'}" alt="${offer.name}" class="w-full h-64 object-cover rounded mb-4">
                        <h3 class="text-3xl font-bold mb-2 text-red-600">${offer.name}</h3>
                        <p class="text-gray-700 text-lg">${offer.description || ''}</p>
                    `;
            itemsContainer.appendChild(card);
        });

        loading.classList.add('hidden');
    }, error => {
        loading.textContent = 'خطأ في تحميل العروض: ' + error.message;
    });
}
// شغل التحميلات
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    loadOffers();
});