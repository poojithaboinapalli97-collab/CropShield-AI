import React, { useState } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  ShieldAlert,
  Droplets,
  Activity,
  Bug,
  Leaf,
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Clock,
  FlaskConical,
} from 'lucide-react';

const cropCalendars = {
  Tomato: [
    {
      stage: 'Stage 1: Nursery & Seedling',
      days: '0 – 20 Days',
      icon: '🌱',
      riskLevel: 'Medium',
      primaryThreats: 'Damping Off (Pythium), Root Rot, Seedling Flea Beetle',
      preventativeSpray: 'Seed treatment with Trichoderma viride @ 5 g/kg or Carbendazim @ 2 g/kg. Drench nursery bed with Copper Oxychloride @ 2.5 g/L.',
      irrigation: 'Light misting every 2 days; avoid waterlogging.',
      scoutingTip: 'Check for seedling wilting or stem rot at soil line.',
    },
    {
      stage: 'Stage 2: Vegetative Growth',
      days: '20 – 45 Days',
      icon: '🌿',
      riskLevel: 'High',
      primaryThreats: 'Early Blight (Alternaria), Bacterial Spot, Whitefly Vector, Leaf Miner',
      preventativeSpray: 'Apply Mancozeb 75% WP @ 2.0 g/L or Azoxystrobin @ 1.0 ml/L. Install 10 yellow sticky traps/acre.',
      irrigation: 'Drip irrigation 40 mins every 2-3 days (Maintain 65-70% soil moisture).',
      scoutingTip: 'Inspect lower leaf surfaces for concentric brown rings and whiteflies.',
    },
    {
      stage: 'Stage 3: Flowering & Fruit Set',
      days: '45 – 65 Days',
      icon: '🌸',
      riskLevel: 'Critical',
      primaryThreats: 'Late Blight (Phytophthora), Blossom End Rot, Tomato Fruit Borer (Helicoverpa)',
      preventativeSpray: 'Foliar spray Calcium Nitrate @ 2.0 g/L + Boron @ 1.0 g/L. Spray Emamectin Benzoate 5% SG @ 0.4 g/L for borer prevention.',
      irrigation: 'Critical moisture window. Maintain uniform irrigation to prevent fruit cracking.',
      scoutingTip: 'Check flowers for thrips and early pin-hole entry on young green tomatoes.',
    },
    {
      stage: 'Stage 4: Fruit Development & Ripening',
      days: '65 – 90 Days',
      icon: '🍅',
      riskLevel: 'Medium',
      primaryThreats: 'Anthracnose Fruit Rot, Sunscald, Mosaic Virus',
      preventativeSpray: 'Spray Azoxystrobin + Difenoconazole @ 1.0 ml/L. Maintain 5-day Pre-Harvest Interval.',
      irrigation: 'Reduce watering slightly 5 days before picking to concentrate fruit sugars.',
      scoutingTip: 'Discard dropped or rotten fruits immediately outside field perimeter.',
    },
    {
      stage: 'Stage 5: Harvesting & Post-Harvest',
      days: '90 – 120 Days',
      icon: '🧺',
      riskLevel: 'Low',
      primaryThreats: 'Post-Harvest Soft Rot, Fruit Bruising',
      preventativeSpray: 'No chemical sprays within 3 days of harvest. Harvest during cool morning hours.',
      irrigation: 'Light irrigation immediately after each picking cycle to support continuous flushing.',
      scoutingTip: 'Sort and grade harvested tomatoes in shaded collection crates.',
    },
  ],
  Cotton: [
    {
      stage: 'Stage 1: Germination & Emergence',
      days: '0 – 25 Days',
      icon: '🌱',
      riskLevel: 'Medium',
      primaryThreats: 'Root Rot, Early Sucking Pests (Thrips, Jassids)',
      preventativeSpray: 'Seed treatment with Imidacloprid 600 FS @ 5 ml/kg seed.',
      irrigation: 'Provide light irrigation for uniform crop stand.',
      scoutingTip: 'Monitor seedling emergence rate and check underside of cotyledon leaves.',
    },
    {
      stage: 'Stage 2: Square & Branching Stage',
      days: '25 – 60 Days',
      icon: '🌿',
      riskLevel: 'High',
      primaryThreats: 'Cotton Leaf Curl Virus (CLCuV), Bacterial Blight, Whitefly Flare-up',
      preventativeSpray: 'Install yellow sticky traps (15/acre). Spray Neem Oil 10,000 ppm @ 3 ml/L or Diafenthiuron 50% WP @ 1.2 g/L.',
      irrigation: 'Irrigate at 12-15 day intervals in black soil.',
      scoutingTip: 'Check top leaves for upward cupping and vein thickening.',
    },
    {
      stage: 'Stage 3: Flowering & Boll Formation',
      days: '60 – 100 Days',
      icon: '🌸',
      riskLevel: 'Critical',
      primaryThreats: 'Pink Bollworm (Pectinophora), Grey Mildew, Alternaria Leaf Spot',
      preventativeSpray: 'Install Pheromone traps @ 8/acre. Spray Profenofos 50% EC @ 2 ml/L or Chlorantraniliprole 18.5% SC @ 0.3 ml/L.',
      irrigation: 'Maintain optimal moisture; avoid water stress during boll expansion.',
      scoutingTip: 'Inspect flower rosettes and dissect green bolls for pink bollworm entry.',
    },
    {
      stage: 'Stage 4: Boll Bursting & Picking',
      days: '100 – 150 Days',
      icon: '☁️',
      riskLevel: 'Low',
      primaryThreats: 'Boll Rot due to unseasonal rains, Cotton Stainer bug',
      preventativeSpray: 'Spray Copper Oxychloride 50% WP @ 2.5 g/L if wet weather occurs during boll bursting.',
      irrigation: 'Cease irrigation 20 days prior to final harvest.',
      scoutingTip: 'Pick clean seed-cotton in dry sunny weather.',
    },
  ],
  'Rice / Paddy': [
    {
      stage: 'Stage 1: Nursery & Seedling',
      days: '0 – 25 Days',
      icon: '🌱',
      riskLevel: 'Medium',
      primaryThreats: 'Brown Spot, Seedling Blast, Thrips',
      preventativeSpray: 'Seed treatment with Tricyclazole 75% WP @ 2 g/kg. Spray Pseudomonas fluorescens @ 5 g/L in nursery.',
      irrigation: 'Maintain 2-3 cm shallow standing water layer.',
      scoutingTip: 'Check nursery leaf tips for brown spindle lesions.',
    },
    {
      stage: 'Stage 2: Tillering & Vegetative',
      days: '25 – 55 Days',
      icon: '🌿',
      riskLevel: 'High',
      primaryThreats: 'Stem Borer (Dead hearts), Bacterial Leaf Blight (Xanthomonas)',
      preventativeSpray: 'Apply Cartap Hydrochloride 4% G @ 7.5 kg/acre or Chlorantraniliprole @ 0.3 ml/L. Spray Streptocycline 1g/10L for BLB.',
      irrigation: 'Maintain 3-5 cm water; avoid drainage during active tillering.',
      scoutingTip: 'Check for central dead hearts and leaf margin yellowing.',
    },
    {
      stage: 'Stage 3: Panicle Initiation & Booting',
      days: '55 – 85 Days',
      icon: '🌾',
      riskLevel: 'Critical',
      primaryThreats: 'Neck Blast, Sheath Blight (Rhizoctonia), Brown Plant Hopper (BPH)',
      preventativeSpray: 'Spray Tricyclazole 75% WP @ 0.6 g/L + Hexaconazole 5% SC @ 2 ml/L. Form alleys every 2 meters for BPH aeration.',
      irrigation: 'Do not allow field to crack; keep standing water intact.',
      scoutingTip: 'Inspect stem base near water line for sheath blight lesions.',
    },
    {
      stage: 'Stage 4: Grain Filling & Maturity',
      days: '85 – 120 Days',
      icon: '🍚',
      riskLevel: 'Low',
      primaryThreats: 'False Smut, Rice Gundhi Bug',
      preventativeSpray: 'Spray Copper Hydroxide 53.8% DF @ 2.0 g/L at early boot stage for false smut prevention.',
      irrigation: 'Drain water completely 10 days before harvesting.',
      scoutingTip: 'Harvest when 85% of panicles turn golden yellow.',
    },
  ],
};

export default function CropCalendarModal({ isOpen, onClose, currentCrop = 'Tomato' }) {
  const [selectedCrop, setSelectedCrop] = useState(currentCrop);
  const [activeStageIdx, setActiveStageIdx] = useState(1);

  if (!isOpen) return null;

  const calendar = cropCalendars[selectedCrop] || cropCalendars['Tomato'];
  const activeStage = calendar[activeStageIdx] || calendar[0];

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-content-card" style={{ maxWidth: '840px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div className="title-with-icon">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                Crop Growth & Seasonal Pest Calendar (Fasal Charka)
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Stage-by-stage disease vulnerability forecasting, prophylactic sprays & irrigation timelines
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* CROP SELECTOR STRIP */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>Select Crop:</span>
            <select
              value={selectedCrop}
              onChange={(e) => {
                setSelectedCrop(e.target.value);
                setActiveStageIdx(0);
              }}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff', fontWeight: 700 }}
            >
              {Object.keys(cropCalendars).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <span style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 700, background: '#dcfce7', padding: '3px 10px', borderRadius: '9999px' }}>
            🌾 Standard Field Lifecycle: {calendar.length} Key Growth Milestones
          </span>
        </div>

        {/* HORIZONTAL STAGE STEPPER */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '12px 0 6px 0', borderBottom: '1px solid #e2e8f0' }}>
          {calendar.map((stg, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveStageIdx(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: activeStageIdx === idx ? '1.5px solid #16a34a' : '1px solid #e2e8f0',
                background: activeStageIdx === idx ? '#f0fdf4' : '#ffffff',
                color: activeStageIdx === idx ? '#166534' : '#475569',
                cursor: 'pointer',
                fontWeight: activeStageIdx === idx ? 800 : 600,
                fontSize: '12px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{stg.icon}</span>
              <span>{stg.stage.split(':')[1] || stg.stage}</span>
            </button>
          ))}
        </div>

        {/* ACTIVE STAGE DETAIL CARD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>{activeStage.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                    {activeStage.stage}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    📅 Timeline: <strong>{activeStage.days}</strong>
                  </span>
                </div>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  background: activeStage.riskLevel === 'Critical' ? '#fee2e2' : activeStage.riskLevel === 'High' ? '#fed7aa' : '#dbeafe',
                  color: activeStage.riskLevel === 'Critical' ? '#991b1b' : activeStage.riskLevel === 'High' ? '#9a3412' : '#1e40af',
                }}
              >
                {activeStage.riskLevel} Pathogen Vulnerability
              </span>
            </div>

            {/* THREATS & SPRAYS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginTop: '6px' }}>
              {/* PRIMARY THREATS */}
              <div style={{ background: '#ffffff', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <ShieldAlert size={15} color="#dc2626" />
                  <strong style={{ fontSize: '12.5px', color: '#991b1b' }}>Key Disease & Pest Risks:</strong>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
                  {activeStage.primaryThreats}
                </p>
              </div>

              {/* PROPHYLACTIC SPRAY */}
              <div style={{ background: '#ffffff', border: '1px solid #86efac', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <FlaskConical size={15} color="#16a34a" />
                  <strong style={{ fontSize: '12.5px', color: '#166534' }}>Prophylactic / Preventative Spray:</strong>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
                  {activeStage.preventativeSpray}
                </p>
              </div>

              {/* IRRIGATION GUIDELINE */}
              <div style={{ background: '#ffffff', border: '1px solid #93c5fd', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Droplets size={15} color="#2563eb" />
                  <strong style={{ fontSize: '12.5px', color: '#1e40af' }}>Irrigation & Moisture:</strong>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
                  {activeStage.irrigation}
                </p>
              </div>

              {/* SCOUTING ACTIONS */}
              <div style={{ background: '#ffffff', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Activity size={15} color="#d97706" />
                  <strong style={{ fontSize: '12.5px', color: '#92400e' }}>Field Scouting Focus:</strong>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>
                  {activeStage.scoutingTip}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid #e2e8f0', marginTop: '10px' }}>
          <button
            type="button"
            className="btn-pill-action btn-settings-pill"
            onClick={onClose}
          >
            Close Calendar
          </button>
        </div>
      </div>
    </div>
  );
}
