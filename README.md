# پلتفرم ملی حقوق گردشگری ایران

> مرجع تخصصی حقوقی گردشگری ایران — قوانین، دانشنامه، دستیار هوشمند، محاسبه‌گر خسارت و تنظیم قرارداد تور

این پلتفرم یک اپلیکیشن تک‌صفحه‌ای (SPA) فارسی و راست‌چین (RTL) است که با **React 18 + TypeScript 5 + Vite 5 + Tailwind 3 + Framer Motion** ساخته شده است.

---

## شروع سریع (Development)

```bash
# نصب وابستگی‌ها
npm install

# اجرای محلی (روی http://localhost:5173)
npm run dev

# بررسی نوع‌چک
npm run typecheck

# بررسی lint
npm run lint

# build تولید
npm run build

# پیش‌نمایش build روی http://localhost:4173
npm run preview
```

**نیازمندی‌ها:** Node.js نسخه ۱۸ یا بالاتر

---

## ساختار پروژه

```
Projecr-Gardeshgary/
├── public/                # فایل‌های استاتیک (favicon, manifest, sw.js, og-image)
├── src/
│   ├── components/        # ۵۶ کامپوننت React
│   ├── hooks/             # ۱۵ hook قابل استفاده مجدد (useAuth, useBookmarks, ...)
│   ├── data.tsx           # داده‌ها و interfaceهای مدل (۲۱ interface, ۳۷ آرایه)
│   ├── App.tsx            # Router + Layout
│   ├── main.tsx           # نقطه ورود + ثبت Service Worker
│   └── index.css          # استایل‌های گلوبال + طراحی "Midnight Desert"
├── index.html             # HTML اصلی
├── vite.config.ts         # پیکربندی Vite با base: './' (relative paths)
├── tailwind.config.js     # پیکربندی Tailwind با palette اختصاصی
├── tsconfig.json          # پیکربندی TypeScript (strict)
└── package.json
```

---

## Build تولید

دستور `npm run build` خروجی را در پوشه `dist/` تولید می‌کند:

```
dist/
├── index.html             # HTML اصلی (با مسیرهای نسبی)
├── assets/
│   ├── index-XXXX.js      # چانک اصلی (~140KB, gzip 42KB)
│   ├── react-vendor-XXXX.js
│   ├── framer-motion-XXXX.js
│   ├── lucide-icons-XXXX.js
│   └── [۱۹ چانک lazy-load دیگر]
├── favicon.svg
├── manifest.json
├── og-image.png
└── sw.js                  # Service Worker برای PWA
```

**مهم:** `vite.config.ts` از `base: './'` استفاده می‌کند — یعنی همه مسیرها در build نهایی **نسبی (relative)** هستند. این یعنی build در هر مسیر سرور کار می‌کند (ریشه دامنه، زیرپوشه، یا زیردامنه) بدون نیاز به پیکربندی اضافه.

---

## راه‌اندازی روی سرور (Production Deployment)

### روش ۱: سرور VPS با Nginx (توصیه شده)

این ساده‌ترین و مطمئن‌ترین روش است.

```bash
# روی سرور:
cd /var/www
git clone https://github.com/Mohammadparsasharififard/Projecr-Gardeshgary.git
cd Projecr-Gardeshgary
npm install
npm run build
# محتوای dist/ اکنون آماده serve است
```

سپس Nginx config:

```nginx
server {
    listen 80;
    server_name gardeshgary.example.com;
    root /var/www/Projecr-Gardeshgary/dist;
    index index.html;

    # SPA: همه مسیرها به index.html برمی‌گردند (چون از hash routing استفاده می‌کنیم
    # این فقط برای fallback است)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # کش طولانی برای assetهای هش‌دار
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service Worker نباید کش شود
    location /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # فشرده‌سازی
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

### روش ۲: cPanel / هاست اشتراکی

```bash
# روی کامپیوتر محلی:
npm install
npm run build

# اکنون محتوای پوشه dist/ را با FTP یا File Manager به public_html/ آپلود کنید
# (یا زیرپوشه‌ای مثل public_html/gardeshgary/)
```

نیازی به Node.js روی سرور نیست — فقط فایل‌های استاتیک را آپلود کنید.

**نکته:** اگر در زیرپوشه آپلود می‌کنید (مثلاً `public_html/gardeshgary/`)، چون `base: './'` است، همه چیز خودکار کار می‌کند.

### روش ۳: زیردامنه (subdomain)

```bash
# روی سرور:
cd /var/www/gardeshgary
git clone https://github.com/Mohammadparsasharifard/Projecr-Gardeshgary.git .
npm install
npm run build
# محتوای dist/ را به nginx root زیردامنه بدهید
```

با `base: './'`، هر سه حالت زیر بدون پیکربندی اضافه کار می‌کنند:
- `https://example.com/` (ریشه دامنه)
- `https://example.com/gardeshgary/` (زیرپوشه)
- `https://gardeshgary.example.com/` (زیردامنه)

### روش ۴: GitHub Pages

```bash
# روی branch gh-pages یا با GitHub Actions:
npm install
npm run build
# محتوای dist/ را به branch gh-pages push کنید
```

### روش ۵: Netlify / Vercel / Cloudflare Pages

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18 یا بالاتر

این پلتفرم‌ها به‌طور خودکار SPA fallback را تنظیم می‌کنند.

---

## ورود ادمین (پنل مدیریت)

| فیلد | مقدار |
|---|---|
| نام کاربری | `admin` |
| رمز عبور | `admin` |

**نکته مهم:** این مقادیر فقط برای پیش‌نمایش هستند. قبل از راه‌اندازی production، باید:
1. یک backend واقعی برای احراز هویت پیاده‌سازی شود
2. رمز عبور hash و salt شود
3. توکن JWT با انقضا استفاده شود

الان احراز هویت در frontend با localStorage ذخیره می‌شود — مناسب دمو، نه production واقعی.

---

## نقش‌های کاربری

| نقش | دسترسی |
|---|---|
| `admin` | پنل مدیریت کامل (آمار، فعالیت‌ها، مدیریت کاربران/محتوا/آژانس‌ها) |
| `user` | پنل مسافر (شکایات، قوانین ذخیره‌شده، مشاوره‌ها، قراردادها) |

برای اضافه‌کردن نقش جدید (مثلاً `lawyer` یا `agency`) فقط یک مورد به `UserRole` در `src/hooks/useAuth.tsx` اضافه کنید.

---

## معماری و توسعه‌پذیری

### اضافه‌کردن یک صفحه/ماژول جدید (مثلاً «قراردادساز»)

فقط ۳ کار ساده:

1. **یک خط به `src/hooks/useHashRoute.ts` اضافه کنید:**
```typescript
export type Route = ... | 'contract-builder';
```

2. **یک آیتم به `NAV_GROUPS` در همان فایل اضافه کنید:**
```typescript
{ id: 'contract-builder', label: 'قراردادساز', hash: '#/contract-builder', icon: 'FileText' }
```

3. **یک `case` در `src/App.tsx` و یک کامپوننت جدید بسازید:**
```typescript
{route === 'contract-builder' && <ContractGeneratorPage />}
```

**تمام.** هیچ بازنویسی لازم نیست.

### جداسازی لایه‌ها

```
┌──────────────────────────────────────────┐
│  UI Components (src/components/) — ۵۶ فایل  │
├──────────────────────────────────────────┤
│  Hooks (src/hooks/) — ۱۵ فایل              │
├──────────────────────────────────────────┤
│  Data Layer (src/data.tsx) — ۲۱ interface  │
├──────────────────────────────────────────┤
│  Routing (src/hooks/useHashRoute.ts)       │
└──────────────────────────────────────────┘
```

این یعنی:
- می‌خواهی داده عوض کنی → `data.tsx` را ویرایش کن، UI دست‌نخورده
- می‌خواهی طراحی عوض کنی → کامپوننت را ویرایش کن، داده دست‌نخورده
- می‌خواهی مسیر اضافه کنی → `useHashRoute.ts` را ویرایش کن، بقیه دست‌نخورده

### اسلات ماژول‌های آینده (آماده برای توسعه)

در `useHashRoute.ts` این موارد برای آینده پیش‌بینی شده‌اند:
- آموزش و رویدادها (academy)
- داوری (arbitration)
- قراردادساز (contract-builder)
- ارزیابی ریسک (risk-assessment)
- پرداخت (payments)
- استان‌ها (provinces)

برای هرکدام فقط ۳ کار بالا را انجام دهید.

---

## امنیت

### هدرهای امنیتی (توسط Next.js proxy یا Nginx باید تنظیم شوند)

```nginx
# در Nginx:
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; frame-ancestors 'self'; object-src 'none'; base-uri 'self';" always;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
```

### توصیه‌های امنیتی قبل از Production

1. **احراز هویت واقعی پیاده‌سازی کنید** — الان فقط localStorage است
2. **HTTPS اجباری** — با Let's Encrypt روی Nginx
3. **CSP را فعال کنید** — در Nginx config بالا
4. **رمز admin را عوض کنید** — الان `admin/admin` است!
5. **backend API بسازید** — برای ذخیره شکایات، رزرو مشاوره و ...

---

## PWA (Progressive Web App)

پلتفرم به‌صورت PWA نصب‌پذیر است:
- `manifest.json` تعریف شده
- `sw.js` برای offline support ثبت می‌شود
- قابلیت نصب روی موبایل و دسکتاپ

---

## عملکرد (Performance)

- **Code splitting:** ۲۱ چانک lazy-load — هر صفحه فقط chunk خودش را load می‌کند
- **ParticleField:** IntersectionObserver (توقف off-screen) + DPR cap 1.5
- **Service Worker:** cache-first برای assets، stale-while-revalidate برای HTML
- **Compressed:** gzip روی سرور فعال باشد (index.html ~42KB gzipped)

---

## پشتیبانی مرورگرها

- Chrome / Edge / Firefox / Safari (آخرین نسخه‌ها)
- iOS Safari 14+
- Android Chrome 90+

---

## لایسنس

این پروژه به‌صورت اختصاصی برای کارفرما توسعه داده شده است. حقوق نشر محفوظ است.

---

## تماس

برای پشتیبانی فنی یا توسعه ماژول‌های جدید، لطفاً با توسعه‌دهنده تماس بگیرید.
