const firebaseConfig = {
    apiKey: "AIzaSyBJlRgbyWRMMLn0U2POvd9apQ_q7kKx32o",
    authDomain: "kean-eradah-shabab-masr.firebaseapp.com",
    databaseURL: "https://kean-eradah-shabab-masr-default-rtdb.firebaseio.com",
    projectId: "kean-eradah-shabab-masr",
    storageBucket: "kean-eradah-shabab-masr.firebasestorage.app",
    messagingSenderId: "425589069316",
    appId: "1:425589069316:web:2dd4db5d59608e01fd8751",
    measurementId: "G-245YN4ZEMG"
};  // ← الصق اللي بعته
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

// Firebase.js - دوال فقط، بدون إعادة تعريف auth
function loginAsAdmin() {
    const email = 'eraditshbabmasr@gmail.com';
    const password = 'eraditshbabmasr@gmail.com'; // ← تأكد إنه الباسورد الحقيقي

    auth.signInWithEmailAndPassword(email, password)
        .then(user => {
            showToast('تم تسجيل الدخول بنجاح! مرحباً أدمن', 'success', 4000);
        })
        .catch(error => {
            let msg = 'خطأ في تسجيل الدخول: ';
            if (error.code === 'auth/user-not-found') {
                msg += 'الحساب مش موجود – أنشئه في Authentication';
            } else if (error.code === 'auth/wrong-password') {
                msg += 'الباسورد غلط';
            } else if (error.code === 'auth/invalid-email') {
                msg += 'الإيميل غلط';
            } else {
                msg += error.message;
            }
            showToast(msg, 'error', 5000);
            console.error('Auth Error:', error);
        });
}

function logoutAdmin() {
    auth.signOut()
        .then(() => {
            showToast('تم تسجيل الخروج بنجاح', 'success', 3000);
        })
        .catch(error => {
            showToast('خطأ في الخروج: ' + error.message, 'error', 5000);
        });
}

auth.onAuthStateChanged(user => {
    const loginSection = document.getElementById('login-section');
    const authStatus = document.getElementById('auth-status');
    const adminContent = document.getElementById('admin-content');

    if (user) {
        if (loginSection) loginSection.classList.add('hidden');
        if (authStatus) authStatus.classList.remove('hidden');
        if (adminContent) adminContent.classList.remove('hidden');
    } else {
        if (loginSection) loginSection.classList.remove('hidden');
        if (authStatus) authStatus.classList.add('hidden');
        if (adminContent) adminContent.classList.add('hidden');
    }
});

// في Firebase.js
const database = firebase.database(); // Realtime Database

// دالة عامة لإضافة عنصر جديد إلى قسم معين (مثل events)
function addItem(section, data) {
    const ref = database.ref(section);
    ref.push(data)
        .then(() => showToast('تم الإضافة بنجاح!', 'success', 3000))
        .catch(error => showToast('خطأ: ' + error.message, 'error', 5000));
}

// دالة لجلب البيانات من قسم
function getItems(section, callback) {
    const ref = database.ref(section);
    ref.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        callback(Object.entries(data)); // يرجع مصفوفة [id, item]
    });
}

// دالة لتعديل عنصر
function updateItem(section, id, data) {
    const ref = database.ref(`${section}/${id}`);
    ref.update(data)
        .then(() => showToast('تم التعديل بنجاح!', 'success', 3000))
        .catch(error => showToast('خطأ: ' + error.message, 'error', 5000));
}

// دالة لحذف عنصر
function deleteItem(section, id) {
    const ref = database.ref(`${section}/${id}`);
    ref.remove()
        .then(() => showToast('تم الحذف بنجاح!', 'success', 3000))
        .catch(error => showToast('خطأ: ' + error.message, 'error', 5000));
}