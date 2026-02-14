// ==============================================
// ملف JavaScript لاستمارة الانضمام - كيان إرادة شباب مصر
// ==============================================
document.getElementById('governorate')
document.getElementById('fullName')
document.getElementById('phone')
document.getElementById('nationalId')
document.getElementById('qualification')
document.getElementById('committee')
document.getElementById('skills')

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('membershipForm');
    const governorateSelect = document.getElementById('governorate');

    // =======================
    // 1. خريطة أرقام واتساب لكل محافظة
    // =======================
    const whatsappNumbers = {
        'القاهرة':          '01000048381',   // منسق القاهرة
        'الجيزة':           '01000048381',
        'الإسكندرية':       '01000048381',
        'الدقهلية':         '01000048381',
        'الشرقية':          '01000048381',
        'الغربية':          '01000048381',   // مثال للغربية (تغييره للرقم الحقيقي)
        'كفر الشيخ':        '01000048381',
        'دمياط':            '01000048381',
        'بورسعيد':          '01000048381',
        'الإسماعيلية':      '01000048381',
        'السويس':           '01000048381',
        'شمال سيناء':       '01000048381',
        'جنوب سيناء':       '01000048381',
        'البحر الأحمر':     '01000048381',
        'الفيوم':           '01000048381',
        'بني سويف':         '01000048381',
        'المنيا':           '01000048381',
        'أسيوط':            '01000048381',
        'سوهاج':            '01000048381',
        'قنا':              '01000048381',
        'الأقصر':           '01000048381',
        'أسوان':            '01000048381',
        'مطروح':            '01000048381',
        'الوادي الجديد':    '01000048381',
        'القليوبية':        '01000048381',
        // أضف باقي المحافظات إذا ناقصة
    };

    const defaultWhatsApp = '01000048381'; // رقم احتياطي لو المحافظة مش موجودة

    // =======================
    // 2. عند تغيير المحافظة → تحديث رقم الواتساب في الرسالة (اختياري - للعرض فقط)
    // =======================
    governorateSelect.addEventListener('change', function () {
        const selectedGov = this.value;
        const phoneNumber = whatsappNumbers[selectedGov] || defaultWhatsApp;
        console.log(`تم اختيار: ${selectedGov} → رقم الواتساب: ${phoneNumber}`);
        // يمكنك عرض الرقم للمستخدم لو حابب (اختياري)
    });

    // =======================
    // 3. معالجة إرسال النموذج
    // =======================
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // جمع البيانات
        const data = {
            governorate: governorateSelect.options[governorateSelect.selectedIndex].text,
            fullName:     document.getElementById('fullName').value.trim(),
            phone:        document.getElementById('phone').value.trim(),
            nationalId:   document.getElementById('nationalId').value.trim(),
            qualification: document.getElementById('qualification').options[document.getElementById('qualification').selectedIndex].text,
            committee:    document.getElementById('committee').options[document.getElementById('committee').selectedIndex].text,
            skills:       document.getElementById('skills').value.trim() || 'لا يوجد'
        };

        // التحقق من الحقول الإجبارية (بسيط)
        if (!data.fullName || !data.phone || !data.nationalId || !data.qualification || !data.committee) {
            showToast("يرجى ملء جميع الحقول الإجبارية", "error");
            return;
        }

        // اختيار رقم الواتساب بناءً على المحافظة
        const phoneNumber = whatsappNumbers[data.governorate] || defaultWhatsApp;

        // صياغة الرسالة بشكل منظم واحترافي
        let message = `*طلب انضمام جديد - كيان إرادة شباب مصر*\n────────────────────\n`;
        message += `المحافظة: ${data.governorate}\n`;
        message += `الاسم الرباعي: ${data.fullName}\n`;
        message += `رقم الهاتف: ${data.phone}\n`;
        message += `الرقم القومي: ${data.nationalId}\n`;
        message += `المؤهل: ${data.qualification}\n`;
        message += `اللجنة المطلوبة: ${data.committee}\n`;

        if (data.skills) {
            message += `المهارات/الملاحظات: ${data.skills}\n`;
        }

        message += `\n────────────────────\n*تم الإرسال من الموقع الرسمي*`;

        // تحويل الرسالة لـ URL آمن
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/+2${phoneNumber}?text=${encodedMessage}`;

        // فتح واتساب في نافذة جديدة
        window.open(whatsappUrl, '_blank');

        // إشعار نجاح
        showToast("تم تحويلك إلى واتساب المنسق بنجاح!", "success", 5000);

        // اختياري: إعادة تعيين النموذج بعد الإرسال
        // form.reset();
    });
});

// ==============================================
// دالة الإشعارات (Toast) - يمكن استخدامها في أي مكان
// ==============================================
function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} flex items-center justify-between`;
    toast.innerHTML = `
        <div class="flex-1">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    if (duration > 0) {
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }
}
