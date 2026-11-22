# AttendanceApp Web - نظام الحضور والانصراف (نسخة الويب)

نسخة ويب مطابقة لتطبيق الأندرويد، مبنية بـ **Next.js 14 + TypeScript + Tailwind CSS + Firebase**.

## ✨ المميزات

| الميزة | الوصف |
|----------|---------|
| 📋 **الحضور والانصراف** | تسجيل دخول/خروج فوري، حساب ساعات العمل والأوفر تايم تلقائياً |
| 🏖️ **الإجازات** | أنواع متعددة، رصيد تلقائي، اعتماد/رفض، ترحيل الأرصدة |
| ⏰ **الأوفر تايم** | أنواع (عادي، عطلة نهاية أسبوع، عطلة رسمية)، معدلات قابلة للتخصيص، إجازات تعويضية |
| 📅 **العطلات** | عطلات مصرية ثابتة + إمكانية إضافة عطلات مخصصة |
| 📊 **التقارير** | أسبوعية/شهرية/سنوية، تصدير PDF عربي، معاينة فورية |
| ⚙️ **الإعدادات** | ملف الموظف، جدول العمل، معدلات الأوفر تايم، إشعارات، أمان |
| ☁️ **Firebase** | مصادقة، قاعدة بيانات فورية، تخزين، مزامنة أوتوماتيكية |
| 🌙 **Dark Mode** | دعم كامل للوضع الداكن/الفاتح |
| 📱 **PWA Ready** | قابل للتثبيت على الهاتف كـ تطبيق |

## 🛠️ التقنيات

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Lucide Icons
- **State**: Zustand (مع persistence)
- **Forms**: React Hook Form + Zod
- **Backend**: Firebase Auth, Firestore, Storage
- **PDF**: jsPDF + autoTable (دعم عربي)
- **Date**: date-fns + date-fns-tz
- **Notifications**: react-hot-toast

## 📁 هيكل المشروع

```
attendance-web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # لوحة التحكم الرئيسية
│   │   ├── attendance/         # سجلات الحضور
│   │   ├── leaves/             # إدارة الإجازات
│   │   ├── overtime/           # الأوفر تايم
│   │   ├── reports/            # التقارير والتصدير
│   │   ├── settings/           # الإعدادات
│   │   ├── login/              # تسجيل الدخول
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home (redirect)
│   │   ├── globals.css         # Global styles
│   │   └── providers.tsx       # Context providers
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   └── layout/             # Layout components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/
│   │   ├── firebase.ts         # Firebase config
│   │   ├── firestore.ts        # Firestore operations
│   │   ├── store.ts            # Zustand store
│   │   ├── types.ts            # TypeScript types
│   │   └── utils.ts            # Utility functions
│   └── ...
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── .env.example
├── deploy-github.sh            # GitHub deployment script
└── README.md
```

## 🚀 البدء السريع

### 1. المتطلبات
- Node.js 18+
- npm أو yarn أو pnpm
- حساب Firebase

### 2. التثبيت
```bash
cd attendance-web
npm install
```

### 3. إعداد Firebase

1. أنشئ مشروع في [Firebase Console](https://console.firebase.google.com)
2. فعّل **Authentication** > Email/Password
2. أنشئ **Firestore Database** (اختر منطقة قريبة)
3. فعّل **Storage** (اختياري للملفات)
4. اذهب إلى **Project Settings** > General > Your apps > Web app
5. انسخ إعدادات `firebaseConfig`

### 4. متغيرات البيئة
```bash
cp .env.example .env.local
```

حرر `.env.local` وأضف مفاتيح Firebase:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 5. التشغيل المحلي
```bash
npm run dev
```
افتح [http://localhost:3000](http://localhost:3000)

## 📦 النشر

### GitHub (مع السكريبت الجاهز)
```bash
# اجعل السكريبت قابل للتنفيذ
chmod +x deploy-github.sh

# شغل السكريبت (سيطلب منك اسم المستودع واسم المستخدم)
./deploy-github.sh attendance-web your-github-username
```

### Vercel (الأسهل لـ Next.js)
1. ادخل على [vercel.com](https://vercel.com)
2. اضغط **Add New Project** > Import Git Repository
3. اختر مستودع GitHub
4. أضف متغيرات البيئة من `.env.local`
5. اضغط **Deploy**

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# اختر مشروعك، و public directory = out
npm run build
firebase deploy
```

## ⚙️ الإعدادات الافتراضية (قانون العمل المصري)

| الإعداد | القيمة |
|----------|---------|
| ساعات العمل الأسبوعية | 48 |
| أيام العمل | 6 (الجمعة عطلة) |
| الاستراحة | 60 دقيقة |
| إجازة سنوية (بعد 6 شهور) | 21 يوم |
| إجازة سنوية (بعد 5 سنوات) | 30 يوم |
| إجازة مرضية | 180 يوم |
| إجازة عرضية | 6 أيام |
| معدل أوفر تايم عادي | 1.5x |
| معدل عطلة نهاية أسبوع | 1.5x |
| معدل عطلة رسمية | 2.0x |

## 🔐 الأمان

- مصادقة Firebase (Email/Password)
- قواعد Firestore Security Rules (مطلوبة للإنتاج)
- متغيرات البيئة للسرية
- تشفير HTTPS تلقائي

## 📱 PWA - التثبيت على الهاتف

التطبيق يدعم Progressive Web App:
1. افتح الموقع في Chrome/Edge على الهاتف
2. اضغط القائمة (⋮) > **تثبيت التطبيق**
3. سيظهر على الشاشة الرئيسية كتطبيق أصلي

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ branch للميزة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للـ branch (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## 📄 الترخيص

MIT License - راجع ملف `LICENSE` للتفاصيل.

## 📞 الدعم

للأسئلة أو المشاكل:
- افتح [Issue](https://github.com/your-username/attendance-web/issues)
- راجع [Firebase Docs](https://firebase.google.com/docs)
- راجع [Next.js Docs](https://nextjs.org/docs)

---

**مطور بـ ❤️ باستخدام Next.js + Firebase**