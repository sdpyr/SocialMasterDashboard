interface SentimentAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  explanation: string;
}

interface ContentGenerationResult {
  content: string;
  hashtags?: string[];
  mediaPrompt?: string;
}

// Mock AI servisleri - gerçek implementasyonda API'ler ile değiştirilecek
export const aiServices = {
  /**
   * Bir metin için duygu analizi yapar
   * @param text Analiz edilecek metin
   * @returns Duygu analizi sonucu
   */
  analyzeSentiment: async (text: string): Promise<SentimentAnalysisResult> => {
    // Dummy implementasyon - gerçek servise bağlanılacak
    await new Promise(resolve => setTimeout(resolve, 1000)); // API çağrısı simülasyonu
    
    // Basit bir duygu analizi simülasyonu
    const lowercaseText = text.toLowerCase();
    const positive = ['harika', 'mükemmel', 'güzel', 'muhteşem', 'teşekkür', 'iyi'].some(word => lowercaseText.includes(word));
    const negative = ['kötü', 'berbat', 'rezalet', 'sorun', 'problem', 'hata'].some(word => lowercaseText.includes(word));
    
    if (positive && !negative) {
      return {
        sentiment: 'positive',
        score: 0.8,
        explanation: 'Metin olumlu ifadeler içeriyor.'
      };
    } else if (negative && !positive) {
      return {
        sentiment: 'negative',
        score: 0.7,
        explanation: 'Metin olumsuz ifadeler içeriyor.'
      };
    } else {
      return {
        sentiment: 'neutral',
        score: 0.5,
        explanation: 'Metin nötr olarak değerlendirildi.'
      };
    }
  },
  
  /**
   * Belirli bir platform için içerik önerileri oluşturur
   * @param platform Sosyal medya platformu
   * @param topic Konu veya anahtar kelimeler
   * @param toneOrStyle İçerik tonu (profesyonel, gündelik, eğlenceli, vb.)
   * @returns Oluşturulan içerik önerisi
   */
  generateContent: async (
    platform: string,
    topic: string,
    toneOrStyle: string
  ): Promise<ContentGenerationResult> => {
    // Dummy implementasyon - gerçek servise bağlanılacak
    await new Promise(resolve => setTimeout(resolve, 1500)); // API çağrısı simülasyonu
    
    const contentByPlatform: Record<string, string> = {
      instagram: `📱 ${topic} hakkında son gelişmeler! #${topic.replace(/\s+/g, '')}`,
      facebook: `${topic} ile ilgili düşünceleriniz neler? Bu konuda yeni bir gelişme oldu ve biz çok heyecanlıyız!`,
      twitter: `${topic} konusu gündemde! Siz ne düşünüyorsunuz? 🤔`,
      linkedin: `Profesyonel ağınızla paylaşmak isterim: ${topic} konusunda yeni gelişmeler var. Bu sektördeki etkisi büyük olacak.`,
      tiktok: `${topic} trendi! 🔥 #${topic.replace(/\s+/g, '')}challenge başlattık!`,
      youtube: `${topic} hakkında derinlemesine bir analiz videosu hazırladık. Kaçırmayın!`,
    };
    
    const hashtags = [
      `#${topic.replace(/\s+/g, '')}`,
      '#sosyalmedya',
      '#trending',
      '#gündem',
      '#2023'
    ];
    
    return {
      content: contentByPlatform[platform.toLowerCase()] || `${topic} hakkında yeni bir gönderi!`,
      hashtags,
      mediaPrompt: `${topic} ile ilgili görsel`
    };
  },
  
  /**
   * Bir gönderi veya yorum için otomatik yanıt önerileri oluşturur
   * @param originalContent Orijinal içerik veya yorum
   * @param platform Sosyal medya platformu
   * @returns Oluşturulan yanıt önerisi
   */
  generateReplyRecommendations: async (
    originalContent: string,
    platform: string
  ): Promise<string[]> => {
    // Dummy implementasyon - gerçek servise bağlanılacak
    await new Promise(resolve => setTimeout(resolve, 800)); // API çağrısı simülasyonu
    
    // Basit yanıt önerileri
    return [
      `Teşekkür ederiz! Geri bildiriminiz bizim için değerli.`,
      `Değerli yorumunuz için teşekkürler. Daha fazla bilgi için DM atabilirsiniz.`,
      `Paylaşımınız için teşekkürler! Daha fazla güncel bilgi için bizi takip etmeye devam edin.`,
      `Güzel yorumunuz için teşekkürler. Size nasıl yardımcı olabiliriz?`,
      `Bu harika geri bildirim için teşekkürler! ❤️`
    ];
  }
};