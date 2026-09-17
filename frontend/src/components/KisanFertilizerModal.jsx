import React, { useState } from 'react';
import {
  X,
  Sprout,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Info,
  Check,
  FileText,
  DollarSign,
  Layers,
  Leaf,
} from 'lucide-react';

// Recommended N:P:K kg/acre guidelines & soil multipliers
const cropNutrientProfiles = {
  Tomato: {
    baseN: 60,
    baseP: 40,
    baseK: 50,
    zincKg: 10,
    fymTonnes: 10,
    basalSplit: { N: 0.3, P: 1.0, K: 0.5 },
    top1Split: { N: 0.4, P: 0.0, K: 0.25 },
    top2Split: { N: 0.3, P: 0.0, K: 0.25 },
    notes: 'Apply Boron 1.0 g/L spray during flowering to prevent blossom end rot.',
  },
  Potato: {
    baseN: 70,
    baseP: 50,
    baseK: 60,
    zincKg: 10,
    fymTonnes: 12,
    basalSplit: { N: 0.5, P: 1.0, K: 0.5 },
    top1Split: { N: 0.5, P: 0.0, K: 0.5 },
    top2Split: { N: 0.0, P: 0.0, K: 0.0 },
    notes: 'Apply all phosphorus and half potash as basal. Avoid excess nitrogen after tuber initiation.',
  },
  Cotton: {
    baseN: 50,
    baseP: 25,
    baseK: 25,
    zincKg: 10,
    fymTonnes: 8,
    basalSplit: { N: 0.2, P: 1.0, K: 0.5 },
    top1Split: { N: 0.4, P: 0.0, K: 0.25 },
    top2Split: { N: 0.4, P: 0.0, K: 0.25 },
    notes: 'Apply Magnesium Sulphate 1% spray at peak boll development to prevent leaf reddening.',
  },
  'Rice / Paddy': {
    baseN: 45,
    baseP: 20,
    baseK: 20,
    zincKg: 10,
    fymTonnes: 6,
    basalSplit: { N: 0.33, P: 1.0, K: 0.5 },
    top1Split: { N: 0.33, P: 0.0, K: 0.0 },
    top2Split: { N: 0.34, P: 0.0, K: 0.5 },
    notes: 'Drain field before top dressing Urea to prevent nitrogen leaching losses.',
  },
  Wheat: {
    baseN: 50,
    baseP: 25,
    baseK: 15,
    zincKg: 8,
    fymTonnes: 6,
    basalSplit: { N: 0.5, P: 1.0, K: 1.0 },
    top1Split: { N: 0.5, P: 0.0, K: 0.0 },
    top2Split: { N: 0.0, P: 0.0, K: 0.0 },
    notes: 'Apply 1st top dressing at Crown Root Initiation (CRI) stage (20-25 DAS).',
  },
  'Maize / Corn': {
    baseN: 55,
    baseP: 30,
    baseK: 20,
    zincKg: 10,
    fymTonnes: 8,
    basalSplit: { N: 0.25, P: 1.0, K: 0.5 },
    top1Split: { N: 0.5, P: 0.0, K: 0.25 },
    top2Split: { N: 0.25, P: 0.0, K: 0.25 },
    notes: 'Zinc Sulphate is critical for maize to prevent white bud physiological disorder.',
  },
  'Chilli / Pepper': {
    baseN: 60,
    baseP: 30,
    baseK: 40,
    zincKg: 10,
    fymTonnes: 10,
    basalSplit: { N: 0.25, P: 1.0, K: 0.5 },
    top1Split: { N: 0.4, P: 0.0, K: 0.25 },
    top2Split: { N: 0.35, P: 0.0, K: 0.25 },
    notes: 'Split nitrogen into 3-4 top dressings to avoid flower drop and fruit rot.',
  },
  Grape: {
    baseN: 70,
    baseP: 45,
    baseK: 80,
    zincKg: 15,
    fymTonnes: 15,
    basalSplit: { N: 0.3, P: 0.6, K: 0.3 },
    top1Split: { N: 0.4, P: 0.4, K: 0.3 },
    top2Split: { N: 0.3, P: 0.0, K: 0.4 },
    notes: 'High potassium requirement during berry enlargement for sugar accumulation and berry skin strength.',
  },
  Apple: {
    baseN: 65,
    baseP: 35,
    baseK: 70,
    zincKg: 12,
    fymTonnes: 15,
    basalSplit: { N: 0.5, P: 1.0, K: 0.5 },
    top1Split: { N: 0.5, P: 0.0, K: 0.5 },
    top2Split: { N: 0.0, P: 0.0, K: 0.0 },
    notes: 'Apply full dose of FYM and Phosphorus in late autumn during tree dormancy.',
  },
};

const soilMultipliers = {
  'Black Cotton Soil': { N_mult: 1.0, P_mult: 1.1, K_mult: 0.85, name: 'Black Cotton Soil (High Clay, High Potash)' },
  'Red Sandy Loam': { N_mult: 1.15, P_mult: 1.0, K_mult: 1.2, name: 'Red Sandy Loam (Low Organic Matter, Needs Potash)' },
  'Alluvial Soil': { N_mult: 0.95, P_mult: 0.95, K_mult: 1.0, name: 'Alluvial Soil (Fertile River Plains)' },
  'Clay Loam': { N_mult: 1.0, P_mult: 1.05, K_mult: 0.9, name: 'Clay Loam (Moderate Drainage, Good CEC)' },
  'Laterite Soil': { N_mult: 1.2, P_mult: 1.3, K_mult: 1.15, name: 'Laterite / Acidic Soil (High P Fixation)' },
};

export default function KisanFertilizerModal({ isOpen, onClose, defaultCrop = 'Tomato' }) {
  const [selectedCrop, setSelectedCrop] = useState(defaultCrop);
  const [selectedSoil, setSelectedSoil] = useState('Black Cotton Soil');
  const [acreage, setAcreage] = useState(1);
  const [copiedPlan, setCopiedPlan] = useState(false);

  if (!isOpen) return null;

  const cropData = cropNutrientProfiles[selectedCrop] || cropNutrientProfiles['Tomato'];
  const soilData = soilMultipliers[selectedSoil] || soilMultipliers['Black Cotton Soil'];

  const area = Math.max(0.1, parseFloat(acreage) || 1);

  // Compute Total Elemental Nutrient Requirements in kg
  const totalN = cropData.baseN * soilData.N_mult * area;
  const totalP = cropData.baseP * soilData.P_mult * area;
  const totalK = cropData.baseK * soilData.K_mult * area;

  // Commercial Fertilizer Conversions:
  // DAP (18% N, 46% P2O5) -> Supplies P and part of N
  const dapKgTotal = totalP / 0.46;
  const nFromDap = dapKgTotal * 0.18;

  // Remaining N supplied via Urea (46% N)
  const remainingN = Math.max(0, totalN - nFromDap);
  const ureaKgTotal = remainingN / 0.46;

  // MOP (60% K2O) -> Supplies K
  const mopKgTotal = totalK / 0.60;

  // Zinc Sulphate (21% Zn)
  const zincKgTotal = cropData.zincKg * area;

  // FYM Compost (Tonnes)
  const fymTonnesTotal = cropData.fymTonnes * area;

  // Bags (Urea is 45kg bag, DAP is 50kg bag, MOP is 50kg bag)
  const dapBags = Math.ceil(dapKgTotal / 50);
  const ureaBags = Math.ceil(ureaKgTotal / 45);
  const mopBags = Math.ceil(mopKgTotal / 50);

  // Approximate Market Prices (Govt Subsidized Rates in INR)
  // Urea: ₹266.50 per 45kg bag
  // DAP: ₹1,350 per 50kg bag
  // MOP: ₹1,700 per 50kg bag
  // Zinc: ₹65 per kg
  const totalFertilizerCost = (ureaBags * 266.5) + (dapBags * 1350) + (mopBags * 1700) + (zincKgTotal * 65);

  const handleCopyPlan = () => {
    const text = `🌾 CROPSHIELD AI - KHAD MITRA FERTILIZER PLAN
-------------------------------------------------
Crop: ${selectedCrop}
Soil Type: ${selectedSoil}
Farm Area: ${area} Acre(s)

📦 COMMERCIAL BAG REQUIREMENTS:
• Urea (45 kg bags): ${ureaBags} Bags (${Math.round(ureaKgTotal)} kg)
• DAP (50 kg bags): ${dapBags} Bags (${Math.round(dapKgTotal)} kg)
• MOP (50 kg bags): ${mopBags} Bags (${Math.round(mopKgTotal)} kg)
• Zinc Sulphate (21%): ${Math.round(zincKgTotal)} kg
• Well-Rotted FYM Compost: ${fymTonnesTotal.toFixed(1)} Tonnes
• Total Subsidized Cost: ~₹${Math.round(totalFertilizerCost).toLocaleString('en-IN')}

🗓️ 3-STAGE APPLICATION SCHEDULE:
1. BASAL DOSE (At Sowing/Transplanting):
   - DAP: 100% (${dapBags} bags)
   - MOP: 50% (${(mopBags * 0.5).toFixed(1)} bags)
   - Urea: 25% (${(ureaBags * 0.25).toFixed(1)} bags)
   - Full Zinc Sulphate & FYM compost

2. 1st TOP DRESSING (20-25 Days):
   - Urea: 50% (${(ureaBags * 0.5).toFixed(1)} bags)
   - MOP: 25% (${(mopBags * 0.25).toFixed(1)} bags)

3. 2nd TOP DRESSING (Flowering / Fruiting):
   - Urea: 25% (${(ureaBags * 0.25).toFixed(1)} bags)
   - MOP: 25% (${(mopBags * 0.25).toFixed(1)} bags)

💡 Agronomist Tip: ${cropData.notes}
-------------------------------------------------
Generated by CropShield AI Precision Agronomy`;

    navigator.clipboard?.writeText(text);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-content-card" style={{ maxWidth: '820px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div className="title-with-icon">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sprout size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                NPK Soil Nutrient & Fertilizer Calculator (Khad Mitra)
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Balanced Nitrogen, Phosphate & Potash dosage tailored to your crop and soil type to avoid pathogen flare-ups
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-form-body mt-14" style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
          {/* 1. INPUT SELECTION ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Target Crop *
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', background: '#fff' }}
              >
                {Object.keys(cropNutrientProfiles).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Soil Texture / Type *
              </label>
              <select
                value={selectedSoil}
                onChange={(e) => setSelectedSoil(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', background: '#fff' }}
              >
                {Object.keys(soilMultipliers).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Farm Area (Acres) *
              </label>
              <input
                type="number"
                min="0.1"
                step="0.25"
                value={acreage}
                onChange={(e) => setAcreage(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: 700 }}
              />
            </div>
          </div>

          {/* 2. BAG REQUIREMENT CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
            {/* UREA */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                Urea (46% N)
              </span>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                {ureaBags} <span style={{ fontSize: '13px', fontWeight: 600 }}>Bags</span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {Math.round(ureaKgTotal)} kg (@ ₹266/bag)
              </span>
            </div>

            {/* DAP */}
            <div style={{ background: '#eff6ff', border: '1.5px solid #93c5fd', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase' }}>
                DAP (18-46-0)
              </span>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#1d4ed8', margin: '4px 0' }}>
                {dapBags} <span style={{ fontSize: '13px', fontWeight: 600 }}>Bags</span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {Math.round(dapKgTotal)} kg (@ ₹1,350/bag)
              </span>
            </div>

            {/* MOP (POTASH) */}
            <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
                MOP Potash (60% K)
              </span>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#b45309', margin: '4px 0' }}>
                {mopBags} <span style={{ fontSize: '13px', fontWeight: 600 }}>Bags</span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {Math.round(mopKgTotal)} kg (@ ₹1,700/bag)
              </span>
            </div>

            {/* ZINC & FYM */}
            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                Micro & Organic
              </span>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#15803d', margin: '4px 0' }}>
                {Math.round(zincKgTotal)} kg Zn
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                + {fymTonnesTotal.toFixed(1)} Tonnes FYM
              </span>
            </div>
          </div>

          {/* 3. 3-STAGE SPLIT APPLICATION ROADMAP */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Layers size={16} color="#16a34a" />
              <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: 800, color: '#0f172a' }}>
                3-Phase Scientific Application Schedule
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {/* STAGE 1 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase' }}>
                  🌱 Phase 1: Basal Application
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
                  • 100% DAP ({dapBags} Bags)<br />
                  • 50% MOP ({(mopBags * 0.5).toFixed(1)} Bags)<br />
                  • 25% Urea ({(ureaBags * 0.25).toFixed(1)} Bags)<br />
                  • Full Zinc Sulphate & FYM Compost
                </p>
              </div>

              {/* STAGE 2 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                  🌿 Phase 2: 1st Top Dressing (20-30 DAS)
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
                  • 50% Urea ({(ureaBags * 0.5).toFixed(1)} Bags)<br />
                  • 25% MOP ({(mopBags * 0.25).toFixed(1)} Bags)<br />
                  • Apply when soil has adequate moisture
                </p>
              </div>

              {/* STAGE 3 */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#d97706', textTransform: 'uppercase' }}>
                  🌸 Phase 3: 2nd Top Dressing (Flowering)
                </span>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
                  • 25% Urea ({(ureaBags * 0.25).toFixed(1)} Bags)<br />
                  • 25% MOP ({(mopBags * 0.25).toFixed(1)} Bags)<br />
                  • Foliar Boron / Micronutrient spray
                </p>
              </div>
            </div>
          </div>

          {/* 4. DISEASE PREVENTION & AGRONOMY WARNING */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <AlertTriangle size={18} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#78350f', lineHeight: 1.4 }}>
              <strong>⚠️ Critical Disease Prevention Advice:</strong> Over-application of Urea makes leaves overly succulent, directly triggering fungal blights (Early & Late Blight) and attracting aphids/whiteflies. Always balance Nitrogen with recommended Muriate of Potash (MOP) to build tough leaf epidermal cell walls.
            </div>
          </div>

          {/* 5. FOOTER TOTAL & ACTIONS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '11.5px', color: '#64748b' }}>Estimated Subsidized Cost: </span>
              <strong style={{ fontSize: '16px', color: '#166534' }}>
                ₹{Math.round(totalFertilizerCost).toLocaleString('en-IN')}
              </strong>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-pill-action btn-settings-pill"
                onClick={handleCopyPlan}
                style={{ padding: '8px 14px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {copiedPlan ? <Check size={14} color="#16a34a" /> : <FileText size={14} />}
                <span>{copiedPlan ? 'Copied to Clipboard!' : 'Copy Khad Schedule'}</span>
              </button>

              <button
                type="button"
                className="btn-pill-action btn-settings-pill"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
