// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDyTNELJ64dENsrxrg_AKlNgwZwjB2tDv0",
    authDomain: "mix-crepe-zayat.firebaseapp.com",
    databaseURL: "https://mix-crepe-zayat-default-rtdb.firebaseio.com",
    projectId: "mix-crepe-zayat",
    storageBucket: "mix-crepe-zayat.firebasestorage.app",
    messagingSenderId: "94038086017",
    appId: "1:94038086017:web:333933ab60bd944e0c1880"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// متغيرات للـ Modal
let currentEditType = ''; // 'category' | 'item' | 'offer'
let currentEditId = '';
let currentDeleteType = '';
let currentDeleteId = '';

// Auth functions
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => showAdminPanel())
        .catch(error => document.getElementById('auth-error').textContent = error.message);
}

function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => showAdminPanel())
        .catch(error => document.getElementById('auth-error').textContent = error.message);
}

function logout() {
    auth.signOut().then(() => {
        document.getElementById('admin-panel').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    });
}

function showAdminPanel() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
    loadCategories();
    loadOffers();
}

auth.onAuthStateChanged(user => {
    if (user) showAdminPanel();
});

// دالة عرض رسالة نجاح/خطأ
function showMessage(section, msg, isError = false) {
    const elem = document.getElementById(`${section}-message`);
    if (elem) {
        elem.textContent = msg;
        elem.className = `mt-2 font-medium ${isError ? 'text-red-500' : 'text-green-500'}`;
        setTimeout(() => elem.textContent = '', isError ? 5000 : 3000);
    }
}

// Modal التعديل
function openEditModal(type, id, data) {
    currentEditType = type;
    currentEditId = id;

    document.getElementById('modal-title').textContent =
        type === 'category' ? 'تعديل الصنف' :
            type === 'item' ? 'تعديل العنصر' : 'تعديل العرض';

    const fields = document.getElementById('modal-fields');
    fields.innerHTML = '';

    fields.innerHTML += `
            <label class="block mb-1 font-medium">الاسم</label>
            <input type="text" id="edit-name" value="${escapeHtml(data.name)}" class="w-full p-2 border rounded mb-4">
            <label class="block mb-1 font-medium">الوصف</label>
            <textarea id="edit-desc" class="w-full p-2 border rounded mb-4">${escapeHtml(data.description || '')}</textarea>
        `;

    if (type === 'item') {
        fields.innerHTML += `
                <label class="block mb-1 font-medium">السعر (جنيه)</label>
                <input type="number" id="edit-price" value="${data.price}" class="w-full p-2 border rounded mb-4">
            `;
    }

    if (type !== 'category') {
        fields.innerHTML += `
                <label class="block mb-1 font-medium">لينك الصورة (اختياري)</label>
                <input type="url" id="edit-image-url" value="${data.imageUrl || ''}" class="w-full p-2 border rounded">
            `;
    }

    document.getElementById('modal-message').textContent = '';
    document.getElementById('edit-modal').classList.remove('hidden');
    document.getElementById('edit-modal').classList.add('flex');
}

async function saveEdit() {
    const msgElem = document.getElementById('modal-message');
    msgElem.textContent = '';
    msgElem.className = 'mt-2 font-medium';

    try {
        const updates = {
            name: document.getElementById('edit-name').value.trim(),
            description: document.getElementById('edit-desc').value.trim()
        };

        if (currentEditType === 'item') {
            updates.price = parseFloat(document.getElementById('edit-price').value);
            if (isNaN(updates.price)) throw new Error('السعر غير صحيح');
        }

        if (currentEditType !== 'category') {
            const newUrl = document.getElementById('edit-image-url').value.trim();
            if (newUrl) updates.imageUrl = newUrl;
        }

        if (!updates.name) throw new Error('الاسم مطلوب');

        const collection = currentEditType === 'category' ? 'categories' :
            currentEditType === 'item' ? 'menuItems' : 'offers';

        await db.collection(collection).doc(currentEditId).update(updates);

        msgElem.textContent = 'تم التعديل بنجاح';
        msgElem.classList.add('text-green-500');

        setTimeout(() => {
            closeModal();
            if (currentEditType === 'category') loadCategories();
            else if (currentEditType === 'item') loadItems();
            else loadOffers();
        }, 1000);
    } catch (error) {
        msgElem.textContent = error.message || 'حدث خطأ';
        msgElem.classList.add('text-red-500');
    }
}

function closeModal() {
    document.getElementById('edit-modal').classList.add('hidden');
    document.getElementById('edit-modal').classList.remove('flex');
}

// Modal الحذف
function openDeleteModal(type, id) {
    currentDeleteType = type;
    currentDeleteId = id;
    document.getElementById('delete-modal').classList.remove('hidden');
    document.getElementById('delete-modal').classList.add('flex');
}

async function confirmDelete() {
    try {
        const collection = currentDeleteType === 'category' ? 'categories' :
            currentDeleteType === 'item' ? 'menuItems' : 'offers';

        await db.collection(collection).doc(currentDeleteId).delete();

        if (currentDeleteType === 'category') {
            const itemsSnapshot = await db.collection('menuItems').where('categoryId', '==', currentDeleteId).get();
            const batch = db.batch();
            itemsSnapshot.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
        }

        closeDeleteModal();
        showMessage(currentDeleteType, 'تم الحذف بنجاح');

        if (currentDeleteType === 'category') loadCategories();
        else if (currentDeleteType === 'item') loadItems();
        else loadOffers();
    } catch (error) {
        showMessage(currentDeleteType, error.message || 'حدث خطأ في الحذف', true);
        closeDeleteModal();
    }
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
    document.getElementById('delete-modal').classList.remove('flex');
}

// Categories
async function addCategory() {
    const name = document.getElementById('new-category').value.trim();
    if (!name) return showMessage('categories', 'أدخل اسم الصنف', true);

    try {
        await db.collection('categories').add({ name });
        document.getElementById('new-category').value = '';
        loadCategories(); // هيحدث الـ list والـ select معاً بدون تكرار
        showMessage('categories', 'تم إضافة الصنف بنجاح');
    } catch (error) {
        showMessage('categories', error.message || 'حدث خطأ', true);
    }
}

async function loadCategories() {
    const list = document.getElementById('categories-list');
    const select = document.getElementById('select-category');
    list.innerHTML = '';
    select.innerHTML = '<option value="">اختر صنف</option>';

    try {
        const snapshot = await db.collection('categories').orderBy('name').get();
        snapshot.forEach(doc => {
            const data = doc.data();

            // إضافة إلى الـ list
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center p-3 bg-gray-200 rounded';
            li.innerHTML = `
                    <span class="font-medium">${data.name}</span>
                    <div class="flex gap-2">
                        <button onclick="openEditModal('category', '${doc.id}', {name: '${escapeHtml(data.name)}'})" class="bg-yellow-500 text-white px-3 py-1 rounded text-sm">تعديل</button>
                        <button onclick="openDeleteModal('category', '${doc.id}')" class="bg-red-500 text-white px-3 py-1 rounded text-sm">حذف</button>
                    </div>
                `;
            list.appendChild(li);

            // إضافة إلى الـ select
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = data.name;
            select.appendChild(option);
        });
    } catch (error) {
        showMessage('categories', 'خطأ في تحميل الأصناف: ' + error.message, true);
    }
}

// Items
async function addItem() {
    const categoryId = document.getElementById('select-category').value;
    const name = document.getElementById('item-name').value.trim();
    const desc = document.getElementById('item-desc').value.trim();
    const price = parseFloat(document.getElementById('item-price').value);
    const imageUrl = document.getElementById('item-image-url').value.trim();

    if (!categoryId || !name || !desc || isNaN(price)) {
        return showMessage('items', 'املأ جميع الحقول بشكل صحيح', true);
    }

    try {
        await db.collection('menuItems').add({
            categoryId,
            name,
            description: desc,
            price,
            imageUrl: imageUrl || ''
        });

        document.getElementById('item-name').value = '';
        document.getElementById('item-desc').value = '';
        document.getElementById('item-price').value = '';
        document.getElementById('item-image-url').value = '';

        loadItems();
        showMessage('items', 'تم إضافة العنصر بنجاح');
    } catch (error) {
        showMessage('items', error.message || 'حدث خطأ', true);
    }
}

async function loadItems() {
    const categoryId = document.getElementById('select-category').value;
    const list = document.getElementById('items-list');
    list.innerHTML = '';

    if (!categoryId) {
        list.innerHTML = '<p class="text-center text-gray-500">اختر صنف لعرض العناصر</p>';
        return;
    }

    try {
        const snapshot = await db.collection('menuItems').where('categoryId', '==', categoryId).get();
        if (snapshot.empty) {
            list.innerHTML = '<p class="text-center text-gray-500">لا يوجد عناصر في هذا الصنف</p>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const li = document.createElement('li');
            li.className = 'p-4 bg-gray-200 rounded';
            li.innerHTML = `
                    <div class="flex justify-between items-start gap-4">
                        <div class="flex-1">
                            <h3 class="font-bold text-lg">${data.name}</h3>
                            <p class="text-gray-700">${data.description || ''}</p>
                            <p class="font-bold text-red-600 mt-1">${data.price} جنيه</p>
                            ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.name}" class="w-32 h-32 object-cover mt-3 rounded-lg">` : ''}
                        </div>
                        <div class="flex flex-col gap-2">
                            <button onclick="openEditModal('item', '${doc.id}', {name: '${escapeHtml(data.name)}', description: '${escapeHtml(data.description || '')}', price: ${data.price}, imageUrl: '${data.imageUrl || ''}'})" class="bg-yellow-500 text-white px-3 py-1 rounded text-sm">تعديل</button>
                            <button onclick="openDeleteModal('item', '${doc.id}')" class="bg-red-500 text-white px-3 py-1 rounded text-sm">حذف</button>
                        </div>
                    </div>
                `;
            list.appendChild(li);
        });
    } catch (error) {
        list.innerHTML = '<p class="text-center text-red-500">خطأ في تحميل العناصر: ' + error.message + '</p>';
    }
}

// Offers
async function addOffer() {
    const name = document.getElementById('offer-name').value.trim();
    const desc = document.getElementById('offer-desc').value.trim();
    const imageUrl = document.getElementById('offer-image-url').value.trim();

    if (!name || !desc || !imageUrl) {
        return showMessage('offers', 'املأ جميع الحقول', true);
    }

    try {
        await db.collection('offers').add({
            name,
            description: desc,
            imageUrl
        });

        document.getElementById('offer-name').value = '';
        document.getElementById('offer-desc').value = '';
        document.getElementById('offer-image-url').value = '';

        loadOffers();
        showMessage('offers', 'تم إضافة العرض بنجاح');
    } catch (error) {
        showMessage('offers', error.message || 'حدث خطأ', true);
    }
}

async function loadOffers() {
    const list = document.getElementById('offers-list');
    list.innerHTML = '';

    try {
        const snapshot = await db.collection('offers').orderBy('name').get();
        if (snapshot.empty) {
            list.innerHTML = '<p class="text-center text-gray-500">لا يوجد عروض حالياً</p>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const li = document.createElement('li');
            li.className = 'p-4 bg-gray-200 rounded';
            li.innerHTML = `
                    <div class="flex justify-between items-start gap-4">
                        <div class="flex-1">
                            <h3 class="font-bold text-xl">${data.name}</h3>
                            <p class="text-gray-700">${data.description || ''}</p>
                            ${data.imageUrl ? `<img src="${data.imageUrl}" alt="${data.name}" class="w-40 h-40 object-cover mt-3 rounded-lg">` : ''}
                        </div>
                        <div class="flex flex-col gap-2">
                            <button onclick="openEditModal('offer', '${doc.id}', {name: '${escapeHtml(data.name)}', description: '${escapeHtml(data.description || '')}', imageUrl: '${data.imageUrl || ''}'})" class="bg-yellow-500 text-white px-3 py-1 rounded text-sm">تعديل</button>
                            <button onclick="openDeleteModal('offer', '${doc.id}')" class="bg-red-500 text-white px-3 py-1 rounded text-sm">حذف</button>
                        </div>
                    </div>
                `;
            list.appendChild(li);
        });
    } catch (error) {
        list.innerHTML = '<p class="text-center text-red-500">خطأ في تحميل العروض: ' + error.message + '</p>';
    }
}

// دالة مساعدة لتجنب مشاكل الـ quotes
function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
}