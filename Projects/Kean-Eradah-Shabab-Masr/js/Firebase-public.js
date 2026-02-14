const firebaseConfig = {
    apiKey: "AIzaSyBJlRgbyWRMMLn0U2POvd9apQ_q7kKx32o",
    authDomain: "kean-eradah-shabab-masr.firebaseapp.com",
    databaseURL: "https://kean-eradah-shabab-masr-default-rtdb.firebaseio.com",
    projectId: "kean-eradah-shabab-masr",
    storageBucket: "kean-eradah-shabab-masr.firebasestorage.app",
    messagingSenderId: "425589069316",
    appId: "1:425589069316:web:2dd4db5d59608e01fd8751",
    measurementId: "G-245YN4ZEMG"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database(); // فقط db للقراءة

// الدوال العامة (لو محتاجها في الصفحات العامة، بس هنا مش مستخدمة)
function getItems(section, callback) {
    const ref = db.ref(section);
    ref.on('value', (snapshot) => {
        const data = snapshot.val() || {};
        callback(Object.entries(data));
    });
}
// احذف addItem, updateItem, deleteItem لو مش محتاجهم هنا (هم للأدمن فقط)