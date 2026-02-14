function sendToWhatsApp() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    // تحقق بسيط لو الحقول فاضية
    if (!name || !phone || !message) {
        alert('من فضلك املأ كل الحقول: الاسم، رقم الهاتف، والرسالة');
        return;
    }

    // رقم الواتساب بتاعك (غيره لو عايز رقم تاني)
    const whatsappNumber = "01024015334";

    // بناء الرسالة
    const text = `اسمي: ${name}%0Aرقمي: ${phone}%0Aالرسالة: ${message}`;

    // الرابط اللي هيفتح واتساب
    const url = `https://wa.me/+2${whatsappNumber}?text=${text}`;

    // فتح واتساب في تب جديد
    window.open(url, '_blank');

    // اختياري: مسح الحقول بعد الإرسال
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('message').value = '';
}