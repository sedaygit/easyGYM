# easyGYM -en
A modern, responsive fitness web application built with React, Vite, and Tailwind CSS. Track workouts, monitor progress, and customize your training experience with bilingual support (EN/TR).

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
