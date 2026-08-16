import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "./types";

const DICT = {
  "nav.home": ["Beranda", "Home", "首页"],
  "nav.about": ["Tentang", "About", "关于"],
  "nav.services": ["Layanan", "Services", "服务"],
  "nav.packages": ["Paket", "Packages", "套餐"],
  "nav.spa": ["Spa", "Spa", "水疗"],
  "nav.team": ["Tim", "Team", "团队"],
  "nav.gallery": ["Galeri", "Gallery", "画廊"],
  "nav.promotions": ["Promo", "Offers", "优惠"],
  "nav.contact": ["Kontak", "Contact", "联系"],
  "nav.more": ["Lainnya", "More", "更多"],
  "cta.book": ["Pesan Sekarang", "Book Now", "立即预约"],
  "cta.bookAppointment": ["Buat Janji", "Book an Appointment", "预约到店"],
  "cta.exploreServices": ["Lihat Layanan", "Explore Services", "浏览服务"],
  "cta.bookService": ["Pesan Layanan", "Book Service", "预约服务"],
  "cta.bookPackage": ["Pesan Paket", "Book Package", "预约套餐"],
  "cta.bookWith": ["Pesan dengan", "Book with", "预约"],
  "cta.discoverStory": ["Kisah Kami", "Discover Our Story", "了解我们的故事"],
  "cta.viewAll": ["Lihat Semua", "View All", "查看全部"],
  "cta.directions": ["Petunjuk Arah", "Get Directions", "导航前往"],
  "cta.whatsapp": ["WhatsApp Kami", "WhatsApp Us", "WhatsApp 联系"],
  "cta.call": ["Telepon", "Call Now", "拨打电话"],
  "status.open": ["Buka Sekarang", "Open Now", "营业中"],
  "status.closed": ["Tutup", "Closed", "已打烊"],
  "status.openToday": ["Buka Hari Ini", "Open Today", "今日营业"],
  "info.hours": ["Jam Buka", "Opening Hours", "营业时间"],
  "info.location": ["Lokasi", "Location", "位置"],
  "info.contact": ["Kontak", "Contact", "联系方式"],
  "info.appointments": ["Reservasi", "Appointments", "预约"],
  "info.chat": ["Chat dengan kami", "Chat with us", "在线咨询"],
  "info.visit": ["Kunjungi Kami", "Visit Us", "到店拜访"],
  "info.email": ["Email", "Email", "邮箱"],
  "info.schedule": ["Jadwal", "Schedule", "时间表"],
  "section.services": ["Layanan", "Services", "服务项目"],
  "section.servicesTitle": ["Perawatan yang dibuat untuk Anda.", "Treatments made for you.", "为你而设的护理。"],
  "section.packages": ["Paket", "Packages", "套餐"],
  "section.packagesTitle": ["Ritual pilihan kami.", "Curated rituals.", "精选仪式。"],
  "section.spa": ["Spa & Wellness", "Spa & Wellness", "水疗与养生"],
  "section.spaTitle": ["Ruang untuk bernapas.", "Room to breathe.", "呼吸的空间。"],
  "section.team": ["Tim Kami", "Our Team", "我们的团队"],
  "section.teamTitle": ["Temui para ahli kami.", "Meet our experts.", "认识我们的专家。"],
  "section.gallery": ["Galeri", "Gallery", "画廊"],
  "section.testimonials": ["Ulasan", "Testimonials", "客户评价"],
  "section.testimonialsTitle": ["Kata mereka.", "In their words.", "客人这样说。"],
  "section.promotions": ["Penawaran", "Offers", "优惠活动"],
  "section.location": ["Lokasi", "Location", "位置"],
  "section.contact": ["Kontak", "Contact", "联系我们"],
  "section.about": ["Tentang Kami", "About Us", "关于我们"],
  "filter.all": ["Semua", "All", "全部"],
  "cat.hair": ["Rambut", "Hair", "美发"],
  "cat.nails": ["Kuku", "Nails", "美甲"],
  "cat.facial": ["Facial", "Facial", "面部"],
  "cat.spa": ["Spa", "Spa", "水疗"],
  "cat.beauty": ["Beauty", "Beauty", "美妆"],
  "label.minutes": ["menit", "min", "分钟"],
  "label.popular": ["Populer", "Popular", "热门"],
  "label.featured": ["Unggulan", "Featured", "推荐"],
  "label.years": ["Tahun Pengalaman", "Years Experience", "年经验"],
  "label.specialty": ["Spesialisasi", "Specialty", "专长"],
  "label.experience": ["Pengalaman", "Experience", "经验"],
  "label.languages": ["Bahasa", "Languages", "语言"],
  "label.availability": ["Ketersediaan", "Availability", "可预约时间"],
  "label.expired": ["Berakhir", "Expired", "已结束"],
  "label.from": ["Mulai", "From", "起"],
  "booking.title": ["Buat Janji", "Book an Appointment", "预约到店"],
  "booking.subtitle": [
    "Kami akan mengonfirmasi lewat WhatsApp.",
    "We will confirm your booking on WhatsApp.",
    "我们将通过 WhatsApp 与您确认。",
  ],
  "booking.name": ["Nama", "Name", "姓名"],
  "booking.phone": ["Nomor WhatsApp", "WhatsApp number", "WhatsApp 号码"],
  "booking.service": ["Layanan", "Service", "服务"],
  "booking.package": ["Paket", "Package", "套餐"],
  "booking.employee": ["Terapis", "Therapist", "理疗师"],
  "booking.date": ["Tanggal", "Preferred date", "日期"],
  "booking.time": ["Waktu", "Preferred time", "时间"],
  "booking.note": ["Catatan (opsional)", "Note (optional)", "备注（选填）"],
  "booking.submit": ["Kirim via WhatsApp", "Send on WhatsApp", "通过 WhatsApp 发送"],
  "booking.none": ["Tidak ada", "No preference", "不限"],
  "booking.required": ["Mohon isi nama dan nomor WhatsApp.", "Please add your name and WhatsApp number.", "请填写姓名和 WhatsApp 号码。"],
  "footer.rights": ["Hak cipta dilindungi.", "All rights reserved.", "版权所有。"],
  "footer.explore": ["Jelajahi", "Explore", "浏览"],
  "footer.visit": ["Kunjungi", "Visit", "到访"],
  "day.0": ["Minggu", "Sunday", "星期日"],
  "day.1": ["Senin", "Monday", "星期一"],
  "day.2": ["Selasa", "Tuesday", "星期二"],
  "day.3": ["Rabu", "Wednesday", "星期三"],
  "day.4": ["Kamis", "Thursday", "星期四"],
  "day.5": ["Jumat", "Friday", "星期五"],
  "day.6": ["Sabtu", "Saturday", "星期六"],
} as const;

export type TKey = keyof typeof DICT;

const IDX: Record<Lang, number> = { id: 0, en: 1, zh: 2 };

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
}

const Ctx = createContext<LangCtx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("salon-lang") as Lang | null;
    if (saved && ["id", "en", "zh"].includes(saved)) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("salon-lang", l);
  };

  const t = (key: TKey) => DICT[key]?.[IDX[lang]] ?? String(key);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
