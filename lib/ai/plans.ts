import type { Lang, PlanId, SafetyPlan } from "@/lib/ai/types";

// Reviewed plans. Shown instantly, and used whenever the AI cannot personalise.
export const PLANS: Record<PlanId, Record<Lang, SafetyPlan>> = {
  night: {
    en: {
      title: "Walking home at night",
      before: [
        "Pick a lit, busy route, even if it takes longer",
        "Charge your phone and carry a power bank",
        "Tell one person when you leave and when you should arrive",
      ],
      during: [
        "Start Follow-Me and keep one ear free",
        "Walk facing traffic, away from parked cars and dark corners",
        "Have your keys in hand before you reach the door",
      ],
      ifWrong: [
        "Change direction towards people, light or an open shop",
        "Call 112 and say where you are out loud",
        "Hold SOS for 2 seconds, or press the volume key three times",
      ],
    },
    hg: {
      title: "Raat ko paidal ghar jaana",
      before: [
        "Roshni aur bheed wala raasta chunein, chahe lamba ho",
        "Phone charge rakhein, power bank saath lein",
        "Kisi ek ko batayein kab nikle aur kab tak pahunchenge",
      ],
      during: [
        "Follow-Me chalu karein, ek kaan khula rakhein",
        "Traffic ki taraf muh karke chalein, khadi gaadiyon se door",
        "Darwaze se pehle hi chabi haath mein le lein",
      ],
      ifWrong: [
        "Log, roshni ya khuli dukaan ki taraf mudein",
        "112 par call karke zor se batayein aap kahan hain",
        "SOS 2 second dabayein, ya volume key teen baar",
      ],
    },
  },
  cab: {
    en: {
      title: "Cab or auto ride",
      before: [
        "Match the number plate, car and driver photo before sitting",
        "Share the live trip with one trusted person",
        "Check that the child lock is off and the windows work",
      ],
      during: [
        "Sit behind, diagonally across from the driver",
        "Follow the route on your own map and start Follow-Me",
        "Stay on a call, or use Fake Call to sound expected",
      ],
      ifWrong: [
        "Ask clearly to stop at a busy, lit place",
        "Call 112 and read out the number plate",
        "Fire SOS early. You do not need to be certain",
      ],
    },
    hg: {
      title: "Cab ya auto ka safar",
      before: [
        "Baithne se pehle number plate, gaadi aur driver ki photo milayein",
        "Kisi bharose wale ko live trip share karein",
        "Child lock band ho aur khidki chalti ho, yeh dekh lein",
      ],
      during: [
        "Peeche, driver ke tirchhe baithein",
        "Apne map par route dekhein aur Follow-Me chalu karein",
        "Call par rahein, ya Fake Call use karein",
      ],
      ifWrong: [
        "Saaf bolein ki bheed aur roshni wali jagah rokein",
        "112 par call karke number plate batayein",
        "SOS jaldi dabayein, pakka hone ka intezaar na karein",
      ],
    },
  },
  travel: {
    en: {
      title: "Travelling alone",
      before: [
        "Leave your itinerary and stay address with two people",
        "Save local police and your stay’s number offline",
        "Keep ID copies and some cash separate from your wallet",
      ],
      during: [
        "Arrive in daylight when you can",
        "Don’t share your room number or that you are alone",
        "Check in with someone at fixed times each day",
      ],
      ifWrong: [
        "Go to hotel reception, a family or any staffed counter",
        "Call 112, or 139 if you are on a train",
        "Fire SOS so your live location reaches your contacts",
      ],
    },
    hg: {
      title: "Akele safar karna",
      before: [
        "Apna plan aur rukne ka pata do logon ko dein",
        "Local police aur hotel ka number offline save karein",
        "ID ki copy aur thode paise alag rakhein",
      ],
      during: [
        "Ho sake toh din mein pahunchein",
        "Room number ya akele hone ki baat kisi ko na batayein",
        "Roz tay samay par kisi ko check-in karein",
      ],
      ifWrong: [
        "Hotel reception, kisi family ya staff counter par jayein",
        "112 par call karein, train mein ho toh 139",
        "SOS dabayein taaki live location contacts tak jaye",
      ],
    },
  },
  campus: {
    en: {
      title: "College or hostel",
      before: [
        "Save the warden, campus security and two friends",
        "Agree a code word that means “come and get me”",
        "Know the lit route between your classes and room",
      ],
      during: [
        "Walk in pairs after dark",
        "Don’t let strangers follow you through a locked gate",
        "Guard your drink and leave with who you came with",
      ],
      ifWrong: [
        "Go to the security post or a staffed building",
        "Tell a friend, then the warden or complaints committee",
        "If you feel at risk, call 112 and fire SOS",
      ],
    },
    hg: {
      title: "College ya hostel",
      before: [
        "Warden, campus security aur do doston ka number save karein",
        "Ek code word tay karein jiska matlab “aakar le jao”",
        "Class se room tak roshni wala raasta jaan lein",
      ],
      during: [
        "Andhere ke baad do log saath chalein",
        "Anjaan ko apne peeche gate se andar na aane dein",
        "Drink par nazar rakhein, jinke saath aaye unke saath jayein",
      ],
      ifWrong: [
        "Security post ya staff wali building mein jayein",
        "Dost ko, phir warden ya complaints committee ko batayein",
        "Khatra lage toh 112 par call karein aur SOS dabayein",
      ],
    },
  },
  work: {
    en: {
      title: "Late shift at work",
      before: [
        "Ask your employer about a verified drop facility",
        "Share your shift times with family",
        "Keep your phone above 40% before you log off",
      ],
      during: [
        "Leave with a colleague and wait inside, not on the road",
        "Start Follow-Me as the vehicle moves",
        "Ask not to be the first pickup or last drop alone",
      ],
      ifWrong: [
        "Call your transport desk and stay near the entrance",
        "Call 112 and give the vehicle number",
        "Fire SOS, then report it to your manager in writing",
      ],
    },
    hg: {
      title: "Late shift",
      before: [
        "Employer se verified drop ke baare mein poochein",
        "Family ko shift ka time batayein",
        "Nikalne se pehle phone 40% se upar rakhein",
      ],
      during: [
        "Colleague ke saath niklein, sadak par nahi andar intezaar karein",
        "Gaadi chalte hi Follow-Me chalu karein",
        "Akele pehla pickup ya aakhri drop na ho, yeh bolein",
      ],
      ifWrong: [
        "Transport desk ko call karein, entrance ke paas rahein",
        "112 par call karke gaadi ka number dein",
        "SOS dabayein, phir manager ko likhkar report karein",
      ],
    },
  },
  followed: {
    en: {
      title: "Someone keeps following me",
      before: [
        "Write down dates, places, vehicles and descriptions",
        "Tell two people and share your usual routes",
        "Vary your timings and turn off public location tags",
      ],
      during: [
        "Don’t go home. Head for people and light",
        "Call someone and describe the person out loud",
        "Don’t confront or bargain with them",
      ],
      ifWrong: [
        "Call 112 immediately",
        "Fire SOS and go inside any open shop",
        "File a complaint at any police station. A Zero FIR is allowed",
      ],
    },
    hg: {
      title: "Koi baar-baar peecha karta hai",
      before: [
        "Date, jagah, gaadi aur huliya likhte jayein",
        "Do logon ko batayein aur apna roz ka raasta share karein",
        "Samay badalte rahein, public location tag band karein",
      ],
      during: [
        "Seedha ghar na jayein, bheed aur roshni ki taraf jayein",
        "Kisi ko call karke huliya zor se batayein",
        "Usse na bhidein, na baat karein",
      ],
      ifWrong: [
        "Turant 112 par call karein",
        "SOS dabayein aur kisi khuli dukaan mein jayein",
        "Kisi bhi thane mein shikayat karein, Zero FIR ho sakti hai",
      ],
    },
  },
  online: {
    en: {
      title: "Online harassment",
      before: [
        "Turn on two-step verification everywhere",
        "Make old posts and friend lists private",
        "Never share OTPs or intimate photos under pressure",
      ],
      during: [
        "Don’t pay, argue or delete anything",
        "Save screenshots with usernames, links and dates",
        "Block and report the account on the platform",
      ],
      ifWrong: [
        "Report at cybercrime.gov.in, or call 1930 for money fraud",
        "Tell one person you trust today",
        "If someone threatens to harm you, call 112 or 181",
      ],
    },
    hg: {
      title: "Online pareshani",
      before: [
        "Har jagah two-step verification chalu karein",
        "Purani posts aur friend list private karein",
        "Dabaav mein OTP ya private photo kabhi na dein",
      ],
      during: [
        "Paise na dein, behas na karein, kuch delete na karein",
        "Username, link aur date ke saath screenshot rakhein",
        "Account ko block aur report karein",
      ],
      ifWrong: [
        "cybercrime.gov.in par report karein, paise ka fraud ho toh 1930",
        "Aaj hi kisi bharose wale ko batayein",
        "Maarne ki dhamki ho toh 112 ya 181",
      ],
    },
  },
  home: {
    en: {
      title: "Feeling unsafe at home",
      before: [
        "Keep documents, money and a charged phone within reach",
        "Agree a code word with someone who can call for you",
        "Know which door you would leave through",
      ],
      during: [
        "Move away from the kitchen and locked rooms",
        "Keep your phone on you. Lower the screen brightness",
        "Your safety comes before winning the argument",
      ],
      ifWrong: [
        "Call 112, or press the volume key three times for SOS",
        "Call 181 for shelter, legal and counselling help",
        "If your phone may be watched, use someone else’s",
      ],
    },
    hg: {
      title: "Ghar par asurakshit mehsoos hona",
      before: [
        "Documents, paise aur charged phone pahunch mein rakhein",
        "Ek code word tay karein, jispar koi aapke liye call kare",
        "Kis darwaze se niklenge, yeh soch lein",
      ],
      during: [
        "Rasoi aur band kamron se door hatein",
        "Phone apne paas rakhein, brightness kam karein",
        "Behas jeetne se zyada zaroori aapki safety hai",
      ],
      ifWrong: [
        "112 par call karein, ya SOS ke liye volume key teen baar",
        "Shelter, legal aur counselling ke liye 181",
        "Phone par nazar ho toh kisi aur ka phone use karein",
      ],
    },
  },
};
