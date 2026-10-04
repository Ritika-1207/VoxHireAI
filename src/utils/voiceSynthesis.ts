/**
 * VoxHire.AI Natural Female Voice Synthesis Engine
 * Clearly feminine, warm, sweet, friendly, confident, and professional voice tuning.
 * Manages human-like pauses, conversational rhythm, pleasant emotions, and multi-language support.
 * Strictly avoids male voices and avoids robotic tones.
 * Speaks naturally without introducing as an AI.
 */

export interface SupportedLanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string;
  sampleGreeting: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (US/UK)',
    flag: '🇺🇸',
    speechCode: 'en-US',
    sampleGreeting: "Hello! This is Aria from VoxHire.AI. It's truly a pleasure to connect with you today.",
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    speechCode: 'hi-IN',
    sampleGreeting: 'नमस्ते! मैं वॉक्सहायर.एआई से आर्या बात कर रही हूं। आज आपसे बात करके मुझे बहुत खुशी हो रही है।',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    speechCode: 'es-ES',
    sampleGreeting: '¡Hola! Te habla Aria de VoxHire.AI. Es un verdadero placer saludarte hoy.',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    speechCode: 'te-IN',
    sampleGreeting: 'నమస్కారం! నేను వాక్స్ హైర్.AI నుండి ఆరియాను మాట్లాడుతున్నాను. మీతో మాట్లాడటం చాలా సంతోషంగా ఉంది.',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    speechCode: 'ta-IN',
    sampleGreeting: 'வணக்கம்! நான் வாக்ஸ்ஹையர்.AI-இலிருந்து ஆரியா பேசுகிறேன். உங்களுடன் உரையாடுவதில் பெருமகிழ்ச்சி.',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    speechCode: 'fr-FR',
    sampleGreeting: "Bonjour ! C'est Aria de VoxHire.AI. Je suis ravie d'échanger avec vous aujourd'hui.",
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    speechCode: 'de-DE',
    sampleGreeting: 'Guten Tag! Hier ist Aria von VoxHire.AI. Schön, dass wir heute miteinander sprechen.',
  },
];

export interface LanguageDialogueFlow {
  disclosureGreeting: string;
  languageComfortQuestion: string;
  confirmChoiceText: string;
  experienceQuestion: string;
  salaryQuestion: string;
  noticeQuestion: string;
  locationQuestion: string;
  conclusionText: string;
}

export const LANGUAGE_DIALOGUES: Record<string, LanguageDialogueFlow> = {
  en: {
    disclosureGreeting: "Hello! This is Aria from VoxHire.AI calling regarding your application for the Software Developer opening.",
    languageComfortQuestion: "Before we begin, which language are you most comfortable speaking in?",
    confirmChoiceText: "Wonderful! We'll continue our conversation in English... I'm really looking forward to learning more about your background today.",
    experienceQuestion: "Could you tell me a little about your development experience and the programming languages you enjoy working with the most?",
    salaryQuestion: "That sounds great! What are your current and expected compensation expectations in LPA?",
    noticeQuestion: "Got it. And what is your official contractual notice period or earliest availability to join?",
    locationQuestion: "Are you comfortable with our hybrid working arrangement based in Bangalore or Hyderabad?",
    conclusionText: "Thank you so much! All of your details have been noted down with care. Our recruitment team will review the summary and be in touch soon. Have a wonderful day ahead!",
  },
  hi: {
    disclosureGreeting: "नमस्ते! मैं वॉक्सहायर.एआई से आर्या बात कर रही हूं, आपकी सॉफ्टवेयर डेवलपर एप्लिकेशन के सिलसिले में।",
    languageComfortQuestion: "बातचीत शुरू करने से पहले, आप किस भाषा में बात करना सबसे अधिक सहज महसूस करते हैं?",
    confirmChoiceText: "बहुत बढ़िया! हम हिंदी में अपनी बातचीत जारी रखेंगे... आज आपसे बात करके मुझे बहुत खुशी हो रही है।",
    experienceQuestion: "क्या आप मुझे अपने सॉफ्टवेयर डेवलपमेंट अनुभव और अपनी पसंदीदा प्रोग्रामिंग भाषाओं के बारे में बता सकते हैं?",
    salaryQuestion: "यह बहुत अच्छा है! आपकी वर्तमान और अपेक्षित वार्षिक सीटीसी क्या है?",
    noticeQuestion: "समझ गई। आपका आधिकारिक नोटिस पीरियड कितना है, या आप कितने दिनों में जॉइन कर सकते हैं?",
    locationQuestion: "क्या आप बैंगलोर या हैदराबाद में हाइब्रिड मॉडल में काम करने के लिए सहज हैं?",
    conclusionText: "बहुत-बहुत धन्यवाद! आपकी सभी जानकारियाँ बहुत सावधानी से नोट कर ली गई हैं। हमारी तकनीकी भर्ती टीम इस सारांश की समीक्षा करेगी और जल्द ही आपसे संपर्क करेगी। आपका दिन शुभ हो!",
  },
  es: {
    disclosureGreeting: "¡Hola! Te habla Aria de VoxHire.AI en relación a tu postulación para la vacante de Desarrollador de Software.",
    languageComfortQuestion: "Antes de comenzar, ¿en qué idioma te sientes más cómodo hablando?",
    confirmChoiceText: "¡Excelente! Continuaremos en español... Es un verdadero gusto conversar contigo hoy.",
    experienceQuestion: "Por favor, cuéntame sobre tu experiencia en desarrollo de software y qué tecnologías dominas mejor.",
    salaryQuestion: "¡Suena muy bien! ¿Cuál es tu salario actual y tu remuneración anual esperada?",
    noticeQuestion: "Entendido. ¿Cuál es tu período de preaviso actual o tu fecha más temprana de disponibilidad?",
    locationQuestion: "¿Te resulta cómoda una modalidad de trabajo híbrida en nuestras oficinas?",
    conclusionText: "¡Muchísimas gracias! He tomado nota de todos tus detalles. Nuestro equipo de selección técnica revisará el resumen y se pondrá en contacto muy pronto. ¡Que tengas un excelente día!",
  },
  te: {
    disclosureGreeting: "నమస్కారం! నేను వాక్స్ హైర్.AI నుండి ఆరియాను మాట్లాడుతున్నాను, మీ సాఫ్ట్‌వేర్ డెవలపర్ జాబ్ అప్లికేషన్ గురించి సంప్రదిస్తున్నాను.",
    languageComfortQuestion: "మనం ప్రారంభించే ముందు, మీరు మాట్లాడటానికి అత్యంత అనుకూలమైన భాష ఏది?",
    confirmChoiceText: "చాలా సంతోషం! మనం తెలుగులోనే మన సంభాషణను కొనసాగిద్దాం... మీ వివరాలు తెలుసుకోవడం చాలా ఆనందంగా ఉంది.",
    experienceQuestion: "మీ సాఫ్ట్‌వేర్ డెవలప్‌మెంట్ అనుభవం మరియు మీరు పనిచేసే ప్రధాన ప్రోగ్రామింగ్ భాషల గురించి క్లుప్తంగా చెప్పగలరా?",
    salaryQuestion: "బాగుంది! మీ ప్రస్తుత మరియు ఆశించే వార్షిక వేతనం (CTC) ఎంత?",
    noticeQuestion: "అర్థమైంది. మీ అధికారిక నోటీస్ పీరియడ్ ఎంత, ఎప్పటిలోగా చేరగలరు?",
    locationQuestion: "హైదరాబాద్ లేదా బెంగళూరులో హైబ్రిడ్ పని విధానంలో పనిచేయడానికి మీకు సౌకర్యంగా ఉంటుందా?",
    conclusionText: "చాలా ధన్యవాదాలు! మీ సమాధానాలన్నీ భద్రపరచబడ్డాయి. మా రిక్రూట్‌మెంట్ బృందం వీటిని పరిశీలించి త్వరలోనే మిమ్మల్ని సంప్రదిస్తుంది. హావ్ ఏ గ్రేట్ డే!",
  },
  ta: {
    disclosureGreeting: "வணக்கம்! நான் வாக்ஸ்ஹையர்.AI-இலிருந்து ஆரியா பேசுகிறேன். உங்கள் மென்பொருள் வேலை விண்ணப்பம் தொடர்பாக அழைக்கிறேன்.",
    languageComfortQuestion: "தொடங்குவதற்கு முன், நீங்கள் பேசுவதற்கு மிகவும் வசதியான மொழி எது?",
    confirmChoiceText: "மிக்க மகிழ்ச்சி! நாம் தமிழிலேயே தொடரலாம்... உங்களுடன் உரையாடுவதில் பெருமகிழ்ச்சி.",
    experienceQuestion: "உங்கள் மென்பொருள் பணி அனுபவம் மற்றும் முதன்மை புரோகிராமிங் மொழிகள் பற்றி சுருக்கமாக கூறுங்கள்?",
    salaryQuestion: "அருமை! உங்கள் தற்போதைய மற்றும் எதிர்பார்க்கும் ஆண்டு ஊதியம் எவ்வளவு?",
    noticeQuestion: "புரிந்தது. உங்கள் நோட்டீஸ் காலம் எவ்வளவு, எப்போது பணியில் சேர முடியும்?",
    locationQuestion: "பெங்களூரு அல்லது ஹைதராபாத்தில் ஹைப்ரிட் முறையில் பணிபுரிய வசதியாக இருக்குமா?",
    conclusionText: "மிக்க நன்றி! உங்கள் தகவல்கள் துல்லியமாக பதிவு செய்யப்பட்டுள்ளன. எங்களின் ஆளெடுப்பு குழு இதனை ஆய்வு செய்து விரைவில் தொடர்புகொள்ளும். இனிய நாளாக அமையட்டும்!",
  },
  fr: {
    disclosureGreeting: "Bonjour ! C'est Aria de VoxHire.AI concernant votre candidature pour le poste de développeur logiciel.",
    languageComfortQuestion: "Avant de commencer, dans quelle langue êtes-vous le plus à l'aise pour échanger ?",
    confirmChoiceText: "Merveilleux ! Poursuivons en français... Je suis ravie d'échanger avec vous aujourd'hui.",
    experienceQuestion: "Pourriez-vous me parler de votre parcours et des langages de programmation avec lesquels vous êtes le plus à l'aise ?",
    salaryQuestion: "C'est formidable ! Quelles sont vos prétentions salariales actuelles et souhaitées ?",
    noticeQuestion: "Bien noté. Quel est votre préavis contractuel ou votre date de disponibilité la plus proche ?",
    locationQuestion: "Êtes-vous à l'aise avec notre modèle de travail hybride ?",
    conclusionText: "Merci infiniment ! Toutes vos réponses ont été soigneusement enregistrées. Notre équipe de recrutement examinera cette synthèse et vous recontactera rapidement. Excellente journée !",
  },
  de: {
    disclosureGreeting: "Guten Tag! Hier ist Aria von VoxHire.AI bezüglich Ihrer Bewerbung für die Stelle als Softwareentwickler.",
    languageComfortQuestion: "Bevor wir beginnen: In welcher Sprache fühlen Sie sich am wohlsten zu sprechen?",
    confirmChoiceText: "Wunderbar! Wir setzen unser Gespräch auf Deutsch fort... Ich freue mich sehr darauf, mehr über Sie zu erfahren.",
    experienceQuestion: "Könnten Sie mir bitte von Ihrer Entwicklungserfahrung und Ihren bevorzugten Programmiersprachen berichten?",
    salaryQuestion: "Das klingt hervorragend! Wie sehen Ihre aktuellen und erwarteten Gehaltsvorstellungen aus?",
    noticeQuestion: "Verstanden. Wie lang ist Ihre Kündigungsfrist bzw. wann könnten Sie frühestens beginnen?",
    locationQuestion: "Sind Sie mit unserem hybriden Arbeitsmodell einverstanden?",
    conclusionText: "Vielen herzlichen Dank! Alle Ihre Angaben wurden sorgfältig erfasst. Unser technisches Recruiting-Team wird die Zusammenfassung prüfen und sich zeitnah bei Ihnen melden. Einen schönen Tag!",
  },
};

/**
 * Strict male indicator keywords to NEVER select
 */
const MALE_INDICATORS = [
  'male', 'david', 'mark', 'george', 'guy', 'stefan', 'paul', 'james', 'richard', 
  'daniel', 'alex', 'fred', 'brian', 'tom', 'michael', 'christopher', 'matthew', 
  'joshua', 'ryan', 'nathan', 'sean', 'john', 'peter', 'andrew', 'steven', 'ravi', 
  'karthik', 'amit', 'raj', 'deepak', 'vikram', 'suresh', 'alva', 'diego', 'jorge',
  'thomas', 'martin', 'nicolas', 'reed', 'claudio', 'jorge', 'cosimo'
];

/**
 * High-priority natural female voice indicators
 */
const FEMALE_INDICATORS = [
  'aria', 'jenny', 'sonia', 'samantha', 'victoria', 'karen', 'moira', 'zira',
  'female', 'woman', 'sweet', 'natural', 'eva', 'monica', 'stephanie', 'laura',
  'fiona', 'luciana', 'swara', 'veena', 'neerja', 'shruti', 'leela', 'kalpana',
  'geeta', 'ananya', 'priya', 'maria', 'lucia', 'sophie', 'marie', 'clara',
  'helena', 'catherine', 'claire', 'julie', 'hazel', 'susan', 'amalie', 'hedda'
];

function isMaleVoice(v: SpeechSynthesisVoice): boolean {
  const nameLower = v.name.toLowerCase();
  return MALE_INDICATORS.some((m) => nameLower.includes(m));
}

function isFemaleVoice(v: SpeechSynthesisVoice): boolean {
  const nameLower = v.name.toLowerCase();
  if (isMaleVoice(v)) return false;
  return FEMALE_INDICATORS.some((f) => nameLower.includes(f));
}

/**
 * Intelligent helper to pick a clearly feminine, sweet, warm, and natural female voice.
 * Strictly rejects male voices.
 */
export function getWarmFemaleVoice(langCode: string = 'en'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const langPrefix = langCode.toLowerCase().slice(0, 2);

  // 1. Prioritized premium natural female voices for target language
  const priorityFemaleVoices = [
    'Microsoft Jenny Online (Natural)',
    'Microsoft Aria Online (Natural)',
    'Google UK English Female',
    'Google US English',
    'Samantha',
    'Victoria',
    'Microsoft Sonia Online (Natural)',
    'Microsoft Zira',
    'Google हिन्दी',
    'Google español',
    'Google français',
    'Google Deutsch',
    'Veena',
    'Swara',
    'Lekha',
    'Karen',
    'Moira',
  ];

  for (const name of priorityFemaleVoices) {
    const found = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith(langPrefix) &&
        v.name.toLowerCase().includes(name.toLowerCase()) &&
        !isMaleVoice(v)
    );
    if (found) return found;
  }

  // 2. Any voice matching language that is explicitly identified as female
  const femaleLangMatched = voices.find(
    (v) => v.lang.toLowerCase().startsWith(langPrefix) && isFemaleVoice(v)
  );
  if (femaleLangMatched) return femaleLangMatched;

  // 3. Any non-male voice matching language
  const nonMaleLangMatched = voices.find(
    (v) => v.lang.toLowerCase().startsWith(langPrefix) && !isMaleVoice(v)
  );
  if (nonMaleLangMatched) return nonMaleLangMatched;

  // 4. Default fallback: Any strictly female English voice
  const fallbackFemale = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith('en') &&
      isFemaleVoice(v) &&
      !isMaleVoice(v)
  );
  if (fallbackFemale) return fallbackFemale;

  // 5. Any non-male voice in any language
  const anyNonMale = voices.find((v) => !isMaleVoice(v));
  return anyNonMale || voices[0] || null;
}

/**
 * Natural speech synthesis speaker with smooth cadence, warm tone, realistic pauses, and sweet feminine inflection.
 */
export function speakNaturalConversational(
  text: string,
  langCode: string = 'en',
  options: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
    rate?: number;
    pitch?: number;
  } = {}
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    options.onEnd?.();
    return;
  }

  try {
    window.speechSynthesis.cancel();

    // Prepare human-like pauses by replacing ellipses and formatting breath marks
    const processedText = text
      .replace(/\.\.\./g, ', ')
      .replace(/([.?!])\s+/g, '$1  ')
      .replace(/\b(Hello|Hi|Wonderful|That sounds great|Got it|Thank you so much|Perfect|Awesome|Certainly|Absolutely)\b/gi, '$1,');

    const utterance = new SpeechSynthesisUtterance(processedText);

    // Sweet, feminine, warm, and natural conversational cadence:
    // Rate: 0.94 (unhurried, warm, human conversation)
    // Pitch: 1.10 (melodic, clearly feminine, sweet and professional)
    utterance.rate = options.rate ?? 0.94;
    utterance.pitch = options.pitch ?? 1.10;

    const voice = getWarmFemaleVoice(langCode);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
      // If voice is non-gender-marked, pitch up slightly to guarantee a distinctly feminine timbre
      if (!isFemaleVoice(voice)) {
        utterance.pitch = 1.14;
      }
    } else {
      const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
      utterance.lang = langMeta ? langMeta.speechCode : 'en-US';
      utterance.pitch = 1.12;
    }

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      options.onEnd?.();
    };

    utterance.onerror = () => {
      options.onError?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis playback error:', err);
    options.onError?.();
  }
}

/**
 * Stop any current speaking
 */
export function stopNaturalSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}
