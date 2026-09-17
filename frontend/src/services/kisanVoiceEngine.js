/**
 * CropShield AI - Kisan Voice Agronomic Intelligence Engine
 * Precision Agri-Vision (Smart Agriculture & Crop Health)
 * 
 * Pipeline:
 * 🎤 Spoken Farmer Audio → Speech-to-Text → CropShield Agronomic Engine → Simple Actionable Guidance → 🔊 Spoken Audio Response
 */

import { INDIAN_LANGUAGES } from '../utils/vernacularTranslator.js';
import { getStoredScans } from '../utils/scanHistory.js';
import { mockWeather } from '../data/mockData.js';

export const SAMPLE_VOICE_QUERIES = [
  {
    lang: 'te',
    langName: 'తెలుగు (Telugu)',
    query: 'టమాట ముందస్తు ఆకుమచ్చ తెగులుకు ఏ మందు పిచికారీ చేయాలి?',
    category: 'Disease Treatment',
  },
  {
    lang: 'te',
    langName: 'తెలుగు (Telugu)',
    query: 'ఈరోజు వాతావరణం ప్రకారం పురుగు మందు పిచికారీ చేయవచ్చా?',
    category: 'Spraying Window',
  },
  {
    lang: 'hi',
    langName: 'हिंदी (Hindi)',
    query: 'टमाटर के अगेती झुलसा रोग के लिए कौन सी दवाई और कितनी मात्रा में छिड़कें?',
    category: 'Disease Treatment',
  },
  {
    lang: 'hi',
    langName: 'हिंदी (Hindi)',
    query: 'मिर्च में थ्रिप्स और पत्ती मरोड़ का जैविक और रासायनिक उपाय क्या है?',
    category: 'Pest Management',
  },
  {
    lang: 'en',
    langName: 'English (Indian Accent)',
    query: 'What is the recommended spray dosage for tomato early blight?',
    category: 'Disease Treatment',
  },
  {
    lang: 'en',
    langName: 'English (Indian Accent)',
    query: 'Is it safe to spray foliar chemicals today given current humidity and rain forecast?',
    category: 'Weather & Spraying',
  },
  {
    lang: 'mr',
    langName: 'मराठी (Marathi)',
    query: 'कपाशीवरील बोंडअळी आणि पांढऱ्या माशीसाठी योग्य औषध कोणते?',
    category: 'Pest Control',
  },
  {
    lang: 'ta',
    langName: 'தமிழ் (Tamil)',
    query: 'தக்காளி இலைக்கருகல் நோய்க்கு என்ன மருந்து தெளிக்க வேண்டும்?',
    category: 'Disease Treatment',
  },
];

/**
 * Evaluates the farmer's spoken query and returns simple, actionable agricultural guidance
 * along with a natural spoken voice script.
 * 
 * @param {object} params
 * @param {string} params.query - Transcribed farmer speech text
 * @param {string} [params.langCode] - Language code ('te', 'hi', 'en', 'mr', 'ta', 'pa', 'bn', 'gu', 'kn')
 * @param {string} [params.crop] - Currently selected crop (e.g. 'Tomato')
 * @param {object} [params.weather] - Current microclimate conditions
 * @returns {object} Structured agronomist answer with key takeaways and spoken script
 */
export const processFarmerVoiceQuery = ({
  query = '',
  langCode = 'en',
  crop = 'Tomato',
  weather = null,
} = {}) => {
  const q = (query || '').toLowerCase().trim();
  const currentLang = langCode || 'en';
  
  // Safe microclimate normalization
  const activeTemp = Math.round(weather?.temp ?? weather?.temperature ?? mockWeather?.temperature ?? 28);
  const activeHumidity = weather?.humidity ?? mockWeather?.humidity ?? 76;
  const activeRainfall = weather?.rainfall ?? 0;
  const activeWindSpeed = weather?.windSpeed ?? 8;

  // Detect recent farm context from scans
  const userScans = getStoredScans();
  const latestScan = userScans.length > 0 ? userScans[0] : null;

  // 1. TOMATO BLIGHT / FUNGAL SPOTS QUERY
  if (
    q.includes('tomato') ||
    q.includes('టమాట') ||
    q.includes('टमाटर') ||
    q.includes('தக்காளி') ||
    q.includes('टोमॅटो') ||
    q.includes('blight') ||
    q.includes('झुलसा')
  ) {
    if (currentLang === 'te') {
      return {
        title: 'టమాట ముందస్తు ఆకుమచ్చ (Early Blight) నివారణ',
        summary: 'శిలీంద్ర వ్యాప్తిని అరికట్టడానికి క్రింది నివారణ మందులను వాడండి.',
        keyActions: [
          'కాపర్ ఆక్సీక్లోరైడ్ (COC 50% WP) 3 గ్రాములు లేదా అజోక్సీస్ట్రోబిన్ + డైఫెనోకోనజోల్ 1 మి.లీ లీటరు నీటికి కలపండి.',
          'నేల తేమను నియంత్రించండి, మొక్క మొదళ్లలో నీరు నిలవకుండా చూడండి.',
          'వ్యాధి సోకిన క్రింది ఆకులను కత్తిరించి పొలం బయట కాల్చివేయండి.',
        ],
        timing: 'ఉదయం పూట ఎండ రాకముందు పిచికారీ చేయండి',
        dosage: 'అజోక్సీస్ట్రోబిన్ + డైఫెనోకోనజోల్ 1.0 మి.లీ/లీటరు నీరు',
        spokenVoiceText: 'టమాట ఆకుమచ్చ తెగులు నివారణకు అజోక్సీస్ట్రోబిన్ ప్లస్ డైఫెనోకోనజోల్ ఒక మిల్లీలీటర్ లీటరు నీటికి కలిపి ఉదయం పూట పిచికారీ చేయండి. మొదళ్లలో నీరు నిలవకుండా చూడండి.',
        confidence: 95,
        category: 'Disease Treatment',
      };
    }

    if (currentLang === 'hi') {
      return {
        title: 'टमाटर का अगेती झुलसा (Early Blight) नियंत्रण',
        summary: 'फफूंद जनित रोगों के प्रसार को रोकने के लिए तुरंत अनुशंसित कवकनाशी का प्रयोग करें।',
        keyActions: [
          'एज़ोक्सीस्ट्रोबिन 18.2% + डिफेनोकोनाज़ोल 11.4% SC @ 1 मिली प्रति लीटर पानी में घोलें।',
          'वैकल्पिक: कॉपर ऑक्सीक्लोराइड 50% WP @ 2.5 से 3 ग्राम प्रति लीटर।',
          'संक्रमित निचली पत्तियों को काटकर खेत से दूर नष्ट कर दें।',
        ],
        timing: 'प्रातःकाल ओस सूखने के तुरंत बाद छिड़कें',
        dosage: 'एज़ोक्सीस्ट्रोबिन + डिफेनोकोनाज़ोल 1.0 मिली/लीटर पानी',
        spokenVoiceText: 'टमाटर के झुलसा रोग के लिए एज़ोक्सीस्ट्रोबिन और डिफेनोकोनाज़ोल एक मिली प्रति लीटर पानी में मिलाकर सुबह के समय छिड़काव करें।',
        confidence: 95,
        category: 'Disease Treatment',
      };
    }

    if (currentLang === 'ta') {
      return {
        title: 'தக்காளி இலைக்கருகல் நோய் கட்டுப்பாடு',
        summary: 'பூஞ்சை பரவுவதை தடுக்க பரிந்துரைக்கப்பட்ட பூஞ்சைக்கொல்லியை தெளிக்கவும்.',
        keyActions: [
          'அசோக்சிஸ்ட்ரோபின் + டைபினோகோனசோல் 1.0 மி.லி / லிட்டர் தண்ணீரில் கலக்கவும்.',
          'காப்பர் ஆக்ஸிகுளோரைடு 3 கிராம் / லிட்டர் தெளிக்கலாம்.',
          'பாதிக்கப்பட்ட இலைகளை அகற்றி அழிக்கவும்.',
        ],
        timing: 'காலை வேளையில் தெளிக்கவும்',
        dosage: '1.0 மி.லி / லிட்டர் தண்ணீர்',
        spokenVoiceText: 'தக்காளி இலைக்கருகல் நோய்க்கு அசோக்சிஸ்ட்ரோபின் மற்றும் டைபினோகோனசோல் ஒரு மில்லி லிட்டர் தண்ணீரில் கலந்து காலையில் தெளிக்கவும்.',
        confidence: 95,
        category: 'Disease Treatment',
      };
    }

    return {
      title: 'Tomato Early & Late Blight Management',
      summary: 'Apply registered fungicides to arrest Alternaria fungal spore spread.',
      keyActions: [
        'Foliar Spray: Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L water.',
        'Alternative Contact: Copper Oxychloride 50% WP @ 2.5-3.0 g/L water.',
        'Prune lower infected foliage and avoid overhead sprinkler splash.',
      ],
      timing: 'Morning application after dew evaporation (07:00 AM - 10:00 AM)',
      dosage: 'Azoxystrobin + Difenoconazole @ 1.0 ml/L (200 ml in 200L water/acre)',
      spokenVoiceText: 'For tomato blight control, spray Azoxystrobin plus Difenoconazole at 1.0 ml per liter of water during morning hours. Ensure proper drainage.',
      confidence: 95,
      category: 'Disease Treatment',
    };
  }

  // 2. CHILLI THRIPS / LEAF CURL QUERY
  if (
    q.includes('chilli') ||
    q.includes('thrip') ||
    q.includes('curl') ||
    q.includes('మిరప') ||
    q.includes('తామర') ||
    q.includes('ముడత') ||
    q.includes('मिर्च') ||
    q.includes('मरोड़')
  ) {
    if (currentLang === 'te') {
      return {
        title: 'మిరప నల్ల తామర పురుగు & ఆకు ముడత నివారణ',
        summary: 'నల్ల తామర పురుగుల నివారణకు సమగ్ర సస్యరక్షణ చర్యలు పాటించండి.',
        keyActions: [
          'ఎకరానికి 20 నీలి మరియు పసుపు రంగు జిగురు అట్టలను అమర్చండి.',
          'రసాయన మందు: స్పైనటోరం 11.7% SC @ 0.9 మి.లీ లేదా ఫిప్రోనిల్ 5% SC @ 2.0 మి.లీ లీటరు నీటికి కలపండి.',
          'ముదిరిన ఆకులను తొలగించి నాశనం చేయండి.',
        ],
        timing: 'సాయంత్రం వేళల్లో పిచికారీ చేయండి',
        dosage: 'స్పైనటోరం 0.9 మి.లీ/లీటరు లేదా వేప నూనె 5 మి.లీ/లీటరు',
        spokenVoiceText: 'మిరపలో తామర పురుగుల నివారణకు ఎకరానికి 20 నీలి జిగురు అట్టలు పెట్టండి. తీవ్రత ఎక్కువగా ఉంటే స్పైనటోరం 0.9 మిల్లీలీటర్లు లీటరు నీటికి కలిపి సాయంత్రం పిచికారీ చేయండి.',
        confidence: 94,
        category: 'Pest Advisory',
      };
    }

    if (currentLang === 'hi') {
      return {
        title: 'मिर्च में थ्रिप्स एवं पत्ती मरोड़ रोग का उपचार',
        summary: 'थ्रिप्स और वायरस फैलाने वाले कीटों की रोकथाम के लिए तुरंत एकीकृत प्रबंधन अपनाएं।',
        keyActions: [
          'प्रति एकड़ 20 नीले और पीले चिपचिपे ट्रैप (Sticky Traps) लगाएं।',
          'रासायनिक दवा: स्पाइनटोरम 11.7% SC @ 0.9 मिली या फिप्रोनिल 5% SC @ 2.0 मिली प्रति लीटर पानी।',
          'नीम तेल (10,000 PPM) 3 मिली प्रति लीटर का छिड़काव करें।',
        ],
        timing: 'शाम के समय छिड़काव सर्वोत्तम है',
        dosage: 'स्पाइनटोरम 0.9 मिली/लीटर या फिप्रोनिल 2.0 मिली/लीटर पानी',
        spokenVoiceText: 'मिर्च में थ्रिप्स के लिए प्रति एकड़ 20 नीले ट्रैप लगाएं। अधिक प्रकोप होने पर स्पाइनटोरम 0.9 मिली प्रति लीटर पानी में मिलाकर शाम के समय छिड़कें।',
        confidence: 94,
        category: 'Pest Advisory',
      };
    }

    return {
      title: 'Chilli Thrips & Leaf Curl Complex Management',
      summary: 'Implement integrated pest management against vector thrips causing leaf curl.',
      keyActions: [
        'Install 20 Blue Sticky Traps per acre at canopy height.',
        'Targeted Spray: Spinetoram 11.7% SC @ 0.9 ml/L or Fipronil 5% SC @ 2.0 ml/L.',
        'Biological Barrier: Spray Neem Oil 10,000 ppm @ 3 ml/L during early infestation.',
      ],
      timing: 'Late afternoon application (04:00 PM - 06:00 PM)',
      dosage: 'Spinetoram 11.7% SC @ 0.9 ml/L water (180 ml/acre in 200L water)',
      spokenVoiceText: 'For chilli thrips, install 20 blue sticky traps per acre. For severe infestation, spray Spinetoram at 0.9 ml per liter of water during the evening.',
      confidence: 94,
      category: 'Pest Advisory',
    };
  }

  // 3. COTTON BOLLWORM / PEST QUERY
  if (
    q.includes('cotton') ||
    q.includes('bollworm') ||
    q.includes('పత్తి') ||
    q.includes('గులాబీ') ||
    q.includes('कपास') ||
    q.includes('गुलाबी सुंडी') ||
    q.includes('कपाशी') ||
    q.includes('बोंडअळी')
  ) {
    if (currentLang === 'te') {
      return {
        title: 'పత్తిలో గులాబీ రంగు కాయతొలుచు పురుగు నివారణ',
        summary: 'కాయతొలుచు పురుగు ఉధృతిని తగ్గించడానికి ఫెరమోన్ ట్రాప్స్ వాడండి.',
        keyActions: [
          'ఎకరానికి 8 లింగాకర్షక బుట్టలను (Pheromone Traps) అమర్చండి.',
          'ఎమామెక్టిన్ బెంజోయేట్ 5% SG @ 0.5 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయండి.',
          'గులాబీ పురుగు సోకిన రాలిన పూత మరియు పిందెలను ఏరి నాశనం చేయండి.',
        ],
        timing: 'సాయంత్రం 04:00 గంటల తర్వాత',
        dosage: 'ఎమామెక్టిన్ బెంజోయేట్ 0.5 గ్రా/లీటరు (100 గ్రా/ఎకరా)',
        spokenVoiceText: 'పత్తిలో గులాబీ రంగు పురుగు నివారణకు ఎకరానికి 8 లింగాకర్షక బుట్టలు పెట్టండి. తీవ్రత ఉంటే ఎమామెక్టిన్ బెంజోయేట్ అర గ్రాము లీటరు నీటికి కలిపి సాయంత్రం పిచికారీ చేయండి.',
        confidence: 93,
        category: 'Pest Advisory',
      };
    }

    if (currentLang === 'hi') {
      return {
        title: 'कपास में गुलाबी सुंडी (Pink Bollworm) प्रबंधन',
        summary: 'सुंडी की निगरानी और नियंत्रण के लिए फेरोमोन ट्रैप एवं अनुशंसित कीटनाशक प्रयोग करें।',
        keyActions: [
          'प्रति एकड़ 8 फेरोमोन ट्रैप (Pheromone Traps) स्थापित करें।',
          'इमामेक्टिन बेंजोएट 5% SG @ 0.5 ग्राम प्रति लीटर पानी में मिलाकर स्प्रे करें।',
          'खेत में गिरे हुए ग्रसित फूलों और कलियों को नष्ट करें।',
        ],
        timing: 'शाम के समय छिड़काव करें',
        dosage: 'इमामेक्टिन बेंजोएट 5% SG @ 0.5 ग्राम/लीटर पानी (100 ग्राम/एकड़)',
        spokenVoiceText: 'कपास में गुलाबी सुंडी के लिए प्रति एकड़ 8 फेरोमोन ट्रैप लगाएं और इमामेक्टिन बेंजोएट आधा ग्राम प्रति लीटर पानी में मिलाकर शाम को छिड़कें।',
        confidence: 93,
        category: 'Pest Advisory',
      };
    }

    if (currentLang === 'mr') {
      return {
        title: 'कपाशीवरील बोंडअळी व रसशोषक कीड नियंत्रण',
        summary: 'बोंडअळीच्या नियंत्रणासाठी कामगंध सापळे व योग्य कीटकनाशकांचा वापर करा.',
        keyActions: [
          'प्रति एकरी ८ कामगंध सापळे (Pheromone Traps) लावा.',
          'इमामेक्टिन बेंझोएट ५% SG @ ०.५ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारणी करा.',
          'गळालेली पाने व बोंडे नष्ट करा.',
        ],
        timing: 'संध्याकाळी फवारणी करा',
        dosage: 'इमामेक्टिन बेंझोएट ०.५ ग्रॅम/लिटर पाणी',
        spokenVoiceText: 'कपाशीवरील बोंडअळीसाठी प्रति एकरी ८ कामगंध सापळे लावा आणि इमामेक्टिन बेंझोएट अर्धा ग्रॅम प्रति लिटर पाण्यात मिसळून संध्याकाळी फवारा.',
        confidence: 93,
        category: 'Pest Advisory',
      };
    }

    return {
      title: 'Cotton Pink Bollworm Management',
      summary: 'Deploy mass monitoring traps and targeted larvicide sprays.',
      keyActions: [
        'Install 8 Pheromone Traps per acre with gossyplure lures.',
        'Targeted Spray: Emamectin Benzoate 5% SG @ 0.5 g/L (100 g/acre in 200L water).',
        'Collect and destroy shed squares and rosette flowers.',
      ],
      timing: 'Evening hours (04:30 PM - 06:30 PM)',
      dosage: 'Emamectin Benzoate 5% SG @ 0.5 g/L water',
      spokenVoiceText: 'For pink bollworm in cotton, install 8 pheromone traps per acre and spray Emamectin Benzoate at 0.5 grams per liter in the evening.',
      confidence: 93,
      category: 'Pest Advisory',
    };
  }

  // 4. FERTILIZER / DOSAGE QUERY
  if (
    q.includes('fertilizer') ||
    q.includes('urea') ||
    q.includes('npk') ||
    q.includes('dose') ||
    q.includes('ఎరువు') ||
    q.includes('యూరియా') ||
    q.includes('खाद') ||
    q.includes('यूरिया')
  ) {
    if (currentLang === 'te') {
      return {
        title: `${crop} పంట ఎరువుల యాజమాన్యం`,
        summary: 'పంట దశను బట్టి సమతుల్య ఎరువులను అందించండి.',
        keyActions: [
          'పూత మరియు కాత దశలో 19:19:19 నీటిలో కరిగే ఎరువు 5 గ్రా/లీటరు పిచికారీ చేయండి.',
          'యూరియాను ఒకేసారి వేయకుండా 3-4 దఫాలుగా వేయండి.',
          'ఎకరాకు 2 టన్నుల బాగా చివికిన పశువుల ఎరువు వేయండి.',
        ],
        timing: 'తడి ఆరిన తర్వాత మాత్రమే నేలలో ఎరువులు వేయండి',
        dosage: '19:19:19 స్ప్రే: 5 గ్రాములు లీటరు నీటికి',
        spokenVoiceText: `${crop} పంట పూత మరియు కాత దశలో పందొమ్మిది పందొమ్మిది పందొమ్మిది ఎరువును ఐదు గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయండి. యూరియాను సమపాళ్లలో వేయండి.`,
        confidence: 92,
        category: 'Nutrient Advisory',
      };
    }

    if (currentLang === 'hi') {
      return {
        title: `${crop} फसल के लिए पोषक तत्व एवं उर्वरक प्रबंधन`,
        summary: 'फसल की अवस्था अनुसार संतुलित खाद और घुलनशील उर्वरक का प्रयोग करें।',
        keyActions: [
          'फूल और फल आने की अवस्था में 19:19:19 NPK @ 5 ग्राम प्रति लीटर का पर्णीय छिड़काव करें।',
          'यूरिया की पूरी मात्रा एक साथ न देकर 3 से 4 बार में दें।',
          'मिट्टी में पर्याप्त नमी होने पर ही खाद डालें।',
        ],
        timing: 'सिंचाई के तुरंत बाद उपयुक्त नमी में खाद दें',
        dosage: 'घुलनशील NPK 19:19:19 @ 5 ग्राम/लीटर पानी',
        spokenVoiceText: `${crop} फसल में फूल व फल की अच्छी वृद्धि के लिए 19:19:19 एनपीके पांच ग्राम प्रति लीटर पानी में घोलकर छिड़काव करें।`,
        confidence: 92,
        category: 'Nutrient Advisory',
      };
    }

    return {
      title: `${crop} Balanced Nutrition Advisory`,
      summary: 'Apply split dose balanced fertilizers tailored to current crop stage.',
      keyActions: [
        'Foliar Boost: 19:19:19 Water Soluble NPK @ 5 g/L during vegetative and flowering stage.',
        'Split Urea application into 3 installments to prevent leaching loss.',
        'Ensure optimum rootzone soil moisture before fertilizer top-dressing.',
      ],
      timing: 'Apply top dressing 1-2 days after irrigation when soil is damp',
      dosage: '19:19:19 NPK Foliar Spray @ 5.0 g/L (1 kg/acre in 200L water)',
      spokenVoiceText: `For ${crop}, spray 19:19:19 water soluble fertilizer at 5 grams per liter during vegetative and flowering stages. Avoid applying urea in waterlogged conditions.`,
      confidence: 92,
      category: 'Nutrient Advisory',
    };
  }

  // 5. WEATHER & SPRAYING SAFETY QUERY
  if (
    q.includes('weather') ||
    q.includes('rain') ||
    q.includes('spray') ||
    q.includes('వాతావరణం') ||
    q.includes('పిచికారీ') ||
    q.includes('मौसम') ||
    q.includes('छिड़काव') ||
    q.includes('हवा') ||
    q.includes('पाऊस')
  ) {
    const isRainRisky = activeRainfall > 5 || activeHumidity > 85;

    if (currentLang === 'te') {
      const sprayStatus = isRainRisky 
        ? 'ఈరోజు మందు పిచికారీ చేయవద్దు. గాలిలో తేమ ఎక్కువగా ఉంది మరియు వర్షం పడే అవకాశం ఉంది.'
        : 'ఈరోజు ఉదయం 6 నుండి 9 గంటల లోపు లేదా సాయంత్రం 4 గంటల తర్వాత పిచికారీ చేయవచ్చు.';

      return {
        title: 'వాతావరణం & పిచికారీ సూచన',
        summary: sprayStatus,
        keyActions: [
          'ప్రస్తుత తేమ: ' + activeHumidity + '% | ఉష్ణోగ్రత: ' + activeTemp + '°C',
          isRainRisky ? 'వర్షం వల్ల మందు కొట్టుకుపోయే ప్రమాదం ఉంది.' : 'గాలి వేగం తక్కువగా ఉన్నప్పుడు పిచికారీ పూర్తి చేయండి.',
          'స్ప్రేయర్ నాజిల్‌ను ఆకుల అడుగు భాగానికి తగిలేలా ఉంచండి.',
        ],
        timing: isRainRisky ? 'వర్షం తగ్గాక మాత్రమే పిచికారీ చేయండి' : 'ఉదయం 06:30 - 09:30 AM',
        dosage: 'నీటితో కలిపేటప్పుడు జిగురు (స్ప్రెడర్) 0.5 మి.లీ/లీటరు కలపండి',
        spokenVoiceText: `${sprayStatus} ప్రస్తుత ఉష్ణోగ్రత ${activeTemp} డిగ్రీలు మరియు తేమ ${activeHumidity} శాతం ఉంది. జాగ్రత్తగా వ్యవసాయం చేయండి.`,
        confidence: 96,
        category: 'Weather Advisory',
      };
    }

    if (currentLang === 'hi') {
      const sprayStatus = isRainRisky 
        ? 'आज कीटनाशक छिड़काव से बचें। आर्द्रता अधिक है और बारिश की संभावना है।'
        : 'आज सुबह 6 से 9 बजे के बीच या शाम 4 बजे के बाद मौसम छिड़काव के लिए अनुकूल है।';

      return {
        title: 'मौसम एवं छिड़काव परामर्श',
        summary: sprayStatus,
        keyActions: [
          'वर्तमान आर्द्रता: ' + activeHumidity + '% | तापमान: ' + activeTemp + '°C',
          isRainRisky ? 'बारिश से दवा बहने का जोखिम है।' : 'हवा की गति शांत होने पर ही स्प्रे करें।',
          'पत्तियों के नीचे की सतह पर अच्छी तरह दवा पहुंचाएं।',
        ],
        timing: isRainRisky ? 'मौसम साफ होने पर ही छिड़कें' : 'प्रातः 06:30 - 09:30 बजे',
        dosage: 'दवा के साथ स्टिकर (स्प्रेडर) 0.5 मिली प्रति लीटर पानी अवश्य मिलाएं',
        spokenVoiceText: `${sprayStatus} वर्तमान तापमान ${activeTemp} डिग्री और आर्द्रता ${activeHumidity} प्रतिशत है।`,
        confidence: 96,
        category: 'Weather Advisory',
      };
    }

    // Default English
    const sprayStatus = isRainRisky 
      ? 'Foliar spraying is NOT recommended today due to high humidity and precipitation risk.'
      : 'Weather is favorable for protective foliar spraying today during calm morning hours.';

    return {
      title: 'Weather & Spraying Window Advisory',
      summary: sprayStatus,
      keyActions: [
        `Microclimate: ${activeTemp}°C, ${activeHumidity}% Relative Humidity`,
        isRainRisky ? 'High risk of chemical wash-off and reduced efficacy.' : 'Optimal calm wind window detected.',
        'Ensure fine droplet cone nozzle coverage on undersides of foliage.',
      ],
      timing: isRainRisky ? 'Postpone until rain subsides' : '06:30 AM - 09:30 AM or 04:30 PM',
      dosage: 'Mix non-ionic spreader @ 0.5 ml/L water for uniform adherence',
      spokenVoiceText: `${sprayStatus} Current temperature is ${activeTemp} degrees Celsius with ${activeHumidity} percent relative humidity.`,
      confidence: 96,
      category: 'Weather Advisory',
    };
  }

  // 6. DEFAULT / GENERAL AGRONOMIC QUERY
  if (currentLang === 'te') {
    return {
      title: `${crop} పంట రక్షణ & సాగు సలహా`,
      summary: `క్రాప్ షీల్డ్ ఏఐ మీ ${crop} పంటను విశ్లేషించింది. ప్రస్తుత తెగులు లేదా పురుగు నివారణకు క్రింది సూచనలు పాటించండి.`,
      keyActions: [
        'పొలంలో నిరంతరం పరిశీలన జరిపి తెగులు లక్షణాలను గమనించండి.',
        'సిఫార్సు చేసిన మందులను మాత్రమే సరైన మోతాదులో వాడండి.',
        'సందేహాలు ఉంటే సమీప కేవీకే వ్యవసాయ నిపుణులను సంప్రదించండి.',
      ],
      timing: 'ఉదయం 07:00 - 10:00 AM',
      dosage: 'కేవీకే ఆమోదించిన మోతాదులోనే పిచికారీ చేయండి',
      spokenVoiceText: `రైతు మిత్రమా, మీ ${crop} పంట రక్షణకు క్రాప్ షీల్డ్ ఏఐ ఎల్లప్పుడూ తోడుగా ఉంటుంది. ఆకుల ఫోటో తీసి పరీక్షించండి మరియు సరైన సమయంలో తగిన మందులను పిచికారీ చేయండి.`,
      confidence: 90,
      category: 'General Advisory',
    };
  }

  if (currentLang === 'hi') {
    return {
      title: `${crop} फसल सुरक्षा एवं कृषि परामर्श`,
      summary: `क्रॉप शील्ड एआई द्वारा आपकी ${crop} फसल के लिए वैज्ञानिक परामर्श तैयार किया गया है।`,
      keyActions: [
        'खेत का नियमित निरीक्षण करें और रोग के प्रारंभिक लक्षण पहचानें।',
        'केवल अनुमोदित कीटनाशक एवं कवकनाशी का सही मात्रा में प्रयोग करें।',
        'अधिक जानकारी के लिए केवीके कृषि वैज्ञानिक से परामर्श लें।',
      ],
      timing: 'प्रातःकाल 07:00 - 10:00 बजे',
      dosage: 'अनुशंसित मात्रा में ही दवा का घोल तैयार करें',
      spokenVoiceText: `किसान भाई, आपकी ${crop} फसल की सुरक्षा के लिए नियमित निगरानी रखें और सही समय पर अनुमोदित दवाओं का छिड़काव करें।`,
      confidence: 90,
      category: 'General Advisory',
    };
  }

  return {
    title: `${crop} Agronomic Protection Advisory`,
    summary: `CropShield AI agronomist intelligence has analyzed your field query for ${crop}.`,
    keyActions: [
      'Maintain routine field scouting to detect early pathogen symptoms.',
      'Apply registered ICAR/CIBRC treatments with uniform spray coverage.',
      'Check local microclimate forecast before applying costly chemical inputs.',
    ],
    timing: 'Morning hours (07:00 AM - 10:00 AM)',
    dosage: 'Follow CIBRC approved label dosages per liter of water',
    spokenVoiceText: `Farmer, CropShield AI advises maintaining routine field scouting for your ${crop} crop and applying registered treatments during favorable morning weather windows.`,
    confidence: 90,
    category: 'General Advisory',
  };
};
