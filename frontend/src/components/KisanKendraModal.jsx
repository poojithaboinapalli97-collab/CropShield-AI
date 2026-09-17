import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  Building2,
  Tractor,
  FlaskConical,
  Store,
  CheckCircle2,
  ExternalLink,
  Clock,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { indianStates, stateDistrictMap } from '../data/indiaLocations';

const kendraDirectory = [
  {
    id: 'kvk-01',
    name: 'Krishi Vigyan Kendra (KVK) - Lam Farm',
    type: 'kvk',
    typeLabel: 'ICAR Research Station & KVK',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    address: 'Lam Farm, Amaravathi Road, Guntur, AP - 522034',
    phone: '+91 863 252 4001',
    timing: '09:00 AM – 05:30 PM (Mon-Sat)',
    services: ['Plant Disease Diagnosis', 'Soil Sample Testing', 'Certified Seed Distribution', 'Kisan Helpline'],
    verified: true,
  },
  {
    id: 'stl-01',
    name: 'District Soil Testing Laboratory (Dept of Agriculture)',
    type: 'soil',
    typeLabel: 'Govt Soil Testing Lab',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    address: 'Collectorate Complex, Nagarampalem, Guntur - 522004',
    phone: '+91 863 223 1890',
    timing: '10:00 AM – 05:00 PM',
    services: ['12-Parameter NPK & Micronutrient Analysis', 'Soil Health Card Issue', 'Water Salinity Testing'],
    verified: true,
  },
  {
    id: 'chc-01',
    name: 'Rythu Bharosa Custom Hiring Center (CHC) & Drone Hub',
    type: 'chc',
    typeLabel: 'Custom Hiring & Machinery Rent',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    address: 'Tadikonda Mandal Center, Guntur District',
    phone: '+91 944 012 3456',
    timing: '06:00 AM – 07:00 PM',
    services: ['Krishi Drone Spraying @ ₹400/acre', 'Tractor Boom Sprayer Rent', 'Rotavator & Laser Leveler'],
    verified: true,
  },
  {
    id: 'apmc-01',
    name: 'Guntur Agricultural Market Committee (Mirchi & Grain Mandi)',
    type: 'mandi',
    typeLabel: 'APMC Market Yard',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    address: 'Market Yard, G.T. Road, Guntur - 522001',
    phone: '+91 863 222 3400',
    timing: '06:00 AM – 02:00 PM',
    services: ['Daily E-NAM Electronic Auctions', 'Cold Storage Warehousing', 'Grain Quality Assay'],
    verified: true,
  },
  {
    id: 'kvk-02',
    name: 'Krishi Vigyan Kendra (PJTSAU) - Wyra',
    type: 'kvk',
    typeLabel: 'ICAR Research Station & KVK',
    state: 'Telangana',
    district: 'Khammam',
    address: 'Wyra, Khammam District, Telangana - 507165',
    phone: '+91 874 925 1234',
    timing: '09:30 AM – 05:00 PM',
    services: ['Cotton Pest Surveillance', 'Bio-fertilizer Supply', 'Agronomist Field Visit'],
    verified: true,
  },
  {
    id: 'kvk-03',
    name: 'KVK Pune (Narayangaon - KVK Baramati)',
    type: 'kvk',
    typeLabel: 'ICAR Research Station & KVK',
    state: 'Maharashtra',
    district: 'Pune',
    address: 'Narayangaon / Baramati Center, Pune, MH - 413115',
    phone: '+91 211 225 5227',
    timing: '09:00 AM – 05:30 PM',
    services: ['Grape & Tomato Disease Lab', 'Tissue Culture Plants', 'Soil & Petiole Testing'],
    verified: true,
  },
];

export default function KisanKendraModal({
  isOpen,
  onClose,
  initialState = 'Andhra Pradesh',
  initialDistrict = 'Guntur',
}) {
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = kendraDirectory.filter((item) => {
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.services.some((s) => s.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div className="modal-content-card" style={{ maxWidth: '880px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div className="title-with-icon">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                Near-Me Krishi Kendra, Labs & Custom Hiring Centers
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Direct contact directory for verified KVK Centers, Soil Testing Labs, Machinery Custom Hiring & APMC Mandis
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* SEARCH & FILTER STRIP */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginTop: '14px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>State</label>
            <select
              value={selectedState}
              onChange={(e) => {
                const st = e.target.value;
                setSelectedState(st);
                const dists = stateDistrictMap[st] || [];
                setSelectedDistrict(dists[0] || '');
              }}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
            >
              {indianStates.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
            >
              {(stateDistrictMap[selectedState] || []).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px', color: '#334155' }}>Search Center or Service</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 'drone spray', 'soil test', 'seed', 'kvk'..."
                style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>
        </div>

        {/* TYPE TABS */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '10px 0 6px 0', borderBottom: '1px solid #e2e8f0' }}>
          {[
            { id: 'all', label: 'All Agro-Centers' },
            { id: 'kvk', label: '🏛️ KVK Research Stations' },
            { id: 'soil', label: '🧪 Soil Testing Labs' },
            { id: 'chc', label: '🚜 CHC Machinery & Drone Rent' },
            { id: 'mandi', label: '🏪 APMC Market Yards' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`btn-pill-action ${selectedType === tab.id ? 'btn-green-pill' : 'btn-settings-pill'}`}
              style={{ padding: '5px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}
              onClick={() => setSelectedType(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CARDS LIST */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginTop: '14px', maxHeight: '55vh', overflowY: 'auto', paddingRight: '4px' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', color: '#16a34a', background: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                  {item.typeLabel}
                </span>
                {item.verified && (
                  <span style={{ fontSize: '11px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}>
                    <ShieldCheck size={13} /> Verified
                  </span>
                )}
              </div>

              <h4 style={{ margin: '4px 0 2px 0', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                {item.name}
              </h4>

              <div style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                <MapPin size={13} style={{ flexShrink: 0, marginTop: '2px', color: '#64748b' }} />
                <span>{item.address}</span>
              </div>

              <div style={{ fontSize: '11.5px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} />
                <span>{item.timing}</span>
              </div>

              {/* SERVICES CHIPS */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                {item.services.map((svc, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '10.5px',
                      background: '#f1f5f9',
                      color: '#334155',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}
                  >
                    • {svc}
                  </span>
                ))}
              </div>

              {/* CALL BUTTON */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9', marginTop: '4px' }}>
                <a
                  href={`tel:${item.phone}`}
                  className="btn-pill-action btn-phone-pill"
                  style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none' }}
                >
                  <Phone size={13} />
                  <span>Call {item.phone}</span>
                </a>

                <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>
                  Free Govt Assistance
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid #e2e8f0', marginTop: '10px' }}>
          <button
            type="button"
            className="btn-pill-action btn-settings-pill"
            onClick={onClose}
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
}
