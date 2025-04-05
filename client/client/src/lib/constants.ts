export const PLATFORMS = ["instagram", "youtube", "tiktok", "facebook", "twitter", "linkedin"] as const;
export type SocialPlatform = typeof PLATFORMS[number];

// Platform specific colors and icons
export const PLATFORM_DATA: Record<SocialPlatform, { 
  label: string;
  color: string;
  bgColor: string;
  iconClass: string;
  analyticsFields: string[];
  postTypes: string[];
  description: string;
}> = {
  instagram: {
    label: "Instagram",
    color: "instagram-color",
    bgColor: "instagram-bg",
    iconClass: "ri-instagram-line",
    description: "Görsel ve video içerik paylaşımı için ideal platform",
    analyticsFields: ["beğeni", "yorum", "paylaşım", "görüntülenme", "takipçi", "erişim"],
    postTypes: ["fotoğraf", "video", "hikaye", "reels"]
  },
  youtube: {
    label: "YouTube",
    color: "youtube-color",
    bgColor: "youtube-bg",
    iconClass: "ri-youtube-line",
    description: "Uzun format video içerik paylaşımı ve yayıncılık platformu",
    analyticsFields: ["beğeni", "yorum", "abone", "görüntülenme", "izlenme süresi", "erişim"],
    postTypes: ["video", "shorts"]
  },
  tiktok: {
    label: "TikTok",
    color: "tiktok-color",
    bgColor: "tiktok-bg",
    iconClass: "ri-tiktok-line",
    description: "Kısa ve yaratıcı video içerikleri için popüler platform",
    analyticsFields: ["beğeni", "yorum", "paylaşım", "görüntülenme", "takipçi", "erişim"],
    postTypes: ["video"]
  },
  facebook: {
    label: "Facebook",
    color: "facebook-color",
    bgColor: "facebook-bg",
    iconClass: "ri-facebook-circle-line",
    description: "Geniş kitleler ve topluluklar için sosyal paylaşım platformu",
    analyticsFields: ["beğeni", "yorum", "paylaşım", "görüntülenme", "takipçi", "erişim"],
    postTypes: ["yazı", "fotoğraf", "video", "link", "etkinlik"]
  },
  twitter: {
    label: "X",
    color: "twitter-color",
    bgColor: "twitter-bg",
    iconClass: "ri-twitter-x-line",
    description: "Kısa metinlerle güncel konular ve trendler için ideal platform",
    analyticsFields: ["beğeni", "retweet", "alıntı", "görüntülenme", "takipçi", "erişim"],
    postTypes: ["yazı", "fotoğraf", "video", "anket"]
  },
  linkedin: {
    label: "LinkedIn",
    color: "linkedin-color",
    bgColor: "linkedin-bg",
    iconClass: "ri-linkedin-line",
    description: "Profesyonel içerik ve iş bağlantıları için sosyal platform",
    analyticsFields: ["beğeni", "yorum", "paylaşım", "görüntülenme", "bağlantı", "erişim"],
    postTypes: ["yazı", "fotoğraf", "video", "makale", "iş ilanı"]
  }
};

// Time intervals for date filters
export const TIME_INTERVALS = [
  { value: "last7days", label: "Son 7 Gün" },
  { value: "last14days", label: "Son 14 Gün" },
  { value: "last30days", label: "Son 30 Gün" },
  { value: "last90days", label: "Son 90 Gün" },
  { value: "thisMonth", label: "Bu Ay" },
  { value: "lastMonth", label: "Geçen Ay" },
  { value: "thisYear", label: "Bu Yıl" }
];

// Feature navigation links
export const FEATURE_LINKS = [
  { path: "/mesajlar", label: "Mesajlar", icon: "ri-message-3-line" },
  { path: "/analizler", label: "Analizler", icon: "ri-line-chart-line" },
  { path: "/istatistikler", label: "İstatistikler", icon: "ri-bar-chart-grouped-line" },
  { path: "/anahtar-kelimeler", label: "Anahtar Kelimeler", icon: "ri-search-line" },
  { path: "/icerik-takvimi", label: "İçerik Takvimi", icon: "ri-calendar-line" },
  { path: "/icerik-olustur", label: "İçerik Oluştur", icon: "ri-add-circle-line" },
  { path: "/admin", label: "Admin Paneli", icon: "ri-shield-keyhole-line" }
];

// Demo user ID
export const DEMO_USER_ID = 1;
