/**
 * CropShield AI - Vernacular Spoken Translation Engine
 * SIH 2026 (Problem Statement SIH26131)
 * 
 * Provides authentic, natural agricultural voice narration and text translations
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

export const getVernacularAdvisory = (langCode, diseaseInfo = {}, steps = []) => {
  const crop = diseaseInfo.crop || 'Crop';
  const disease = diseaseInfo.condition || diseaseInfo.diseaseName || diseaseInfo.activeDisease || 'Disease';
  const confidence = diseaseInfo.confidence || 92;
  const risk = diseaseInfo.riskLevel || diseaseInfo.severity || 'High';

  switch (langCode) {
    case 'te': // Telugu
      return {
        greeting: 'రైతు సోదరులకు నమస్కారం. క్రాప్ షీల్డ్ ఏఐ పంట రక్షణ సలహా.',
        diagnosisText: `మీ ${crop} పంటలో ${disease} లక్షణాలు ${confidence}% ఖచ్చితత్వంతో గుర్తించబడ్డాయి. ప్రమాద స్థాయి: ${risk}.`,
        practicalSummary: 'ఆకులపై మచ్చలు కనిపించాయి. వెంటనే వ్యాప్తిని అరికట్టడానికి సేంద్రీయ మరియు సిఫార్సు చేసిన మందులను పిచికారీ చేయండి.',
        spokenSteps: [
          'మొదట వ్యాధి సోకిన క్రింది ఆకులను తుంచి పొలం బయట కాల్చివేయండి.',
          'ఎకరానికి 5 కిలోల ట్రైకోడెర్మా విరిడే లేదా వేప నూనె 5 మిల్లీలీటర్లు లీటరు నీటిలో కలిపి పిచికారీ చేయండి.',
          'తీవ్రత ఎక్కువగా ఉంటే నిపుణులు సూచించిన శిలీంద్ర సంహారిణిని 1 గ్రాము లీటరు నీటి చొప్పున సాయంత్రం వేళల్లో పిచికారీ చేయండి.',
          'రసాయనం పిచికారీ చేసేటప్పుడు తప్పనిసరిగా ముఖానికి మాస్క్ మరియు చేతులకు గ్లౌవ్స్ ధరించండి.',
        ],
        conclusion: 'మరిన్ని వివరాల కోసం సమీప కృషి విజ్ఞాన కేంద్రం (KVK) నిపుణులను సంప్రదించండి.',
      };

    case 'hi': // Hindi
      return {
        greeting: 'नमस्ते किसान भाइयों। क्रॉप शील्ड एआई फसल सुरक्षा सलाह।',
        diagnosisText: `आपकी ${crop} की फसल में ${disease} के लक्षण ${confidence}% सटीकता के साथ पाए गए हैं। जोखिम स्तर: ${risk}.`,
        practicalSummary: 'पत्तियों पर धब्बे और संक्रमण देखा गया है। समय पर रोकथाम से 30% तक फसल नुकसान से बचा जा सकता है।',
        spokenSteps: [
          'सबसे पहले रोगग्रस्त निचली पत्तियों को तोड़कर खेत से दूर नष्ट करें।',
          'जैविक नियंत्रण हेतु ट्राइकोडर्मा विरिडी 5 ग्राम प्रति लीटर या नीम तेल 5 मिली प्रति लीटर पानी में मिलाकर छिड़काव करें।',
          'अधिक प्रकोप होने पर अनुशंसित कवकनाशी का 1 ग्राम प्रति लीटर की दर से शाम 4 बजे के बाद छिड़काव करें।',
          'छिड़काव करते समय मास्क और दस्ताने अवश्य पहनें और हवा की दिशा में छिड़काव करें।',
        ],
        conclusion: 'कठिन मामलों में तुरंत कृषि विज्ञान केंद्र (KVK) के वैज्ञानिकों से संपर्क करें।',
      };

    case 'mr': // Marathi
      return {
        greeting: 'नमस्कार शेतकरी मित्रांनो. क्रॉप शील्ड एआय पीक संरक्षण सल्ला.',
        diagnosisText: `तुमच्या ${crop} पिकावर ${disease} रोगाची लक्षणे ${confidence}% अचूकतेने आढळली आहेत. धोक्याची पातळी: ${risk}.`,
        practicalSummary: 'पानांवर ठिपके दिसून येत आहेत. वेळेवर फवारणी केल्यास पिकाचे नुकसान टाळता येईल.',
        spokenSteps: [
          'सुरुवातीला बाधित झालेली खालची पाने काढून शेताबाहेर नष्ट करा.',
          'जैविक नियंत्रणासाठी ट्रायकोडर्मा विरिडी ५ ग्रॅम किंवा निंबोळी अर्क ५ मिली प्रति लिटर पाण्यात मिसळून फवारा.',
          'रोगाची तीव्रता जास्त असल्यास शिफारशीत बुरशीनाशक १ ग्रॅम प्रति लिटर पाण्यात मिसळून संध्याकाळी फवारणी करा.',
          'फवारणी करताना तोंडाला मास्क आणि हातमोजे नक्की वापरा.',
        ],
        conclusion: 'अधिक माहितीसाठी स्थानिक कृषी विज्ञान केंद्र (KVK) शी संपर्क साधा.',
      };

    case 'pa': // Punjabi
      return {
        greeting: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਕਿਸਾਨ ਵੀਰੋ। ਕ੍ਰੌਪ ਸ਼ੀਲਡ ਏਆਈ ਫਸਲ ਸੁਰੱਖਿਆ ਸਲਾਹ।',
        diagnosisText: `ਤੁਹਾਡੀ ${crop} ਦੀ ਫਸਲ ਵਿੱਚ ${disease} ਦੇ ਲੱਛਣ ${confidence}% ਸ਼ੁੱਧਤਾ ਨਾਲ ਪਾਏ ਗਏ ਹਨ। ਖਤਰੇ ਦਾ ਪੱਧਰ: ${risk}.`,
        practicalSummary: 'ਪੱਤਿਆਂ ਉੱਤੇ ਬੀਮਾਰੀ ਦੇ ਨਿਸ਼ਾਨ ਹਨ। ਸਮੇਂ ਸਿਰ ਸਪਰੇਅ ਨਾਲ ਫਸਲ ਦਾ ਬਚਾਅ ਯਕੀਨੀ ਬਣਾਓ।',
        spokenSteps: [
          'ਪਹਿਲਾਂ ਬਿਮਾਰੀ ਵਾਲੇ ਹੇਠਲੇ ਪੱਤਿਆਂ ਨੂੰ ਤੋੜ ਕੇ ਖੇਤ ਵਿੱਚੋਂ ਬਾਹਰ ਕੱਢੋ।',
          'ਜੈਵਿਕ ਰੋਕਥਾਮ ਲਈ ਨਿੰਮ ਦਾ ਤੇਲ 5 ਮਿ.ਲੀ. ਪ੍ਰਤੀ ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।',
          'ਜੇਕਰ ਬੀਮਾਰੀ ਜ਼ਿਆਦਾ ਹੋਵੇ ਤਾਂ ਮਾਹਿਰਾਂ ਦੁਆਰਾ ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀ ਉੱਲੀਨਾਸ਼ਕ ਦਵਾਈ ਦਾ ਛਿੜਕਾਅ ਸ਼ਾਮ ਵੇਲੇ ਕਰੋ।',
          'ਸਪਰੇਅ ਕਰਦੇ ਸਮੇਂ ਮਾਸਕ ਅਤੇ ਦਸਤਾਨੇ ਜ਼ਰੂਰ ਪਹਿਨੋ।',
        ],
        conclusion: 'ਕਿਸੇ ਵੀ ਸ਼ੱਕ ਦੀ ਸੂਰਤ ਵਿੱਚ ਨੇੜਲੇ ਕ੍ਰਿਸ਼ੀ ਵਿਗਿਆਨ ਕੇਂਦਰ (KVK) ਨਾਲ ਰਾਬਤਾ ਕਾਇਮ ਕਰੋ।',
      };

    case 'ta': // Tamil
      return {
        greeting: 'வணக்கம் விவசாய பெருமக்களே. பயிர் பாதுகாப்பு ஆலோசனை.',
        diagnosisText: `உங்கள் ${crop} பயிரில் ${disease} அறிகுறிகள் ${confidence}% துல்லியத்துடன் கண்டறியப்பட்டுள்ளன. ஆபத்து நிலை: ${risk}.`,
        practicalSummary: 'இலைகளில் புள்ளிகள் மற்றும் பூஞ்சான் பரவல் உள்ளது. உடனடியாக பரிந்துரைக்கப்பட்ட பாதுகாப்பு முறைகளை மேற்கொள்ளவும்.',
        spokenSteps: [
          'முதலில் பாதிக்கப்பட்ட கீழ் இலைகளை அகற்றி வயலுக்கு வெளியே அப்புறப்படுத்துங்கள்.',
          'உயிரியல் கட்டுப்பாட்டிற்கு டிரைக்கோடெர்மா விரிடி 5 கிராம் அல்லது வேப்ப எண்ணெய் 5 மி.லி ஒரு லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்.',
          'தாக்கம் அதிகமாக இருந்தால் மாலை வேளையில் பரிந்துரைக்கப்பட்ட பூஞ்சாணக்கொல்லியை தெளிக்கவும்.',
          'மருந்து தெளிக்கும் போது முகக்கவசம் மற்றும் கையுறைகளை கட்டாயம் அணியவும்.',
        ],
        conclusion: 'மேலும் உதவிக்கு உங்கள் அருகிலுள்ள கேவிகே (KVK) மையத்தை தொடர்பு கொள்ளவும்.',
      };

    case 'bn': // Bengali
      return {
        greeting: 'নমস্কার কৃষক বন্ধুরা। ক্রপ শিল্ড এআই ফসল সুরক্ষা নির্দেশিকা।',
        diagnosisText: `আপনার ${crop} ফসলে ${disease} রোগের লক্ষণ ${confidence}% নির্ভুলতার সাথে সনাক্ত হয়েছে। ঝুঁকির মাত্রা: ${risk}.`,
        practicalSummary: 'পাতায় দাগ ও ছত্রাক দেখা গেছে। সময়মতো ব্যবস্থা নিলে ফলন সুরক্ষিত থাকবে।',
        spokenSteps: [
          'প্রথমে রোগাক্রান্ত নিচের পাতাগুলো ছিঁড়ে মাঠের বাইরে নষ্ট করুন।',
          'জৈব দমনের জন্য ট্রাইকোডার্মা ভিরিডি ৫ গ্রাম অথবা নিম তেল ৫ মিলি প্রতি লিটার পানিতে মিশিয়ে স্প্রে করুন।',
          'প্রকোপ বেশি হলে অনুমোদিত ছত্রাকনাশক বিকেলে জমিতে স্প্রে করুন।',
          'কীটনাশক স্প্রে করার সময় মাস্ক ও গ্লাভস ব্যবহার করুন।',
        ],
        conclusion: 'জরুরী সহায়তার জন্য নিকটস্থ কৃষি বিজ্ঞান কেন্দ্র (KVK) এ যোগাযোগ করুন।',
      };

    case 'gu': // Gujarati
      return {
        greeting: 'નમસ્તે ખેડૂત મિત્રો. ક્રોપ શિલ્ડ એઆઈ પાક સંરક્ષણ સલાહ.',
        diagnosisText: `તમારા ${crop} પાકમાં ${disease} ના લક્ષણો ${confidence}% ચોકસાઈ સાથે મળ્યા છે. જોખમ સ્તર: ${risk}.`,
        practicalSummary: 'પાંદડા પર રોગના ચિન્હો દેખાયા છે. સમયસર પગલાં લેવાથી પાક સુરક્ષિત રહેશે.',
        spokenSteps: [
          'સૌપ્રથમ રોગગ્રસ્ત પાંદડાં તોડીને ખેતરની બહાર નષ્ટ કરો.',
          'જૈવિક નિયંત્રણ માટે લીમડાનું તેલ ૫ મિલી પ્રતિ લિટર પાણીમાં ભેળવીને છંટકાવ કરો.',
          'રોગ વધારે હોય તો કૃષિ વૈજ્ઞાનિક દ્વારા સૂચવેલ ફૂગનાશકનો સાંજના સમયે છંટકાવ કરો.',
          'દવાનો છંટકાવ કરતી વખતે માસ્ક અને હાથમોજાં અવશ્ય પહેરો.',
        ],
        conclusion: 'વધુ માહિતી માટે નજીકના કૃષિ વિજ્ઞાન કેન્દ્ર (KVK) નો સંપર્ક કરો.',
      };

    case 'kn': // Kannada
      return {
        greeting: 'ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ. ಕ್ರಾಪ್ ಶೀಲ್ಡ್ ಬೆಳೆ ರಕ್ಷಣಾ ಸಲಹೆ.',
        diagnosisText: `ನಿಮ್ಮ ${crop} ಬೆಳೆಯಲ್ಲಿ ${disease} ಲಕ್ಷಣಗಳು ${confidence}% ನಿಖರತೆಯೊಂದಿಗೆ ಪತ್ತೆಯಾಗಿವೆ. ಅಪಾಯದ ಮಟ್ಟ: ${risk}.`,
        practicalSummary: 'ಎಲೆಗಳ ಮೇಲೆ ಚುಕ್ಕೆಗಳು ಕಂಡುಬಂದಿವೆ. ತಕ್ಷಣವೇ ಸೂಕ್ತ ಔಷಧ ಸಿಂಪಡಿಸಿ.',
        spokenSteps: [
          'ಮೊದಲು ರೋಗಪೀಡಿತ ಕೆಳಗಿನ ಎಲೆಗಳನ್ನು ಕಿತ್ತು ಹೊಲದಿಂದ ಹೊರಗೆ ನಾಶಪಡಿಸಿ.',
          'ಜೈವಿಕ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ ಟ್ರೈಕೋಡರ್ಮಾ ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆ 5 ಮಿ.ಲೀ ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ.',
          'ತೀವ್ರತೆ ಹೆಚ್ಚಾಗಿದ್ದರೆ ಶಿಫಾರಸು ಮಾಡಿದ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಸಂಜೆ ವೇಳೆ ಸಿಂಪಡಿಸಿ.',
          'ಔಷಧ ಸಿಂಪಡಿಸುವಾಗ ಮಾಸ್ಕ್ ಮತ್ತು ಕೈಗವಸುಗಳನ್ನು ಕಡ್ಡಾಯವಾಗಿ ಧರಿಸಿ.',
        ],
        conclusion: 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಹತ್ತಿರದ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (KVK) ವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      };

    default: // English
      return {
        greeting: 'Hello Farmer. Welcome to CropShield AI Crop Protection Advisory.',
        diagnosisText: `Diagnostic scan detected ${disease} on your ${crop} with ${confidence}% model confidence. Risk Level: ${risk}.`,
        practicalSummary: 'Lesions identified on foliage. Immediate 4-tier IPDM intervention is advised to safeguard yield.',
        spokenSteps: [
          'Prune and destroy infected lower leaves away from the cropping boundary.',
          'Apply bio-control agent Trichoderma viride @ 5g/L or Neem seed extract (NSKE 5%).',
          'If spore pressure exceeds threshold, apply targeted fungicide in the late afternoon.',
          'Always wear protective gloves and an N95 respirator during chemical dilution.',
        ],
        conclusion: 'For complex cases, escalate directly to accredited KVK Pathology laboratories.',
      };
  }
};
