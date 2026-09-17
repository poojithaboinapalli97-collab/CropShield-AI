import React, { useState } from 'react';
import {
  X,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Phone,
  FileCheck2,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
  Filter,
  Check,
  Percent,
} from 'lucide-react';

const schemesData = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'income',
    categoryLabel: 'Direct Income Support',
    benefit: '₹6,000 / Year',
    benefitSub: 'Direct Bank Transfer (3 equal installments of ₹2,000)',
    eligibility: 'All landholding farmer families with cultivable land in their name.',
    subsidyRate: '100% Central Government Grant',
    requiredDocs: [
      'Aadhaar Card linked to Bank Account',
      'Land Ownership Documents (Khatauni / 7/12 / RoR / Pahani)',
      'Bank Account Passbook (with IFSC Code)',
      'Active Mobile Number for e-KYC OTP',
    ],
    officialUrl: 'https://pmkisan.gov.in',
    helpline: '155261 / 1800-115-526',
    status: 'Active (Installment 18 Open)',
    featured: true,
  },
  {
    id: 'pmfby',
    title: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    category: 'insurance',
    categoryLabel: 'Crop Insurance & Risk Cover',
    benefit: 'Comprehensive Yield & Post-Harvest Loss Cover',
    benefitSub: 'Farmer pays only 1.5% - 2% subsidized premium; balance paid by Govt.',
    eligibility: 'All farmers (loanee and non-loanee) growing notified food grains, oilseeds, and horticultural crops.',
    subsidyRate: 'Govt subsidizes 85%–90% of actual premium cost',
    requiredDocs: [
      'Sowing Certificate / Patwari Land Record',
      'Aadhaar Card & Bank Account details',
      'Crop Sowing Declaration / Geo-tagged crop photo',
      'Loss Intimation within 72 hours of unseasonal rain/pest outbreak',
    ],
    officialUrl: 'https://pmfby.gov.in',
    helpline: '14447 (Crop Loss Helpline)',
    status: 'Kharif & Rabi Windows Active',
    featured: true,
  },
  {
    id: 'pmksy',
    title: 'PMKSY - Per Drop More Crop (Drip & Sprinkler Subsidy)',
    category: 'irrigation',
    categoryLabel: 'Micro-Irrigation Subsidy',
    benefit: 'Up to 55% - 75% Subsidy on Drip & Sprinkler Systems',
    benefitSub: '55% for General farmers, up to 75% for Small & Marginal (SF/MF) and Women farmers.',
    eligibility: 'Farmers having assured water source (borewell, open well, canal connection) and cultivable land.',
    subsidyRate: '55% to 75% Financial Assistance',
    requiredDocs: [
      'Land Record (Pahani / Adangal / 7/12)',
      'Water Source Electricity Bill / Pump Certificate',
      'Field Layout Sketch prepared by Micro-Irrigation Engineer',
      'Aadhaar & Bank Account Copy',
    ],
    officialUrl: 'https://pmksy.gov.in',
    helpline: '1800-180-1551',
    status: 'State Portals Accepting Applications',
    featured: true,
  },
  {
    id: 'smam-drone',
    title: 'SMAM & Krishi Drone Subsidy (Agricultural Mechanization)',
    category: 'machinery',
    categoryLabel: 'Drone & Machinery Subsidy',
    benefit: '50% to 80% Subsidy on Agricultural Spray Drones',
    benefitSub: 'Up to ₹5 Lakh (50%) for SC/ST, Small/Marginal & Women farmers; 80% for FPOs.',
    eligibility: 'Individual progressive farmers, Custom Hiring Centers (CHC), Farmer Producer Orgs (FPOs).',
    subsidyRate: '50% to 80% Subsidy on DGCA Certified Drones',
    requiredDocs: [
      'Farmer Identity & Land Possession Certificate',
      'DGCA Certified Remote Pilot License or CHC registration',
      'Quotation from Authorized Drone Manufacturer',
      'Bank Guarantee / Passbook',
    ],
    officialUrl: 'https://agrimachinery.nic.in',
    helpline: '011-2338-7200',
    status: 'Open under Sub-Mission on Agri Mechanization',
    featured: false,
  },
  {
    id: 'pkvy',
    title: 'Paramparagat Krishi Vikas Yojana (PKVY Organic Scheme)',
    category: 'organic',
    categoryLabel: 'Organic & Bio-Farming Cluster',
    benefit: '₹50,000 / Hectare over 3 Years',
    benefitSub: '₹31,000 direct assistance for organic bio-fertilizers, neem cake, and bio-agents.',
    eligibility: 'Farmers forming a group/cluster of 20 or more farmers (min. 50 acres cluster).',
    subsidyRate: '100% Organic Input & Certification Support',
    requiredDocs: [
      'Cluster Membership Form & PGS-India Organic Registration',
      'Soil Health Baseline Test Report',
      'Aadhaar & Bank Details of Farmer Group',
    ],
    officialUrl: 'https://pgsindia-ncof.gov.in',
    helpline: '1800-180-1551',
    status: 'Cluster Applications Active',
    featured: false,
  },
  {
    id: 'kcc',
    title: 'Kisan Credit Card (KCC Subsidized Crop Loan)',
    category: 'credit',
    categoryLabel: 'Subsidized Crop Loan',
    benefit: 'Crop Loans up to ₹3 Lakh @ Effective 4% Interest Rate',
    benefitSub: '7% base interest rate with 3% Prompt Repayment Incentive (PRI) from RBI.',
    eligibility: 'All farmers, tenant farmers, oral lessees, and sharecroppers.',
    subsidyRate: '3% Interest Subvention (Net 4% p.a.)',
    requiredDocs: [
      'Duly filled KCC application form',
      'Land revenue records / crop acreage proof',
      'Aadhaar Card & PAN Card / Voter ID',
      'No Dues Certificate from nearby bank branches',
    ],
    officialUrl: 'https://www.myscheme.gov.in/schemes/kcc',
    helpline: '1800-180-1111',
    status: 'Available across all Nationalized & Grameena Banks',
    featured: false,
  },
  {
    id: 'soil-health',
    title: 'Soil Health Card Scheme (Free Soil Testing & Nutrient Card)',
    category: 'soil',
    categoryLabel: 'Soil Testing & Nutrient Health',
    benefit: 'Free GPS-Enabled Soil Testing for 12 Parameters (N, P, K, pH, Zinc, etc.)',
    benefitSub: 'Provides tailored fertilizer dosages to reduce Urea overspending by 20%-30%.',
    eligibility: 'All farmers across India; samples collected every 2 years by Dept of Agriculture.',
    subsidyRate: '100% Free Government Testing & Advisory',
    requiredDocs: [
      'Land Plot Khata / Survey Number',
      'Farmer Mobile Number & Aadhaar',
    ],
    officialUrl: 'https://soilhealth.dac.gov.in',
    helpline: '011-2430-5000',
    status: 'Active at all District Soil Labs',
    featured: false,
  },
];

export default function KisanYojanaModal({ isOpen, onClose, userState = 'Andhra Pradesh' }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeScheme, setActiveScheme] = useState(schemesData[0]);
  const [checkedDocs, setCheckedDocs] = useState({});

  if (!isOpen) return null;

  const filteredSchemes = schemesData.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  const toggleDocCheck = (docName) => {
    setCheckedDocs((prev) => ({ ...prev, [docName]: !prev[docName] }));
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-content-card" style={{ maxWidth: '900px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div className="title-with-icon">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Landmark size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                PM Kisan & Government Subsidy Navigator
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Central & State ({userState}) agricultural schemes, insurance claims, drip subsidies & Krishi Drone assistance
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* CATEGORY FILTER CHIPS */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '12px 0 6px 0', borderBottom: '1px solid #e2e8f0' }}>
          {[
            { id: 'all', label: '🌟 All Schemes' },
            { id: 'income', label: '💵 Income Support (PM-Kisan)' },
            { id: 'insurance', label: '🛡️ Crop Insurance (PMFBY)' },
            { id: 'irrigation', label: '💧 Drip / Micro-Irrigation' },
            { id: 'machinery', label: '🛸 Drone & Mechanization' },
            { id: 'organic', label: '🌿 Organic Farming (PKVY)' },
            { id: 'credit', label: '💳 Kisan Credit Card (4%)' },
            { id: 'soil', label: '🧪 Soil Health Card' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`btn-pill-action ${selectedCategory === cat.id ? 'btn-green-pill' : 'btn-settings-pill'}`}
              style={{ padding: '5px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* DUAL COLUMN: SCHEME LIST + DETAILED APPLICATION CARD */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '14px', maxHeight: '65vh', overflowY: 'auto', paddingRight: '4px' }}>
          {/* LEFT: SCHEMES LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                onClick={() => setActiveScheme(scheme)}
                style={{
                  background: activeScheme.id === scheme.id ? '#f0fdf4' : '#ffffff',
                  border: `1.5px solid ${activeScheme.id === scheme.id ? '#16a34a' : '#e2e8f0'}`,
                  borderRadius: '10px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: activeScheme.id === scheme.id ? '0 4px 12px rgba(22, 163, 74, 0.12)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', color: '#16a34a', background: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                    {scheme.categoryLabel}
                  </span>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                    {scheme.benefit}
                  </span>
                </div>
                <h4 style={{ margin: '4px 0 2px 0', fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                  {scheme.title}
                </h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.3 }}>
                  {scheme.benefitSub}
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT: SELECTED SCHEME DETAILS & APPLY CARD */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '4px' }}>
                  {activeScheme.categoryLabel}
                </span>
                <h3 style={{ margin: '6px 0 2px 0', fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  {activeScheme.title}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 700 }}>
                  ● {activeScheme.status}
                </span>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Assistance Value</span>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#15803d' }}>
                  {activeScheme.benefit}
                </div>
              </div>
            </div>

            {/* KEY HIGHLIGHTS */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px' }}>
              <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.4, marginBottom: '6px' }}>
                <strong>🎯 Eligibility Criteria:</strong> {activeScheme.eligibility}
              </div>
              <div style={{ fontSize: '12px', color: '#1e40af', lineHeight: 1.4 }}>
                <strong>💰 Subsidy Rate:</strong> {activeScheme.subsidyRate}
              </div>
            </div>

            {/* REQUIRED DOCUMENTS CHECKLIST */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <FileCheck2 size={15} color="#16a34a" />
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>
                  Required Application Documents:
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {activeScheme.requiredDocs.map((doc, idx) => (
                  <label
                    key={idx}
                    onClick={() => toggleDocCheck(doc)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: checkedDocs[doc] ? '#166534' : '#475569',
                      background: checkedDocs[doc] ? '#dcfce7' : '#ffffff',
                      border: `1px solid ${checkedDocs[doc] ? '#86efac' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedDocs[doc]}
                      onChange={() => {}}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ textDecoration: checkedDocs[doc] ? 'line-through' : 'none' }}>
                      {doc}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* HELPLINE & DIRECT APPLY BUTTON */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
              <a
                href={`tel:${activeScheme.helpline.split('/')[0].trim()}`}
                style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Phone size={13} />
                <span>Helpline: {activeScheme.helpline}</span>
              </a>

              <a
                href={activeScheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="scan-cta-large-btn"
                style={{ width: 'auto', padding: '8px 16px', fontSize: '12.5px', textDecoration: 'none' }}
              >
                <span>Apply on Official Portal</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
