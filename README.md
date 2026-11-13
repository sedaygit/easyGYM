# easyGYM -en
A modern, responsive fitness web application built with React, Vite, and Tailwind CSS. Track workouts, monitor progress, and customize your training experience with bilingual support (EN/TR). Detailed information in english is below.

# easyGYM -tr

**easyGYM**, kullanıcının hedeflediği kas gruplarına göre egzersiz rutini oluşturmasına, antrenmanını adım adım takip etmesine ve gelişimini yerel olarak kaydetmesine yardımcı olan, React ve Vite ile geliştirilmiş responsive bir fitness web uygulamasıdır.

Uygulama Türkçe ve İngilizce arayüz sunar. Kullanıcı hesapları, tercihler, antrenman geçmişi ve favoriler tarayıcının `LocalStorage` alanında saklanır. Proje bir eğitim kapsamında hazırlanmış istemci taraflı bir prototiptir; sunucu, veritabanı veya gerçek kimlik doğrulama servisi içermez.

## Özellikler

- **Kayıt ve giriş arayüzü:** Ad, e-posta, şifre ve fitness seviyesi ile yerel demo hesabı oluşturma/giriş yapma. E-posta eşleşmesi ve şifre kontrolü.
- **Kas grubu seçimi:** Ön ve arka anatomik görünüm üzerinden göğüs, sırt, omuz, kol, core ve bacak gruplarını seçme.
- **Kişiselleştirilmiş rutin:** Seçilen kas gruplarına ve fitness seviyesine göre egzersiz listesi oluşturma; egzersizleri rutine ekleyip çıkarma.
- **Antrenman ayarları:** Set, tekrar ve setler/egzersizler arasındaki dinlenme süresini belirleme.
- **Egzersiz rehberi:** Egzersiz açıklamaları, adım adım uygulama yönergeleri, form ipuçları, uyarılar, alternatifler, ekipman bilgileri ve animasyonlu görseller.
- **Sesli anlatım:** İngilizce ve Türkçe egzersiz anlatımları; otomatik oynatma ve ses tercihleri.
- **Isınma ve soğuma:** Kas grubuna göre zaman tabanlı ısınma ve soğuma hareketleri.
- **Sayaçlar ve antrenman akışı:** Egzersiz/set ilerlemesi, zaman tabanlı hareket sayacı, dinlenme sayacı ve sesli/görsel geri bildirim.
- **Yarım kalan antrenmanlar:** Antrenmanı kaydetme, kaldığı egzersiz/set adımından devam ettirme ve geçmişte durumunu görme.
- **İlerleme ve başarımlar:** Tamamlanan antrenman sayısı, süre, set/tekrar toplamları, seri (streak), en uzun seri ve kas grubu dağılımı.
- **Streak League:** Antrenman serisine göre lig/seviye görünümü.
- **Geçmiş ve favoriler:** Geçmiş oturumlarının özetini açma, tekrar başlatma ve favorilere ekleme/çıkarma.
- **Profil ve tercihler:** Dil, ses ve otomatik sesli anlatım tercihlerini yönetme.
- **Yerel veri saklama:** Kullanıcıya özel verileri tarayıcı `LocalStorage` alanında saklama.

## Kullanılan Teknolojiler

| Teknoloji | Kullanım amacı |
|---|---|
| React 18 | Bileşen tabanlı kullanıcı arayüzü ve uygulama durumu |
| Vite 5 | Geliştirme sunucusu ve üretim derlemesi |
| JavaScript (ES Modules) | Uygulama mantığı |
| Tailwind CSS 3 | Yardımcı sınıflarla responsive stil |
| PostCSS ve Autoprefixer | CSS işleme ve tarayıcı uyumluluğu |
| LocalStorage | Kullanıcı, tercih, geçmiş, favori ve oturum verileri |
| Python + edge-tts | Egzersiz ses dosyalarını üretmek için yardımcı betikler |

## Gereksinimler

- Node.js 18 veya üzeri
- npm
- (Ses dosyalarını yeniden üretmek için) Python 3 ve `edge-tts`

## Kurulum ve Çalıştırma

Terminalde uygulamanın kök klasörüne (`easygym/`) geçin:

```bash
cd easygym
npm install
npm run dev
```

Vite terminalde yerel geliştirme adresini gösterecektir. Varsayılan yapılandırmada port `5178` olarak ayarlanmıştır; port doluysa Vite uygun başka bir port seçebilir.

## Üretim Derlemesi

```bash
npm run build
npm run preview
```

Üretim dosyaları `dist/` klasörüne oluşturulur. Yayına alırken `dist/` klasörü Netlify, Vercel veya benzeri statik barındırma hizmetine dağıtılır. Vite tabanlı SPA yönlendirmesi kullanıldığı için barındırma hizmetinde tüm yolların `index.html` dosyasına yönlendirilmesi gerekebilir.

## Proje Yapısı

```text
easygym/
├── public/
│   ├── audio/
│   │   ├── exercises/       # İngilizce egzersiz anlatımları
│   │   ├── warmups/         # İngilizce ısınma/soğuma anlatımları
│   │   └── tr/              # Türkçe ses dosyaları
│   └── images/
│       ├── exercises/       # Egzersiz animasyonları
│       └── ...              # Uygulama görselleri
├── src/
│   ├── components/
│   │   ├── achievements/    # Geçmiş, istatistikler, lig kartı
│   │   ├── anatomy/         # Anatomik kas seçimi
│   │   ├── auth/            # Kayıt ve giriş
│   │   ├── complete/        # Antrenman tamamlanma ekranı
│   │   ├── fx/              # Görsel efektler
│   │   ├── nav/             # Ana navigasyon
│   │   ├── profile/         # Profil ve tercihler
│   │   ├── routine/         # Rutin oluşturma ve egzersiz listesi
│   │   ├── ui/              # Tekrar kullanılan arayüz bileşenleri
│   │   └── workout/         # Aktif antrenman ve dinlenme ekranları
│   ├── data/                # Egzersiz, kas ve ısınma/soğuma verileri
│   ├── hooks/               # Sayaç ve LocalStorage hook'ları
│   ├── i18n/                # Türkçe/İngilizce çeviri altyapısı
│   ├── lib/                 # Depolama, ses, biçimlendirme ve istatistik yardımcıları
│   ├── styles/              # Tema stilleri
│   ├── App.jsx              # Ana uygulama akışı ve ekran geçişleri
│   ├── index.css
│   └── main.jsx             # React başlangıç noktası
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.cjs
├── tailwind.config.cjs
└── vite.config.js
```

Ses üretim betikleri arşivde `easyGYM/` üst klasöründe (`generate_audio.py` ve `generate_audio_tr.py`) bulunur. Bu betikler mevcut `easygym/` uygulama klasöründeki egzersiz verilerini okuyacak şekilde hazırlanmıştır.

## Yerel Veri ve Güvenlik Notu

Bu sürümde hesap ve uygulama verileri tarayıcı `LocalStorage` alanında tutulur. Kayıt/giriş akışı eğitim amaçlı yerel bir demo mekanizmasıdır; sunucu tarafı kimlik doğrulama, parola hash'leme, parola sıfırlama, çoklu cihaz senkronizasyonu veya bulut yedeklemesi yoktur. Bu nedenle gerçek kullanıcı parolaları veya hassas kişisel bilgilerle kullanılmamalıdır. Tarayıcı/site verilerinin temizlenmesi yerel kayıtları silebilir.

## Yapay Zekâ Destekli Geliştirme Süreci

Projenin geliştirilmesinde birden fazla yapay zekâ aracı farklı aşamalarda kullanılmıştır:

1. **Planlama ve temel sürüm — Gemini + Opus 5.5 (Sixth VS Code eklentisi):** İlk olarak Gemini yardımıyla uygulamanın kullanıcı akışı, ekranları ve temel özelliklerini tanımlayan kapsamlı bir istem hazırlandı. Bu istem, Sixth eklentisi üzerinden Opus 5.5'e verilerek React/Vite ve Tailwind CSS tabanlı ilk uygulama iskeleti ve temel kullanıcı akışı oluşturuldu.
2. **Özellik geliştirme — Gemini:** İlk sürümün üzerine kayıt ekranına fitness seviyesi seçimi, egzersizlerde ekipman bilgileri, İngilizce sesli anlatım, kullanıcı tarafından ayarlanabilir dinlenme süresi, `StreakLeagueCard` lig bileşeni, geçmiş kayıtlarının özetlenmesi/tekrarlanması/favorilenmesi ve kas gruplarına göre ısınma-soğuma içerikleri eklendi.
3. **Hata ayıklama, iyileştirme ve yerelleştirme — ChatGPT:** Antrenman süresi ve toplam süre hesaplamaları üzerinde düzeltmeler yapıldı; geçmiş kayıtlarında yarım kalan/tamamlanan durumları ayrıştırıldı; Türkçe-İngilizce arayüz geçişi ve Türkçe sesli anlatım dosyaları geliştirildi; e-posta/şifre giriş kontrolleri ve kullanıcı/egzersiz kimliklerinin benzersiz olması üzerinde çalışıldı. Ayrıca sayaç akışı, yarım kalan antrenmanı sürdürme, kas adı çevirileri ve geçmiş ekranındaki metin/etiket tutarlılığı gibi konularda hata ayıklama yapıldı.

Yapay zekâ araçları kod üretiminin yanında istem hazırlama, bileşen taslağı oluşturma, mevcut kodu açıklama, hata nedenlerini araştırma, çeviri ve dokümantasyon çalışmalarında yardımcı olarak kullanılmıştır. Üretilen kodlar proje içinde düzenlenmiş ve uygulamanın ihtiyaçlarına göre uyarlanmıştır.

# easyGYM- en

**easyGYM** is a modern, responsive fitness web application built with React and Vite. It helps users create personalized workout routines based on their target muscle groups, follow their workouts step by step, and track their fitness progress locally.

The application supports both English and Turkish interfaces. User accounts, preferences, workout history, and favorites are stored locally in the browser using `LocalStorage`. This project is an educational, client-side prototype and does not include a backend server, database, or production authentication service.

## Features

- **Registration and Login:** Create a local demo account and log in using a name, email, password, and fitness level. Includes email matching and password validation.
- **Muscle Group Selection:** Select multiple muscle groups, including chest, back, shoulders, arms, core, and legs, using interactive front and back anatomical views.
- **Personalized Workout Routines:** Generate exercise lists based on selected muscle groups and fitness levels. Add or remove exercises from routines.
- **Workout Customization:** Set the number of sets, repetitions, and rest duration between sets and exercises.
- **Exercise Guidance:** View exercise descriptions, step-by-step instructions, form tips, safety warnings, alternatives, equipment requirements, and animated exercise demonstrations.
- **Audio Narration:** English and Turkish exercise narrations, with automatic playback and customizable audio preferences.
- **Warm-up and Cool-down:** Time-based warm-up and cool-down exercises tailored to selected muscle groups.
- **Workout Timers and Progression:** Track exercise and set progress with exercise timers, rest countdowns, and audio/visual feedback.
- **Unfinished Workouts:** Save incomplete workout sessions, resume from the last exercise and set, and view their status in workout history.
- **Progress and Achievements:** Track completed workouts, duration, total sets and reps, workout streaks, longest streak, and muscle group distribution.
- **Streak League:** View league levels and progression based on workout streaks.
- **Workout History and Favorites:** View workout summaries, repeat previous workouts, and add or remove sessions from favorites.
- **Profile and Preferences:** Manage language, sound, and automatic audio playback preferences.
- **Local Data Storage:** Store user-specific application data in the browser's `LocalStorage`.

## Technologies Used

| Technology | Purpose |
|---|---|
| React 18 | Component-based user interface and application state |
| Vite 5 | Development server and production build |
| JavaScript (ES Modules) | Application logic |
| Tailwind CSS 3 | Utility-first responsive styling |
| PostCSS and Autoprefixer | CSS processing and browser compatibility |
| LocalStorage | Local storage for user accounts, preferences, history, favorites, and workout sessions |
| Python + edge-tts | Helper scripts for generating exercise audio files |

## Requirements

- Node.js 18 or later
- npm
- Python 3 and `edge-tts` (only if regenerating audio files)

## Installation and Setup

Open a terminal and navigate to the project root directory (`easygym/`):

```bash
cd easygym
npm install
npm run dev
```

Vite will display the local development URL in the terminal. The default configuration uses port `5178`. If the port is already in use, Vite may select another available port.

## Production Build

```bash
npm run build
npm run preview
```

The production-ready files are generated in the `dist/` directory. The `dist/` folder can be deployed to Netlify, Vercel, or another static hosting provider.

Since the application uses Vite-based single-page application routing, the hosting provider may need to redirect all routes to `index.html`.

## Project Structure

```text
easygym/
├── public/
│   ├── audio/
│   │   ├── exercises/       # English exercise narrations
│   │   ├── warmups/         # English warm-up/cool-down narrations
│   │   └── tr/              # Turkish audio files
│   └── images/
│       ├── exercises/       # Exercise animations
│       └── ...              # Application images
├── src/
│   ├── components/
│   │   ├── achievements/    # History, statistics, league card
│   │   ├── anatomy/         # Anatomical muscle selection
│   │   ├── auth/            # Registration and login
│   │   ├── complete/        # Workout completion screen
│   │   ├── fx/              # Visual effects
│   │   ├── nav/             # Main navigation
│   │   ├── profile/         # Profile and preferences
│   │   ├── routine/         # Routine creation and exercise lists
│   │   ├── ui/              # Reusable UI components
│   │   └── workout/         # Active workout and rest screens
│   ├── data/                # Exercise, muscle, warm-up and cool-down data
│   ├── hooks/               # Countdown and LocalStorage hooks
│   ├── i18n/                # Turkish/English translation system
│   ├── lib/                 # Storage, audio, formatting and statistics utilities
│   ├── styles/              # Theme styles
│   ├── App.jsx              # Main application flow and screen navigation
│   ├── index.css
│   └── main.jsx             # React entry point
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.cjs
├── tailwind.config.cjs
└── vite.config.js
```

Audio generation scripts are located in the parent `easyGYM/` directory (`generate_audio.py` and `generate_audio_tr.py`). These scripts are designed to read exercise data from the `easygym/` application directory.

## Local Data Storage and Security

This version stores account and application data in the browser's `LocalStorage`.

The registration and login flow is a local demonstration mechanism. It does not provide server-side authentication, password hashing, password recovery, multi-device synchronization, or cloud backups.

For this reason, the application should not be used with real passwords or sensitive personal information. Clearing browser or website data may permanently remove locally stored records.

## AI-Assisted Development Process

Multiple AI tools were used at different stages of the development process:

1. **Planning and Initial Version — Gemini + Opus 5.5 (Sixth VS Code Extension):** Gemini was first used to prepare a comprehensive prompt defining the application's user flow, screens, and core features. This prompt was then submitted to Opus 5.5 through the Sixth VS Code extension, which generated the initial React/Vite and Tailwind CSS application structure and basic user flow.

2. **Feature Development — Gemini:** Additional features were built on top of the initial version, including fitness level selection during registration, equipment information for exercises, English audio narration, user-configurable rest duration, the `StreakLeagueCard` component, workout history summaries, repeat workout and favorites functionality, and muscle-specific warm-up and cool-down content.

3. **Debugging, Improvements, and Localization — ChatGPT:** Workout duration and total-time calculations were corrected; completed and unfinished workout states were distinguished in history; Turkish-English interface switching and Turkish audio narrations were implemented; email/password validation and unique user/exercise identifiers were improved. Additional debugging and refinements covered countdown behavior, resuming unfinished workouts, muscle name translations, and consistency of history labels and interface text.

AI tools were used not only for code generation but also for prompt engineering, component design, code explanation, debugging, translation, and documentation. Generated code was reviewed, adapted, and integrated according to the project's requirements.
