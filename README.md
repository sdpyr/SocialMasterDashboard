# SocialMaster Dashboard

SocialMaster Dashboard, sosyal medya hesaplarınızı tek bir platformdan yönetmenize olanak sağlayan kapsamlı bir sosyal medya yönetim aracıdır. Bu platform, sosyal medya hesaplarınızın planlanması, içerik oluşturma, zamanlama, analiz ve raporlama işlemlerini kolaylaştırarak sosyal medya stratejinizi optimize etmenize yardımcı olur.

## Özellikler

### Çoklu Sosyal Medya Hesap Yönetimi
- Farklı platformlardaki (Facebook, Instagram, Twitter, LinkedIn vb.) tüm sosyal medya hesaplarınızı tek bir yerden yönetme
- Platform bazlı özellikler ve sınırlamalarla uyumlu çalışma
- Kolay hesap ekleme ve yetkilendirme

### İçerik Oluşturma ve Zamanlama
- Taslak oluşturma ve düzenleme
- Çoklu medya (görsel, video, GIF) desteği
- İleri tarihli gönderi planlama
- Tekrarlanan gönderi zamanlama
- Platform bazlı içerik optimizasyonu

### Analitik ve Raporlama
- Etkileşim ve erişim verileri
- Takipçi demografisi ve büyüme analizi
- Platform karşılaştırmalı performans raporları
- Özelleştirilebilir rapor şablonları
- Veri görselleştirme araçları

### İçerik Yönetim Sistemi (CMS)
- Sayfalar, menüler ve içerik bölümlerinin yönetimi
- Sıkça sorulan sorular ve içerik bloklarının düzenlenmesi
- Şablonlar ve özelleştirilebilir tasarım seçenekleri

### Çoklu Dil Desteği
- Arayüz için Türkçe ve İngilizce dil seçenekleri
- Kolay dil ekleme ve çeviri yönetimi

## Teknik Özellikler

### Mimari
SocialMaster, modern web teknolojileri kullanılarak geliştirilmiş bir full-stack uygulamadır:

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express.js
- **Veritabanı**: PostgreSQL
- **ORM**: Drizzle ORM
- **Kimlik doğrulama**: Passport.js
- **UI Bileşenleri**: shadcn/ui (Radix UI tabanlı)
- **Stil**: Tailwind CSS
- **Durum Yönetimi**: TanStack Query
- **Form Yönetimi**: React Hook Form, Zod

### Sistem Gereksinimleri
- Node.js 18.x veya üzeri
- PostgreSQL 14.x veya üzeri
- NPM 8.x veya üzeri

## Kurulum

### Ön Gereksinimler
- Node.js ve npm kurulu olmalıdır
- PostgreSQL veritabanı kurulu ve çalışır durumda olmalıdır

### Adımlar

1. Repoyu klonlayın:
```bash
git clone https://github.com/sizinkullanici/socialmaster.git
cd socialmaster
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env` dosyasını oluşturun:
```bash
DATABASE_URL=postgresql://kullanici:sifre@localhost:5432/socialmaster
SESSION_SECRET=sizin_session_secret_anahtariniz
```

4. Veritabanı tablolarını oluşturun:
```bash
npm run db:push
```

5. Uygulamayı başlatın:
```bash
npm run dev
```

## Kullanım Kılavuzu

### Giriş ve Kayıt
- `/auth` URL'sini ziyaret ederek giriş yapabilir veya yeni hesap oluşturabilirsiniz
- Demo için: Kullanıcı adı: `admin`, Şifre: `password`

### Sosyal Medya Hesapları
1. Dashboard'dan "Hesaplar" bölümüne gidin
2. "Yeni Hesap Ekle" butonuna tıklayın
3. Desteklenen platformlardan birini seçin
4. Yetkilendirme işlemini tamamlayın

### Gönderiler
1. "Gönderiler" bölümüne gidin
2. "Yeni Gönderi" butonuna tıklayın
3. İçerik, medya ve hedef hesapları seçin
4. Hemen paylaşın veya zamanlayın

### Analitik
1. "Analitik" bölümüne gidin
2. Görüntülemek istediğiniz hesabı veya hesapları seçin
3. Tarih aralığını ayarlayın
4. Metriklerinizi görüntüleyin ve raporlayın

### İçerik Yönetimi
1. "İçerik Yönetimi" bölümüne gidin
2. Sayfalar, bölümler, menüler veya SSS sekmelerinden birini seçin
3. İçerikleri düzenleyin, ekleyin veya kaldırın

## Geliştirme

### Kod Yapısı
- `/client`: Frontend (React) kodları
- `/server`: Backend (Express) kodları
- `/shared`: Frontend ve backend arasında paylaşılan kod ve tipler
- `/public`: Statik dosyalar

### Komutlar
- `npm run dev`: Geliştirme modunda projeyi başlatır
- `npm run build`: Projeyi derler
- `npm run db:push`: Veritabanı şemasını günceller
- `npm run db:studio`: Drizzle Studio'yu açar (veritabanı yönetim arayüzü)

## API Dokümantasyonu

SocialMaster, uygulamanın farklı bileşenleri için RESTful API uç noktaları sunar:

### Kullanıcı API'leri
- `POST /api/register`: Yeni kullanıcı oluşturur
- `POST /api/login`: Kullanıcı girişi yapar
- `POST /api/logout`: Kullanıcı çıkışı yapar
- `GET /api/user`: Mevcut kullanıcı bilgilerini getirir

### Sosyal Hesap API'leri
- `GET /api/accounts`: Tüm hesapları listeler
- `GET /api/accounts/:id`: Belirli bir hesabın detaylarını getirir
- `POST /api/accounts`: Yeni sosyal medya hesabı ekler
- `PATCH /api/accounts/:id`: Hesap bilgilerini günceller
- `DELETE /api/accounts/:id`: Hesabı siler

### Gönderi API'leri
- `GET /api/accounts/:accountId/posts`: Hesaba ait gönderileri listeler
- `GET /api/posts/:id`: Belirli bir gönderinin detaylarını getirir
- `POST /api/posts`: Yeni gönderi oluşturur
- `PATCH /api/posts/:id`: Gönderiyi günceller
- `DELETE /api/posts/:id`: Gönderiyi siler

### Analitik API'leri
- `GET /api/accounts/:accountId/analytics`: Hesaba ait analitik verileri listeler
- `GET /api/accounts/:accountId/analytics/date/:date`: Belirli bir tarihe ait analitik verilerini getirir
- `POST /api/analytics`: Yeni analitik kaydı oluşturur

### CMS API'leri
- `GET /api/pages`: Tüm sayfaları listeler
- `GET /api/pages/:id`: Belirli bir sayfanın detaylarını getirir
- `POST /api/pages`: Yeni sayfa oluşturur
- `PUT /api/pages/:id`: Sayfayı günceller
- `DELETE /api/pages/:id`: Sayfayı siler

- `GET /api/page-sections`: Sayfa bölümlerini listeler
- `POST /api/page-sections`: Yeni sayfa bölümü oluşturur
- `PUT /api/page-sections/:id`: Sayfa bölümünü günceller
- `DELETE /api/page-sections/:id`: Sayfa bölümünü siler

- `GET /api/menu-items`: Menü öğelerini listeler
- `POST /api/menu-items`: Yeni menü öğesi oluşturur
- `PUT /api/menu-items/:id`: Menü öğesini günceller
- `DELETE /api/menu-items/:id`: Menü öğesini siler

- `GET /api/faq-items`: SSS öğelerini listeler
- `POST /api/faq-items`: Yeni SSS öğesi oluşturur
- `PUT /api/faq-items/:id`: SSS öğesini günceller
- `DELETE /api/faq-items/:id`: SSS öğesini siler

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakınız.

## İletişim

Sorularınız veya geri bildirimleriniz için:
- Email: info@socialmaster.com
- Twitter: @socialmaster
- Web: https://www.socialmaster.com