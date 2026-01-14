# Freela — Freelancer tarzı örnek site

Bu proje, açık mavi / beyaz / gri renk şemasına sahip basit bir freelancer tarzı ön yüz iskeletidir.

Nasıl çalıştırılır

- Dosyaları açmak için `index.html` dosyasını tarayıcıda açın.
- Geliştirme için bir yerel sunucu kullanmak isterseniz (ör. VS Code Live Server), projenin kökünü seçin.


Backend & DB
- `server.js` — Express sunucusu, SQLite veritabanı (`data.sqlite`) ile çalışır.
- `scripts/init_db.js` — veritabanı tablolarını oluşturur ve örnek seed verisi ekler.

Örnek çalışma (lokalde):

```powershell
cd 'C:\Users\Seele\Documents\GitHub\SeeleSilver.github.io'
npm install
npm run init-db    # data.sqlite oluşturur ve seed ekler
npm start
```

Varsayılan JWT sırları geliştirme içindir; üretimde `JWT_SECRET` çevre değişkenini ayarlayın.
- Tasarım detayları veya renk tonları üzerinde ince ayar yapabilirim.
