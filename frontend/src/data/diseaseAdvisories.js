/**
 * CropShield AI - Pathogen-Specific Agronomic Advisory Database
 * Certified ICAR, ANGRAU, CRIDA, and TNAU agronomic treatment protocols.
 * Each disease has a completely unique set of curated chemical, biological, and cultural actions.
 */

export const DISEASE_ADVISORY_DATABASE = {
  // ==========================================
  // TOMATO DISEASES
  // ==========================================
  'Tomato___Bacterial_spot': {
    crop: 'Tomato',
    disease: 'Bacterial Spot (Xanthomonas perforans)',
    summary: 'Small, dark greasy spots with yellow halos on foliage and raised scabby pustules on green fruit.',
    actions: [
      'Spray Copper Hydroxide 53.8% DF @ 2.0 g/L or Copper Oxychloride 50% WP @ 2.5 g/L + Streptocycline @ 100 ppm (1g in 10L water).',
      'Cease all overhead sprinkler irrigation immediately to prevent bacterial splash between plant rows.',
      'Treat future tomato seeds by soaking in hot water (50°C for 25 minutes) or 1.3% sodium hypochlorite before nursery sowing.',
      'Apply bio-agent Bacillus subtilis or Trichoderma viride @ 5 g/L around root zone during early transplanting.',
    ]
  },
  'Tomato___Early_blight': {
    crop: 'Tomato',
    disease: 'Early Blight (Alternaria solani)',
    summary: 'Dark brown to black circular lesions displaying prominent concentric target-board rings on older leaves.',
    actions: [
      'Spray protective fungicide Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2.0 g/L at first appearance of target spots.',
      'For active curative knockdown, apply Azoxystrobin 23% SC @ 1.0 ml/L or Difenoconazole 25% EC @ 0.5 ml/L.',
      'Prune and discard bottom 15 cm of foliage to eliminate ground-level spore splash and improve lower air circulation.',
      'Apply clean paddy straw or plastic mulch over soil beds to create a physical barrier against soil-borne Alternaria spores.',
    ]
  },
  'Tomato___Late_blight': {
    crop: 'Tomato',
    disease: 'Late Blight (Phytophthora infestans)',
    summary: 'Rapidly expanding water-soaked dark lesions with pale green borders and delicate white fungal down underneath.',
    actions: [
      'Emergency Action: Apply systemic translaminar fungicide Cymoxanil 8% + Mancozeb 64% WP @ 2.0 g/L or Dimethomorph 50% WP @ 1.0 g/L within 24 hours.',
      'In persistent humid/foggy weather, rotate after 7 days with Metalaxyl-M 4% + Mancozeb 64% WP (Ridomil Gold) @ 2.5 g/L.',
      'Strictly avoid overhead irrigation; ensure field furrows drain freely to eliminate standing stagnant moisture.',
      'Apply bio-fungicide Trichoderma harzianum @ 5 g/L into soil around root zones to prevent secondary tuber/stem rot.',
    ]
  },
  'Tomato___Leaf_Mold': {
    crop: 'Tomato',
    disease: 'Leaf Mold (Passalora fulva)',
    summary: 'Pale yellowish-green blotches on upper leaf surfaces matching olive-brown velvety mold on leaf undersides.',
    actions: [
      'Spray Difenoconazole 25% EC @ 0.5 ml/L or Copper Oxychloride 50% WP @ 2.5 g/L targeting leaf undersides.',
      'Reduce canopy humidity below 85% by opening greenhouse side curtains and widening inter-row plant spacing.',
      'Prune out crowded interior sucker shoots and dense leaves to facilitate rapid air flow and light penetration.',
      'Avoid working inside the field when morning dew is present to prevent spreading microscopic conidia across rows.',
    ]
  },
  'Tomato___Septoria_leaf_spot': {
    crop: 'Tomato',
    disease: 'Septoria Leaf Spot (Septoria lycopersici)',
    summary: 'Numerous small circular spots (2-3 mm) with light gray centers, dark brown borders, and tiny black fruiting specks.',
    actions: [
      'Spray Mancozeb 75% WP @ 2.5 g/L or Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L.',
      'Stake, trellis, and tie tomato vines vertically off the soil surface to minimize moisture contact.',
      'Remove bottom 3-4 leaves carrying dense circular specks before spores climb into upper canopy.',
      'Implement 2-year crop rotation with non-solanaceous crops (maize, pulses, beans) to clear overwintering debris.',
    ]
  },
  'Tomato___Spider_mites Two-spotted_spider_mite': {
    crop: 'Tomato',
    disease: 'Two-Spotted Spider Mite (Tetranychus urticae)',
    summary: 'Fine yellow/bronze stippling on upper leaves accompanied by delicate silken webbing under leaf surfaces.',
    actions: [
      'Spray selective acaricide Spiromesifen 22.9% SC @ 1.0 ml/L or Propargite 57% EC @ 2.0 ml/L with high pressure.',
      'Direct spray nozzle upwards towards leaf undersides where mite colonies and eggs reside.',
      'Moisten field perimeter bunds and wash dusty border roads to dismantle dry microclimates that trigger mite outbreaks.',
      'Avoid repeated broad-spectrum synthetic pyrethroid sprays which destroy beneficial predatory phytoseiid mites.',
    ]
  },
  'Tomato___Target_Spot': {
    crop: 'Tomato',
    disease: 'Target Spot (Corynespora cassiicola)',
    summary: 'Brown necrotic lesions with distinct concentric zonate rings and yellow chlorotic halos across foliage and stems.',
    actions: [
      'Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L or Fluxapyroxad + Pyraclostrobin @ 0.6 ml/L.',
      'Ensure adequate row spacing of at least 60 cm to promote rapid canopy drying after rain.',
      'Collect and bury fallen infected plant debris to reduce saprophytic inoculum buildup in topsoil.',
      'Maintain balanced nitrogen nutrition; avoid excessive vegetative growth which promotes dense humid canopies.',
    ]
  },
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
    crop: 'Tomato',
    disease: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
    summary: 'Severe upward leaf curling, cupping, yellow margins, stunted bushy growth, and flower abscission.',
    actions: [
      'Install 15 yellow sticky traps per acre to monitor and physically trap whitefly (Bemisia tabaci) vectors.',
      'Spray Acetamiprid 20% SP @ 0.3 g/L or Imidacloprid 17.8% SL @ 0.5 ml/L or Pyriproxyfen 10% EC @ 2.0 ml/L against whitefly nymphs.',
      'Rogue out and bury severely stunted, puckered plants early to stop field-wide virus transmission.',
      'Erect tall border barrier crops of maize or sorghum (3 rows) around the field perimeter to deflect wind-borne whitefly swarms.',
    ]
  },
  'Tomato___Tomato_mosaic_virus': {
    crop: 'Tomato',
    disease: 'Tomato Mosaic Virus (ToMV)',
    summary: 'Mottled alternating dark and light green patches, blistering, distortion, and fern-like narrow leaf blades.',
    actions: [
      'Rogue out and immediately burn infected mosaic-mottled plants; never compost viral plant material.',
      'Sanitize pruning shears, stakes, and workers\' hands with 10% trisodium phosphate (TSP) or 20% reconstituted skim milk.',
      'Control aphid vectors by spraying Neem oil 10,000 ppm @ 2.0 ml/L or Thiamethoxam 25% WG @ 0.3 g/L.',
      'Note: No chemical fungicide cures viral particles; rigorous sanitation and vector management are the only defenses.',
    ]
  },
  'Tomato___healthy': {
    crop: 'Tomato',
    disease: 'Healthy Foliage',
    summary: 'Vibrant green foliage with no detectable disease lesions, insect feeding damage, or viral chlorosis.',
    actions: [
      'No chemical fungicide or bactericide spray required. Continue routine organic field maintenance.',
      'Apply foliar Calcium Nitrate @ 2.0 g/L + Boron @ 1.0 g/L during fruit-set to prevent blossom-end rot.',
      'Maintain regular drip fertigation and optimal soil moisture to prevent fruit cracking.',
      'Perform weekly scouting of lower canopy leaves and shoot tips for early sucking pest ingress.',
    ]
  },

  // ==========================================
  // CHILLI & BELL PEPPER DISEASES
  // ==========================================
  'Pepper,_bell___Bacterial_spot': {
    crop: 'Chilli / Pepper',
    disease: 'Bacterial Leaf Spot (Xanthomonas euvesicatoria)',
    summary: 'Small, circular to irregular water-soaked spots turning dark brown with pale centers on leaves and green pods.',
    actions: [
      'Spray Copper Oxychloride 50% WP @ 2.5 g/L + Streptocycline 100 ppm (1g in 10L water) or Copper Hydroxide @ 2.0 g/L.',
      'Cease overhead sprinkler watering immediately to prevent bacterial splash between chilli plants.',
      'Treat future chilli seeds by soaking in hot water (50°C for 25 minutes) before nursery bed sowing.',
      'Disinfect secateurs, pruning shears, and spray tanks with 1% sodium hypochlorite solution between rows.',
    ]
  },
  'Pepper,_bell___healthy': {
    crop: 'Chilli / Pepper',
    disease: 'Healthy Foliage',
    summary: 'Dark green, smooth turgid foliage with strong branching and healthy flower bud initiation.',
    actions: [
      'No chemical pesticide spray needed. Maintain balanced micronutrient fertigation.',
      'Apply foliar spray of 19:19:19 NPK @ 5 g/L + micronutrient mix @ 2 g/L during flowering.',
      'Install 5 yellow and 5 blue sticky traps per acre for early thrips and whitefly surveillance.',
      'Maintain clean furrow irrigation; avoid prolonged water stagnation around the collar region.',
    ]
  },
  'Chilli___Anthracnose': {
    crop: 'Chilli / Pepper',
    disease: 'Anthracnose & Fruit Rot (Colletotrichum capsici)',
    summary: 'Sunken, circular dark necrotic spots with concentric rings on ripe fruits and dieback of twigs from top downwards.',
    actions: [
      'Pick, remove and destroy all sunken rotten chilli pods and blackened twigs away from the plot.',
      'Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top) @ 1.0 ml/L or Mancozeb 75% WP @ 2.5 g/L.',
      'Follow with a second spray of Tebuconazole 25.9% EC @ 1.0 ml/L after 12-15 days if cloudy weather persists.',
      'Ensure complete spray coverage on developing fruit clusters and lower stems.',
    ]
  },
  'Chilli___Leaf_Curl': {
    crop: 'Chilli / Pepper',
    disease: 'Chilli Leaf Curl (Gemini Virus & Thrips/Mites Vector)',
    summary: 'Upward curling of leaves, thickened veins, crinkled foliage, shortened internodes, and stunted bushy growth.',
    actions: [
      'Install 15 blue sticky traps per acre for thrips and 15 yellow sticky traps for whiteflies.',
      'Spray Diafenthiuron 50% WP @ 1.2 g/L or Fipronil 5% SC @ 2.0 ml/L against thrips and yellow mite vectors.',
      'Rogue out severely stunted, upward-cupped chilli plants to stop field-wide virus transmission.',
      'Spray Neem oil 10,000 ppm @ 2.0 ml/L as an organic repellent on fresh terminal flushes.',
    ]
  },

  // ==========================================
  // COTTON DISEASES
  // ==========================================
  'Cotton___Bacterial_Blight': {
    crop: 'Cotton',
    disease: 'Bacterial Blight / Angular Leaf Spot (Xanthomonas citri pv. malvacearum)',
    summary: 'Angular, water-soaked dark brown spots restricted by leaf veinlets, black arm lesions on stems, and boll rot.',
    actions: [
      'Spray Copper Oxychloride 50% WP @ 2.5 g/L + Streptocycline 100 ppm (1g in 10L water).',
      'Withhold excessive urea/nitrogen top-dressing which makes soft cotton foliage highly vulnerable to Xanthomonas.',
      'Deploy yellow sticky traps @ 10 per acre to monitor and suppress secondary vector movements.',
      'Spray during late afternoon hours with complete coverage on the undersides of leaves.',
    ]
  },
  'Cotton___Leaf_Curl_Virus': {
    crop: 'Cotton',
    disease: 'Cotton Leaf Curl Virus (CLCuV)',
    summary: 'Upward or downward leaf curling, thickened veins, leaf-like outgrowths (enations) under leaves, and severe stunting.',
    actions: [
      'Rogue out and burn infected stunted plants and border weed hosts (Abutilon indicum) along field margins.',
      'Deploy yellow sticky traps @ 15 per acre and spray Pyriproxyfen 10% EC @ 2.0 ml/L against whitefly vectors.',
      'Spray Flonicamid 50% WG @ 0.3 g/L or Afidopyropen 50 g/L @ 2.0 ml/L for systemic vector knockdown.',
      'Spray late in the afternoon to protect beneficial pollinator insects; wear protective mask and gloves.',
    ]
  },
  'Cotton___healthy': {
    crop: 'Cotton',
    disease: 'Healthy Crop',
    summary: 'Broad, vigorous palmate leaves with healthy square and boll development and clean stem vasculature.',
    actions: [
      'No chemical spray needed. Maintain balanced fertilization with NPK and Zinc Sulphate @ 10 kg/acre.',
      'Foliar spray of 2% DAP or 1% Potassium Nitrate (13:0:45) at peak flowering and boll formation.',
      'Install pheromone traps @ 5 per acre for monitoring pink bollworm (Pectinophora gossypiella).',
      'Maintain proper drainage in black cotton soils to prevent root asphyxiation during heavy monsoons.',
    ]
  },

  // ==========================================
  // CORN / MAIZE DISEASES
  // ==========================================
  'Corn_(maize)___Common_rust_': {
    crop: 'Corn / Maize',
    disease: 'Common Rust (Puccinia sorghi)',
    summary: 'Golden-brown to cinnamon-colored powdery pustules scattered abundantly on both upper and lower leaf surfaces.',
    actions: [
      'Spray systemic triazole fungicide Propiconazole 25% EC (Tilt) @ 1.0 ml/L or Mancozeb 75% WP @ 2.5 g/L.',
      'Inspect flag leaves and mid-canopy leaves for golden-brown powdery pustules that rupture the leaf epidermis.',
      'Avoid heavy single doses of nitrogen during humid vegetative phases; ensure balanced potash (MOP) application.',
      'Deep plough post-harvest stubble to bury infected crop residue below 15 cm soil depth.',
    ]
  },
  'Corn_(maize)___Northern_Leaf_Blight': {
    crop: 'Corn / Maize',
    disease: 'Northern Corn Leaf Blight (Exserohilum turcicum)',
    summary: 'Long, elliptical, cigar-shaped grayish-green to tan lesions (2.5 to 15 cm long) developing on lower leaves upward.',
    actions: [
      'Spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L or Mancozeb 75% WP @ 2.5 g/L at early lesion stage.',
      'Inspect upper leaf whorls and mid-canopy for elongated elliptical gray-green blight lesions.',
      'Practice 2-year crop rotation with non-host crops (pulses, soybean, groundnut) to break inoculum cycle.',
      'Deep plough post-harvest stubble to bury infected corn residue below 15 cm soil depth.',
    ]
  },
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
    crop: 'Corn / Maize',
    disease: 'Gray Leaf Spot (Cercospora zeae-maydis)',
    summary: 'Rectangular, narrow necrotic lesions strictly delimited by parallel leaf veins, turning tan to gray.',
    actions: [
      'Spray Pyraclostrobin 20% WG @ 1.0 g/L or Azoxystrobin + Difenoconazole @ 1.0 ml/L before tassel emergence.',
      'Avoid high plant densities that create prolonged humid microclimates inside the corn canopy.',
      'Practice minimum 1-year rotation away from corn to non-host broadleaf crops.',
      'Incorporate post-harvest stalks into soil with disc harrow to accelerate fungal tissue decomposition.',
    ]
  },
  'Corn_(maize)___healthy': {
    crop: 'Corn / Maize',
    disease: 'Healthy Foliage',
    summary: 'Dark green, broad elongated leaves with vigorous whorl expansion and robust tassel/cob formation.',
    actions: [
      'No chemical pesticide needed. Continue standard agronomic nitrogen side-dressing.',
      'Side-dress Urea @ 30-40 kg/acre at knee-high stage and tasseling stage with soil moisture.',
      'Scout leaf whorls for Fall Armyworm (Spodoptera frugiperda) egg masses or early leaf windowing.',
      'Ensure proper drainage to avoid waterlogging during early germination and vegetative phases.',
    ]
  },

  // ==========================================
  // POTATO DISEASES
  // ==========================================
  'Potato___Early_blight': {
    crop: 'Potato',
    disease: 'Early Blight (Alternaria solani)',
    summary: 'Brown, angular-to-circular target-board lesions with yellow margins on older leaves, leading to defoliation.',
    actions: [
      'Spray Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2.0 g/L as protective canopy barrier.',
      'For active infection, spray Azoxystrobin 23% SC @ 1.0 ml/L or Difenoconazole 25% EC @ 0.5 ml/L.',
      'Ensure balanced plant nutrition; stressed, nitrogen-deficient potato crops are heavily predisposed to Alternaria.',
      'Apply clean straw mulch to isolate lower foliage from soil-splashed conidial inoculum.',
    ]
  },
  'Potato___Late_blight': {
    crop: 'Potato',
    disease: 'Late Blight (Phytophthora infestans)',
    summary: 'Fast-spreading water-soaked dark purplish-black foliar blighting with white fungal sporulation under humid canopy.',
    actions: [
      'Emergency Action: Spray Dimethomorph 50% WP @ 1.0 g/L or Cymoxanil 8% + Mancozeb 64% WP @ 2.0 g/L immediately.',
      'Rotate after 7 days with Metalaxyl-M 4% + Mancozeb 64% WP (Ridomil Gold) @ 2.5 g/L if wet weather continues.',
      'Earth up soil hills well around potato plants to prevent fungal zoospores from washing into tuber beds.',
      'Kill and desiccate haulms (potato vines) 10-14 days before harvest to prevent tuber infection during digging.',
    ]
  },
  'Potato___healthy': {
    crop: 'Potato',
    disease: 'Healthy Crop',
    summary: 'Lush, compact dark green compound foliage with vigorous stolon expansion and tuber bulking.',
    actions: [
      'No chemical spray needed. Maintain proper hill earthing-up to shield developing tubers from sunlight.',
      'Apply Potassium Sulphate (SOP) @ 25 kg/acre to boost starch synthesis and tuber dry matter.',
      'Monitor fields for potato tuber moth (PTM) and aphid vectors.',
      'Maintain uniform irrigation; avoid water fluctuation which causes growth cracking and knobby tubers.',
    ]
  },

  // ==========================================
  // GRAPE DISEASES
  // ==========================================
  'Grape___Black_rot': {
    crop: 'Grape',
    disease: 'Black Rot (Guignardia bidwellii)',
    summary: 'Reddish-brown circular leaf spots with black fruiting pimples; shriveling of berries into hard black mummies.',
    actions: [
      'Spray Myclobutanil 10% WP @ 0.5 g/L or Mancozeb 75% WP @ 2.5 g/L before bloom and at berry-set.',
      'Collect and deeply bury or burn all shriveled black mummified berries and infected leaves from the vine floor.',
      'Prune inner vine shoots to open the canopy for rapid sunlight penetration and cluster drying.',
      'Maintain protective fungicide coverage from early 10-cm shoot emergence until veraison.',
    ]
  },
  'Grape___Esca_(Black_Measles)': {
    crop: 'Grape',
    disease: 'Esca / Black Measles (Phaeomoniella & Phaeoacremonium)',
    summary: 'Tiger-stripe chlorotic leaf patterns, dark spots on berries (measles), and sudden apoplexy wilting of vines.',
    actions: [
      'Prune diseased cordons back to clean, healthy white/green vascular wood.',
      'Immediately paint all large vine pruning wounds with Copper Oxychloride paste (1:1 with linseed oil).',
      'Rogue out dead cordons and burn infected trunk wood away from the vineyard.',
      'Avoid heavy pruning during rainy periods when fungal airborne spores enter fresh wood vessels.',
    ]
  },
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
    crop: 'Grape',
    disease: 'Leaf Blight (Pseudocercospora vitis / Isariopsis)',
    summary: 'Irregular dark brown necrotic patches on leaves with dark velvety fungal tufts under older foliage.',
    actions: [
      'Spray Bordeaux mixture 1% or Kresoxim-methyl 44.3% SC @ 0.7 ml/L or Azoxystrobin @ 1.0 ml/L.',
      'Collect and burn fallen leaf litter post-harvest to reduce overwintering stromata.',
      'Train vines on bower or trellis system to maximize airflow through the grape canopy.',
      'Apply balanced potassium and silica sprays to toughen the leaf cuticle against fungal hyphae penetration.',
    ]
  },
  'Grape___healthy': {
    crop: 'Grape',
    disease: 'Healthy Foliage',
    summary: 'Broad, vibrant green palmate leaves supporting healthy, uniform grape cluster development.',
    actions: [
      'No chemical pesticide spray needed. Maintain proper canopy training and shoot thinning.',
      'Foliar spray of Solubor (Boron 20%) @ 1.0 g/L + Zinc EDTA @ 1.0 g/L at pre-bloom stage for optimal berry set.',
      'Perform regular shoot tipping and lateral shoot removal to prevent canopy congestion.',
      'Scout for mealybugs (Maconellicoccus hirsutus) around vine bark and shoot joints.',
    ]
  },

  // ==========================================
  // CITRUS / ORANGE DISEASES
  // ==========================================
  'Orange___Haunglongbing_(Citrus_greening)': {
    crop: 'Citrus / Orange',
    disease: 'Citrus Greening / Huanglongbing (Candidatus Liberibacter)',
    summary: 'Asymmetrical blotchy yellow mottle on leaves, upright chlorotic twigs, vein corking, and small lopsided bitter fruit.',
    actions: [
      'Control Asian Citrus Psyllid (ACP) vector: Spray Imidacloprid 17.8% SL @ 0.5 ml/L or Thiamethoxam 25% WG @ 0.3 g/L.',
      'Prune out severely yellowing, chlorotic branch flush during dormant season and destroy prunings.',
      'Apply balanced foliar micronutrient cocktail (Zinc Sulphate 0.5% + Ferrous Sulphate 0.2% + Manganese Sulphate 0.2%).',
      'Plant only certified disease-free budded saplings sourced from accredited ICAR-CCRI nurseries.',
    ]
  },

  // ==========================================
  // APPLE DISEASES
  // ==========================================
  'Apple___Apple_scab': {
    crop: 'Apple',
    disease: 'Apple Scab (Venturia inaequalis)',
    summary: 'Olive-green to velvety brown circular spots on leaves and corky, scabby, cracked lesions on apple fruits.',
    actions: [
      'Spray Difenoconazole 25% EC @ 0.5 ml/L or Captan 50% WP @ 2.5 g/L at pink bud and petal fall stages.',
      'Rotate with Dodine 65% WP @ 0.75 g/L or Kresoxim-methyl 44.3% SC @ 0.5 ml/L after fruit set.',
      'Rake, collect, and burn fallen scab-infected leaves on orchard floor before winter snowfall/dormancy.',
      'Prune inner orchard branches annually to open tree canopy for rapid morning leaf drying.',
    ]
  },
  'Apple___Black_rot': {
    crop: 'Apple',
    disease: 'Black Rot & Frog-Eye Leaf Spot (Botryosphaeria obtusa)',
    summary: 'Frog-eye circular leaf spots with purple margins and firm, dark rotting rings on developing apples.',
    actions: [
      'Spray Myclobutanil 10% WP @ 0.5 g/L or Mancozeb 75% WP @ 2.5 g/L from silver tip to petal fall.',
      'Prune and destroy dead wood, fire blight cankers, and mummified apples hanging in the tree canopy.',
      'Paint large bark wounds with copper oxychloride paste to prevent fungal colonization.',
      'Maintain tree vigor with balanced soil nutrition; drought-stressed trees are highly vulnerable.',
    ]
  },
  'Apple___Cedar_apple_rust': {
    crop: 'Apple',
    disease: 'Cedar Apple Rust (Gymnosporangium juniperi-virginianae)',
    summary: 'Bright yellow-orange circular spots on upper leaf surfaces developing raised tube-like fungal aecia underneath.',
    actions: [
      'Spray Myclobutanil 10% WP @ 0.5 g/L or Mancozeb 75% WP @ 2.5 g/L starting at pink bud stage.',
      'Remove and eradicate alternate host eastern red cedar / juniper trees within 500 meters of the orchard.',
      'Prune rust galls from nearby ornamental cedars before spring rains induce gelatinous spore horns.',
      'Apply 3 protective fungicide sprays at 10-day intervals during warm spring rains.',
    ]
  },
  'Apple___healthy': {
    crop: 'Apple',
    disease: 'Healthy Foliage',
    summary: 'Deep green, serrated elliptical leaves with healthy spur development and clean fruit skin.',
    actions: [
      'No chemical pesticide needed. Continue dormant pruning and orchard floor maintenance.',
      'Foliar spray of Calcium Chloride @ 3.0 g/L during fruit sizing to prevent bitter pit.',
      'Apply dormant horticultural mineral oil spray @ 2% before bud burst to smother overwintering mite eggs.',
      'Maintain mulch ring around tree basin to conserve moisture and suppress orchard weeds.',
    ]
  },

  // ==========================================
  // RICE / PADDY DISEASES
  // ==========================================
  'Rice___Blast': {
    crop: 'Rice / Paddy',
    disease: 'Rice Blast (Magnaporthe oryzae)',
    summary: 'Elliptical spindle-shaped eye lesions with ash-gray centers and brown margins on leaves, neck rot of panicles.',
    actions: [
      'Drain standing water from blast-infected paddy plots for 24-48 hours to arrest fungal mycelial spread.',
      'Spray Tricyclazole 75% WP @ 0.6 g/L (120 g/acre) or Kasugamycin 3% SL @ 2.5 ml/L at early tillering and panicle emergence.',
      'Postpone nitrogen top-dressing; apply Muriate of Potash (MOP) @ 20 kg/acre to strengthen silica epidermal cell walls.',
      'Maintain clean field bunds and eradicate wild weed hosts around the paddy perimeter.',
    ]
  },
  'Rice___Bacterial_Leaf_Blight': {
    crop: 'Rice / Paddy',
    disease: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
    summary: 'Water-soaked wavy lesions starting from leaf tips moving downward, turning straw-colored with milky bacterial ooze.',
    actions: [
      'Spray Copper Oxychloride @ 2.5 g/L + Plantomycin / Streptocycline @ 100 ppm (1g in 10L water).',
      'Withhold nitrogen top-dressing completely during active blight progression.',
      'Drain standing water from fields and avoid field-to-field overflow irrigation.',
      'Apply potash fertilizer in split doses to harden leaf tissues against bacterial entry.',
    ]
  },
  'Rice___healthy': {
    crop: 'Rice / Paddy',
    disease: 'Healthy Crop',
    summary: 'Vibrant green erect leaf blades with vigorous tillering and clean stem nodes.',
    actions: [
      'No chemical spray required. Follow System of Rice Intensification (SRI) alternate wetting and drying.',
      'Apply neem-coated urea in 3 split doses (basal, tillering, panicle initiation).',
      'Deploy pheromone traps @ 8 per acre for yellow stem borer (Scirpophaga incertulas) monitoring.',
      'Keep field bunds clean to prevent rodent and insect harboring.',
    ]
  },

  // ==========================================
  // WHEAT DISEASES
  // ==========================================
  'Wheat___Stripe_Rust': {
    crop: 'Wheat',
    disease: 'Yellow / Stripe Rust (Puccinia striiformis)',
    summary: 'Bright yellow to orange powdery pustules arranged in prominent parallel stripes along leaf veins.',
    actions: [
      'Inspect flag leaves and earheads for yellow/orange powdery rust pustules along leaf veins.',
      'Spray systemic triazole fungicide Propiconazole 25% EC (Tilt) @ 1.0 ml/L or Tebuconazole @ 1.0 ml/L water.',
      'Avoid excess urea/nitrogen application; apply balanced potash (MOP) @ 20 kg/acre to harden cell walls.',
      'Spray during calm morning hours with knapsack sprayer using 200 liters of water per acre.',
    ]
  },
  'Wheat___healthy': {
    crop: 'Wheat',
    disease: 'Healthy Crop',
    summary: 'Broad, erect green flag leaves supporting robust spikelet and grain filling without rust or leaf blotch.',
    actions: [
      'No chemical spray needed. Maintain recommended irrigation at Crown Root Initiation (CRI) and flowering.',
      'Apply split urea before second irrigation and ensure zinc sulphate application.',
      'Scout for aphid colonies on flag leaves during cloudy winter weather.',
      'Ensure proper drainage to prevent lodging during late grain-fill stages.',
    ]
  },

  // ==========================================
  // SQUASH, STRAWBERRY, PEACH, CHERRY, SOYBEAN
  // ==========================================
  'Squash___Powdery_mildew': {
    crop: 'Squash',
    disease: 'Powdery Mildew (Podosphaera xanthii)',
    summary: 'White talcum-powder-like fungal patches spreading over upper and lower leaf surfaces, petiole, and stems.',
    actions: [
      'Spray Wettable Sulphur 80% WP @ 2.5 g/L or Hexaconazole 5% SC @ 1.0 ml/L at first appearance.',
      'Rotate with Dinocap 48% EC @ 0.5 ml/L or Azoxystrobin @ 1.0 ml/L if patches spread to vine runners.',
      'Remove heavily colonized bottom leaves and ensure adequate vine spacing for air circulation.',
      'Avoid spraying sulphur during hot midday hours (>32°C) to prevent leaf scorching.',
    ]
  },
  'Strawberry___Leaf_scorch': {
    crop: 'Strawberry',
    disease: 'Leaf Scorch (Diplocarpon earlianum)',
    summary: 'Numerous irregular purplish-red blotches turning dark brown, causing leaves to curl up and scorch.',
    actions: [
      'Spray Captan 50% WP @ 2.0 g/L or Copper Oxychloride 50% WP @ 2.5 g/L at early runner emergence.',
      'Prune and burn older scorched leaves showing heavy purplish-brown lesions.',
      'Use drip irrigation beneath black plastic or clean straw mulch to keep strawberry foliage dry.',
      'Avoid overhead watering which spreads fungal ascospores across the planting bed.',
    ]
  },
  'Peach___Bacterial_spot': {
    crop: 'Peach',
    disease: 'Bacterial Spot (Xanthomonas arboricola pv. pruni)',
    summary: 'Small, angular water-soaked leaf lesions that drop out leaving a shot-hole appearance; pitted fruit lesions.',
    actions: [
      'Spray Copper Hydroxide @ 2.0 g/L or Oxytetracycline @ 0.5 g/L starting at shuck-split stage.',
      'Prune and remove infected twigs during winter dormancy to reduce overwintering bacterial cankers.',
      'Maintain tree vigor with balanced fertilizer; avoid severe nitrogen deficiency or excess.',
      'Plant windbreaks to reduce sand abrasion and wind injury which allow bacterial entry.',
    ]
  },
  'Cherry_(including_sour)___Powdery_mildew': {
    crop: 'Cherry',
    disease: 'Powdery Mildew (Podosphaera clandestina)',
    summary: 'White powdery fungal felt on young leaves, causing leaf cupping, distortion, and fruit russeting.',
    actions: [
      'Spray Myclobutanil 10% WP @ 0.5 g/L or Wettable Sulphur 80% WP @ 2.5 g/L at petal fall.',
      'Prune interior canopy branches to improve sunlight penetration and air movement.',
      'Avoid high rates of nitrogen fertilizer which produce lush susceptible terminal growth.',
      'Apply post-harvest cleanup spray if mildew colonization is noted on terminal shoot tips.',
    ]
  },
  'Soybean___healthy': {
    crop: 'Soybean',
    disease: 'Healthy Foliage',
    summary: 'Broad, trifoliate dark green leaves with vigorous nodulation and pod development.',
    actions: [
      'No chemical fungicide needed. Ensure Rhizobium inoculation and phosphorus availability.',
      'Apply Single Super Phosphate (SSP) @ 100 kg/acre to supply both phosphorus and sulfur.',
      'Monitor for defoliating caterpillars (Spodoptera litura) and stem flies.',
      'Ensure soil has adequate moisture during pod-fill stage for maximum grain weight.',
    ]
  },
  'Blueberry___healthy': {
    crop: 'Blueberry',
    disease: 'Healthy Foliage',
    summary: 'Glossy dark green leaves with strong cane growth and healthy fruit clusters.',
    actions: [
      'No chemical pesticide needed. Maintain acidic soil pH (4.5 to 5.5) using elemental sulfur.',
      'Apply pine bark or peat moss mulch around root zones to conserve moisture and protect shallow roots.',
      'Irrigate with drip system using low-salinity water.',
      'Prune older, non-productive canes during dormant winter season.',
    ]
  },
  'Raspberry___healthy': {
    crop: 'Raspberry',
    disease: 'Healthy Foliage',
    summary: 'Clean compound foliage with vigorous primocanes and floricanes.',
    actions: [
      'No chemical spray needed. Trellis canes vertically to support fruit-bearing branches.',
      'Prune out spent floricanes down to the ground immediately after summer harvest.',
      'Apply clean organic compost around cane base in early spring.',
      'Maintain drip irrigation to avoid wetting foliage and fruit clusters.',
    ]
  },
};

/**
 * Resolves exact pathogen-specific 4-step action plan
 */
export const getExactDiseaseAdvisory = (rawDisease = '', cropName = '') => {
  if (!rawDisease) return null;

  // Direct exact match
  if (DISEASE_ADVISORY_DATABASE[rawDisease]) {
    return DISEASE_ADVISORY_DATABASE[rawDisease];
  }

  // Normalized alphanumeric match (ignores spaces, underscores, hyphens, and case)
  const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const targetNorm = norm(rawDisease);

  for (const [key, val] of Object.entries(DISEASE_ADVISORY_DATABASE)) {
    const keyNorm = norm(key);
    if (keyNorm === targetNorm) {
      return val;
    }
  }

  // Substring match with normalized strings
  for (const [key, val] of Object.entries(DISEASE_ADVISORY_DATABASE)) {
    const keyNorm = norm(key);
    if (targetNorm.includes('lateblight') && keyNorm.includes('lateblight')) {
      if (targetNorm.includes('potato') && keyNorm.includes('potato')) return val;
      if (targetNorm.includes('tomato') && keyNorm.includes('tomato')) return val;
      return val;
    }
    if (targetNorm.includes('earlyblight') && keyNorm.includes('earlyblight')) {
      if (targetNorm.includes('potato') && keyNorm.includes('potato')) return val;
      if (targetNorm.includes('tomato') && keyNorm.includes('tomato')) return val;
      return val;
    }
    if (targetNorm.includes('bacterial') && keyNorm.includes('bacterial')) {
      if (targetNorm.includes('cotton') && keyNorm.includes('cotton')) return val;
      if (targetNorm.includes('pepper') && keyNorm.includes('pepper')) return val;
      if (targetNorm.includes('tomato') && keyNorm.includes('tomato')) return val;
      return val;
    }
    if (targetNorm.includes('rust') && keyNorm.includes('rust')) return val;
    if (targetNorm.includes('curl') && keyNorm.includes('curl')) return val;
    if (targetNorm.includes('anthracnose') && keyNorm.includes('anthracnose')) return val;
    if (targetNorm.includes('scab') && keyNorm.includes('scab')) return val;
    if (targetNorm.includes('healthy') && keyNorm.includes('healthy')) return val;
  }

  // Generic fallback
  return {
    crop: cropName || 'Crop',
    disease: rawDisease.replace(/___/g, ' - ').replace(/_/g, ' '),
    summary: `Targeted management actions for ${rawDisease}.`,
    actions: [
      `Inspect ${cropName || 'crop'} foliage thoroughly for active margin expansion and lesion borders.`,
      `Apply protective broad-spectrum fungicide (Mancozeb 75% WP @ 2.5 g/L or Copper Oxychloride @ 2.5 g/L).`,
      `Ensure proper spacing and drip irrigation to minimize leaf wetness duration.`,
      `For complex symptoms, submit a leaf sample to your district KVK diagnostic lab.`,
    ]
  };
};
