import bn from "@/lib/i18n/bn.json";
import hi from "@/lib/i18n/hi.json";
import mr from "@/lib/i18n/mr.json";
import ta from "@/lib/i18n/ta.json";
import te from "@/lib/i18n/te.json";
import type { LangId } from "@/lib/i18n/languages";

// Translations for pages built in one language, such as /hi and /bn.

export type LocalLang = Exclude<LangId, "en">;

const DICTS: Record<LocalLang, Record<string, string>> = { hi, bn, mr, ta, te };

/** Translates a phrase, or a sentence written as parts, into one string. */
export function translator(lang: LocalLang) {
  const dict = DICTS[lang];
  return (text: string) => (dict[text.replace(/\s+/g, " ").trim()] ?? text).split("|").join(" ");
}

export const LOCAL_META: Record<LocalLang, { title: string; description: string; also: string }> = {
  hi: {
    title: "RESCUEN: महिला सुरक्षा और SOS ऐप (निःशुल्क)",
    description:
      "दो सेकंड दबाइए और RESCUEN 1 किमी के भीतर के लोगों, आपके परिवार और पुलिस को लाइव लोकेशन भेज देता है। भारत में बना निःशुल्क निजी सुरक्षा ऐप।",
    also: "यह पेज दूसरी भाषाओं में",
  },
  bn: {
    title: "RESCUEN: নারী নিরাপত্তা ও SOS অ্যাপ (বিনামূল্যে)",
    description:
      "দুই সেকেন্ড চেপে ধরলেই RESCUEN ১ কিমির মধ্যের মানুষ, আপনার পরিবার ও পুলিশকে লাইভ অবস্থান পাঠায়। ভারতে তৈরি বিনামূল্যের ব্যক্তিগত নিরাপত্তা অ্যাপ।",
    also: "অন্য ভাষায় এই পাতা",
  },
  mr: {
    title: "RESCUEN: महिला सुरक्षा आणि SOS ॲप (मोफत)",
    description:
      "दोन सेकंद दाबा आणि RESCUEN १ किमीच्या आतील लोकांना, कुटुंबाला आणि पोलिसांना लाइव्ह ठिकाण पाठवते. भारतात बनलेले मोफत वैयक्तिक सुरक्षा ॲप.",
    also: "हे पान इतर भाषांमध्ये",
  },
  ta: {
    title: "RESCUEN: பெண்கள் பாதுகாப்பு & SOS செயலி (இலவசம்)",
    description:
      "இரண்டு விநாடி அழுத்தினால் 1 கி.மீ.க்குள் உள்ளவர்கள், குடும்பம், காவல்துறைக்கு RESCUEN நேரலை இருப்பிடத்தை அனுப்பும். இந்தியாவில் உருவான இலவச பாதுகாப்புச் செயலி.",
    also: "பிற மொழிகளில் இந்தப் பக்கம்",
  },
  te: {
    title: "RESCUEN: మహిళా భద్రత & SOS యాప్ (ఉచితం)",
    description:
      "రెండు సెకన్లు నొక్కితే 1 కి.మీ. లోపు ఉన్నవారికి, కుటుంబానికి, పోలీసులకు RESCUEN లైవ్ లొకేషన్ పంపుతుంది. భారత్‌లో తయారైన ఉచిత భద్రతా యాప్.",
    also: "ఇతర భాషల్లో ఈ పేజీ",
  },
};

/** Tells search engines which page serves which language. */
export const HOME_LANGUAGES = {
  "x-default": "/",
  "en-IN": "/",
  "hi-IN": "/hi",
  "bn-IN": "/bn",
  "mr-IN": "/mr",
  "ta-IN": "/ta",
  "te-IN": "/te",
};
