/**
 * CropShield AI - Vernacular Spoken Translation Engine
 * Precision Agri-Vision (Smart Agriculture & Crop Health)
 * 
 * Provides authentic, natural, crop-specific agricultural voice narration and text translations
 * across major Indian languages (Hindi, Telugu, Tamil, Marathi, Punjabi, Bengali, Gujarati, Kannada, English).
 */

export const INDIAN_LANGUAGES = [
  { code: 'te', name: 'తెలుగు (Telugu)', voiceCode: 'te-IN' },
  { code: 'hi', name: 'हिंदी (Hindi)', voiceCode: 'hi-IN' },
  { code: 'mr', name: 'मराठी (Marathi)', voiceCode: 'mr-IN' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)', voiceCode: 'pa-IN' },
  { code: 'ta', name: 'தமிழ் (Tamil)', voiceCode: 'ta-IN' },
  { code: 'bn', name: 'বাংলা (Bengali)', voiceCode: 'bn-IN' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)', voiceCode: 'gu-IN' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', voiceCode: 'kn-IN' },
  { code: 'en', name: 'English (Indian Accent)', voiceCode: 'en-IN' },
];

/**
 * Generates specialized, crop-and-disease-tailored actions in all supported languages.
 */
export const getVernacularAdvisory = (langCode, diseaseInfo = {}, customSteps = []) => {
  const crop = diseaseInfo.crop || 'Crop';
  const disease = diseaseInfo.condition || diseaseInfo.diseaseName || diseaseInfo.activeDisease || 'Disease';
  const confidence = diseaseInfo.confidence || 92;
  const risk = diseaseInfo.riskLevel || diseaseInfo.severity || 'High';

  const cleanCrop = (crop || '').toLowerCase();
  const cleanDisease = (disease || '').toLowerCase();

  // -------------------------------------------------------------
  // INVALID SPECIMEN HANDLING (ID Card, Document, Non-plant image)
  // -------------------------------------------------------------
  if (diseaseInfo.isInvalidSpecimen) {
    if (langCode === 'te') {
      return {
        greeting: 'రైతు సోదరులకు ముఖ్య గమనిక.',
        diagnosisText: 'ఈ చిత్రంలో పంట ఆకులు లేదా మొక్కల భాగాలు గుర్తించబడలేదు.',
        practicalSummary: 'మీరు అప్‌లోడ్ చేసిన చిత్రం గుర్తింపు కార్డు (ID card) లేదా మొక్కలు కాని వస్తువుగా గుర్తించబడింది. క్రాప్ షీల్డ్ ఏఐ కేవలం వ్యవసాయ పంటల ఆకులను మాత్రమే విశ్లేషిస్తుంది.',
        spokenSteps: [
          'దయచేసి మీ పంట ఆకును దగ్గరగా స్పష్టంగా ఫోటో తీయండి.',
          'మంచి వెలుతురులో ఆకుల మచ్చలు మరియు ఈనెలు స్పష్టంగా కనిపించేలా చూడండి.',
          'గుర్తింపు కార్డులు లేదా కాగితపు పత్రాల ఫోటోలు అప్‌లోడ్ చేయవద్దు.',
          'సరైన పంట ఫోటోతో తిరిగి పరీక్షించి సరైన సలహాను పొందండి.',
        ],
        conclusion: 'మరింత సహాయం కోసం సమీప కృషి విజ్ఞాన కేంద్రం (KVK) ను సంప్రదించండి.',
      };
    }
    if (langCode === 'hi') {
      return {
        greeting: 'किसान भाइयों ध्यान दें।',
        diagnosisText: 'इस तस्वीर में फसल की पत्तियां या पौधे के लक्षण नहीं पाए गए हैं।',
        practicalSummary: 'अपलोड की गई फोटो आईडी कार्ड, दस्तावेज या गैर-कृषि वस्तु प्रतीत होती है। क्रॉप शील्ड एआई केवल कृषि फसलों की पत्तियों का विश्लेषण करता है।',
        spokenSteps: [
          'कृपया फसल की रोगग्रस्त या स्वस्थ पत्ती की साफ और नजदीकी फोटो लें।',
          'पर्याप्त धूप में पत्ती की शिराएं और धब्बे स्पष्ट दिखने चाहिए।',
          'आईडी कार्ड, कागजात या अन्य वस्तुओं की तस्वीरें अपलोड न करें।',
          'सही फसल की फोटो दोबारा अपलोड करके सही उपचार सलाह प्राप्त करें।',
        ],
        conclusion: 'सटीक सलाह के लिए नजदीकी कृषि विज्ञान केंद्र (KVK) से संपर्क करें।',
      };
    }
    return {
      greeting: 'Attention Farmer.',
      diagnosisText: 'Scan stopped: No agricultural crop leaves or plant foliage detected.',
      practicalSummary: 'The uploaded image appears to be an ID card, paper document, or non-plant object. CropShield AI only analyzes agricultural plant specimens.',
      spokenSteps: [
        'Take a clear, well-lit close-up photo of your crop leaf or foliage.',
        'Ensure leaf veins and disease lesions are in sharp focus.',
        'Do not upload ID cards, documents, screenshots, or indoor objects.',
        'Upload your genuine crop leaf photo to receive certified agricultural advisory.',
      ],
      conclusion: 'For further assistance, consult your local KVK or Agriculture Department.',
    };
  }

  // Identify crop category
  let category = 'tomato';
  if (cleanCrop.includes('wheat')) {
    category = 'wheat';
  } else if (cleanCrop.includes('cotton')) {
    category = 'cotton';
  } else if (cleanCrop.includes('chilli') || cleanCrop.includes('pepper') || cleanCrop.includes('chili')) {
    category = 'chilli';
  } else if (cleanCrop.includes('rice') || cleanCrop.includes('paddy')) {
    category = 'rice';
  } else if (cleanCrop.includes('maize') || cleanCrop.includes('corn')) {
    category = 'maize';
  } else if (cleanCrop.includes('potato')) {
    category = 'potato';
  }

  // -------------------------------------------------------------
  // ENGLISH (INDIAN ACCENT)
  // -------------------------------------------------------------
  if (langCode === 'en') {
    // If custom tailored steps were supplied from DiseaseDetection.jsx, use them
    if (customSteps && customSteps.length > 0) {
      return {
        greeting: 'Hello Farmer. Welcome to CropShield AI Crop Protection Advisory.',
        diagnosisText: `Diagnostic scan detected ${disease} on your ${crop} with ${confidence}% model confidence. Risk Level: ${risk}.`,
        practicalSummary: `Targeted agronomic action is required immediately for ${crop} to prevent yield decline.`,
        spokenSteps: customSteps,
        conclusion: 'For complex cases, escalate directly to accredited KVK Pathology laboratories.',
      };
    }

    if (category === 'wheat') {
      return {
        greeting: 'Hello Farmer. Welcome to CropShield AI Crop Protection Advisory.',
        diagnosisText: `Diagnostic scan detected ${disease} on your Wheat crop with ${confidence}% model confidence. Risk Level: ${risk}.`,
        practicalSummary: 'Foliar rust pustules and fungal spore pressure identified on wheat canopy.',
        spokenSteps: [
          'Inspect flag leaves and earheads for bright yellow or orange powdery rust pustule stripes.',
          'Immediately spray systemic triazole fungicide Propiconazole 25% EC (Tilt) @ 1.0 ml/L or Tebuconazole @ 1.0 ml/L water.',
          'Stop excess urea and nitrogen top-dressing; apply Muriate of Potash (MOP) to harden cell walls.',
          'Spray during calm morning hours with a clean knapsack sprayer using 200 liters of water per acre.',
        ],
        conclusion: 'For complex cases, escalate directly to accredited KVK or PAU Wheat Pathology teams.',
      };
    }

    if (category === 'cotton') {
      return {
        greeting: 'Hello Farmer. Welcome to CropShield AI Crop Protection Advisory.',
        diagnosisText: `Diagnostic scan detected ${disease} on your Cotton crop with ${confidence}% model confidence. Risk Level: ${risk}.`,
        practicalSummary: 'Bacterial water-soaked lesions or virus vector symptoms identified on cotton foliage.',
        spokenSteps: [
          'Rogue out stunted, virus-infected cotton plants and broadleaf weed hosts from field borders.',
          'For Bacterial Blight, spray Copper Oxychloride 50% WP @ 2.5 g/L + Streptocycline @ 100 ppm (1g in 10L water).',
          'For Leaf Curl (CLCuV), suppress whitefly vectors by spraying Pyriproxyfen 10% EC @ 2.0 ml/L or Diafenthiuron @ 1.2 g/L.',
          'Spray thoroughly on the undersides of leaves during late afternoon and wear protective gloves and mask.',
        ],
        conclusion: 'For severe boll or foliage damage, consult your nearest CICR or KVK Cotton specialist.',
      };
    }

    if (category === 'chilli') {
      return {
        greeting: 'Hello Farmer. Welcome to CropShield AI Crop Protection Advisory.',
        diagnosisText: `Diagnostic scan detected ${disease} on your Chilli crop with ${confidence}% model confidence. Risk Level: ${risk}.`,
        practicalSummary: 'Anthracnose fruit rot lesions or thrips-borne leaf curl identified in chilli field.',
        spokenSteps: [
          'Pick and destroy sunken anthracnose fruit-rot pods and die-back infected twigs away from the field.',
          'Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top) @ 1.0 ml/L or Mancozeb 75% WP @ 2.5 g/L.',
          'For leaf curl, install 15 blue sticky traps/acre and spray Diafenthiuron 50% WP @ 1.2 g/L against thrips and mites.',
          'Avoid standing furrow water and ensure complete spray coverage on developing fruit bunches.',
        ],
        conclusion: 'Consult local Spice Board or KVK Agronomist for certified residue-free export spray schedules.',
      };
    }

    if (category === 'rice') {
      return {
        greeting: 'Hello Farmer. Welcome to CropShield AI Crop Protection Advisory.',
        diagnosisText: `Diagnostic scan detected ${disease} on your Rice crop with ${confidence}% model confidence. Risk Level: ${risk}.`,
        practicalSummary: 'Blast spindle lesions or bacterial leaf blighting observed in paddy field.',
        spokenSteps: [
          'Drain standing water from blast-infected paddy plots for 24–48 hours to arrest fungal mycelial spread.',
          'Spray Tricyclazole 75% WP @ 0.6 g/L (120 g/acre) or Kasugamycin 3% SL @ 2.5 ml/L at early tillering.',
          'Postpone nitrogen top-dressing; apply potash @ 20 kg/acre to strengthen silica epidermal resistance.',
          'Maintain clean field bunds and destroy wild weed hosts around the paddy perimeter.',
        ],
        conclusion: 'For neck blast or sheath rot escalation, contact your district ICAR-NRRI or KVK center.',
      };
    }

    if (category === 'maize') {
      return {
        greeting: 'Hello Farmer. Welcome to CropShield AI Crop Protection Advisory.',
        diagnosisText: `Diagnostic scan detected ${disease} on your Maize crop with ${confidence}% model confidence. Risk Level: ${risk}.`,
        practicalSummary: 'Foliar blight lesions or rust pustules identified across mid-canopy corn leaves.',
        spokenSteps: [
          'Inspect upper leaf whorls and mid-canopy for elongated elliptical gray-green blight lesions.',
          'Spray Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L.',
          'For Fall Armyworm in whorls, apply Emamectin Benzoate 5% SG @ 0.4 g/L directed into leaf whorls.',
          'Deep plough post-harvest stubble to bury infected corn residue below 15 cm soil depth.',
        ],
        conclusion: 'For recurring armyworm or blight infestations, contact your local KVK agronomist.',
      };
    }

    // Default Tomato
    return {
      greeting: 'Hello Farmer. Welcome to CropShield AI Crop Protection Advisory.',
      diagnosisText: `Diagnostic scan detected ${disease} on your Tomato with ${confidence}% model confidence. Risk Level: ${risk}.`,
      practicalSummary: 'Foliar lesions and blighting identified. Immediate multi-tier intervention is advised.',
      spokenSteps: [
        'Prune and destroy infected lower foliage showing concentric target-board lesions up to 15 cm from soil.',
        'For Late Blight (Phytophthora), spray Cymoxanil 8% + Mancozeb 64% WP @ 2.0 g/L or Dimethomorph 50% WP @ 1.0 g/L.',
        'Stop overhead sprinkler irrigation; switch to drip or furrow irrigation to keep foliage dry.',
        'Apply bio-control agent Trichoderma harzianum @ 5g/L around root zone after chemical intervention.',
      ],
      conclusion: 'For complex cases, escalate directly to accredited KVK Pathology laboratories.',
    };
  }

  // -------------------------------------------------------------
  // HINDI
  // -------------------------------------------------------------
  if (langCode === 'hi') {
    if (category === 'wheat') {
      return {
        greeting: 'नमस्ते किसान भाइयों। क्रॉप शील्ड एआई गेहूं फसल सुरक्षा सलाह।',
        diagnosisText: `आपकी गेहूं की फसल में ${disease} के लक्षण ${confidence}% सटीकता के साथ पाए गए हैं। जोखिम स्तर: ${risk}.`,
        practicalSummary: 'गेहूं के पत्तों और बालियों पर पीला या भूरा रतुआ (रस्ट) फफूंद का प्रकोप देखा गया है।',
        spokenSteps: [
          'गेहूं के झंडा पत्तों और बालियों पर पीले या नारंगी रंग के रतुआ पाउडर धब्बों की तुरंत जांच करें।',
          'प्रोपिकोनाज़ोल 25% ईसी (टिल्ट) 1 मिली प्रति लीटर या टेबुकोनाज़ोल 1 मिली प्रति लीटर पानी में मिलाकर तुरंत छिड़काव करें।',
          'यूरिया (नाइट्रोजन) का अधिक प्रयोग रोकें और पोटाश खाद देकर पौधों की रोग प्रतिरोधक क्षमता बढ़ाएं।',
          'सुबह के शांत समय में मास्क पहनकर 200 लीटर पानी प्रति एकड़ की दर से समान रूप से छिड़काव करें।',
        ],
        conclusion: 'कठिन मामलों में तुरंत कृषि विज्ञान केंद्र (KVK) या गेहूं अनुसंधान निदेशालय से संपर्क करें।',
      };
    }

    if (category === 'cotton') {
      return {
        greeting: 'नमस्ते किसान भाइयों। क्रॉप शील्ड एआई कपास सुरक्षा सलाह।',
        diagnosisText: `आपकी कपास की फसल में ${disease} के लक्षण ${confidence}% सटीकता के साथ पाए गए हैं। जोखिम स्तर: ${risk}.`,
        practicalSummary: 'कपास की पत्तियों पर जीवाणु झुलसा या पत्ता मरोड़ वायरस के लक्षण पाए गए हैं।',
        spokenSteps: [
          'खेत की मेड़ों से रोगग्रस्त पौधे और खरपतवार (कांगनी, कंघी) उखाड़कर तुरंत नष्ट करें।',
          'जीवाणु झुलसा (बैक्टीरियल ब्लाइट) के लिए कॉपर ऑक्सीक्लोराइड 2.5 ग्राम + स्ट्रेप्टोसाइक्लिन 1 ग्राम प्रति 10 लीटर पानी में मिलाकर छिड़कें।',
          'पत्ता मरोड़ वायरस (CLCuV) फैलाने वाली सफेद मक्खी के नियंत्रण हेतु पाइरीप्रॉक्सीफेन 2 मिली प्रति लीटर का छिड़काव करें।',
          'पत्तियों की निचली सतह पर अच्छी तरह शाम के समय मास्क व दस्ताने पहनकर छिड़काव करें।',
        ],
        conclusion: 'अधिक प्रकोप की स्थिति में निकटतम कपास अनुसंधान संस्थान या KVK से सलाह लें।',
      };
    }

    if (category === 'chilli') {
      return {
        greeting: 'नमस्ते किसान भाइयों। क्रॉप शील्ड एआई मिर्च फसल सुरक्षा सलाह।',
        diagnosisText: `आपकी मिर्च की फसल में ${disease} के लक्षण ${confidence}% सटीकता के साथ पाए गए हैं। जोखिम स्तर: ${risk}.`,
        practicalSummary: 'मिर्च में फल सड़न (एंथ्रेक्नोज) या पत्ता मरोड़ (चुर्रा-मुर्रा) का प्रकोप देखा गया है।',
        spokenSteps: [
          'मिर्च में फल सड़न से ग्रसित सूखे फल और काली टहनियों को तोड़कर खेत से बाहर नष्ट करें।',
          'कवक नियंत्रण के लिए एज़ोक्सीस्ट्रोबिन + डाइफेनोकोनाज़ोल 1 मिली प्रति लीटर या मैंकोज़ेब 2.5 ग्राम प्रति लीटर पानी में मिलाकर छिड़कें।',
          'पत्ता मरोड़ और थ्रिप्स/माइट्स के नियंत्रण हेतु प्रति एकड़ 15 नीले-पीले ट्रैप लगाएं और डायफेंथियूरॉन 1.2 ग्राम प्रति लीटर छिड़कें।',
          'क्यारियों में पानी खड़ा न रहने दें और फल बनने की अवस्था में समान छिड़काव सुनिश्चित करें।',
        ],
        conclusion: 'निर्यात गुणवत्ता हेतु अवशेष-मुक्त छिड़काव के लिए KVK मिर्च विशेषज्ञ से परामर्श लें।',
      };
    }

    if (category === 'rice') {
      return {
        greeting: 'नमस्ते किसान भाइयों। क्रॉप शील्ड एआई धान फसल सुरक्षा सलाह।',
        diagnosisText: `आपकी धान की फसल में ${disease} के लक्षण ${confidence}% सटीकता के साथ पाए गए हैं। जोखिम स्तर: ${risk}.`,
        practicalSummary: 'धान की फसल में झुलसा (ब्लास्ट) या जीवाणु पत्ती झुलसा का संक्रमण देखा गया है।',
        spokenSteps: [
          'धान के खेत से 24 से 48 घंटे के लिए जमा हुआ पानी निकाल दें ताकि फसल में नमी और फफूंद का फैलाव कम हो।',
          'झुलसा (ब्लास्ट) रोग के नियंत्रण हेतु ट्राईसाइक्लाज़ोल 75% डब्ल्यूपी 0.6 ग्राम प्रति लीटर पानी (120 ग्राम/एकड़) का छिड़काव करें।',
          'यूरिया का छिड़काव तुरंत रोकें और पोटाश 20 किग्रा प्रति एकड़ देकर धान के तनों को मजबूत बनाएं।',
          'खेत की मेड़ों से खरपतवार हटाएं ताकि बीमारी के कीटाणु दोबारा फसल में न फैलें।',
        ],
        conclusion: 'गर्दन तोड़ (नेक ब्लास्ट) की स्थिति में तुरंत नजदीकी कृषि विज्ञान केंद्र से संपर्क करें।',
      };
    }

    if (category === 'maize') {
      return {
        greeting: 'नमस्ते किसान भाइयों। क्रॉप शील्ड एआई मक्का सुरक्षा सलाह।',
        diagnosisText: `आपकी मक्का की फसल में ${disease} के लक्षण ${confidence}% सटीकता के साथ पाए गए हैं। जोखिम स्तर: ${risk}.`,
        practicalSummary: 'मक्का के पत्तों पर पत्ती झुलसा या फॉल आर्मीवॉर्म का प्रभाव देखा गया है।',
        spokenSteps: [
          'मक्का की पत्तियों पर लंबे धूसर-हरे झुलसा धब्बों और तने के पास भूरे रतुआ के लक्षणों की निगरानी करें।',
          'पत्ती झुलसा के लिए मैंकोज़ेब 2.5 ग्राम या एज़ोक्सीस्ट्रोबिन 1 मिली प्रति लीटर पानी में मिलाकर घुटने तक की ऊंचाई पर छिड़कें।',
          'फॉल आर्मीवॉर्म सुंडी दिखने पर इमामेक्टिन बेंजोएट 0.4 ग्राम या कोराजन 0.4 मिली प्रति लीटर पोंगे में डालें।',
          'कटाई के बाद खेत की गहरी जुताई करें ताकि मिट्टी में छिपे फफूंद के जीवाणु नष्ट हो सकें।',
        ],
        conclusion: 'आर्मीवॉर्म नियंत्रण हेतु नजदीकी KVK वैज्ञानिक से संपर्क करें।',
      };
    }

    // Tomato
    return {
      greeting: 'नमस्ते किसान भाइयों। क्रॉप शील्ड एआई टमाटर सुरक्षा सलाह।',
      diagnosisText: `आपकी टमाटर की फसल में ${disease} के लक्षण ${confidence}% सटीकता के साथ पाए गए हैं। जोखिम स्तर: ${risk}.`,
      practicalSummary: 'टमाटर की पत्तियों पर झुलसा और फफूंद के लक्षण देखे गए हैं।',
      spokenSteps: [
        'टमाटर के पौधों की निचली संक्रमित पत्तियों को 15 सेमी ऊंचाई तक काटकर खेत से बाहर नष्ट करें।',
        'पिछेता झुलसा (लेट ब्लाइट) के लिए साइमोक्सानिल + मैंकोज़ेब 2 ग्राम प्रति लीटर या डाइमेथोमॉर्फ 1 ग्राम प्रति लीटर का छिड़काव करें।',
        'फव्वारा सिंचाई बंद करें; पत्तियों को सूखा रखने के लिए केवल ड्रिप या नाली द्वारा सिंचाई करें।',
        'मिट्टी जनित संक्रमण रोकने हेतु ट्राइकोडर्मा 5 ग्राम प्रति लीटर की दर से जड़ों के पास दें।',
      ],
      conclusion: 'कठिन मामलों में तुरंत कृषि विज्ञान केंद्र (KVK) के वैज्ञानिकों से संपर्क करें।',
    };
  }

  // -------------------------------------------------------------
  // TELUGU
  // -------------------------------------------------------------
  if (langCode === 'te') {
    if (category === 'wheat') {
      return {
        greeting: 'రైతు సోదరులకు నమస్కారం. క్రాప్ షీల్డ్ ఏఐ గోధుమ పంట రక్షణ సలహా.',
        diagnosisText: `మీ గోధుమ పంటలో ${disease} లక్షణాలు ${confidence}% ఖచ్చితత్వంతో గుర్తించబడ్డాయి. ప్రమాద స్థాయి: ${risk}.`,
        practicalSummary: 'గోధుమ ఆకులపై మరియు కంకులపై పసుపు తుప్పు తెగులు వ్యాప్తి చెందుతున్నది.',
        spokenSteps: [
          'గోధుమ ఆకులపై పొడవాటి పసుపు లేదా నారింజ రంగు తుప్పు పొడి మచ్చలను గమనించండి.',
          'ఎకరాకు ప్రొపికోనాజోల్ 25% EC 200 మి.లీ లేదా టెబుకోనాజోల్ మందును లీటరు నీటికి 1 మి.లీ చొప్పున కలిపి పిచికారీ చేయండి.',
          'యూరియా వాడకాన్ని తగ్గించి, పొటాష్ ఎరువును వేయడం ద్వారా పైరుకు వ్యాధి నిరోధక శక్తిని పెంచండి.',
          'ఉదయం పూట గాలి తక్కువగా ఉన్నప్పుడు రక్షణ మాస్క్ ధరించి 200 లీటర్ల నీటితో పిచికారీ చేయండి.',
        ],
        conclusion: 'మరిన్ని వివరాల కోసం సమీప కృషి విజ్ఞాన కేంద్రం (KVK) నిపుణులను సంప్రదించండి.',
      };
    }

    if (category === 'cotton') {
      return {
        greeting: 'రైతు సోదరులకు నమస్కారం. క్రాప్ షీల్డ్ ఏఐ పత్తి పంట రక్షణ సలహా.',
        diagnosisText: `మీ పత్తి పంటలో ${disease} లక్షణాలు ${confidence}% ఖచ్చితత్వంతో గుర్తించబడ్డాయి. ప్రమాద స్థాయి: ${risk}.`,
        practicalSummary: 'పత్తిలో బాక్టీరియల్ ఆకుమచ్చ లేదా ఆకుముడత వైరస్ లక్షణాలు కనిపించాయి.',
        spokenSteps: [
          'చేనులో వైరస్ సోకిన మొక్కలను, కలుపు మొక్కలను పీకి పొలం బయట కాల్చివేయండి.',
          'బాక్టీరియల్ ఆకుమచ్చ తెగులు నివారణకు కాపర్ ఆక్సిక్లోరైడ్ 2.5 గ్రాములు + స్ట్రెప్టోసైక్లిన్ 1 గ్రాము 10 లీటర్ల నీటిలో కలిపి పిచికారీ చేయండి.',
          'తెల్లదోమ వ్యాప్తిని అరికట్టడానికి పైరిప్రాక్సిఫెన్ 2 మి.లీ లేదా డయాఫెంథియురాన్ 1.2 గ్రాము లీటరు నీటికి పిచికారీ చేయండి.',
          'ఆకుల అడుగు భాగాన మందు బాగా తడిసేలా సాయంత్రం వేళల్లో రక్షణ దుస్తులతో పిచికారీ చేయండి.',
        ],
        conclusion: 'తీవ్రత ఎక్కువగా ఉంటే స్థానిక KVK పత్తి శాస్త్రవేత్తలను సంప్రదించండి.',
      };
    }

    if (category === 'chilli') {
      return {
        greeting: 'రైతు సోదరులకు నమస్కారం. క్రాప్ షీల్డ్ ఏఐ మిరప పంట రక్షణ సలహా.',
        diagnosisText: `మీ మిరప పంటలో ${disease} లక్షణాలు ${confidence}% ఖచ్చితత్వంతో గుర్తించబడ్డాయి. ప్రమాద స్థాయి: ${risk}.`,
        practicalSummary: 'మిరప తోటలో కొమ్మ ఎండు, కాయ కుళ్లు లేదా బొబ్బర ముడత తెగులు వ్యాప్తి చెందుతున్నది.',
        spokenSteps: [
          'మిరప తోటలో కొమ్మ ఎండు తెగులు మరియు కాయ కుళ్లు సోకిన కాయలను ఏరివేసి నాశనం చేయండి.',
          'శిలీంద్ర నివారణకు అజాక్సిస్ట్రోబిన్ + డైఫెనోకోనాజోల్ 1 మి.లీ లేదా మాంకోజెబ్ 2.5 గ్రాములు లీటరు నీటికి కలిపి పిచికారీ చేయండి.',
          'తామర పురుగులు మరియు నల్లి నివారణకు ఎకరాకు 15 నీలం అట్టలు అమర్చి, డయాఫెంథియురాన్ 1.2 గ్రాములు పిచికారీ చేయండి.',
          'పాదుల వద్ద నీరు నిలవకుండా చూసుకోండి మరియు కాయల గుత్తులు తడిసేలా పిచికారీ చేయండి.',
        ],
        conclusion: 'మరిన్ని వివరాల కోసం సమీప కృషి విజ్ఞాన కేంద్రం (KVK) మిరప నిపుణులను సంప్రదించండి.',
      };
    }

    if (category === 'rice') {
      return {
        greeting: 'రైతు సోదరులకు నమస్కారం. క్రాప్ షీల్డ్ ఏఐ వరి పంట రక్షణ సలహా.',
        diagnosisText: `మీ వరి పంటలో ${disease} లక్షణాలు ${confidence}% ఖచ్చితత్వంతో గుర్తించబడ్డాయి. ప్రమాద స్థాయి: ${risk}.`,
        practicalSummary: 'వరి చేనులో అగ్గి తెగులు లేదా బాక్టీరియల్ ఆకు ఎండు తెగులు కనిపించింది.',
        spokenSteps: [
          'వరి చేనులో అగ్గి తెగులు తీవ్రత తగ్గించడానికి చేనులోని నీటిని ఒకటి లేదా రెండు రోజులు తీసివేయండి.',
          'అగ్గి తెగులు నివారణకు ట్రైసైక్లజోల్ 75% WP 0.6 గ్రాములు (ఎకరాకు 120 గ్రాములు) లీటరు నీటికి కలిపి పిచికారీ చేయండి.',
          'యూరియా ఎరువును తాత్కాలికంగా ఆపి, ఎకరాకు 20 కిలోల పొటాష్ వేసి మొక్కలకు బలాన్నివ్వండి.',
          'గట్లపై ఉన్న గడ్డి కలుపు మొక్కలను తొలగించి తెగులు పునరుత్పత్తిని అరికట్టండి.',
        ],
        conclusion: 'కంకి అగ్గి తెగులు సోకినప్పుడు వెంటనే వ్యవసాయ అధికారులను సంప్రదించండి.',
      };
    }

    // Tomato default
    return {
      greeting: 'రైతు సోదరులకు నమస్కారం. క్రాప్ షీల్డ్ ఏఐ టమాట పంట రక్షణ సలహా.',
      diagnosisText: `మీ టమాట పంటలో ${disease} లక్షణాలు ${confidence}% ఖచ్చితత్వంతో గుర్తించబడ్డాయి. ప్రమాద స్థాయి: ${risk}.`,
      practicalSummary: 'టమాట ఆకులపై మాడ తెగులు లక్షణాలు కనిపించాయి.',
      spokenSteps: [
        'టమాట మొక్కల క్రింది భాగంలో మచ్చలున్న ఆకులను 15 సెం.మీ ఎత్తు వరకు కత్తిరించి కాల్చివేయండి.',
        'లేట్ బ్లైట్ తెగులు నివారణకు సైమోక్సానిల్ + మాంకోజెబ్ 2 గ్రాములు లేదా డైమెథోమార్ఫ్ 1 గ్రాము లీటరు నీటికి కలిపి పిచికారీ చేయండి.',
        'ఆకులు తడవకుండా ఉండేందుకు తుంపర సేద్యం కాకుండా బిందు సేద్యం (డ్రిప్) మాత్రమే ఉపయోగించండి.',
        'భూమి ద్వారా వ్యాపించే తెగుళ్లను అరికట్టడానికి ట్రైకోడెర్మా విరిడే 5 గ్రాములు లీటరు నీటికి పాదుల వద్ద పోయండి.',
      ],
      conclusion: 'మరిన్ని వివరాల కోసం సమీప కృషి విజ్ఞాన కేంద్రం (KVK) నిపుణులను సంప్రదించండి.',
    };
  }

  // -------------------------------------------------------------
  // PUNJABI
  // -------------------------------------------------------------
  if (langCode === 'pa') {
    if (category === 'wheat') {
      return {
        greeting: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ। ਕ੍ਰੌਪ ਸ਼ੀਲਡ ਏਆਈ ਕਣਕ ਸੁਰੱਖਿਆ ਸਲਾਹ।',
        diagnosisText: `ਤੁਹਾਡੀ ਕਣਕ ਦੀ ਫਸਲ ਵਿੱਚ ${disease} ਦੇ ਲੱਛਣ ${confidence}% ਸ਼ੁੱਧਤਾ ਨਾਲ ਪਾਏ ਗਏ ਹਨ। ਖਤਰੇ ਦਾ ਪੱਧਰ: ${risk}.`,
        practicalSummary: 'ਕਣਕ ਦੇ ਪੱਤਿਆਂ ਉੱਤੇ ਪੀਲੀ ਕੁੰਗੀ ਜਾਂ ਭੂਰੀ ਕੁੰਗੀ ਦਾ ਹਮਲਾ ਦੇਖਿਆ ਗਿਆ ਹੈ।',
        spokenSteps: [
          'ਕਣਕ ਦੇ ਪੱਤਿਆਂ ਅਤੇ ਸਿੱਟਿਆਂ \'ਤੇ ਪੀਲੀ ਕੁੰਗੀ ਦੇ ਪਾਊਡਰ ਵਰਗੇ ਨਿਸ਼ਾਨਾਂ ਦੀ ਤੁਰੰਤ ਜਾਂਚ ਕਰੋ।',
          'ਤੁਰੰਤ ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ 25% ਈਸੀ (ਟਿਲਟ) 1 ਮਿਲੀ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।',
          'ਯੂਰੀਆ ਖਾਦ ਦੀ ਵੱਧ ਵਰਤੋਂ ਬੰਦ ਕਰੋ ਅਤੇ ਪੋਟਾਸ਼ ਪਾ ਕੇ ਫਸਲ ਦੀ ਸਹਿਣਸ਼ੀਲਤਾ ਵਧਾਓ।',
          'ਸਵੇਰ ਦੇ ਸ਼ਾਂਤ ਸਮੇਂ ਮੂੰਹ \'ਤੇ ਮਾਸਕ ਪਾ ਕੇ 200 ਲੀਟਰ ਪਾਣੀ ਪ੍ਰਤੀ ਏਕੜ ਨਾਲ ਸਪਰੇਅ ਕਰੋ।',
        ],
        conclusion: 'ਪੀਲੀ ਕੁੰਗੀ ਦੇ ਹਮਲੇ ਦੀ ਸੂਰਤ ਵਿੱਚ ਨੇੜਲੇ ਕੇਵੀਕੇ ਜਾਂ ਪੀਏਯੂ ਲੁਧਿਆਣਾ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।',
      };
    }

    if (category === 'cotton') {
      return {
        greeting: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ। ਕ੍ਰੌਪ ਸ਼ੀਲਡ ਏਆਈ ਨਰਮਾ/ਕਪਾਹ ਸੁਰੱਖਿਆ ਸਲਾਹ।',
        diagnosisText: `ਤੁਹਾਡੇ ਨਰਮੇ ਦੀ ਫਸਲ ਵਿੱਚ ${disease} ਦੇ ਲੱਛਣ ${confidence}% ਸ਼ੁੱਧਤਾ ਨਾਲ ਪਾਏ ਗਏ ਹਨ। ਖਤਰੇ ਦਾ ਪੱਧਰ: ${risk}.`,
        practicalSummary: 'ਨਰਮੇ ਵਿੱਚ ਪੱਤਾ ਮਰੋੜ ਰੋਗ ਜਾਂ ਬੈਕਟੀਰੀਅਲ ਬਲਾਈਟ ਦੇ ਲੱਛਣ ਮਿਲੇ ਹਨ।',
        spokenSteps: [
          'ਖੇਤ ਦੀਆਂ ਵੱਟਾਂ ਤੋਂ ਪੱਤਾ ਮਰੋੜ ਵਾਲੇ ਬੂਟਿਆਂ ਅਤੇ ਨਦੀਨਾਂ ਨੂੰ ਪੁੱਟ ਕੇ ਸਾੜ ਦਿਓ।',
          'ਬੈਕਟੀਰੀਅਲ ਬਲਾਈਟ ਲਈ ਕਾਪਰ ਆਕਸੀਕਲੋਰਾਈਡ 2.5 ਗ੍ਰਾਮ + ਸਟ੍ਰੈਪਟੋਸਾਈਕਲੀਨ 1 ਗ੍ਰਾਮ ਪ੍ਰਤੀ 10 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਛਿੜਕੋ।',
          'ਚਿੱਟੀ ਮੱਖੀ ਦੇ ਹਮਲੇ ਨੂੰ ਰੋਕਣ ਲਈ ਪਾਈਰੀਪ੍ਰੌਕਸੀਫੇਨ 2 ਮਿ.ਲੀ. ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਦੇ ਹਿਸਾਬ ਨਾਲ ਸਪਰੇਅ ਕਰੋ।',
          'ਪੱਤਿਆਂ ਦੇ ਹੇਠਲੇ ਪਾਸੇ ਸ਼ਾਮ ਵੇਲੇ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਪਰੇਅ ਕਰੋ ਅਤੇ ਸੁਰੱਖਿਆ ਮਾਸਕ ਦੀ ਵਰਤੋਂ ਕਰੋ।',
        ],
        conclusion: 'ਵਧੇਰੇ ਸਲਾਹ ਲਈ ਜ਼ਿਲ੍ਹੇ ਦੇ ਕ੍ਰਿਸ਼ੀ ਵਿਗਿਆਨ ਕੇਂਦਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।',
      };
    }

    if (category === 'chilli') {
      return {
        greeting: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ। ਕ੍ਰੌਪ ਸ਼ੀਲਡ ਏਆਈ ਮਿਰਚ ਸੁਰੱਖਿਆ ਸਲਾਹ।',
        diagnosisText: `ਤੁਹਾਡੀ ਮਿਰਚ ਦੀ ਫਸਲ ਵਿੱਚ ${disease} ਦੇ ਲੱਛਣ ${confidence}% ਸ਼ੁੱਧਤਾ ਨਾਲ ਪਾਏ ਗਏ ਹਨ। ਖਤਰੇ ਦਾ ਪੱਧਰ: ${risk}.`,
        practicalSummary: 'ਮਿਰਚਾਂ ਵਿੱਚ ਫਲ ਗਲਣ ਜਾਂ ਮਰੋੜੀਆ ਰੋਗ ਦੇ ਲੱਛਣ ਦਿਖਾਈ ਦਿੱਤੇ ਹਨ।',
        spokenSteps: [
          'ਮਿਰਚਾਂ ਦੇ ਸੁੱਕੇ ਅਤੇ ਦਾਗੀ ਫਲਾਂ ਨੂੰ ਤੋੜ ਕੇ ਖੇਤ ਵਿੱਚੋਂ ਬਾਹਰ ਕੱਢ ਕੇ ਦੱਬ ਦਿਓ।',
          'ਉੱਲੀ ਰੋਕਥਾਮ ਲਈ ਐਜ਼ੋਕਸੀਸਟ੍ਰੋਬਿਨ 1 ਮਿਲੀ ਜਾਂ ਮੈਨਕੋਜ਼ੇਬ 2.5 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।',
          'ਮਰੋੜੀਆ ਰੋਗ ਅਤੇ ਥ੍ਰਿਪਸ ਦੀ ਰੋਕਥਾਮ ਲਈ ਡਾਇਫੈਂਥੀਯੂਰੋਨ 1.2 ਗ੍ਰਾਮ ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਸਪਰੇਅ ਕਰੋ।',
          'ਖੇਤ ਵਿੱਚ 15 ਪੀਲੇ ਅਤੇ ਨੀਲੇ ਚਿਪਕਵੇਂ ਟਰੈਪ ਪ੍ਰਤੀ ਏਕੜ ਲਗਾਓ।',
        ],
        conclusion: 'ਕਿਸੇ ਵੀ ਸ਼ੰਕੇ ਲਈ ਕੇਵੀਕੇ ਦੇ ਮਾਹਿਰਾਂ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।',
      };
    }

    // Default
    return {
      greeting: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ। ਕ੍ਰੌਪ ਸ਼ੀਲਡ ਏਆਈ ਫਸਲ ਸੁਰੱਖਿਆ ਸਲਾਹ।',
      diagnosisText: `ਤੁਹਾਡੀ ਫਸਲ ਵਿੱਚ ${disease} ਦੇ ਲੱਛਣ ${confidence}% ਸ਼ੁੱਧਤਾ ਨਾਲ ਪਾਏ ਗਏ ਹਨ। ਖਤਰੇ ਦਾ ਪੱਧਰ: ${risk}.`,
      practicalSummary: 'ਪੱਤਿਆਂ ਉੱਤੇ ਬੀਮਾਰੀ ਦੇ ਨਿਸ਼ਾਨ ਹਨ। ਫਸਲ ਦੀ ਸੁਰੱਖਿਆ ਲਈ ਤੁਰੰਤ ਕਦਮ ਚੁੱਕੋ।',
      spokenSteps: [
        'ਪਹਿਲਾਂ ਬਿਮਾਰੀ ਵਾਲੇ ਹੇਠਲੇ ਪੱਤਿਆਂ ਨੂੰ ਤੋੜ ਕੇ ਖੇਤ ਵਿੱਚੋਂ ਬਾਹਰ ਕੱਢੋ।',
        'ਸਿਫਾਰਸ਼ ਕੀਤੀ ਉੱਲੀਨਾਸ਼ਕ ਦਵਾਈ ਦਾ ਛਿੜਕਾਅ ਸ਼ਾਮ ਵੇਲੇ ਕਰੋ।',
        'ਫਸਲ ਵਿੱਚ ਪਾਣੀ ਦਾ ਸਹੀ ਨਿਕਾਸ ਯਕੀਨੀ ਬਣਾਓ।',
        'ਸਪਰੇਅ ਕਰਦੇ ਸਮੇਂ ਮਾਸਕ ਅਤੇ ਦਸਤਾਨੇ ਜ਼ਰੂਰ ਪਹਿਨੋ।',
      ],
      conclusion: 'ਵਧੇਰੇ ਜਾਣਕਾਰੀ ਲਈ ਨੇੜਲੇ ਕ੍ਰਿਸ਼ੀ ਵਿਗਿਆਨ ਕੇਂਦਰ (KVK) ਨਾਲ ਰਾਬਤਾ ਕਾਇਮ ਕਰੋ।',
    };
  }

  // -------------------------------------------------------------
  // MARATHI
  // -------------------------------------------------------------
  if (langCode === 'mr') {
    if (category === 'cotton') {
      return {
        greeting: 'नमस्कार शेतकरी मित्रांनो. क्रॉप शील्ड एआय कापूस संरक्षण सल्ला.',
        diagnosisText: `तुमच्या कापूस पिकावर ${disease} रोगाची लक्षणे ${confidence}% अचूकतेने आढळली आहेत. धोक्याची पातळी: ${risk}.`,
        practicalSummary: 'कापसावर जिवाणूजन्य करपा किंवा चुरडा-मुरडा रोगाचे प्रमाण दिसून येत आहे.',
        spokenSteps: [
          'शेतातील बांधावरील रोगट झाडे आणि तण उपटून नष्ट करा.',
          'करपा रोगासाठी कॉपर ऑक्सिक्लोराईड २.५ ग्रॅम + स्ट्रेप्टोसायक्लिन १ ग्रॅम प्रति १० लिटर पाण्यात मिसळून फवारा.',
          'पांढऱ्या माशीच्या नियंत्रणासाठी पायरीप्रॉक्सीफेन २ मिली प्रति लिटर पाण्यात मिसळून फवारणी करा.',
          'पानांच्या खालच्या बाजूला संध्याकाळी तोंडाला मास्क लावून फवारणी करा.',
        ],
        conclusion: 'अधिक माहितीसाठी स्थानिक कृषी विज्ञान केंद्र (KVK) शी संपर्क साधा.',
      };
    }

    if (category === 'wheat') {
      return {
        greeting: 'नमस्कार शेतकरी मित्रांनो. क्रॉप शील्ड एआय गहू संरक्षण सल्ला.',
        diagnosisText: `तुमच्या गहू पिकावर ${disease} रोगाची लक्षणे ${confidence}% अचूकतेने आढळली आहेत. धोक्याची पातळी: ${risk}.`,
        practicalSummary: 'गव्हाच्या पानांवर तांबेरा रोगाचे पिवळे किंवा तपकिरी ठिपके आढळले आहेत.',
        spokenSteps: [
          'गव्हाच्या पानांवरील पिवळ्या किंवा तपकिरी तांबेराच्या ठिपक्यांची तपासणी करा.',
          'प्रोपिकोनाझोल २५% ईसी १ मिली प्रति लिटर पाण्यात मिसळून तात्काळ फवारणी करा.',
          'युरियाचा अतिवापर टाळा आणि पिकाला पोटॅश खताचा डोस द्या.',
          'सकाळच्या वेळी मास्क लावून प्रति एकर २०० लिटर पाण्यातून फवारणी करा.',
        ],
        conclusion: 'अधिक माहितीसाठी स्थानिक KVK गहू शास्त्रज्ञांशी संपर्क साधा.',
      };
    }

    if (category === 'chilli') {
      return {
        greeting: 'नमस्कार शेतकरी मित्रांनो. क्रॉप शील्ड एआय मिरची संरक्षण सल्ला.',
        diagnosisText: `तुमच्या मिरची पिकावर ${disease} रोगाची लक्षणे ${confidence}% अचूकतेने आढळली आहेत. धोक्याची पातळी: ${risk}.`,
        practicalSummary: 'मिरचीवर फळकूज (एंथ्रॅक्नोज) किंवा बोकड्या रोगाचा प्रादुर्भाव झाला आहे.',
        spokenSteps: [
          'रोगट वाळलेली मिरचीची फळे आणि फांद्या तोडून शेताबाहेर नष्ट करा.',
          'अझॉक्सीस्ट्रोबिन १ मिली किंवा मँकोझेब २.५ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारा.',
          'थ्रिप्स आणि बोकड्या रोगासाठी प्रति एकर १५ निळे-पिवळे चिकट सापळे लावा आणि डायफेंथियूरॉन १.२ ग्रॅम फवारा.',
          'वाफ्यांमध्ये पाणी साचू देऊ नका आणि फळांवर व्यवस्थित औषध पोहचेल अशी फवारणी करा.',
        ],
        conclusion: 'मिरची तज्ज्ञांच्या सल्ल्यासाठी स्थानिक KVK केंद्राशी संपर्क साधा.',
      };
    }

    // Default Tomato/Others
    return {
      greeting: 'नमस्कार शेतकरी मित्रांनो. क्रॉप शील्ड एआय पीक संरक्षण सल्ला.',
      diagnosisText: `तुमच्या ${crop} पिकावर ${disease} रोगाची लक्षणे ${confidence}% अचूकतेने आढळली आहेत. धोक्याची पातळी: ${risk}.`,
      practicalSummary: 'पानांवर ठिपके दिसून येत आहेत. वेळेवर फवारणी केल्यास पिकाचे नुकसान टाळता येईल.',
      spokenSteps: [
        'सुरुवातीला बाधित झालेली खालची पाने काढून शेताबाहेर नष्ट करा.',
        'शिफारशीत बुरशीनाशक १ ग्रॅम किंवा जैविक ट्रायकोडर्मा ५ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारा.',
        'ठिबक सिंचनाचा वापर करा आणि पानांवर पाणी साचू देऊ नका.',
        'फवारणी करताना तोंडाला मास्क आणि हातमोजे नक्की वापरा.',
      ],
      conclusion: 'अधिक माहितीसाठी स्थानिक कृषी विज्ञान केंद्र (KVK) शी संपर्क साधा.',
    };
  }

  // -------------------------------------------------------------
  // TAMIL
  // -------------------------------------------------------------
  if (langCode === 'ta') {
    if (category === 'cotton') {
      return {
        greeting: 'வணக்கம் விவசாய பெருமக்களே. பயிர் பாதுகாப்பு ஆலோசனை.',
        diagnosisText: `உங்கள் பருத்தி பயிரில் ${disease} அறிகுறிகள் ${confidence}% துல்லியத்துடன் கண்டறியப்பட்டுள்ளன. ஆபத்து நிலை: ${risk}.`,
        practicalSummary: 'பருத்தியில் பாக்டீரியா இலைக்கருகல் அல்லது இலைச்சுருள் நோய் தாக்குதல் உள்ளது.',
        spokenSteps: [
          'பாதிக்கப்பட்ட செடிகள் மற்றும் வரப்பு களைகளை பிடுங்கி அப்புறப்படுத்துங்கள்.',
          'பாக்டீரியா கருகலுக்கு காப்பர் ஆக்ஸிகுளோரைடு 2.5 கிராம் + ஸ்ட்ரெப்டோமைசின் 1 கிராம் 10 லிட்டர் நீரில் கலந்து தெளிக்கவும்.',
          'வெள்ளை ஈக்களை கட்டுப்படுத்த பைரிப்ராக்ஸிபென் 2 மி.லி லிட்டர் நீரில் கலந்து தெளிக்கவும்.',
          'இலையின் அடிப்பகுதியில் மருந்து படுமாறு மாலை வேளையில் தெளிக்கவும்.',
        ],
        conclusion: 'மேலும் உதவிக்கு உங்கள் அருகிலுள்ள கேவிகே (KVK) மையத்தை தொடர்பு கொள்ளவும்.',
      };
    }

    if (category === 'chilli') {
      return {
        greeting: 'வணக்கம் விவசாய பெருமக்களே. மிளகாய் பயிர் பாதுகாப்பு ஆலோசனை.',
        diagnosisText: `உங்கள் மிளகாய் பயிரில் ${disease} அறிகுறிகள் ${confidence}% துல்லியத்துடன் கண்டறியப்பட்டுள்ளன. ஆபத்து நிலை: ${risk}.`,
        practicalSummary: 'மிளகாயில் காய் அழுகல் அல்லது இலைச்சுருட்டை நோய் பரவல் உள்ளது.',
        spokenSteps: [
          'பாதிக்கப்பட்ட காய்ந்த மிளகாய் காய்களை பறித்து வயலுக்கு வெளியே அழிக்கவும்.',
          'அசோக்சிஸ்ட்ரோபின் 1 மி.லி அல்லது மேன்கோசெப் 2.5 கிராம் லிட்டர் நீரில் கலந்து தெளிக்கவும்.',
          'இலைப்பேன் மற்றும் சுருட்டை நோய்க்கு ஏக்கருக்கு 15 நீல நிற ஒட்டும் பொறிகளை அமைக்கவும்.',
          'வயலில் நீர் தேங்காமல் வடிகால் வசதியை சரியாக பராமரிக்கவும்.',
        ],
        conclusion: 'மேலும் உதவிக்கு உங்கள் அருகிலுள்ள கேவிகே (KVK) மையத்தை தொடர்பு கொள்ளவும்.',
      };
    }

    // Default
    return {
      greeting: 'வணக்கம் விவசாய பெருமக்களே. பயிர் பாதுகாப்பு ஆலோசனை.',
      diagnosisText: `உங்கள் ${crop} பயிரில் ${disease} அறிகுறிகள் ${confidence}% துல்லியத்துடன் கண்டறியப்பட்டுள்ளன. ஆபத்து நிலை: ${risk}.`,
      practicalSummary: 'இலைகளில் புள்ளிகள் மற்றும் பூஞ்சான் பரவல் உள்ளது. உடனடியாக தடுப்பு முறைகளை மேற்கொள்ளவும்.',
      spokenSteps: [
        'முதலில் பாதிக்கப்பட்ட கீழ் இலைகளை அகற்றி வயலுக்கு வெளியே அப்புறப்படுத்துங்கள்.',
        'பரிந்துரைக்கப்பட்ட பூஞ்சாணக்கொல்லியை மாலை வேளையில் தெளிக்கவும்.',
        'சொட்டு நீர் பாசன முறையை பயன்படுத்தி இலைகள் நனையாமல் பார்த்துக் கொள்ளவும்.',
        'மருந்து தெளிக்கும் போது முகக்கவசம் மற்றும் கையுறைகளை கட்டாயம் அணியவும்.',
      ],
      conclusion: 'மேலும் உதவிக்கு உங்கள் அருகிலுள்ள கேவிகே (KVK) மையத்தை தொடர்பு கொள்ளவும்.',
    };
  }

  // -------------------------------------------------------------
  // BENGALI, GUJARATI, KANNADA Fallbacks with Crop Diagnosis
  // -------------------------------------------------------------
  if (langCode === 'bn') {
    return {
      greeting: 'নমস্কার কৃষক বন্ধুরা। ক্রপ শিল্ড এআই ফসল সুরক্ষা নির্দেশিকা।',
      diagnosisText: `আপনার ${crop} ফসলে ${disease} রোগের লক্ষণ ${confidence}% নির্ভুলতার সাথে সনাক্ত হয়েছে। ঝুঁকির মাত্রা: ${risk}.`,
      practicalSummary: `${crop} ফসলের জন্য নির্দিষ্ট কৃষি পরামর্শ অবিলম্বে প্রয়োগ করুন।`,
      spokenSteps: [
        'প্রথমে রোগাক্রান্ত অংশ ছিঁড়ে মাঠের বাইরে পুড়িয়ে ফেলুন।',
        'ফসল ও রোগ অনুযায়ী অনুমোদিত ছত্রাকনাশক সঠিক মাত্রায় স্প্রে করুন।',
        'অতিরিক্ত ইউরিয়া বন্ধ করে পটাশ প্রয়োগ করে উদ্ভিদের প্রতিরোধ ক্ষমতা বাড়ান।',
        'কীটনাশক স্প্রে করার সময় মাস্ক ও গ্লাভস ব্যবহার করুন।',
      ],
      conclusion: 'জরুরী সহায়তার জন্য নিকটস্থ কৃষি বিজ্ঞান কেন্দ্র (KVK) এ যোগাযোগ করুন।',
    };
  }

  if (langCode === 'gu') {
    return {
      greeting: 'નમસ્તે ખેડૂત મિત્રો. ક્રોપ શિલ્ડ એઆઈ પાક સંરક્ષણ સલાહ.',
      diagnosisText: `તમારા ${crop} પાકમાં ${disease} ના લક્ષણો ${confidence}% ચોકસાઈ સાથે મળ્યા છે. જોખમ સ્તર: ${risk}.`,
      practicalSummary: `${crop} પાકના રક્ષણ માટે સમયસર પગલાં લેવા જરૂરી છે.`,
      spokenSteps: [
        'સૌપ્રથમ રોગગ્રસ્ત પાંદડાં કે ફળો તોડીને ખેતરની બહાર નષ્ટ કરો.',
        'નિષ્ણાતો દ્વારા સૂચવેલ ફૂગનાશક દવા સાંજના સમયે છંટકાવ કરો.',
        'વધારાનું નાઇટ્રોજન ખાતર અટકાવો અને પોટાશ ખાતર આપો.',
        'દવાનો છંટકાવ કરતી વખતે માસ્ક અને હાથમોજાં અવશ્ય પહેરો.',
      ],
      conclusion: 'વધુ માહિતી માટે નજીકના કૃષિ વિજ્ઞાન કેન્દ્ર (KVK) નો સંપર્ક કરો.',
    };
  }

  if (langCode === 'kn') {
    return {
      greeting: 'ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ. ಕ್ರಾಪ್ ಶೀಲ್ಡ್ ಬೆಳೆ ರಕ್ಷಣಾ ಸಲಹೆ.',
      diagnosisText: `ನಿಮ್ಮ ${crop} ಬೆಳೆಯಲ್ಲಿ ${disease} ಲಕ್ಷಣಗಳು ${confidence}% ನಿಖರತೆಯೊಂದಿಗೆ ಪತ್ತೆಯಾಗಿವೆ. ಅಪಾಯದ ಮಟ್ಟ: ${risk}.`,
      practicalSummary: `${crop} ಬೆಳೆಯಲ್ಲಿ ರೋಗ ನಿಯಂತ್ರಣಕ್ಕೆ ತಕ್ಷಣ ಸೂಕ್ತ ಕ್ರಮಗಳನ್ನು ಕೈಗೊಳ್ಳಿ.`,
      spokenSteps: [
        'ಮೊದಲು ರೋಗಪೀಡಿತ ಭಾಗಗಳನ್ನು ಕಿತ್ತು ಹೊಲದಿಂದ ಹೊರಗೆ ನಾಶಪಡಿಸಿ.',
        'ಶಿಫಾರಸು ಮಾಡಿದ ಔಷಧಿಯನ್ನು ಸರಿಯಾದ ಪ್ರಮಾಣದಲ್ಲಿ ಸಿಂಪಡಿಸಿ.',
        'ಹೆಚ್ಚುವರಿ ಯೂರಿಯಾ ತಪ್ಪಿಸಿ, ಪೊಟ್ಯಾಷ್ ಗೊಬ್ಬರ ನೀಡಿ ರೋಗ ನಿರೋಧಕತೆ ಹೆಚ್ಚಿಸಿ.',
        'ಔಷಧ ಸಿಂಪಡಿಸುವಾಗ ಮಾಸ್ಕ್ ಮತ್ತು ಕೈಗವಸುಗಳನ್ನು ಕಡ್ಡಾಯವಾಗಿ ಧರಿಸಿ.',
      ],
      conclusion: 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಹತ್ತಿರದ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (KVK) ವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    };
  }

  // Fallback
  return {
    greeting: 'Hello Farmer. Welcome to CropShield AI Crop Protection Advisory.',
    diagnosisText: `Diagnostic scan detected ${disease} on your ${crop} with ${confidence}% model confidence. Risk Level: ${risk}.`,
    practicalSummary: 'Targeted crop protection actions recommended.',
    spokenSteps: customSteps && customSteps.length > 0 ? customSteps : [
      'Inspect crop canopy for active lesion progression.',
      'Apply recommended targeted fungicide or bactericide at labeled dilution.',
      'Ensure proper drainage and avoid waterlogging in the root zone.',
      'Wear protective PPE gear during chemical application.',
    ],
    conclusion: 'For complex cases, escalate directly to accredited KVK Pathology laboratories.',
  };
};
