import React, { useState, useEffect } from 'react';
import {
  X,
  Droplets,
  Calculator,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  Info,
  Check,
  RotateCcw,
  Printer,
  ChevronRight,
  FlaskConical,
} from 'lucide-react';

// Common CIBRC / ICAR Approved Chemicals & Bio-Pesticides Database
const chemicalDatabase = [
  {
    name: 'Copper Oxychloride 50% WP (Blitox / Fytolan)',
    type: 'Fungicide / Bactericide',
    target: 'Bacterial Spot, Early Blight, Late Blight, Anthracnose',
    dosagePerLiter: 2.5, // grams per liter
    unit: 'g',
    phiDays: 3,
    avgPricePerKg: 650,
    toxicity: 'Blue (Moderately Toxic)',
    safetyTip: 'Do not mix with alkaline substances. Apply early morning.',
  },
  {
    name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)',
    type: 'Systemic Broad-Spectrum Fungicide',
    target: 'Early Blight, Powdery Mildew, Rust, Anthracnose',
    dosagePerLiter: 1.0, // ml per liter
    unit: 'ml',
    phiDays: 5,
    avgPricePerKg: 2800, // per Liter
    toxicity: 'Blue (Moderately Toxic)',
    safetyTip: 'Wear gloves and face mask. Safe for beneficial pollinators after drying.',
  },
  {
    name: 'Mancozeb 75% WP (Dithane M-45 / Indofil M-45)',
    type: 'Contact Protective Fungicide',
    target: 'Late Blight, Downy Mildew, Leaf Spot, Rust',
    dosagePerLiter: 2.0, // grams per liter
    unit: 'g',
    phiDays: 7,
    avgPricePerKg: 500,
    toxicity: 'Green (Slightly Toxic)',
    safetyTip: 'Ensure complete foliage coverage including leaf undersides.',
  },
  {
    name: 'Streptocycline 90:10 (Streptomycin + Tetracycline)',
    type: 'Antibacterial formulation',
    target: 'Bacterial Leaf Spot, Bacterial Canker, Black Rot',
    dosagePerLiter: 0.1, // 1g in 10L water (0.1g/L)
    unit: 'g',
    phiDays: 5,
    avgPricePerKg: 3500,
    toxicity: 'Green (Slightly Toxic)',
    safetyTip: 'Always mix with Copper Oxychloride for synergistic antibacterial protection.',
  },
  {
    name: 'Hexaconazole 5% EC (Contaf Plus)',
    type: 'Systemic Fungicide',
    target: 'Powdery Mildew, Rust, Sheath Blight, Tikka Disease',
    dosagePerLiter: 2.0, // ml per liter
    unit: 'ml',
    phiDays: 14,
    avgPricePerKg: 950,
    toxicity: 'Yellow (Highly Toxic)',
    safetyTip: 'Maintain strict 14-day Pre-Harvest Interval before crop picking.',
  },
  {
    name: 'Trichoderma viride 1.5% WP (Bio-Fungicide)',
    type: 'Bio-Fungicide (Organic)',
    target: 'Root Rot, Damping Off, Wilt, Soil Pathogens',
    dosagePerLiter: 5.0, // grams per liter
    unit: 'g',
    phiDays: 0,
    avgPricePerKg: 250,
    toxicity: 'Green (Safe / Bio-Organic)',
    safetyTip: '100% Organic & Non-Toxic. Do not mix with chemical fungicides.',
  },
  {
    name: 'Pseudomonas fluorescens 1.0% WP (Bio-Bactericide)',
    type: 'Bio-Bactericide & Plant Growth Promoter',
    target: 'Bacterial Wilt, Soft Rot, Sheath Rot',
    dosagePerLiter: 5.0, // grams per liter
    unit: 'g',
    phiDays: 0,
    avgPricePerKg: 280,
    toxicity: 'Green (Safe / Bio-Organic)',
    safetyTip: 'Safe for organic certification. Promotes systemic acquired resistance.',
  },
  {
    name: 'Neem Oil 10,000 PPM (Azadirachtin Bio-Insecticide)',
    type: 'Botanical Insecticide & Repellent',
    target: 'Whiteflies, Aphids, Thrips, Spider Mites, Early Caterpillars',
    dosagePerLiter: 3.0, // ml per liter
    unit: 'ml',
    phiDays: 1,
    avgPricePerKg: 850,
    toxicity: 'Green (Safe / Botanical)',
    safetyTip: 'Add 1 ml liquid soap/surfactant per liter for uniform leaf wetting.',
  },
  {
    name: 'Imidacloprid 17.8% SL (Confidor)',
    type: 'Systemic Insecticide',
    target: 'Sucking Pests (Whitefly, Jassids, Aphids, Thrips)',
    dosagePerLiter: 0.5, // ml per liter
    unit: 'ml',
    phiDays: 7,
    avgPricePerKg: 2200,
    toxicity: 'Yellow (Highly Toxic)',
    safetyTip: 'Do NOT spray during active flowering hours to protect honeybees.',
  },
  {
    name: 'Emamectin Benzoate 5% SG (Proclaim)',
    type: 'Larvicide / Caterpillar Specialist',
    target: 'Fruit Borer, Fall Armyworm, Diamondback Moth, Leaf Miner',
    dosagePerLiter: 0.4, // grams per liter
    unit: 'g',
    phiDays: 5,
    avgPricePerKg: 4200,
    toxicity: 'Blue (Moderately Toxic)',
    safetyTip: 'Spray during dusk or early morning when larvae are actively feeding.',
  },
];

const sprayerTypes = [
  { id: 'knapsack16', name: 'Manual Knapsack Sprayer', tankCapacity: 16, waterPerAcre: 160, icon: '🎒' },
  { id: 'battery20', name: 'Battery / Motorized Sprayer', tankCapacity: 20, waterPerAcre: 180, icon: '⚡' },
  { id: 'tractor200', name: 'Tractor Boom Sprayer (High Volume)', tankCapacity: 200, waterPerAcre: 200, icon: '🚜' },
  { id: 'drone10', name: 'Krishi Drone (Ultra Low Volume - ULV)', tankCapacity: 10, waterPerAcre: 10, icon: '🛸' },
];

export default function KisanSprayCalcModal({
  isOpen,
  onClose,
  initialChemical = '',
  cropName = 'Tomato',
  detectedDisease = '',
}) {
  // Farm input state
  const [landArea, setLandArea] = useState(1);
  const [areaUnit, setAreaUnit] = useState('Acres'); // 'Acres', 'Guntas', 'Bighas', 'Cents', 'Hectares'
  const [selectedSprayerId, setSelectedSprayerId] = useState('knapsack16');
  const [selectedChemName, setSelectedChemName] = useState(() => {
    if (initialChemical) {
      const match = chemicalDatabase.find((c) =>
        c.name.toLowerCase().includes(initialChemical.toLowerCase()) ||
        initialChemical.toLowerCase().includes(c.name.toLowerCase())
      );
      if (match) return match.name;
    }
    return chemicalDatabase[0].name;
  });

  const [customDosage, setCustomDosage] = useState('');
  const [useCustomDosage, setUseCustomDosage] = useState(false);
  const [copiedSlip, setCopiedSlip] = useState(false);

  // Update chemical if initialChemical changes
  useEffect(() => {
    if (initialChemical) {
      const match = chemicalDatabase.find((c) =>
        c.name.toLowerCase().includes(initialChemical.toLowerCase()) ||
        initialChemical.toLowerCase().includes(c.name.toLowerCase())
      );
      if (match) {
        setSelectedChemName(match.name);
      }
    }
  }, [initialChemical]);

  if (!isOpen) return null;

  // Convert land area to standard Acres
  const convertToAcres = (val, unit) => {
    const num = parseFloat(val) || 0;
    switch (unit) {
      case 'Guntas':
        return num / 40; // 40 Guntas = 1 Acre
      case 'Bighas':
        return num / 1.6; // ~1.6 Bigha = 1 Acre (Standard Central/North India)
      case 'Cents':
        return num / 100; // 100 Cents = 1 Acre (South India)
      case 'Hectares':
        return num * 2.471; // 1 Ha = 2.471 Acres
      case 'Acres':
      default:
        return num;
    }
  };

  const currentSprayer = sprayerTypes.find((s) => s.id === selectedSprayerId) || sprayerTypes[0];
  const currentChem = chemicalDatabase.find((c) => c.name === selectedChemName) || chemicalDatabase[0];

  const effectiveAcres = convertToAcres(landArea, areaUnit);

  // Total Water Needed
  const totalWaterLitres = Math.round(effectiveAcres * currentSprayer.waterPerAcre);

  // Dosage per Liter
  const activeDosagePerLiter = useCustomDosage && parseFloat(customDosage) > 0
    ? parseFloat(customDosage)
    : currentChem.dosagePerLiter;

  // Chemical Per Tank
  const chemPerTank = (activeDosagePerLiter * currentSprayer.tankCapacity).toFixed(1);

  // Number of Tanks
  const totalTanks = Math.ceil(totalWaterLitres / currentSprayer.tankCapacity) || 1;

  // Total Chemical Needed
  const totalChemAmount = (totalWaterLitres * activeDosagePerLiter);
  const totalChemDisplay = totalChemAmount >= 1000
    ? `${(totalChemAmount / 1000).toFixed(2)} kg / Liters`
    : `${Math.round(totalChemAmount)} ${currentChem.unit}`;

  // Cost Estimation
  const estimatedCost = Math.round((totalChemAmount / 1000) * currentChem.avgPricePerKg);

  const handleCopySlip = () => {
    const slipText = `🌾 CROPSHIELD AI - KISAN SPRAY SLIP
-------------------------------------------
Crop: ${cropName} ${detectedDisease ? `(${detectedDisease})` : ''}
Field Area: ${landArea} ${areaUnit} (~${effectiveAcres.toFixed(2)} Acres)
Equipment: ${currentSprayer.name} (${currentSprayer.tankCapacity}L Tank)
Chemical: ${currentChem.name}
Recommended Dosage: ${activeDosagePerLiter} ${currentChem.unit}/Liter

📋 ACTION PLAN:
• Total Water Volume: ${totalWaterLitres} Liters
• Total Tanks to Mix: ${totalTanks} Tanks
• Chemical Per ${currentSprayer.tankCapacity}L Tank: ${chemPerTank} ${currentChem.unit}
• Total Chemical to Buy: ${totalChemDisplay}
• Approx Cost: ₹${estimatedCost}
• Safe Pre-Harvest Interval (PHI): ${currentChem.phiDays} Days
• Best Spray Window: 06:00 AM – 10:00 AM (Wind < 10 km/h)
-------------------------------------------
Generated by CropShield AI Precision Vision`;

    navigator.clipboard?.writeText(slipText);
    setCopiedSlip(true);
    setTimeout(() => setCopiedSlip(false), 2000);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-content-card" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div className="title-with-icon">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calculator size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                Kisan Spray Tank & Chemical Dosage Calculator
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Accurate water, dilution & tank measurements compliant with ICAR & CIBRC agricultural standards
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* CROP & DISEASE NOTIFICATION BANNER IF TRIGGERED FROM SCAN */}
        {detectedDisease && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#16a34a" />
              <span style={{ fontSize: '12.5px', color: '#166534', fontWeight: 600 }}>
                Diagnosed Crop: <strong>{cropName}</strong> • Condition: <strong>{detectedDisease}</strong>
              </span>
            </div>
            <span style={{ fontSize: '11px', background: '#22c55e', color: '#fff', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
              AI Prescribed Rx
            </span>
          </div>
        )}

        <div className="modal-form-body mt-14" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 1. INPUT CONFIGURATION GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {/* LAND AREA & UNIT */}
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Field Land Area *
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  style={{ width: '60%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: 700 }}
                />
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value)}
                  style={{ width: '40%', padding: '9px 8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                >
                  <option value="Acres">Acres</option>
                  <option value="Guntas">Guntas (Guntha)</option>
                  <option value="Bighas">Bighas</option>
                  <option value="Cents">Cents</option>
                  <option value="Hectares">Hectares</option>
                </select>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', display: 'block' }}>
                = {effectiveAcres.toFixed(2)} Standard Acres
              </span>
            </div>

            {/* SPRAYER EQUIPMENT */}
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Sprayer Equipment Type *
              </label>
              <select
                value={selectedSprayerId}
                onChange={(e) => setSelectedSprayerId(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', background: '#fff' }}
              >
                {sprayerTypes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.name} ({s.tankCapacity}L)
                  </option>
                ))}
              </select>
              <span style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', display: 'block' }}>
                Water rate: {currentSprayer.waterPerAcre}L / Acre
              </span>
            </div>

            {/* CHEMICAL SELECTION */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Select Approved Chemical / Bio-Agent *
              </label>
              <select
                value={selectedChemName}
                onChange={(e) => {
                  setSelectedChemName(e.target.value);
                  setUseCustomDosage(false);
                }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', background: '#fff' }}
              >
                {chemicalDatabase.map((c) => (
                  <option key={c.name} value={c.name}>
                    [{c.type}] {c.name} (Std: {c.dosagePerLiter} {c.unit}/L)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* OPTIONAL CUSTOM DOSAGE OVERRIDE */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <label style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={useCustomDosage}
                onChange={(e) => setUseCustomDosage(e.target.checked)}
              />
              <span>Override with custom dosage prescribed by local agronomist</span>
            </label>

            {useCustomDosage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="number"
                  step="0.1"
                  placeholder={currentChem.dosagePerLiter.toString()}
                  value={customDosage}
                  onChange={(e) => setCustomDosage(e.target.value)}
                  style={{ width: '80px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #94a3b8', fontSize: '13px' }}
                />
                <span style={{ fontSize: '12px', color: '#334155', fontWeight: 600 }}>{currentChem.unit} / Liter</span>
              </div>
            )}
          </div>

          {/* 2. CALCULATION RESULTS KPI GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginTop: '4px' }}>
            {/* KPI 1: TANKS TO MIX */}
            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '12px 14px', textAlign: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
                Total Tanks to Mix
              </span>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#15803d', margin: '4px 0' }}>
                {totalTanks} <span style={{ fontSize: '14px', fontWeight: 600 }}>Tanks</span>
              </div>
              <span style={{ fontSize: '11px', color: '#4b5563' }}>
                {currentSprayer.tankCapacity}L per tank
              </span>
            </div>

            {/* KPI 2: CHEMICAL PER TANK */}
            <div style={{ background: '#eff6ff', border: '1.5px solid #93c5fd', borderRadius: '10px', padding: '12px 14px', textAlign: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase' }}>
                Chemical Per Tank
              </span>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#1d4ed8', margin: '4px 0' }}>
                {chemPerTank} <span style={{ fontSize: '14px', fontWeight: 600 }}>{currentChem.unit}</span>
              </div>
              <span style={{ fontSize: '11px', color: '#4b5563' }}>
                @ {activeDosagePerLiter} {currentChem.unit} / Liter
              </span>
            </div>

            {/* KPI 3: TOTAL WATER VOLUME */}
            <div style={{ background: '#fdf4ff', border: '1.5px solid #f0abfc', borderRadius: '10px', padding: '12px 14px', textAlign: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#86198f', textTransform: 'uppercase' }}>
                Total Water Required
              </span>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#a21caf', margin: '4px 0' }}>
                {totalWaterLitres} <span style={{ fontSize: '14px', fontWeight: 600 }}>Liters</span>
              </div>
              <span style={{ fontSize: '11px', color: '#4b5563' }}>
                For {landArea} {areaUnit}
              </span>
            </div>

            {/* KPI 4: TOTAL CHEMICAL PURCHASE */}
            <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '12px 14px', textAlign: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                Total Chemical to Buy
              </span>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#b45309', margin: '4px 0' }}>
                {totalChemDisplay}
              </div>
              <span style={{ fontSize: '11px', color: '#4b5563' }}>
                Approx Cost: ₹{estimatedCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* 3. CHEMICAL SAFETY & APPLICATION GUIDELINES */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FlaskConical size={16} color="#2563eb" /> {currentChem.name}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ fontSize: '11px', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  ⏳ Pre-Harvest Interval (PHI): {currentChem.phiDays} Days
                </span>
                <span style={{ fontSize: '11px', background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  🛡️ {currentChem.toxicity}
                </span>
              </div>
            </div>

            <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#475569', lineHeight: 1.4 }}>
              <strong>Target Pathogens:</strong> {currentChem.target}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#0369a1', background: '#f0f9ff', padding: '8px 10px', borderRadius: '6px', borderLeft: '3px solid #0284c7' }}>
              💡 <strong>Agronomist Tip:</strong> {currentChem.safetyTip} Always spray in morning hours (06:00 AM – 10:00 AM) when wind speed is under 12 km/h to prevent spray drift.
            </p>
          </div>

          {/* 4. FOOTER ACTIONS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                className="btn-pill-action btn-settings-pill"
                onClick={handleCopySlip}
                style={{ padding: '8px 14px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {copiedSlip ? <Check size={14} color="#16a34a" /> : <FileText size={14} />}
                <span>{copiedSlip ? 'Spray Slip Copied!' : 'Copy Spray Slip'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-pill-action btn-settings-pill"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="button"
                className="scan-cta-large-btn"
                style={{ width: 'auto', padding: '9px 18px' }}
                onClick={() => {
                  handleCopySlip();
                  onClose();
                }}
              >
                <CheckCircle2 size={16} />
                <span>Save & Apply Plan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
