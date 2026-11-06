// The site's content as it was before Sanity: used when Sanity is not connected,
// and loaded into Sanity once by `npm run cms:seed`. After that, edit content in the Studio.
//
// Images here point at the optimised files in media/ ({ local: "<name>" }).
// Text marks: *word* shows in italic/highlight, **words** in bold.

const img = (local, width, height, alt, kind = "gallery") => ({ local, kind, width, height, alt });

export const settings = {
  _id: "siteSettings",
  _type: "siteSettings",
  orgName: "Victoria's Wellness Initiative for Women and Girls",
  shortName: "Victoria's Wellness",
  subName: "Initiative for Women and Girls",
  alternateNames: ["Victoria's Wellness", "VWIG", "vwigcare"],
  slogan: "Healthier Women. Brighter Futures.",
  orgDescription:
    "A community-driven Nigerian non-profit advancing the health, dignity and wellbeing of women and girls through health education, menstrual health, preventive care, health screening outreaches and community support.",
  phone: "+234 705 242 9995",
  whatsapp: "2347052429995",
  email: "victoriaswellnessintiative4wg@gmail.com",
  instagram: "vwigcare",
  nav: [
    { label: "About", href: "#about" },
    { label: "Programmes", href: "#programmes" },
    { label: "Impact", href: "#impact" },
    { label: "Get Involved", href: "#get-involved" },
    { label: "Contact", href: "#contact" },
  ],
  donateLabel: "Donate",
  supportLabel: "Get Support",
  announcement: {
    enabled: true,
    bold: "Our new website is live.",
    text: "Get support, join an outreach or partner with us.",
  },
  footer: {
    mission: "Advancing the health, dignity and wellbeing of women and girls, everywhere.",
    copyright: "© 2026 Victoria's Wellness Initiative for Women and Girls",
    registration: "",
  },
  forms: {
    supportEndpoint: "",
    involvedEndpoint: "",
    contactEndpoint: "",
    newsletterEndpoint: "",
    replyTime: "",
  },
  seo: {
    title: "Victoria's Wellness | Women's and Girls' Health NGO, Nigeria",
    description:
      "Nigerian non-profit for women's and girls' health: menstrual health, outreaches, screening and support in Lagos, Ogun and Osun. Get help, volunteer or donate.",
    ogTitle: "Victoria's Wellness Initiative for Women and Girls",
    ogDescription:
      "A Nigerian non-profit advancing the health, dignity and wellbeing of women and girls: menstrual health, health outreaches, screening and support.",
    twitterDescription: "Health education, menstrual health and community outreaches for women and girls in Nigeria.",
    ogImage: null, // null: use public/og-image.jpg
    ogImageAlt:
      "A Victoria's Wellness volunteer holds a microphone to a smiling schoolgirl during a girls' health outreach.",
  },
  aeo: {
    // A plain summary that AI assistants and answer engines can quote (llms.txt and structured data)
    summary:
      "Victoria's Wellness Initiative for Women and Girls (VWIG) is a community-driven non-profit in Nigeria. It brings health education, preventive care and community support to women and girls in underserved communities, including menstrual health education and sanitary products for schoolgirls, community health outreaches with health checks, malaria prevention and referrals. It has worked in Lagos, Ogun and Osun states.",
    areasServed: [
      { name: "Lagos State", kind: "State" },
      { name: "Ogun State", kind: "State" },
      { name: "Osun State", kind: "State" },
      { name: "Nigeria", kind: "Country" },
    ],
    topics: [
      "Women's health",
      "Girls' health and empowerment",
      "Menstrual health and hygiene",
      "Period poverty",
      "Health education",
      "Cervical cancer screening",
      "HPV vaccination awareness",
      "Malaria prevention",
      "Mental and emotional wellbeing",
      "Community health outreach",
      "Telehealth",
    ],
    foundingDate: "",
    allowAiTraining: true,
  },
};

const arrow = { href: "#get-support", label: "Get Support" };

export const home = {
  _id: "homePage",
  _type: "homePage",
  hero: {
    title: "Advancing the health, *dignity* and wellbeing of women and girls, everywhere.",
    lead: "We bring health education, preventive care and community support to women and girls in underserved communities across Nigeria and beyond.",
    buttons: [
      { label: "Get Support", href: "#get-support", style: "primary" },
      { label: "Get Involved", href: "#get-involved", style: "secondary" },
      { label: "Donate", href: "#donate", style: "donate" },
    ],
    privacyNote: "Your details stay private.",
    image: img("hero", 960, 1200,
      "A volunteer holds a microphone out to a laughing schoolgirl in a hijab, surrounded by her classmates, at a health outreach in Epe.", "hero"),
    mobileImage: null,
    caption: "Listening first, at a girls' health outreach in Epe, Lagos State.",
  },

  about: {
    eyebrow: "Who we are",
    title: "A health initiative led by the communities it serves",
    body: "Victoria's Wellness Initiative for Women and Girls is a community-driven nonprofit. We began because too many women and girls could not reach good health information or care. We work to change that through education, prevention and local action, so every woman and girl can live a healthy life with dignity.",
    linkLabel: "See our programmes",
    linkHref: "#programmes",
    image: img("about", 880, 704,
      "Women seated in rows listen as volunteers in Victoria's Wellness T-shirts lead a health education session at the front of a community hall.", "section"),
    caption: "A health education session led by our volunteers.",
    mission: {
      label: "Our mission",
      lead: "To transform the health and wellbeing of women and girls.",
      more: "We do this by building health knowledge, widening access to quality care and prevention, and giving underserved communities the resources and opportunities to thrive.",
      image: img("gallery-bp-check", 960, 640,
        "A volunteer in gloves takes a woman's blood pressure while other women wait their turn in a community hall."),
      caption: "Blood pressure checks at a women's health outreach.",
    },
    vision: {
      label: "Our vision",
      lead: "A world where every woman and girl, wherever she lives, is informed, healthy and able to live with dignity, purpose and possibility.",
      more: "",
      image: img("gallery-certificates", 960, 640,
        "Schoolgirls in blue uniforms hold certificates, standing with volunteers under trees."),
      caption: "Contest winners receive certificates for a fully funded annual scholarship.",
    },
    symbolsLabel: "What our work stands for",
    symbols: [
      { label: "Health", icon: "heart-plus" },
      { label: "Growth", icon: "sprout" },
      { label: "Protection", icon: "shield-check" },
      { label: "Unity", icon: "rings" },
      { label: "Empowerment", icon: "girl" },
    ],
  },

  programmes: {
    title: "What we do",
    intro: "Seven ways we help women, girls and families stay healthy.",
    image: img("programmes", 880, 660,
      "Smiling schoolgirls in blue uniforms hold up their menstrual health kits, with Victoria's Wellness volunteers standing behind them.", "section"),
    caption: "Girls receive menstrual health kits at a school outreach.",
    items: [
      {
        name: "Health Education and Awareness", icon: "book", status: "now",
        text: "Clear, evidence-based health information that helps people make informed choices.",
        audience: "Women, girls, families, communities",
        actions: [arrow, { label: "Ask about outreach", href: "#contact" }],
      },
      {
        name: "Women's Health and Screening", icon: "stethoscope", status: "now",
        text: "Health awareness, preventive care and referrals to the right medical help.",
        audience: "Women and adolescent girls", actions: [arrow],
      },
      {
        name: "Vaccination and Disease Prevention", icon: "shield-plus", status: "partner",
        text: "Immunisation awareness, and support for vaccination work with qualified health providers.",
        audience: "Children, girls, women, communities", actions: [arrow],
      },
      {
        name: "Malaria Prevention", icon: "net", status: "now",
        text: "Community education, awareness drives and insecticide-treated mosquito nets.",
        audience: "Women, children, families", actions: [arrow],
      },
      {
        name: "Mental and Emotional Wellbeing", icon: "chat-heart", status: "partner",
        text: "Awareness, a listening ear and referrals to professional services when needed.",
        audience: "Women, girls, anyone facing emotional strain", actions: [arrow],
      },
      {
        name: "Girls' Health and Empowerment", icon: "girl", status: "now", highlight: true,
        text: "Menstrual health lessons, hygiene support and sanitary products, so girls can stay confident and in school.",
        audience: "School-aged girls, adolescents", actions: [arrow],
      },
      {
        name: "Telehealth and Digital Health Support", icon: "phone-plus", status: "partner",
        text: "Helping people reach qualified health professionals through digital tools and partners.",
        audience: "People in remote or underserved areas", actions: [arrow],
      },
    ],
    statusNowLabel: "Running now",
    statusPartnerLabel: "With partners",
    audienceLabel: "For",
    note: "**Running now:** outreach, screening, menstrual health sessions, sanitary products and mosquito nets. **With partners:** vaccination, mental health support and telehealth are arranged with partners, depending on availability and resources. Dates, places and who can take part are shared on our official channels.",
  },

  where: {
    title: "Reaching women and girls where care is hardest to find",
    body: "We have reached communities in Lagos, Ogun and Osun states, and we are growing to more underserved communities across Nigeria and beyond.",
    image: img("gallery-women-group", 960, 640,
      "A large group of women from the community stand and sit together outside a single-storey building."),
    caption: "Women from the community after a health outreach.",
    stopsLabel: "Communities we have reached",
    stops: [
      { place: "Idata Town", area: "" },
      { place: "Folu", area: "Ibeju-Lekki" },
      { place: "Epe", area: "" },
      { place: "Eleko", area: "" },
      { place: "Odo-Gbolu", area: "" },
      { place: "Oke-Ogbo", area: "Ile-Ife" },
      { place: "Modakeke", area: "" },
    ],
    nextLabel: "Next, your community?",
    nextButtonLabel: "Bring us to your community",
    nextButtonHref: "#get-involved",
  },

  impact: {
    eyebrow: "Our impact",
    title: "Progress you can count",
    intro: "We have catered to real people and real communities.",
    asOf: "", // e.g. 2026-10-31: shown as "Figures as of …" and used by answer engines
    major: [
      { prefix: "Over", number: 2500, label: "women reached" },
      { prefix: "Over", number: 4800, label: "girls reached", highlight: true },
    ],
    minor: [
      { prefix: "Over", number: 900, label: "insecticide-treated mosquito nets given out" },
      { prefix: "Over", number: 10, label: "health education sessions" },
      { prefix: "Over", number: 500, label: "people at those sessions" },
    ],
    image: img("gallery-epe-school", 960, 640,
      "Hundreds of students in pink berets and uniforms gather in front of Epe Girls' Senior High School."),
    caption: "Students gather for a girls' health outreach, Epe Girls' Senior High School.",
    checksTitle: "Checks offered at our outreaches",
    checks: ["Hepatitis B", "HIV", "Malaria", "Typhoid (Widal test)", "Cervical screening (Pap smear)", "Blood sugar", "Blood pressure"],
    buttonLabel: "See our outreach",
    buttonHref: "#outreach",
  },

  values: {
    eyebrow: "Our values",
    title: "What guides our work",
    intro: "Ten promises we keep in every outreach, every session and every conversation.",
    image: img("gallery-line", 960, 640, "A line of schoolgirls in berets show their packs of sanitary pads to the camera."),
    items: [
      { name: "Empowerment", icon: "girl", color: "sage", text: "We give women and girls the knowledge, confidence and resources to make informed choices about health and life." },
      { name: "Health Equity", icon: "scales", color: "rose", text: "Good healthcare and health information are rights, not privileges." },
      { name: "Prevention", icon: "shield-check", color: "gold", text: "Early education, screening, vaccination and healthy living help problems get caught in time." },
      { name: "Dignity and Compassion", icon: "hand-heart", color: "rose", text: "Every woman and girl deserves to be seen, heard, respected and cared for." },
      { name: "Knowledge and Health Literacy", icon: "book-light", color: "sage", text: "We turn reliable health information into practical knowledge people can use." },
      { name: "Inclusion", icon: "group", color: "gold", text: "We make safe, respectful spaces where every woman and girl can take part." },
      { name: "Community-Centred Impact", icon: "home-heart", color: "sage", text: "We listen to communities and build solutions that answer real needs." },
      { name: "Integrity and Accountability", icon: "medal", color: "gold", text: "We practise openness, ethics and careful use of every contribution." },
      { name: "Collaboration", icon: "rings-plus", color: "rose", text: "We work with communities, health professionals, governments and partners." },
      { name: "Sustainable Transformation", icon: "sprout-ground", color: "sage", text: "We help communities grow stronger so change lasts beyond short-term help." },
    ],
  },

  support: {
    title: "You don't have to work it out alone",
    body: "Tell us what kind of help you need and how to reach you. A member of our team will get back to you with information, a referral or the next step. Your request is private, and we will never judge you for asking.",
    quickLabel: "Other ways to reach us",
    whatsappLabel: "Message us on WhatsApp",
    whatsappNote: "Opens WhatsApp in a new tab",
    whatsappMessage: "Hello, I would like some support.",
    callLabel: "Call the care line",
    referralLabel: "Request a referral",
    referralNote: "Starts the form below with \"A referral\" chosen",
    form: {
      title: "Send a support request",
      requiredNote: "All questions are needed unless they say otherwise.",
      nameLabel: "First name",
      nameHelp: "A first name is enough.",
      contactLabel: "Phone or email",
      contactHelp: "Where should we reach you?",
      preferredLabel: "How should we contact you?",
      helpLabel: "What help do you need?",
      privacyNote: "Please don't write medical details in this form. Just choose the kind of help.",
      helpOptions: ["Health information", "A referral", "Menstrual health support", "A screening", "Telehealth support", "Something else"],
      referralOption: "A referral",
      ageLabel: "Your age group",
      ageOptions: ["Under 18", "18 to 35", "36 and over"],
      guardianLabel: "A parent or guardian's contact",
      guardianHelp: "We may need a parent or guardian to agree before we can help.",
      consentText: "I agree that Victoria's Wellness may use my details to reply to this request.",
      emergency: "**In an emergency**, go to the nearest health facility now. We cannot give emergency care through this website.",
      submitLabel: "Send my request",
      doneTitle: "Thank you.",
      doneText: "We have your request and will contact you as soon as we can.",
      doneEmergency: "If this is an emergency, please go to the nearest health facility now.",
    },
    disclaimerTitle: "Your health matters.",
    disclaimer: "This website gives health information, education and guidance to help you make informed choices. It does not replace advice, diagnosis or treatment from a health professional, and we do not provide emergency medical care through this platform. Where we can, we will connect you with the right health professionals or referral services.",
  },

  involved: {
    eyebrow: "Join us",
    title: "Be part of the change",
    body: "Every woman and girl deserves a healthy, dignified life. We welcome volunteers, health professionals, teachers and community advocates to help close healthcare gaps. We also welcome schools, NGOs, companies, donors and sponsors who share our vision.",
    image: img("involved", 880, 587,
      "Partners, officials and Victoria's Wellness volunteers stand behind bags of donated sanitary products outside a school office.", "section"),
    caption: "Partners and volunteers with donated sanitary products at Epe Girls' Senior High School.",
    waysLabel: "Four ways to help",
    ways: [
      { label: "Volunteer your time and skills", icon: "heart" },
      { label: "Partner with us", icon: "rings" },
      { label: "Sponsor an outreach", icon: "sprout" },
      { label: "Give supplies", icon: "gift" },
    ],
    closing: "Your skills, time or resources can make a lasting difference, *one woman, one girl and one community at a time.*",
    form: {
      title: "Offer your help",
      nameLabel: "Your name",
      contactLabel: "Email or phone",
      roleLabel: "I am a…",
      roleOptions: ["Volunteer", "Health professional", "School", "Organisation", "Sponsor", "Other"],
      orgRoles: ["School", "Organisation", "Sponsor"],
      orgLabel: "Organisation name",
      messageLabel: "How would you like to help?",
      messageHelp: "A sentence or two is plenty.",
      consentText: "I agree that Victoria's Wellness may use my details to reply.",
      submitLabel: "Offer my help",
      whatsappLabel: "Or message us on WhatsApp",
      whatsappMessage: "Hello, I would like to get involved.",
      doneTitle: "Thank you.",
      doneText: "We will be in touch soon.",
    },
  },

  donate: {
    title: "Support our mission",
    body: "We welcome individuals, organisations and companies who want to improve access to health education, preventive care, menstrual health support and essential health services for women and girls in underserved communities.",
    howTitle: "How to give",
    howText: "Our official donation channels are being set up. To donate, sponsor an outreach or give supplies, message us on WhatsApp or email and we will guide you.",
    whatsappLabel: "Donate on WhatsApp",
    whatsappMessage: "Hello, I would like to donate to Victoria's Wellness.",
    emailLabel: "Email us to give",
    emailSubject: "Supporting Victoria's Wellness",
    image: img("gallery-epe-handout", 960, 640,
      "A volunteer hands a pack of sanitary pads to a schoolgirl while her classmates wait their turn."),
    useTitle: "How your gift is used",
    uses: ["Community health outreaches", "Health education campaigns", "Menstrual health work", "Preventive care", "Essential health supplies for women and girls"],
    note: "Gifts go to our charitable work and related programme costs, with careful and open use of every contribution.",
    thanks: "Thank you for believing in our mission.",
  },

  outreach: {
    title: "Out in the community",
    body: "See where we have been and where we are going next. Dates, places and who can join are shared here and on Instagram.",
    video: { local: "media/outreach-highlights.mp4" },
    poster: { local: "media/outreach-highlights-poster-1280.jpg", width: 1920, height: 1080 },
    videoLabel: "Video: highlights from Victoria's Wellness outreaches, with captions on screen.",
    playLabel: "Play the film",
    playNote: "(20 seconds)",
    videoCaption: "Highlights from our outreaches: girls' health sessions, health checks for women and community education. Captions are on screen; there is no sound.",
    upcomingTitle: "Upcoming",
    upcomingText: "Our next outreach will be announced soon. Follow us on Instagram to hear first.",
    events: [],
    instagramLabel: "Follow us on Instagram (@vwigcare)",
    askLabel: "Ask about an outreach",
  },

  gallery: {
    eyebrow: "Gallery",
    title: "Moments from our outreaches",
    intro: "Real people, real communities. Tap any photo to see it larger.",
    items: [
      { layout: "big", caption: "Students hold up their sanitary pads after a girls' health session, Epe.", image: img("gallery-epe-pads", 960, 640, "Schoolgirls in pink berets hold their packs of sanitary pads up high.") },
      { layout: "normal", caption: "Blood pressure checks at a women's health outreach.", image: img("gallery-bp-check", 960, 640, "A volunteer in gloves takes a woman's blood pressure in a community hall.") },
      { layout: "normal", caption: "A volunteer hears from students during a girls' health session, Epe.", image: img("gallery-mic", 960, 640, "A volunteer holds a microphone out to a laughing schoolgirl while her classmates look on.") },
      { layout: "wide", caption: "Women from the community after a health outreach.", image: img("gallery-women-group", 960, 640, "A large group of women from the community stand and sit together outside a single-storey building.") },
      { layout: "wide", caption: "Students gather for a girls' health outreach, Epe Girls' Senior High School.", image: img("gallery-epe-school", 960, 640, "Hundreds of students in pink berets and uniforms gather in front of Epe Girls' Senior High School.") },
      { layout: "normal", caption: "Volunteers hand out sanitary products, Epe.", image: img("gallery-epe-handout", 960, 640, "A volunteer hands a pack of sanitary pads to a schoolgirl while her classmates wait their turn.") },
      { layout: "normal", caption: "Students show their sanitary pads, Epe.", image: img("gallery-line", 960, 640, "A line of schoolgirls in berets show their packs of sanitary pads to the camera.") },
      { layout: "normal", caption: "Contest winners receive certificates for a fully funded annual scholarship.", image: img("gallery-certificates", 960, 640, "Schoolgirls in blue uniforms hold certificates, standing with volunteers under trees.") },
      { layout: "wide", caption: "Girls receive awards at a Victoria's Wellness event.", image: img("gallery-ceremony", 960, 640, "Girls in school uniforms hold award certificates on a stage beneath a Victoria's Wellness banner.") },
      { layout: "normal", caption: "Students wait for their sanitary products, Epe.", image: img("gallery-queue", 960, 640, "Schoolgirls queue in a courtyard while a volunteer prepares their sanitary products.") },
      { layout: "wide", caption: "A health education session led by our volunteers.", image: img("gallery-session", 960, 640, "Women seated in rows listen as volunteers lead a health education session at the front of a hall.") },
    ],
    instagramTitle: "More on Instagram",
    instagramText: "Follow @vwigcare for outreach news and photos",
  },

  // Questions people ask search engines and AI assistants, answered in plain words.
  // Draft answers use only facts already on the site: the client should check them.
  faq: {
    enabled: true,
    eyebrow: "Questions",
    title: "Questions people ask us",
    intro: "Short answers about who we are, where we work and how to get help.",
    items: [
      {
        question: "What is Victoria's Wellness Initiative for Women and Girls?",
        answer: "Victoria's Wellness Initiative for Women and Girls (VWIG) is a community-driven non-profit in Nigeria. We bring health education, preventive care and community support to women and girls in underserved communities.",
      },
      {
        question: "Where does Victoria's Wellness work?",
        answer: "We have reached communities in Lagos, Ogun and Osun states, including Idata Town, Folu (Ibeju-Lekki), Epe, Eleko, Odo-Gbolu, Oke-Ogbo (Ile-Ife) and Modakeke. We are growing to more underserved communities across Nigeria and beyond.",
      },
      {
        question: "How do you help with menstrual health and period poverty?",
        answer: "Our Girls' Health and Empowerment programme gives menstrual health lessons, hygiene support and sanitary products, so girls can stay confident and in school. We run these sessions in schools, for example at Epe Girls' Senior High School in Lagos State.",
      },
      {
        question: "What health checks are offered at your outreaches?",
        answer: "Checks offered at our outreaches include hepatitis B, HIV, malaria, typhoid (Widal test), cervical screening (Pap smear), blood sugar and blood pressure.",
      },
      {
        question: "How can I get support from Victoria's Wellness?",
        answer: "Send a support request using the form on this page, message us on WhatsApp or call +234 705 242 9995. Your request is private. We cannot give emergency care: in an emergency, go to the nearest health facility now.",
      },
      {
        question: "How many women and girls have you reached?",
        answer: "We have reached over 2,500 women and over 4,800 girls. We have also given out over 900 insecticide-treated mosquito nets and run over 10 health education sessions with over 500 people.",
      },
      {
        question: "How can I volunteer or partner with you?",
        answer: "Fill in the Get Involved form or message us on WhatsApp. We welcome volunteers, health professionals, teachers and community advocates, as well as schools, NGOs, companies, donors and sponsors.",
      },
      {
        question: "How can I donate?",
        answer: "Our official donation channels are being set up. To donate, sponsor an outreach or give supplies, message us on WhatsApp or email victoriaswellnessintiative4wg@gmail.com and we will guide you.",
      },
    ],
  },

  newsletter: {
    title: "Stay in touch",
    text: "Get news of outreaches, health tips and ways to help. A few emails a year, and you can leave any time.",
    emailLabel: "Your email",
    submitLabel: "Subscribe",
    consentText: "I agree to receive emails from Victoria's Wellness.",
    doneText: "Check your inbox to confirm.",
  },

  contact: {
    title: "Talk to us",
    body: "Questions, ideas or want to work with us? Send a message or reach us directly.",
    form: {
      title: "Send a message",
      nameLabel: "Name",
      contactLabel: "Email or phone",
      messageLabel: "Message",
      replyLabel: "How should we reply?",
      consentText: "I agree that Victoria's Wellness may use my details to reply.",
      submitLabel: "Send message",
      doneTitle: "Thank you.",
      doneText: "We have your message and will reply soon.",
    },
  },
};

const block = (text, style = "normal") => ({ _type: "block", style, children: [{ _type: "span", text }] });

export const privacy = {
  _id: "privacyPage",
  _type: "legalPage",
  title: "Privacy policy",
  description: "How we handle the information you share with us.",
  hideFromSearch: true, // placeholder text: kept out of search results until the final policy is in
  updated: "",
  body: [
    block("We take your privacy seriously. This page explains what we collect when you use our forms, why we collect it, who can see it and how to ask us to delete it."),
  ],
  pendingNote: "Our full privacy policy is being finalised and will be published here before launch.",
};

export const terms = {
  _id: "termsPage",
  _type: "legalPage",
  title: "Terms of use",
  description: "Terms of use and health information disclaimer.",
  hideFromSearch: true,
  updated: "",
  body: [
    block("Please read these terms before using this site. The health information here is for education only and does not replace advice from a health professional."),
  ],
  pendingNote: "Our full terms of use are being finalised and will be published here before launch.",
};
