export type GuideSection = { h: string; p?: string; list?: string[]; ordered?: boolean };
export type Guide = {
  slug: string;
  title: string;
  /** Title for search results, under 60 characters. */
  seo: string;
  summary: string;
  /** What the Ask buttons on this guide ask. */
  ask: string;
  minutes: number;
  updated: string;
  intro: string;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "what-to-do-if-someone-is-following-you",
    title: "What to do if someone is following you",
    seo: "Someone following you? What to do, step by step",
    summary: "Calm, practical steps for the first minutes, and what to do afterwards.",
    ask: "What if someone is following me?",
    minutes: 4,
    updated: "2026-11-23",
    intro:
      "If you think someone is following you, trust that feeling and act early. You do not need proof to ask for help. These steps are for the first few minutes, when a clear head matters most.",
    sections: [
      {
        h: "First, check without stopping",
        p: "Cross the road or make two turns that nobody would make by chance. If the same person is still behind you, treat it as real.",
      },
      {
        h: "Go towards people, not home",
        p: "Leading someone to your door tells them where you live. Choose a place where others will notice.",
        list: [
          "An open shop, petrol pump, hospital, hotel lobby or police booth",
          "A family, a group of women, or a uniformed guard",
          "A lit main road rather than a shortcut",
        ],
      },
      {
        h: "Make yourself heard",
        list: [
          "Call 112 and say where you are, out loud",
          "Call someone you trust and describe the person or vehicle clearly",
          "If they come closer, shout. “Fire!” often brings people faster than “Help!”",
        ],
      },
      {
        h: "Use your phone well",
        p: "Keep it in your hand with the screen ready. In the RESCUEN app, hold SOS for two seconds, or press the volume key three times even from the lock screen. Use Fake Call if you need a reason to change direction.",
      },
      {
        h: "Afterwards",
        ordered: true,
        list: [
          "Write down the time, place, clothes, height, vehicle and number plate while it is fresh",
          "Tell two people you trust",
          "File a complaint. Any police station can record a Zero FIR, wherever it happened",
          "Change your timings and routes for a while, and travel with someone",
        ],
      },
    ],
    faq: [
      { q: "Should I confront the person?", a: "No. Put distance and people between you, and let the police deal with them." },
      { q: "What if I am wrong?", a: "Then nothing is lost. Asking for help early is always the better mistake." },
      { q: "Is stalking a crime in India?", a: "Yes. Repeatedly following or contacting a woman against her wishes is a criminal offence. You can report it at any police station." },
    ],
  },
  {
    slug: "cab-safety-checklist",
    title: "Cab and auto safety checklist",
    seo: "Cab & auto safety checklist for women in India",
    summary: "What to check before you sit, during the ride, and if something feels wrong.",
    ask: "How do I stay safe in a cab?",
    minutes: 3,
    updated: "2026-11-23",
    intro:
      "Most rides are uneventful. A thirty-second routine keeps them that way, and means you already know what to do if one is not.",
    sections: [
      {
        h: "Before you sit",
        list: [
          "Match the number plate, car model and driver’s photo with your app",
          "Ask the driver who they are here for, instead of saying your name first",
          "Check that the child lock is off and the windows open",
          "Share the live trip with one person who will notice if you are late",
        ],
      },
      {
        h: "During the ride",
        list: [
          "Sit in the back, diagonally across from the driver",
          "Follow the route on your own map",
          "Start Follow-Me in RESCUEN. If you stop unexpectedly it checks on you",
          "Keep your bag strap free of your body so you can leave quickly",
        ],
      },
      {
        h: "If something feels wrong",
        ordered: true,
        list: [
          "Say clearly: “Please stop here”, at a busy and lit place",
          "Call 112 and read out the number plate so the driver hears it",
          "Trigger SOS early. You do not have to be certain",
          "Use the emergency button inside your cab app too",
        ],
      },
      {
        h: "After an unsafe ride",
        p: "Save the trip details and screenshots, report the driver in the app, and file a police complaint if you were threatened, touched or held against your will.",
      },
    ],
    faq: [
      { q: "The driver says the online trip must be cancelled. What should I do?", a: "Decline and leave. An offline trip has no tracking, no record and no support." },
      { q: "Is it safer to sit in front?", a: "Usually not. The back seat, diagonally across from the driver, gives you more space and a clearer exit." },
    ],
  },
  {
    slug: "night-shift-commute-safety",
    title: "Night shift and late commute safety",
    seo: "Night shift safety for women: a practical guide",
    summary: "A simple routine for nurses, BPO staff, students and anyone who travels late.",
    ask: "Tips for walking at night",
    minutes: 4,
    updated: "2026-11-23",
    intro:
      "Late travel becomes safer when it is predictable to the people you trust and unpredictable to everyone else.",
    sections: [
      {
        h: "Set it up once",
        list: [
          "Share your roster with two people and agree when they should call",
          "Ask your employer, in writing, about verified transport for late shifts",
          "Save the transport desk, building security and 112 as favourites",
          "Agree a code word that means “call me now and come”",
        ],
      },
      {
        h: "Before you log off",
        list: [
          "Charge your phone above 40 percent",
          "Check the vehicle number and driver before you leave the building",
          "Message someone when you step out",
        ],
      },
      {
        h: "On the way",
        list: [
          "Wait inside, not on the road",
          "Start Follow-Me as soon as the vehicle moves",
          "Ask not to be the only passenger on the first pickup or last drop",
          "Keep one ear free and avoid long phone scrolling",
        ],
      },
      {
        h: "The last hundred metres",
        p: "Most people relax near home. Keep your keys in hand, look around before you stop, and if someone is waiting, walk past and call for help.",
      },
    ],
    faq: [
      { q: "Must my employer provide transport at night?", a: "Rules differ by state and industry, and many require safe transport and consent for women on night shifts. Ask HR for the policy in writing." },
      { q: "What should I do if the office cab is late?", a: "Stay inside the building, tell the transport desk and one person at home, and do not wait alone on the road." },
    ],
  },
  {
    slug: "solo-travel-safety-india",
    title: "Solo travel safety in India",
    seo: "Solo travel safety in India for women: checklist",
    summary: "Plan, arrive, stay and move around with fewer surprises.",
    ask: "How do I travel alone safely?",
    minutes: 5,
    updated: "2026-11-23",
    intro: "Solo travel is freedom with a little preparation. These habits cost minutes and prevent most problems.",
    sections: [
      {
        h: "Plan",
        list: [
          "Give your route, tickets and stay address to two people",
          "Book the first night in advance and arrive in daylight",
          "Read recent reviews written by women travelling alone",
          "Keep ID copies, a spare card and cash in a second place",
        ],
      },
      {
        h: "Stay",
        list: [
          "Ask for a room that is not on the ground floor and is near the lift",
          "Check locks, windows and the peephole first. Ask to change the room if needed",
          "Don’t say your room number aloud or tell strangers you are alone",
          "Use a door wedge or the chain at night",
        ],
      },
      {
        h: "Move around",
        list: [
          "Prefer official taxis, prepaid counters and app cabs",
          "On trains, 139 is the railway helpline, including for security",
          "Start Follow-Me on unfamiliar routes",
          "Check in at fixed times. A missed check-in should trigger a call",
        ],
      },
      {
        h: "If you need help",
        p: "Walk to reception, a family, or any staffed counter. Call 112. At tourist places ask for the tourist police. Use SOS so your live location reaches your contacts.",
      },
    ],
    faq: [
      { q: "Should I post photos while travelling?", a: "Enjoy it, and post after you have left the place. Live locations tell strangers where you are and that you are alone." },
      { q: "What is the railway helpline number?", a: "139. You can call it for security, medical and other help on trains." },
    ],
  },
  {
    slug: "online-harassment-what-to-do",
    title: "Online harassment and blackmail: what to do",
    seo: "Online harassment or blackmail in India: what to do",
    summary: "Keep evidence, stop the contact, and report it the right way.",
    ask: "I am being harassed online",
    minutes: 4,
    updated: "2026-11-23",
    intro:
      "If someone is threatening, blackmailing or humiliating you online, you have done nothing wrong. Most of these threats lose their power once you keep evidence and tell someone.",
    sections: [
      {
        h: "Do these first",
        ordered: true,
        list: [
          "Don’t pay. Payment usually leads to more demands",
          "Don’t delete anything yet",
          "Take screenshots that show the username, link, date and message",
          "Tell one person you trust today",
        ],
      },
      {
        h: "Stop the contact",
        list: [
          "Report the account on the platform, then block it",
          "Make your profile, friends list and old posts private",
          "Change passwords and turn on two-step verification",
          "Sign out of all other devices",
        ],
      },
      {
        h: "Report it",
        list: [
          "cybercrime.gov.in accepts complaints online, including anonymous ones for crimes against women and children",
          "1930 is the cyber fraud helpline. Call quickly if money was taken",
          "Any police station can take your complaint",
          "For photos shared without consent, StopNCII.org can help platforms block them",
        ],
      },
      {
        h: "Look after yourself",
        p: "This is frightening and exhausting. If you feel hopeless, call Tele-MANAS on 14416 at any hour. It is free and confidential.",
      },
    ],
    faq: [
      { q: "They have my private photos. What now?", a: "Don’t pay and don’t panic. Save evidence, report on cybercrime.gov.in, and use StopNCII.org to help prevent sharing." },
      { q: "Can I report without giving my name?", a: "The national portal allows anonymous reports for certain crimes against women and children." },
    ],
  },
  {
    slug: "how-to-set-up-your-trusted-circle",
    title: "How to set up your trusted circle",
    seo: "How to choose emergency contacts & set up SOS",
    summary: "Choose the right people, brief them well, and practise once.",
    ask: "How do I add trusted contacts?",
    minutes: 3,
    updated: "2026-11-23",
    intro: "An alert is only as good as the person who receives it. Ten minutes of setup makes a real difference.",
    sections: [
      {
        h: "Choose well",
        list: [
          "Someone who answers calls at night",
          "Someone who lives or works close to you",
          "Someone calm who will act and not panic",
          "Mix family with a friend, neighbour or colleague",
        ],
      },
      {
        h: "Brief them",
        p: "Tell them what an SOS message looks like and agree the plan.",
        ordered: true,
        list: [
          "Call you once",
          "If there is no answer, call 112 and give your live location",
          "Call the next person in the circle",
          "Go to you only if it is safe, and not alone",
        ],
      },
      {
        h: "Add them in RESCUEN",
        p: "Open your profile and add up to five contacts. Check every digit, because emergency numbers are change-locked for 60 days so nobody can quietly redirect your alerts.",
      },
      {
        h: "Practise once",
        p: "Do a calm trial together. Make sure the SMS arrives, the map link opens, and everyone knows how you will say that you are safe.",
      },
    ],
    faq: [
      { q: "How many contacts should I add?", a: "Three to five. Enough that someone always answers." },
      { q: "Why are the numbers locked for 60 days?", a: "So a person who takes or borrows your phone cannot quietly change who receives your alerts." },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);

export const HELPLINES: { num: string; name: string; use: string; group: "Emergency" | "Women & children" | "Support" }[] = [
  { num: "112", name: "All emergencies", use: "Police, fire and ambulance through one number", group: "Emergency" },
  { num: "100", name: "Police", use: "Crime or a threat to your safety", group: "Emergency" },
  { num: "101", name: "Fire", use: "Fire and rescue", group: "Emergency" },
  { num: "108", name: "Ambulance", use: "Medical emergencies in most states", group: "Emergency" },
  { num: "181", name: "Women helpline", use: "Support, shelter and referral, day and night", group: "Women & children" },
  { num: "1091", name: "Women in distress", use: "Police helpline for women", group: "Women & children" },
  { num: "1098", name: "Child helpline", use: "Any child in need of care or protection", group: "Women & children" },
  { num: "1930", name: "Cyber fraud", use: "Report online financial fraud quickly", group: "Support" },
  { num: "14416", name: "Tele-MANAS", use: "Free mental health support, day and night", group: "Support" },
  { num: "14567", name: "Elderline", use: "Help for senior citizens", group: "Support" },
  { num: "139", name: "Railway", use: "Security and help on trains", group: "Support" },
  { num: "1033", name: "Highway", use: "Help on national highways", group: "Support" },
  { num: "15100", name: "Legal aid", use: "Free legal help through NALSA", group: "Support" },
];
