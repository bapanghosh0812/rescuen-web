"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Smartphone,
  CreditCard,
  Building2,
  Wallet,
  Lock,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  MailCheck,
  AlertCircle,
  QrCode,
  Globe,
  ChevronDown,
  Printer,
} from "lucide-react";
import NamasteIllustration from "@/components/NamasteIllustration";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (res: unknown) => void) => void;
    };
  }
}

type Language = "en" | "hi" | "bn" | "hinglish" | "mr" | "ta" | "te";
type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

type VerifiedReceipt = {
  receiptId: string;
  name: string;
  email: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  timestamp: string;
  message: string;
  emailDelivered: boolean;
};

const PRESET_AMOUNTS = [
  { value: 51, tag: "Shagun 🙏" },
  { value: 101, tag: "Popular ❤️" },
  { value: 501, tag: "Safety Shield 🛡️" },
  { value: 1100, tag: "Radar Hero ⚡" },
  { value: 5000, tag: "Guardian 🌟" },
  { value: 11000, tag: "Patron 👑" },
];

const LANGUAGES: { id: Language; label: string; flag: string }[] = [
  { id: "en", label: "English (Default)", flag: "🇬🇧" },
  { id: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { id: "bn", label: "বাংলা (Bengali)", flag: "🇮🇳" },
  { id: "hinglish", label: "Hinglish", flag: "🇮🇳" },
  { id: "mr", label: "मराठी (Marathi)", flag: "🇮🇳" },
  { id: "ta", label: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { id: "te", label: "తెలుగు (Telugu)", flag: "🇮🇳" },
];

const I18N = {
  en: {
    heroBadge: "100% Citizen-Powered Safety Mission",
    heroTitle: "Every Contribution",
    heroHighlight: "Protects a Precious Life",
    heroDesc:
      "Team RESCUEN keeps this life-saving safety platform 100% free for women, children, and every citizen across India. Your voluntary contribution fuels our 24×7 emergency SOS infrastructure, 1 KM Rescue Radar, and nationwide safety mission.",
    pillar1Val: "₹1 – ₹1L",
    pillar1Label: "Voluntary Choice",
    pillar2Val: "100%",
    pillar2Label: "Direct Mission",
    pillar3Val: "Optional",
    pillar3Label: "Email Receipt",
    trustBadge:
      "Official Razorpay Bank Gateway: Only genuine bank-captured transactions with HMAC-SHA256 cryptographic signatures receive official receipts.",
    portalTag: "Team RESCUEN · Official Support Portal",
    securityHeader: "Razorpay 256-Bit SSL",
    formTitle: "Support Team RESCUEN",
    formSubtitle:
      "Choose any amount from ₹1 to ₹1,00,000. Official Razorpay checkout supports instant UPI, QR, Cards, and NetBanking.",
    step1: "1. Select or Enter Contribution Amount (₹1 – ₹1,00,000)",
    customPlaceholder: "Enter custom amount (1 to 100000)",
    step2: "2. Preferred Payment Method",
    methodUpiTitle: "UPI & Official QR",
    methodUpiSubtitle: "GPay, PhonePe, Paytm, BHIM & Instant Verified QR",
    methodUpiBadge: "Instant & QR",
    methodCardTitle: "Debit / Credit Card",
    methodCardSubtitle: "RuPay, Visa, Mastercard, Maestro",
    methodCardBadge: "256-Bit SSL",
    methodNbTitle: "NetBanking",
    methodNbSubtitle: "SBI, HDFC, ICICI, Axis & 50+ Indian Banks",
    methodNbBadge: "Direct Bank",
    methodWalletTitle: "Mobile Wallets",
    methodWalletSubtitle: "Amazon Pay, Mobikwik, Airtel Money",
    methodWalletBadge: "One-Tap",
    step3: "3. Official Receipt on Email (Optional)",
    step3Desc:
      "If you would like an official receipt sent to your email, please provide your name and email. Otherwise, leave them blank to donate anonymously:",
    namePlaceholder: "Your Full Name (Optional)",
    emailPlaceholder: "Email for Receipt (Optional)",
    messagePlaceholder: "Blessing or Message for Team RESCUEN (Optional) 🙏",
    ctaText: "Contribute via Razorpay",
    creatingOrder: "Creating Razorpay Order...",
    openingGateway: "Opening Razorpay Secure Gateway...",
    verifying: "Verifying payment with bank...",
    footerNote: "Official Razorpay Checkout · Instant QR & UPI · 256-Bit Bank Encryption",
    celebratingBadge: "🙏 Sincere Gratitude · Bank Verified Contribution",
    celebratingTitle: "Namaste & Thank You,",
    celebratingDesc:
      "Team RESCUEN extends heartfelt gratitude. Your voluntary support directly helps protect millions of families and women across the nation 24×7.",
    receiptHeading: "we’ve received your contribution",
    receiptParagraph: "Thank you for supporting Team RESCUEN. Your contribution has been verified by the bank.",
    receiptEmailedNotice: "An official copy of this receipt has been emailed to",
    printBtn: "Save / Print Official Document",
    anotherBtn: "Make Another Contribution",
    emailNote: "If the email is not visible in your Primary inbox, please check your Updates or Spam folder.",
  },
  hi: {
    heroBadge: "100% नागरिक-संचालित सुरक्षा मिशन",
    heroTitle: "हर एक योगदान,",
    heroHighlight: "किसी की जान बचाता है",
    heroDesc:
      "टीम RESCUEN ने इस जीवन-रक्षक सुरक्षा प्लेटफॉर्म को हर बेटी, महिला और नागरिक के लिए 100% निःशुल्क रखा है। आपका स्वैच्छिक योगदान हमारे 24×7 आपातकालीन SOS सर्वर, 1 KM रेस्क्यू रडार और देशव्यापी सुरक्षा मिशन को शक्ति देता है।",
    pillar1Val: "₹1 – ₹1 लाख",
    pillar1Label: "अपनी इच्छा से",
    pillar2Val: "100%",
    pillar2Label: "सीधा मिशन में",
    pillar3Val: "वैकल्पिक",
    pillar3Label: "ईमेल रसीद",
    trustBadge:
      "आधिकारिक रेजरपे बैंक गेटवे: केवल वास्तविक बैंक-सत्यापित भुगतानों को ही आधिकारिक रसीद प्रदान की जाती है।",
    portalTag: "टीम RESCUEN · आधिकारिक सहयोग पोर्टल",
    securityHeader: "रेजरपे 256-बिट SSL सुरक्षित",
    formTitle: "टीम RESCUEN का सहयोग करें",
    formSubtitle:
      "₹1 से ₹1,00,000 के बीच कोई भी राशि चुनें। रेजरपे चेकआउट यूपीआई, क्यूआर, कार्ड और नेटबैंकिंग का पूर्ण समर्थन करता है।",
    step1: "1. योगदान राशि चुनें या दर्ज करें (₹1 – ₹1,00,000)",
    customPlaceholder: "अन्य राशि दर्ज करें (1 से 100000)",
    step2: "2. पसंदीदा भुगतान विकल्प चुनें",
    methodUpiTitle: "यूपीआई एवं आधिकारिक क्यूआर",
    methodUpiSubtitle: "गूगल पे, फोनपे, पेटीएम, भीम और स्वतः सत्यापित क्यूआर",
    methodUpiBadge: "त्वरित एवं क्यूआर",
    methodCardTitle: "डेबिट / क्रेडिट कार्ड",
    methodCardSubtitle: "RuPay, Visa, Mastercard",
    methodCardBadge: "256-बिट सुरक्षित",
    methodNbTitle: "नेटबैंकिंग",
    methodNbSubtitle: "एसबीआई, एचडीएफसी, आईसीआईसीआई, एक्सिस व सभी बैंक",
    methodNbBadge: "सीधा बैंक",
    methodWalletTitle: "मोबाइल वॉलेट",
    methodWalletSubtitle: "अमेज़न पे, मोबिक्विक आदि",
    methodWalletBadge: "वन-टैप",
    step3: "3. ईमेल पर आधिकारिक रसीद (वैकल्पिक)",
    step3Desc:
      "यदि आप ईमेल पर आधिकारिक रसीद चाहते हैं तो नाम और ईमेल दर्ज करें, अन्यथा गुप्त दान के लिए इसे खाली छोड़ दें:",
    namePlaceholder: "आपका पूरा नाम (वैकल्पिक)",
    emailPlaceholder: "रसीद के लिए ईमेल (वैकल्पिक)",
    messagePlaceholder: "टीम RESCUEN के लिए कोई संदेश या शुभकामना (वैकल्पिक) 🙏",
    ctaText: "रेजरपे द्वारा योगदान करें",
    creatingOrder: "रेजरपे आर्डर बन रहा है...",
    openingGateway: "सुरक्षित रेजरपे गेटवे खुल रहा है...",
    verifying: "बैंक सत्यापन जारी है...",
    footerNote: "आधिकारिक रेजरपे चेकआउट · त्वरित क्यूआर व यूपीआई · 256-बिट बैंक एन्क्रिप्शन",
    celebratingBadge: "🙏 कोटि-कोटि धन्यवाद · बैंक सत्यापित योगदान",
    celebratingTitle: "नमस्ते एवं हार्दिक धन्यवाद,",
    celebratingDesc:
      "टीम RESCUEN की ओर से आपको दिल से कोटि-कोटि प्रणाम! आपका सहयोग देश की बेटियों और नागरिकों को 24×7 सुरक्षित रखने में मदद करेगा।",
    receiptHeading: "हमें आपका योगदान प्राप्त हुआ ✅",
    receiptParagraph: "टीम RESCUEN का समर्थन करने के लिए धन्यवाद। आपका योगदान बैंक द्वारा सत्यापित कर लिया गया है।",
    receiptEmailedNotice: "इस रसीद की आधिकारिक प्रति भेज दी गई है:",
    printBtn: "आधिकारिक दस्तावेज़ सेव / प्रिंट करें",
    anotherBtn: "एक और योगदान करें",
    emailNote: "यदि ईमेल इनबॉक्स में तुरंत न दिखे, तो कृपया अपडेट्स या स्पैम फोल्डर भी जांचें।",
  },
  bn: {
    heroBadge: "১০০% নাগরিক-চালিত সুরক্ষা মিশন",
    heroTitle: "প্রতিটি অনুদান,",
    heroHighlight: "একটি জীবন রক্ষা করে",
    heroDesc:
      "টিম RESCUEN এই জীবন রক্ষাকারী সুরক্ষা প্ল্যাটফর্মটি ভারতের প্রতিটি নারী ও নাগরিকের জন্য ১০০% বিনামূল্যে রেখেছে। আপনার স্বেচ্ছাসেবী অনুদান আমাদের ২৪×৭ জরুরি এসওএস সার্ভার ও দেশব্যাপী মিশনকে এগিয়ে নিয়ে যায়।",
    pillar1Val: "₹১ – ₹১ লাখ",
    pillar1Label: "নিজের ইচ্ছামতো",
    pillar2Val: "১০০%",
    pillar2Label: "সরাসরি মিশনে",
    pillar3Val: "ঐচ্ছিক",
    pillar3Label: "ইমেল রসিদ",
    trustBadge: "অফিসিয়াল রেজরপে ব্যাংক গেটওয়ে: শুধুমাত্র ব্যাংক-যাচাইকৃত লেনদেনেই রসিদ জারি করা হয়।",
    portalTag: "টিম RESCUEN · অফিশিয়াল দান পোর্টাল",
    securityHeader: "রেজরপে ২৫৬-বিট এসএসএল",
    formTitle: "টিম RESCUEN কে সমর্থন করুন",
    formSubtitle: "₹১ থেকে ₹১,০০,০০০ পর্যন্ত যেকোনো পরিমাণ বেছে নিন। সম্পূর্ণ নিরাপদ রেজরপে গেটওয়ে।",
    step1: "১. অনুদানের পরিমাণ নির্বাচন করুন বা লিখুন (₹১ – ₹১,০০,০০০)",
    customPlaceholder: "অন্য পরিমাণ লিখুন (১ থেকে ১০০০00)",
    step2: "২. পেমেন্ট পদ্ধতি বেছে নিন",
    methodUpiTitle: "ইউপিআই ও অফিসিয়াল কিউআর",
    methodUpiSubtitle: "Google Pay, PhonePe, Paytm, BHIM এবং QR",
    methodUpiBadge: "১-ক্লিক পে",
    methodCardTitle: "ডেবিট / ক্রেডিট কার্ড",
    methodCardSubtitle: "RuPay, Visa, Mastercard",
    methodCardBadge: "২৫৬-বিট SSL",
    methodNbTitle: "নেটব্যাঙ্কিং",
    methodNbSubtitle: "SBI, HDFC, ICICI, Axis ও অন্যান্য ব্যাংক",
    methodNbBadge: "সরাসরি ব্যাংক",
    methodWalletTitle: "মোবাইল ওয়ালেট",
    methodWalletSubtitle: "Amazon Pay, Mobikwik ইত্যাদি",
    methodWalletBadge: "সহজ পে",
    step3: "৩. ইমেলে অফিসিয়াল রসিদ (ঐচ্ছিক)",
    step3Desc: "আপনি যদি ইমেলে রসিদ চান তবে নাম এবং ইমেল লিখুন, অথবা বেনামে দান করতে ফাঁকা রাখুন:",
    namePlaceholder: "আপনার পুরো নাম (ঐচ্ছিক)",
    emailPlaceholder: "রসিদের জন্য ইমেল (ঐচ্ছিক)",
    messagePlaceholder: "টিম RESCUEN-এর জন্য শুভকামনা বা বার্তা (ঐচ্ছিক) 🙏",
    ctaText: "রেজরপে দিয়ে অনুদান করুন",
    creatingOrder: "রেজরপে অর্ডার তৈরি হচ্ছে...",
    openingGateway: "সুরক্ষিত পেমেন্ট উইন্ডো খুলছে...",
    verifying: "পেমেন্ট যাচাই করা হচ্ছে...",
    footerNote: "অফিসিয়াল রেজরপে চেকআউট · ইউপিআই ও কার্ড · ব্যাংকিং এনক্রিপশন",
    celebratingBadge: "🙏 আন্তরিক ধন্যবাদ · ব্যাংক যাচাইকৃত অনুদান",
    celebratingTitle: "নমস্কার ও আন্তরিক ধন্যবাদ,",
    celebratingDesc: "টিম RESCUEN-এর পক্ষ থেকে আপনাকে অসংখ্য ধন্যবাদ! আপনার অবদান নারীদের সুরক্ষায় কাজে লাগবে।",
    receiptHeading: "আমরা আপনার অনুদান পেয়েছি ✅",
    receiptParagraph: "টিম RESCUEN-কে সমর্থন করার জন্য ধন্যবাদ। ব্যাংক লেনদেনটি সফলভাবে যাচাই করা হয়েছে।",
    receiptEmailedNotice: "এই রসিদের একটি কপি পাঠানো হয়েছে:",
    printBtn: "অফিসিয়াল ডকুমেন্ট সেভ / প্রিন্ট করুন",
    anotherBtn: "অন্য একটি অনুদান করুন",
    emailNote: "ইমেলটি ইনবক্সে না পেলে অনুগ্রহ করে স্প্যাম বা আপডেটস ফোল্ডার চেক করুন।",
  },
  hinglish: {
    heroBadge: "100% Citizen-Powered Safety Mission",
    heroTitle: "Har Ek Daan,",
    heroHighlight: "Kisi Ki Jaan Bachata Hai",
    heroDesc:
      "Team RESCUEN ne is life-saving safety platform ko har beti, mahila aur citizen ke liye 100% Free rakha hai. Aapka ₹1 se ₹1,00,000 tak ka sahyog direct hamare 24×7 emergency SOS servers aur nationwide mission ko chalata hai.",
    pillar1Val: "₹1 – ₹1L",
    pillar1Label: "Apni Marzi Se",
    pillar2Val: "100%",
    pillar2Label: "Direct Mission",
    pillar3Val: "Optional",
    pillar3Label: "Email Receipt",
    trustBadge: "Official Razorpay Gateway: Bank capture aur HMAC-SHA256 signature verification ke sath.",
    portalTag: "Team RESCUEN · Official Support Portal",
    securityHeader: "Razorpay 256-Bit SSL",
    formTitle: "Support Team RESCUEN",
    formSubtitle:
      "Choose any amount from ₹1 to ₹1,00,000. Official Razorpay checkout supports instant UPI, QR, Cards, and NetBanking.",
    step1: "1. Select or Enter Amount (₹1 – ₹1,00,000)",
    customPlaceholder: "Enter custom amount (1 to 100000)",
    step2: "2. Choose Preferred Payment Option",
    methodUpiTitle: "UPI & Official QR",
    methodUpiSubtitle: "GPay, PhonePe, Paytm, BHIM & Instant Verified QR",
    methodUpiBadge: "Instant & QR",
    methodCardTitle: "Debit / Credit Card",
    methodCardSubtitle: "RuPay, Visa, Mastercard",
    methodCardBadge: "256-Bit SSL",
    methodNbTitle: "NetBanking",
    methodNbSubtitle: "SBI, HDFC, ICICI, Axis & All Banks",
    methodNbBadge: "Direct Bank",
    methodWalletTitle: "Mobile Wallets",
    methodWalletSubtitle: "Amazon Pay, Mobikwik",
    methodWalletBadge: "One-Tap",
    step3: "3. Official Receipt on Email (Optional)",
    step3Desc:
      "Agar email par official receipt chahiye toh Name aur Email bharein, warna gupt daan ke liye khali chhod dein:",
    namePlaceholder: "Aapka Naam (Optional)",
    emailPlaceholder: "Receipt ke liye Email (Optional)",
    messagePlaceholder: "Team RESCUEN ke liye koi sandesh (Optional) 🙏",
    ctaText: "Pay via Razorpay",
    creatingOrder: "Order create ho raha hai...",
    openingGateway: "Razorpay Secure Gateway khul raha hai...",
    verifying: "Bank verification chal raha hai...",
    footerNote: "Official Razorpay Checkout · Instant QR & UPI · 256-Bit Bank Encryption",
    celebratingBadge: "🙏 Koti-Koti Dhanyavaad · Bank Verified Contribution",
    celebratingTitle: "Namaste & Thank You,",
    celebratingDesc:
      "Team RESCUEN ki taraf se dil se pranaam! Aapka sahyog Bharat ki har beti aur citizen ko surakshit rakhega.",
    receiptHeading: "we’ve got your contribution ✅",
    receiptParagraph: "Thank you for supporting Team RESCUEN. Your contribution has been verified by the bank.",
    receiptEmailedNotice: "An official copy of this receipt has been emailed to",
    printBtn: "Save / Print Official Document",
    anotherBtn: "Make Another Contribution",
    emailNote: "Agar email inbox me na dikhe, toh kripya Updates ya Spam folder bhi check karein.",
  },
  mr: {
    heroBadge: "१००% नागरिक-चालित सुरक्षा मिशन",
    heroTitle: "प्रत्येक योगदान,",
    heroHighlight: "एकाचे प्राण वाचवते",
    heroDesc: "टीम RESCUEN ने हे जीवन-रक्षक सुरक्षा व्यासपीठ भारतातील प्रत्येक नागरिक व महिलांसाठी १००% विनामूल्य ठेवले आहे.",
    pillar1Val: "₹१ – ₹१ लाख",
    pillar1Label: "स्वेच्छेने",
    pillar2Val: "१००%",
    pillar2Label: "थेट मिशनमध्ये",
    pillar3Val: "ऐच्छिक",
    pillar3Label: "ईमेल पावती",
    trustBadge: "अधिकृत रेझरपे बँक गेटवे: केवळ बँक-सत्यापित व्यवहारांनाच अधिकृत पावती दिली जाते.",
    portalTag: "टीम RESCUEN · अधिकृत सहाय्य पोर्टल",
    securityHeader: "रेझरपे २५६-बिट एसएसएल",
    formTitle: "टीम RESCUEN ला मदत करा",
    formSubtitle: "₹१ ते ₹१,००,००० मधील कोणतीही रक्कम निवडा. यूपीआय, क्यूआर, कार्ड आणि नेटबँकिंग समर्थित.",
    step1: "१. रक्कम निवडा किंवा प्रविष्ट करा (₹१ – ₹१,००,०००)",
    customPlaceholder: "इतर रक्कम टाका (१ ते १०००००)",
    step2: "२. पेमेंट पद्धत निवडा",
    methodUpiTitle: "यूपीआय व अधिकृत क्यूआर",
    methodUpiSubtitle: "GPay, PhonePe, Paytm, BHIM आणि QR",
    methodUpiBadge: "झटपट पेमेंट",
    methodCardTitle: "डेबिट / क्रेडिट कार्ड",
    methodCardSubtitle: "RuPay, Visa, Mastercard",
    methodCardBadge: "२५६-बिट SSL",
    methodNbTitle: "नेटबँकिंग",
    methodNbSubtitle: "सर्व प्रमुख भारतीय बँका",
    methodNbBadge: "थेट बँक",
    methodWalletTitle: "मोबाईल वॉलेट्स",
    methodWalletSubtitle: "Amazon Pay, Mobikwik",
    methodWalletBadge: "वन-टॅप",
    step3: "३. ईमेलवर अधिकृत पावती (ऐच्छिक)",
    step3Desc: "आपल्याला पावती हवी असल्यास नाव आणि ईमेल प्रविष्ट करा, अन्यथा गुप्त दानासाठी रिक्त ठेवा:",
    namePlaceholder: "पूर्ण नाव (ऐच्छिक)",
    emailPlaceholder: "ईमेल पत्ता (ऐच्छिक)",
    messagePlaceholder: "टीम RESCUEN साठी संदेश (ऐच्छिक) 🙏",
    ctaText: "रेझरपे द्वारे योगदान द्या",
    creatingOrder: "ऑर्डर तयार होत आहे...",
    openingGateway: "गेटवे उघडत आहे...",
    verifying: "बँक पडताळणी सुरू आहे...",
    footerNote: "अधिकृत रेझरपे चेकआउट · २५६-बिट बँक एन्क्रिप्शन",
    celebratingBadge: "🙏 मनःपूर्वक धन्यवाद · बँक सत्यापित योगदान",
    celebratingTitle: "नमस्ते आणि धन्यवाद,",
    celebratingDesc: "टीम RESCUEN कडून आपले मनापासून आभार! आपले सहकार्य नागरिकांच्या सुरक्षेसाठी उपयुक्त ठरेल.",
    receiptHeading: "आम्हाला आपले योगदान प्राप्त झाले ✅",
    receiptParagraph: "टीम RESCUEN ला पाठिंबा दिल्याबद्दल धन्यवाद.",
    receiptEmailedNotice: "पावतीची प्रत या ईमेलवर पाठवली आहे:",
    printBtn: "अधिकृत कागदपत्र सेव्ह / प्रिंट करा",
    anotherBtn: "दुसरे योगदान करा",
    emailNote: "ईमेल इनबॉक्समध्ये न आढळल्यास कृपया स्पॅम किंवा अपडेट्स फोल्डर तपासा.",
  },
  ta: {
    heroBadge: "100% குடிமக்கள் பாதுகாப்பு இயக்கம்",
    heroTitle: "ஒவ்வொரு பங்களிப்பும்,",
    heroHighlight: "ஒரு உயிரைக் காக்கும்",
    heroDesc: "டீம் RESCUEN இந்த உயிர்காக்கும் தளத்தை இந்திய மக்கள் அனைவருக்கும் 100% இலவசமாக வழங்குகிறது.",
    pillar1Val: "₹1 – ₹1L",
    pillar1Label: "விருப்பப்படி",
    pillar2Val: "100%",
    pillar2Label: "நேரடி இயக்கம்",
    pillar3Val: "விருப்பம்",
    pillar3Label: "மின்னஞ்சல் ரசீது",
    trustBadge: "அதிகாரப்பூர்வ ரேஸர்பே வங்கி கேட்வே.",
    portalTag: "டீம் RESCUEN · அதிகாரப்பூர்வ நன்கொடை போர்டல்",
    securityHeader: "256-பிட் SSL பாதுகாப்பு",
    formTitle: "டீம் RESCUEN-க்கு ஆதரவளியுங்கள்",
    formSubtitle: "₹1 முதல் ₹1,00,000 வரை ஏதேனும் தொகையைத் தேர்வு செய்யவும்.",
    step1: "1. தொகையைத் தேர்ந்தெடுக்கவும் (₹1 – ₹1,00,000)",
    customPlaceholder: "தொகையை உள்ளிடவும் (1 முதல் 100000)",
    step2: "2. கட்டண முறையைத் தேர்வுசெய்க",
    methodUpiTitle: "யுபிஐ & அதிகாரப்பூர்வ QR",
    methodUpiSubtitle: "GPay, PhonePe, Paytm, BHIM மற்றும் QR",
    methodUpiBadge: "உடனடி",
    methodCardTitle: "டெபிட் / கிரெடிட் கார்டு",
    methodCardSubtitle: "RuPay, Visa, Mastercard",
    methodCardBadge: "SSL பாதுகாப்பு",
    methodNbTitle: "நெட் பேங்கிங்",
    methodNbSubtitle: "அனைத்து வங்கிகள்",
    methodNbBadge: "நேரடி வங்கி",
    methodWalletTitle: "மொபைல் வாலட்டுகள்",
    methodWalletSubtitle: "Amazon Pay, Mobikwik",
    methodWalletBadge: "ஒரே தட்டல்",
    step3: "3. மின்னஞ்சலில் ரசீது (விருப்பத்திற்குரியது)",
    step3Desc: "ரசீது வேண்டுமெனில் பெயர் மற்றும் மின்னஞ்சலை உள்ளிடவும்:",
    namePlaceholder: "முழு பெயர் (விருப்பம்)",
    emailPlaceholder: "மின்னஞ்சல் (விருப்பம்)",
    messagePlaceholder: "செய்தி அல்லது வாழ்த்துக்கள் (விருப்பம்) 🙏",
    ctaText: "ரேஸர்பே மூலம் செலுத்தவும்",
    creatingOrder: "ஆர்டர் உருவாகிறது...",
    openingGateway: "கேட்வே திறக்கிறது...",
    verifying: "சரிபார்க்கப்படுகிறது...",
    footerNote: "அதிகாரப்பூர்வ ரேஸர்பே செக்அவுட் · 256-பிட் வங்கி பாதுகாப்பு",
    celebratingBadge: "🙏 மனமார்ந்த நன்றி · வங்கி சரிபார்க்கப்பட்டது",
    celebratingTitle: "வணக்கம் & மனமார்ந்த நன்றி,",
    celebratingDesc: "டீம் RESCUEN சார்பாக எங்களது நெஞ்சார்ந்த நன்றிகள்!",
    receiptHeading: "உங்கள் பங்களிப்பு பெறப்பட்டது ✅",
    receiptParagraph: "டீம் RESCUEN-க்கு ஆதரவளித்தமைக்கு நன்றி.",
    receiptEmailedNotice: "ரசீது அனுப்பப்பட்ட மின்னஞ்சல்:",
    printBtn: "அதிகாரப்பூர்வ ஆவணத்தை அச்சிடுக",
    anotherBtn: "மீண்டும் பங்களிக்கவும்",
    emailNote: "மின்னஞ்சல் இன்பாக்ஸில் இல்லை எனில் ஸ்பேம் அல்லது அப்டேட்ஸ் பிரிவைச் சரிபார்க்கவும்.",
  },
  te: {
    heroBadge: "100% పౌర రక్షణ ఉద్యమం",
    heroTitle: "ప్రతి విరాళం,",
    heroHighlight: "ఒక ప్రాణాన్ని కాపాడుతుంది",
    heroDesc: "టీమ్ RESCUEN ఈ ప్రాణరక్షణ ప్లాట్‌ఫారమ్‌ను దేశ పౌరులందరికీ 100% ఉచితంగా అందిస్తోంది.",
    pillar1Val: "₹1 – ₹1లక్ష",
    pillar1Label: "మీ ఇష్టం",
    pillar2Val: "100%",
    pillar2Label: "నేరుగా మిషన్",
    pillar3Val: "ఐచ్ఛికం",
    pillar3Label: "ఈమెయిల్ రసీదు",
    trustBadge: "అధికారిక రేజర్‌పే బ్యాంక్ గేట్‌వే రక్షణ.",
    portalTag: "టీమ్ RESCUEN · అధికారిక విరాళ పోర్టల్",
    securityHeader: "256-బిట్ SSL రక్షణ",
    formTitle: "టీమ్ RESCUEN కు మద్దతు ఇవ్వండి",
    formSubtitle: "₹1 నుండి ₹1,00,000 వరకు మీ ఇష్టానుసారంగా ఎంచుకోండి.",
    step1: "1. విరాళం మొత్తాన్ని ఎంచుకోండి (₹1 – ₹1,00,000)",
    customPlaceholder: "మొత్తాన్ని నమోదు చేయండి (1 to 100000)",
    step2: "2. చెల్లింపు విధానాన్ని ఎంచుకోండి",
    methodUpiTitle: "యూపీఐ & అధికారిక క్యూఆర్",
    methodUpiSubtitle: "GPay, PhonePe, Paytm, BHIM & QR",
    methodUpiBadge: "తక్షణ చెల్లింపు",
    methodCardTitle: "డెబిట్ / క్రెడిట్ కార్డు",
    methodCardSubtitle: "RuPay, Visa, Mastercard",
    methodCardBadge: "SSL రక్షణ",
    methodNbTitle: "నెట్ బ్యాంకింగ్",
    methodNbSubtitle: "అన్ని భారతీయ బ్యాంకులు",
    methodNbBadge: "నేరుగా బ్యాంక్",
    methodWalletTitle: "మొబైల్ వాలెట్లు",
    methodWalletSubtitle: "Amazon Pay, Mobikwik",
    methodWalletBadge: "వన్-ట్యాప్",
    step3: "3. ఈమెయిల్ లో అధికారిక రసీదు (ఐచ్ఛికం)",
    step3Desc: "రసీదు కావాలంటే పేరు మరియు ఈమెయిల్ నమోదు చేయండి, లేదా ఖాళీగా వదిలేయండి:",
    namePlaceholder: "పూర్తి పేరు (ఐచ్ఛికం)",
    emailPlaceholder: "ఈమెయిల్ చిరునామా (ఐచ్ఛికం)",
    messagePlaceholder: "టీమ్ RESCUEN కోసం సందేశం (ఐచ్ఛికం) 🙏",
    ctaText: "రేజర్‌పే ద్వారా చెల్లించండి",
    creatingOrder: "ఆర్డర్ తయారవుతోంది...",
    openingGateway: "గేట్‌వే తెరుచుకుంటోంది...",
    verifying: "ధృవీకరించబడుతోంది...",
    footerNote: "అధికారిక రేజర్‌పే చెక్‌అవుట్ · 256-బిట్ బ్యాంక్ ఎన్‌క్రిప్షన్",
    celebratingBadge: "🙏 హృదయపూర్వక ధన్యవాదాలు · ధృవీకరించబడింది",
    celebratingTitle: "నమస్కారం & ధన్యవాదాలు,",
    celebratingDesc: "టీమ్ RESCUEN తరపున మీకు హృదయపూర్వక కృతజ్ఞతలు!",
    receiptHeading: "మీ విరాళం అందింది ✅",
    receiptParagraph: "టీమ్ RESCUEN కు మద్దతు ఇచ్చినందుకు ధన్యవాదాలు.",
    receiptEmailedNotice: "రసీదు పంపబడిన ఈమెయిల్:",
    printBtn: "అధికారిక పత్రాన్ని ప్రింట్ చేయండి",
    anotherBtn: "మరొక విరాళం ఇవ్వండి",
    emailNote: "ఈమెయిల్ ఇన్‌బాక్స్‌లో లేకపోతే దయచేసి స్పామ్ లేదా అప్‌డేట్స్ ఫోల్డర్‌ను తనిఖీ చేయండి.",
  },
};

const PUBLIC_RAZORPAY_KEY_ID =
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TwHgq9sFTpjuIL";

function loadRazorpaySdk(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.getElementById("razorpay-checkout-sdk") as HTMLScriptElement | null;
    if (existing) {
      if (window.Razorpay) return resolve(true);
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function DonationPortal({ compact = false }: { compact?: boolean }) {
  const [lang, setLang] = useState<Language>("en");
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);

  const [amount, setAmount] = useState<number>(101);
  const [customAmountStr, setCustomAmountStr] = useState<string>("101");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [company, setCompany] = useState<string>(""); // Honeypot
  const [method, setMethod] = useState<PaymentMethod>("upi");

  const [loading, setLoading] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // STRICT RULE: Receipt state is ONLY set when Razorpay server-to-server signature is verified!
  const [receipt, setReceipt] = useState<VerifiedReceipt | null>(null);

  const t = I18N[lang] || I18N.en;

  const handlePresetClick = (val: number) => {
    setAmount(val);
    setCustomAmountStr(String(val));
    setError(null);
  };

  const handleCustomAmountChange = (raw: string) => {
    const cleaned = raw.replace(/[^0-9]/g, "");
    setCustomAmountStr(cleaned);
    if (!cleaned) {
      setAmount(0);
      return;
    }
    const num = Math.min(100000, Math.max(0, parseInt(cleaned, 10)));
    setAmount(num);
    if (parseInt(cleaned, 10) > 100000) {
      setCustomAmountStr("100000");
    }
    setError(null);
  };

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

  async function initiateRazorpayPayment(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatusText("");

    if (!amount || amount < 1 || amount > 100000) {
      setError(
        lang === "hi"
          ? "योगदान राशि ₹1 से ₹1,00,000 के बीच होनी चाहिए।"
          : "Contribution amount must be between ₹1 and ₹1,00,000."
      );
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(
        lang === "hi"
          ? "कृपया सही ईमेल पता दर्ज करें (या रसीद न चाहिए तो इसे खाली छोड़ दें)।"
          : "Please enter a valid email address, or leave it blank to donate anonymously."
      );
      return;
    }

    setLoading(true);
    setStatusText(t.creatingOrder);

    try {
      const res = await fetch("/api/donate/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          amount,
          method,
          message: message.trim() || undefined,
          company,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok || !data.order_id) {
        setError(data.error || "Unable to initiate payment order. Please try again.");
        setLoading(false);
        setStatusText("");
        return;
      }

      setStatusText(t.openingGateway);
      const sdkReady = await loadRazorpaySdk();
      if (!sdkReady || !window.Razorpay) {
        setError("Razorpay SDK could not be loaded. Please check your internet connection.");
        setLoading(false);
        setStatusText("");
        return;
      }

      const rzpKey = PUBLIC_RAZORPAY_KEY_ID || data.keyId;

      const rzpOptions: Record<string, unknown> = {
        key: rzpKey,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Team RESCUEN",
        description: `Surakshit Bharat Mission Contribution (${formattedAmount})`,
        image: "/rescuen-logo.png",
        order_id: data.order_id,
        prefill: {
          name: name.trim() || "Well-Wisher",
          email: email.trim() || "supporter@rescuen.app",
        },
        config: {
          display: {
            blocks: {
              preferred: {
                name: "Recommended Payment Instrument",
                instruments: [{ method }],
              },
            },
            sequence: ["block.preferred", "upi", "card", "netbanking", "wallet"],
            preferences: { show_default_blocks: true },
          },
        },
        theme: {
          color: "#004aad",
          backdrop_color: "rgba(10, 37, 64, 0.82)",
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setStatusText(t.verifying);
          await verifyPaymentOnServer({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderToken: data.orderToken,
          });
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setStatusText("");
            setError(
              lang === "hi"
                ? "भुगतान रद्द कर दिया गया। आपके खाते से कोई राशि नहीं काटी गई है।"
                : "Payment window was dismissed. No amount was debited."
            );
          },
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on("payment.failed", (failRes: unknown) => {
        setLoading(false);
        setStatusText("");
        const desc =
          typeof failRes === "object" &&
          failRes !== null &&
          "error" in failRes &&
          typeof (failRes as { error?: { description?: string } }).error?.description === "string"
            ? (failRes as { error: { description: string } }).error.description
            : "Payment was declined by bank. No amount was debited.";
        setError(desc);
      });

      rzp.open();
      setLoading(false);
      setStatusText("");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
      setStatusText("");
    }
  }

  async function verifyPaymentOnServer(payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderToken: string;
  }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: payload.razorpay_order_id,
          razorpay_payment_id: payload.razorpay_payment_id,
          razorpay_signature: payload.razorpay_signature,
          orderToken: payload.orderToken,
          paymentMethod: method.toUpperCase(),
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          amount,
          message: message.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok || !data.verified) {
        setError(data.error || "Payment verification failed with bank.");
        setLoading(false);
        setStatusText("");
        return;
      }

      setReceipt(data.receipt);
      setLoading(false);
      setStatusText("");
    } catch {
      setError("Verification network request failed. Please check your internet connection.");
      setLoading(false);
      setStatusText("");
    }
  }

  function handlePrintReceipt() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  return (
    <div className="relative">
      {/* Decorative Luxury Background Glows (Hidden in print) */}
      <div className="no-print pointer-events-none absolute -top-16 -left-16 -z-10 h-72 w-72 rounded-full bg-brand-200/35 blur-2xl" />
      <div className="no-print pointer-events-none absolute top-1/3 -right-16 -z-10 h-80 w-80 rounded-full bg-gold-200/30 blur-2xl" />
      <div className="no-print pointer-events-none absolute -bottom-10 left-1/3 -z-10 h-64 w-64 rounded-full bg-safe-200/25 blur-2xl" />

      {/* ───────── LANGUAGE TRANSLATION SWITCHER (TOP-RIGHT CORNER) ───────── */}
      <div className="no-print mb-4 flex items-center justify-end">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLangMenu(!showLangMenu)}
            aria-label="Select Language"
            className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white/90 px-3.5 py-2 text-xs font-bold text-ink shadow-soft backdrop-blur-md transition-all hover:border-brand hover:text-brand"
          >
            <Globe className="h-4 w-4 text-brand" />
            <span>
              {LANGUAGES.find((l) => l.id === lang)?.flag}{" "}
              {LANGUAGES.find((l) => l.id === lang)?.label}
            </span>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>

          <AnimatePresence>
            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift"
              >
                <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-ink-faint">
                  Select Language
                </div>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      setLang(l.id);
                      setShowLangMenu(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all ${
                      lang === l.id
                        ? "bg-brand text-white font-bold"
                        : "text-ink hover:bg-paper"
                    }`}
                  >
                    <span>
                      {l.flag} {l.label}
                    </span>
                    {lang === l.id && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className={`grid items-start gap-10 lg:grid-cols-12 ${compact ? "" : "pt-2"}`}>
        {/* ───────── LEFT COLUMN: NAMASTE ILLUSTRATION & TRUST (Hidden in print) ───────── */}
        <div className="no-print lg:col-span-5 flex flex-col items-center lg:sticky lg:top-28">
          <div className="w-full rounded-[2rem] border border-white/80 bg-gradient-to-b from-white/95 via-brand-50/50 to-gold-100/35 p-6 sm:p-8 shadow-lift backdrop-blur-2xl ring-1 ring-brand-900/5">
            <NamasteIllustration celebrating={!!receipt} amount={amount} />

            <div className="mt-5 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand">
                <Sparkles className="h-3.5 w-3.5 text-gold-500" />
                {t.heroBadge}
              </span>
              <h3 className="h-display mt-3 text-2xl sm:text-3xl text-ink">
                {t.heroTitle} <span className="text-gradient-brand">{t.heroHighlight}</span>
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{t.heroDesc}</p>
            </div>

            {/* Impact Pillars */}
            <div className="mt-6 grid grid-cols-3 gap-2.5 text-center">
              <div className="rounded-2xl border border-white/90 bg-white/80 p-3 shadow-soft backdrop-blur-md">
                <div className="font-display text-lg font-extrabold text-brand">{t.pillar1Val}</div>
                <div className="text-[11px] font-semibold text-ink-faint">{t.pillar1Label}</div>
              </div>
              <div className="rounded-2xl border border-white/90 bg-white/80 p-3 shadow-soft backdrop-blur-md">
                <div className="font-display text-lg font-extrabold text-safe-600">{t.pillar2Val}</div>
                <div className="text-[11px] font-semibold text-ink-faint">{t.pillar2Label}</div>
              </div>
              <div className="rounded-2xl border border-white/90 bg-white/80 p-3 shadow-soft backdrop-blur-md">
                <div className="font-display text-lg font-extrabold text-gold-600">{t.pillar3Val}</div>
                <div className="text-[11px] font-semibold text-ink-faint">{t.pillar3Label}</div>
              </div>
            </div>

            {/* Security Guarantee Badge */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/70 px-4 py-3 text-xs text-ink-soft">
              <ShieldCheck className="h-5 w-5 shrink-0 text-brand" />
              <span>{t.trustBadge}</span>
            </div>
          </div>
        </div>

        {/* ───────── RIGHT COLUMN: MAIN INTERFACE / COMPLETED RECEIPT ───────── */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {/* STATE 1: COMPLETED BANK-VERIFIED OFFICIAL DOCUMENT (Contains Cartoon & Receipt, 1-Page Print) */}
            {receipt ? (
              <motion.div
                key="receipt-view"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden rounded-[2.2rem] border border-gold-300/70 bg-white p-4 sm:p-7 shadow-lift ring-1 ring-gold-400/20"
              >
                {/* ══════════════════════════════════════════════════════════════
                    PRINT-OPTIMIZED OFFICIAL DOCUMENT (Contains Cartoon, Greeting, and Full Receipt)
                    ══════════════════════════════════════════════════════════════ */}
                <div
                  id="printable-receipt-card"
                  className="overflow-hidden rounded-3xl border border-slate-300 bg-white text-ink shadow-lg"
                >
                  {/* Official Certificate Brand Header */}
                  <div className="print-header flex items-center justify-between bg-[#004aad] px-6 py-4 text-white">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-white p-1.5 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/rescuen-logo.png" alt="RESCUEN" className="h-7 w-7 object-contain" />
                      </span>
                      <div>
                        <span className="font-serif text-xl font-bold tracking-wider text-white">
                          RESCUEN
                        </span>
                        <div className="text-[10px] font-semibold tracking-wider text-blue-100 uppercase">
                          The Ultimate Safety · Surakshit Bharat Mission
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white border border-white/25">
                        Official Contribution Certificate
                      </span>
                      <div className="text-[10px] text-blue-100 mt-0.5 font-mono">
                        100% Citizen-Powered Safety
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* ── CARTOON ILLUSTRATION & DESCRIPTION INTEGRATED IN THE OFFICIAL DOCUMENT ── */}
                    <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-slate-200 pb-5">
                      <div className="w-40 shrink-0">
                        <NamasteIllustration celebrating={true} amount={receipt.amount} />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-0.5 text-[11px] font-extrabold text-gold-700">
                          {t.celebratingBadge}
                        </span>
                        <h3 className="h-display mt-2 text-2xl font-black text-ink">
                          {t.celebratingTitle} <span className="text-brand">{receipt.name}!</span>
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                          <b>Team RESCUEN</b> ki taraf se dil se koti-koti pranaam! Har ek daan, kisi ki jaan bachata hai. Your voluntary support directly powers our 24×7 emergency SOS infrastructure, 1&nbsp;KM Rescue Radar, and nationwide women safety shield.
                        </p>
                      </div>
                    </div>

                    {/* Official Receipt Data Table */}
                    <div className="my-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-xs sm:text-sm">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand font-mono">
                          OFFICIAL CONTRIBUTION RECEIPT DETAILS
                        </span>
                        <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                          ✓ Verified by Bank Gateway
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-slate-800">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Receipt ID:</span>
                          <span className="font-mono font-bold text-slate-900">{receipt.receiptId}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Supporter Name:</span>
                          <span className="font-bold text-slate-900">{receipt.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Amount Contributed:</span>
                          <span className="font-extrabold text-brand text-base">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                              maximumFractionDigits: 0,
                            }).format(receipt.amount)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Payment Gateway:</span>
                          <span className="font-semibold text-slate-900">
                            Razorpay Official ({receipt.paymentMethod})
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Razorpay Payment ID:</span>
                          <span className="font-mono font-semibold text-slate-900">
                            {receipt.transactionId}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Date &amp; Time:</span>
                          <span className="text-slate-700">{receipt.timestamp}</span>
                        </div>
                      </div>

                      {receipt.message && (
                        <div className="mt-3 border-t border-slate-200 pt-2.5 italic text-xs text-slate-600">
                          “{receipt.message}”
                        </div>
                      )}
                    </div>

                    {/* Official Document Footer Notice */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
                      <div className="text-slate-500 text-[10.5px] leading-relaxed max-w-sm">
                        Digitally authenticated under Surakshit Bharat Mission. Powered by official Razorpay bank gateway. This voluntary daan directly powers 24×7 emergency safety infrastructure across India.
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-slate-900 text-xs">Team RESCUEN</div>
                        <div className="text-[10px] text-slate-500">Official Computer-Generated Receipt</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#082347] px-6 py-2.5 text-center text-[10.5px] text-slate-300">
                    RESCUEN — Women’s safety, reimagined. · Official Citizen Support Document
                  </div>
                </div>

                {/* Email Delivery Note for Donor */}
                {receipt.email && (
                  <p className="no-print mt-3 text-center text-xs text-ink-faint">{t.emailNote}</p>
                )}

                {/* Post-Receipt Action Buttons (Hidden when printing) */}
                <div className="no-print mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button onClick={handlePrintReceipt} type="button" className="btn-primary">
                    <Printer className="h-4 w-4" />
                    {t.printBtn}
                  </button>
                  <button
                    onClick={() => {
                      setReceipt(null);
                    }}
                    type="button"
                    className="btn-ghost"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t.anotherBtn}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* STATE 2: CLEAN OFFICIAL RAZORPAY DONATION FORM (DEFAULT IN ENGLISH) */
              <motion.form
                key="donate-form-view"
                onSubmit={initiateRazorpayPayment}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/95 p-6 sm:p-9 shadow-lift backdrop-blur-2xl ring-1 ring-brand-900/5"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="chip border-gold-300/60 bg-gold-100/70 text-gold-600">
                    <HeartHandshake className="h-4 w-4 text-gold-600" />
                    {t.portalTag}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-safe-600">
                    <Lock className="h-3.5 w-3.5" /> {t.securityHeader}
                  </span>
                </div>

                <h2 className="h-display mt-4 text-2xl sm:text-3xl text-ink">
                  {t.formTitle} <span className="text-gradient-brand">via Razorpay</span>
                </h2>
                <p className="mt-1.5 text-sm text-ink-soft">{t.formSubtitle}</p>

                {/* 1. Preset Amount Chips */}
                <div className="mt-6">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft">
                    {t.step1}
                  </label>
                  <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                    {PRESET_AMOUNTS.map((item) => {
                      const active = amount === item.value;
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => handlePresetClick(item.value)}
                          className={`relative flex flex-col items-center justify-center rounded-2xl border px-2 py-3 text-center transition-all ${
                            active
                              ? "border-brand bg-brand-gradient text-white shadow-glow"
                              : "border-line bg-paper/90 text-ink hover:border-brand/40 hover:bg-white"
                          }`}
                        >
                          <span className="font-display text-base font-extrabold">
                            ₹{item.value.toLocaleString("en-IN")}
                          </span>
                          <span
                            className={`mt-0.5 text-[10px] font-semibold ${
                              active ? "text-brand-100" : "text-ink-faint"
                            }`}
                          >
                            {item.tag}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Rupee Input */}
                  <div className="relative mt-3.5">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 font-display text-xl font-extrabold text-brand">
                      ₹
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={customAmountStr}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      placeholder={t.customPlaceholder}
                      aria-label="Custom contribution amount in INR"
                      className="w-full rounded-2xl border border-line bg-paper pl-10 pr-28 py-3.5 font-display text-lg font-extrabold text-ink transition-all focus:border-brand focus:bg-white"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-bold text-ink-faint">
                      INR · Max ₹1L
                    </span>
                  </div>
                </div>

                {/* 2. Payment Method Preference */}
                <div className="mt-6">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-ink-soft">
                    {t.step2}
                  </label>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {[
                      {
                        id: "upi" as PaymentMethod,
                        title: t.methodUpiTitle,
                        subtitle: t.methodUpiSubtitle,
                        badge: t.methodUpiBadge,
                        icon: QrCode,
                      },
                      {
                        id: "card" as PaymentMethod,
                        title: t.methodCardTitle,
                        subtitle: t.methodCardSubtitle,
                        badge: t.methodCardBadge,
                        icon: CreditCard,
                      },
                      {
                        id: "netbanking" as PaymentMethod,
                        title: t.methodNbTitle,
                        subtitle: t.methodNbSubtitle,
                        badge: t.methodNbBadge,
                        icon: Building2,
                      },
                      {
                        id: "wallet" as PaymentMethod,
                        title: t.methodWalletTitle,
                        subtitle: t.methodWalletSubtitle,
                        badge: t.methodWalletBadge,
                        icon: Wallet,
                      },
                    ].map((pm) => {
                      const Icon = pm.icon;
                      const selected = method === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setMethod(pm.id)}
                          className={`flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
                            selected
                              ? "border-brand bg-brand-50/80 shadow-soft ring-1 ring-brand"
                              : "border-line bg-paper/70 hover:border-brand/30 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`grid h-10 w-10 place-items-center rounded-xl ${
                                selected
                                  ? "bg-brand text-white"
                                  : "bg-white text-ink-soft border border-line"
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </span>
                            <div>
                              <div className="text-sm font-bold text-ink">{pm.title}</div>
                              <div className="text-[11px] text-ink-faint">{pm.subtitle}</div>
                            </div>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                              selected
                                ? "bg-brand text-white"
                                : "bg-white text-ink-faint border border-line"
                            }`}
                          >
                            {pm.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. OPTIONAL Donor Name & Email */}
                <div className="mt-6 rounded-3xl border border-line bg-paper/70 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-ink">
                      {t.step3}
                    </span>
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-bold text-brand">
                      Optional
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-faint">{t.step3Desc}</p>

                  <div className="mt-3 grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <input
                        id="donor-name"
                        type="text"
                        maxLength={80}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.namePlaceholder}
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-faint focus:border-brand"
                      />
                    </div>
                    <div>
                      <input
                        id="donor-email"
                        type="email"
                        maxLength={120}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.emailPlaceholder}
                        className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-ink-faint focus:border-brand"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <input
                      id="donor-message"
                      type="text"
                      maxLength={250}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.messagePlaceholder}
                      className="w-full rounded-2xl border border-line bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brand"
                    />
                  </div>
                </div>

                {/* Hidden Honeypot against Bots */}
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                {/* Status / Loading Notification */}
                {statusText && (
                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-xs font-semibold text-brand">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                    <span>{statusText}</span>
                  </div>
                )}

                {/* Error Alert */}
                {error && (
                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-sos-200 bg-sos-50 px-4 py-3 text-xs font-semibold text-sos-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Primary Submit CTA — Launches Official Razorpay Modal */}
                <button
                  type="submit"
                  disabled={loading || !amount || amount < 1}
                  className="btn-primary mt-6 w-full py-4 text-base font-extrabold shadow-glow disabled:opacity-50"
                >
                  {loading ? (
                    t.openingGateway
                  ) : (
                    <>
                      <HeartHandshake className="h-5 w-5" />
                      {t.ctaText} ({formattedAmount})
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-ink-soft">
                  <ShieldCheck className="h-4 w-4 text-brand" />
                  <span>{t.footerNote}</span>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
