import React from 'react';
import MainHeader from '@/components/layout/MainHeader';
import Footer from '@/components/layout/Footer';

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Hakkımızda</h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="lead">
                SocialMaster, sosyal medya hesaplarınızı tek bir platformdan yönetmenize olanak sağlayan, Türkiye'nin önde gelen sosyal medya yönetim aracıdır.
              </p>
              
              <h2>Misyonumuz</h2>
              <p>
                Sosyal medyada varlığınızı güçlendirmek, içeriklerinizi en doğru zamanda en geniş kitleye ulaştırmak ve veriye dayalı kararlar almanıza yardımcı olmak için buradayız. Misyonumuz, işletmelerin sosyal medya yönetimini daha kolay, daha verimli ve daha etkili hale getirmektir.
              </p>
              
              <h2>Vizyonumuz</h2>
              <p>
                Türkiye'nin en kapsamlı ve kullanıcı dostu sosyal medya yönetim platformu olmayı, global pazarda Türk yazılım sektörünü temsil etmeyi hedefliyoruz. Kullanıcılarımızın ihtiyaçlarını en iyi şekilde anlayarak, sürekli gelişen teknolojimizle sosyal medya yönetiminde öncü olmaya devam edeceğiz.
              </p>
              
              <h2>Değerlerimiz</h2>
              <ul>
                <li><strong>Kullanıcı Odaklılık:</strong> Her geliştirme ve yenilik, kullanıcılarımızın ihtiyaçlarını karşılamak için yapılır.</li>
                <li><strong>Yenilikçilik:</strong> Sosyal medya dünyasındaki değişimlere ayak uydurmak için sürekli kendimizi yeniliyoruz.</li>
                <li><strong>Güvenilirlik:</strong> Kullanıcılarımızın verilerinin güvenliği ve gizliliği bizim için en önemli önceliktir.</li>
                <li><strong>Erişilebilirlik:</strong> Her boyuttaki işletmenin kaliteli sosyal medya yönetim araçlarına erişebilmesini sağlıyoruz.</li>
                <li><strong>Şeffaflık:</strong> İş süreçlerimizde ve kullanıcı iletişimimizde açık ve şeffaf bir yaklaşım benimsiyoruz.</li>
              </ul>
              
              <h2>Ekibimiz</h2>
              <p>
                SocialMaster, sosyal medya, yazılım geliştirme ve veri analizi alanlarında deneyimli bir ekip tarafından geliştirilmektedir. Türkiye'nin dört bir yanından yetenekli yazılım geliştiricileri, tasarımcılar, içerik uzmanları ve müşteri destek ekipleri, size en iyi hizmeti sunmak için çalışmaktadır.
              </p>
              
              <h2>Tarihçemiz</h2>
              <p>
                2021 yılında kurulan SocialMaster, sosyal medya yönetimindeki zorlukları aşmak ve işletmelere bu alanda destek olmak amacıyla yola çıktı. İlk yılımızda 1000'den fazla kullanıcıya ulaşarak Türkiye'nin en hızlı büyüyen sosyal medya yönetim platformlarından biri olduk. Bugün, her ölçekten işletmeye hizmet veriyor ve sürekli büyümeye devam ediyoruz.
              </p>
              
              <div className="mt-12 bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-lg mb-4">Bize Ulaşın</h3>
                <p>
                  Sorularınız veya işbirliği teklifleriniz için bizimle iletişime geçebilirsiniz. Size yardımcı olmaktan mutluluk duyarız.
                </p>
                <a href="/iletisim" className="mt-4 inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  İletişim Formu
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}