/**
 * CropShield AI - APMC Mandi & Real-time Market Intelligence Modal
 * Precision Agri-Vision (Smart Agriculture & Crop Health)
 * 
 * Features:
 * 1. Live APMC Mandi Prices (Wholesale ₹/Qtl & Retail ₹/kg)
 * 2. Instant Reactive Search & 18+ Commodity Dropdown
 * 3. Live GPS Location Access (Auto-detect GPS coordinates + District Picker)
 * 4. Dynamic Distance Calculator (Haversine km) & Google Maps Directions
 * 5. Dynamic 7-Day Trajectory with real calendar day labels
 * 6. Market Sentiment & Arrival Volumes
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Store,
  MapPin,
  Phone,
  Clock,
  ArrowUpRight,
  Calculator,
  X,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronDown,
  Navigation,
  Compass,
  LocateFixed,
  Loader2,
  ExternalLink,
  Zap,
} from 'lucide-react';
import {
  getMandiPrices,
  getMandiForCrop,
  MAJOR_AGRI_DISTRICTS,
  findNearestDistrict,
  calculateDistanceKm,
} from '../services/mandiService.js';
import '../styles/MandiMarketModal.css';

export default function MandiMarketModal({
  isOpen = false,
  onClose = () => {},
  currentCrop = 'Tomato',
  selectedDistrict = 'Guntur',
}) {
  const [selectedCropName, setSelectedCropName] = useState(currentCrop || 'Tomato');
  const [searchFilter, setSearchFilter] = useState('');
  const [priceUnit, setPriceUnit] = useState('qtl'); // 'qtl' (₹/Quintal) or 'kg' (₹/Kg)
  const [calcMode, setCalcMode] = useState('qtl'); // 'qtl' or 'kg'
  const [calcQty, setCalcQty] = useState(15); // for profit calculation

  // Location Access States
  const [userCoords, setUserCoords] = useState(null); // { lat, lng }
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');
  const [activeDistrictObj, setActiveDistrictObj] = useState(() => {
    const match = MAJOR_AGRI_DISTRICTS.find((d) =>
      d.name.toLowerCase().includes((selectedDistrict || '').toLowerCase())
    );
    return match || MAJOR_AGRI_DISTRICTS[0];
  });

  // Sync selected crop whenever currentCrop prop or modal opens
  useEffect(() => {
    if (currentCrop) {
      setSelectedCropName(currentCrop);
    }
    if (selectedDistrict) {
      const match = MAJOR_AGRI_DISTRICTS.find((d) =>
        d.name.toLowerCase().includes(selectedDistrict.toLowerCase())
      );
      if (match) {
        setActiveDistrictObj(match);
        setUserCoords({ lat: match.lat, lng: match.lng });
      }
    }
  }, [currentCrop, selectedDistrict, isOpen]);

  // Handle Live GPS Geolocation request
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocationStatus('Acquiring high-accuracy GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const coords = { lat: latitude, lng: longitude };
        setUserCoords(coords);

        const nearestDist = findNearestDistrict(latitude, longitude);
        setActiveDistrictObj(nearestDist);
        setLocating(false);
        setLocationStatus(
          `GPS Active: ${nearestDist.name}, ${nearestDist.state} (±${Math.round(accuracy)}m)`
        );
      },
      (error) => {
        setLocating(false);
        console.warn('GPS location error:', error.message);
        setLocationStatus('GPS Access denied. Using selected district fallback.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Handle manual district change
  const handleDistrictChange = (distId) => {
    const found = MAJOR_AGRI_DISTRICTS.find((d) => d.id === distId);
    if (found) {
      setActiveDistrictObj(found);
      setUserCoords({ lat: found.lat, lng: found.lng });
      setLocationStatus(`Location: ${found.name}, ${found.state}`);
    }
  };

  const allMandiRates = getMandiPrices();

  // Instant reactive search handler
  const handleSearchChange = (query) => {
    setSearchFilter(query);
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;

    // Check if query matches any existing crop
    const matched = allMandiRates.find((m) =>
      m.crop.toLowerCase().startsWith(trimmed) ||
      m.crop.toLowerCase().includes(trimmed) ||
      m.variety.toLowerCase().includes(trimmed)
    );

    if (matched) {
      setSelectedCropName(matched.crop);
    } else if (trimmed.length >= 2) {
      setSelectedCropName(query.trim());
    }
  };

  const handleSelectCrop = (cropName) => {
    setSelectedCropName(cropName);
    setSearchFilter('');
  };

  if (!isOpen) return null;

  // Active Mandi with dynamic distance adjustment
  const activeMandi = getMandiForCrop(selectedCropName, userCoords || { lat: activeDistrictObj.lat, lng: activeDistrictObj.lng });

  const displayList = searchFilter.trim()
    ? allMandiRates.filter((m) =>
        m.crop.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.variety.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.mandi.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : allMandiRates;

  // Earnings calculation based on Qtl or Kg
  const ratePerQtl = activeMandi.modalPrice || 2200;
  const ratePerKg = activeMandi.modalPriceKg || (ratePerQtl / 100);
  const estimatedEarnings = calcMode === 'qtl'
    ? ratePerQtl * Number(calcQty || 0)
    : ratePerKg * Number(calcQty || 0);

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="modal-content-card mandi-modal-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="mandi-modal-header">
          <div className="mandi-header-title-wrap">
            <div className="mandi-header-icon">
              <Store size={22} className="text-white" />
            </div>
            <div>
              <div className="mandi-title-row">
                <h3 className="mandi-title">APMC Mandi & Real-time Market Intelligence</h3>
                <span className="mandi-live-badge">AGMARKNET LIVE FEED</span>
              </div>
              <p className="mandi-subtitle">
                Live daily wholesale & retail commodity prices, real 7-day trajectories, and GPS-localized APMC market yards across India.
              </p>
            </div>
          </div>

          <button type="button" className="mandi-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="mandi-modal-body">
          {/* LOCATION ACCESS & GEO-ROUTING BAR */}
          <div className="mandi-location-banner">
            <div className="mlb-left">
              <div className="mlb-icon-wrap">
                <MapPin size={16} className="text-emerald" />
              </div>
              <div>
                <div className="mlb-title-row">
                  <span className="mlb-title">Farmer Location & APMC Radius:</span>
                  <span className="mlb-active-loc">
                    <strong>{activeDistrictObj.name}</strong>, {activeDistrictObj.state}
                  </span>
                </div>
                {locationStatus && <span className="mlb-status-text">{locationStatus}</span>}
              </div>
            </div>

            <div className="mlb-actions-row">
              {/* GPS Auto-Detect Button */}
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={locating}
                className={`mandi-gps-btn ${userCoords ? 'gps-active' : ''}`}
                title="Detect my live GPS location"
              >
                {locating ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Locating...</span>
                  </>
                ) : (
                  <>
                    <LocateFixed size={14} />
                    <span>Auto-Detect GPS</span>
                  </>
                )}
              </button>

              {/* District Switcher */}
              <div className="mandi-district-select-wrap">
                <select
                  value={activeDistrictObj.id}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="mandi-district-dropdown"
                >
                  {MAJOR_AGRI_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      📍 {d.name}, {d.state} ({d.hub})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SEARCH & CROP SELECTOR BAR */}
          <div className="mandi-controls-bar">
            {/* Search Input with instant matching */}
            <div className="mandi-search-input-wrap">
              <Search size={16} className="mandi-search-icon" />
              <input
                type="text"
                placeholder="Type crop name (e.g. Potato, Onion, Tomato, Wheat, Cotton, Chilli, Grape...)"
                value={searchFilter}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchFilter.trim()) {
                    handleSearchChange(searchFilter);
                  }
                }}
                className="mandi-search-input-field"
              />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="mandi-search-clear-btn"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Quick Dropdown Selector for All Crops */}
            <div className="mandi-dropdown-wrap">
              <select
                value={allMandiRates.some(m => m.crop.toLowerCase() === selectedCropName.toLowerCase()) ? selectedCropName : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    handleSelectCrop(e.target.value);
                  }
                }}
                className="mandi-crop-select-dropdown"
              >
                <option value="" disabled>-- Select Any Crop ({allMandiRates.length}) --</option>
                {allMandiRates.map((m) => (
                  <option key={m.id} value={m.crop}>
                    {m.crop} (₹{m.modalPrice.toLocaleString('en-IN')}/Qtl • ₹{m.modalPriceKg}/kg)
                  </option>
                ))}
              </select>
            </div>

            {/* Price Unit Switcher: Quintal vs Kg */}
            <div className="mandi-unit-toggle-group">
              <button
                type="button"
                className={`mandi-unit-btn ${priceUnit === 'qtl' ? 'unit-btn-active' : ''}`}
                onClick={() => setPriceUnit('qtl')}
              >
                ₹ / Quintal
              </button>
              <button
                type="button"
                className={`mandi-unit-btn ${priceUnit === 'kg' ? 'unit-btn-active' : ''}`}
                onClick={() => setPriceUnit('kg')}
              >
                ₹ / Kg
              </button>
            </div>
          </div>

          {/* ACTIVE COMMODITY PILLS BAR */}
          <div className="mandi-pills-section">
            <div className="mandi-pills-label-row">
              <span className="mandi-pills-label">
                Quick Select ({displayList.length} crops):
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {activeMandi.sentiment && (
                  <span className="mandi-sentiment-pill">
                    <Zap size={11} style={{ display: 'inline', marginRight: '3px' }} />
                    {activeMandi.sentiment}
                  </span>
                )}
                <span className="mandi-active-indicator">
                  Viewing: <strong>{activeMandi.crop}</strong>
                </span>
              </div>
            </div>
            <div className="mandi-crop-pills-bar">
              {displayList.map((m) => {
                const isSelected = selectedCropName.toLowerCase().includes(m.crop.toLowerCase()) || 
                                   m.crop.toLowerCase().includes(selectedCropName.toLowerCase());
                return (
                  <button
                    key={m.id}
                    type="button"
                    className={`mandi-crop-chip ${isSelected ? 'mandi-chip-active' : ''}`}
                    onClick={() => handleSelectCrop(m.crop)}
                  >
                    <span className="chip-crop-name">{m.crop}</span>
                    <strong className="chip-price">
                      {priceUnit === 'qtl'
                        ? `₹${m.modalPrice.toLocaleString('en-IN')}`
                        : `₹${m.modalPriceKg || (m.modalPrice/100).toFixed(1)}/kg`}
                    </strong>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 1: MANDI PRICES & 7-DAY PRICE TRENDS GRID */}
          <div className="mandi-primary-grid">
            {/* CARD 1: ACTIVE MANDI PRICE CARD */}
            <div className="mandi-hero-price-card">
              <div className="mhc-top-bar">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="mhc-variety-tag">{activeMandi.variety}</span>
                    {activeMandi.grade && <span className="mhc-grade-tag">{activeMandi.grade}</span>}
                  </div>
                  <h4 className="mhc-crop-name">{activeMandi.crop}</h4>
                  <span className="mhc-location-text">
                    <MapPin size={13} style={{ display: 'inline', marginRight: '3px' }} /> 
                    {activeMandi.mandi}, {activeMandi.district}
                  </span>
                </div>
                <div className={`mhc-trend-badge ${activeMandi.trendType === 'up' ? 'trend-badge-up' : 'trend-badge-down'}`}>
                  {activeMandi.trendType === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{activeMandi.trendPercent} Today</span>
                </div>
              </div>

              <div className="mhc-price-display-row">
                <div>
                  <span className="mhc-label">Today's Real-time Modal Price</span>
                  <div className="mhc-big-price">
                    {priceUnit === 'qtl' ? (
                      <>
                        ₹{activeMandi.modalPrice?.toLocaleString('en-IN')}
                        <span className="mhc-unit">/ Quintal (100 kg)</span>
                        <div className="mhc-sub-rate">
                          ≈ ₹{activeMandi.modalPriceKg || (activeMandi.modalPrice/100).toFixed(2)} per kg
                        </div>
                      </>
                    ) : (
                      <>
                        ₹{activeMandi.modalPriceKg || (activeMandi.modalPrice/100).toFixed(2)}
                        <span className="mhc-unit">/ kg</span>
                        <div className="mhc-sub-rate">
                          ≈ ₹{activeMandi.modalPrice?.toLocaleString('en-IN')} per Quintal
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mhc-range-box">
                  <div className="range-item">
                    <span className="range-lbl">Min Daily Rate</span>
                    <span className="range-val">
                      {priceUnit === 'qtl'
                        ? `₹${activeMandi.minPrice?.toLocaleString('en-IN')}`
                        : `₹${activeMandi.minPriceKg || (activeMandi.minPrice/100).toFixed(1)}/kg`}
                    </span>
                  </div>
                  <div className="range-divider"></div>
                  <div className="range-item">
                    <span className="range-lbl">Max Daily Rate</span>
                    <span className="range-val text-emerald">
                      {priceUnit === 'qtl'
                        ? `₹${activeMandi.maxPrice?.toLocaleString('en-IN')}`
                        : `₹${activeMandi.maxPriceKg || (activeMandi.maxPrice/100).toFixed(1)}/kg`}
                    </span>
                  </div>
                  <div className="range-divider"></div>
                  <div className="range-item">
                    <span className="range-lbl">Govt. MSP</span>
                    <span className="range-val">
                      {priceUnit === 'qtl'
                        ? `₹${activeMandi.mspPrice?.toLocaleString('en-IN')}`
                        : `₹${(activeMandi.mspPrice/100).toFixed(1)}/kg`}
                    </span>
                  </div>
                </div>
              </div>

              {/* EARNINGS ESTIMATOR */}
              <div className="mandi-calculator-box">
                <div className="calc-header">
                  <Calculator size={14} className="text-emerald" />
                  <span>Harvest Revenue Estimator:</span>
                  <div className="calc-unit-toggle">
                    <button
                      type="button"
                      className={`calc-toggle-btn ${calcMode === 'qtl' ? 'active' : ''}`}
                      onClick={() => setCalcMode('qtl')}
                    >
                      Quintals (100kg)
                    </button>
                    <button
                      type="button"
                      className={`calc-toggle-btn ${calcMode === 'kg' ? 'active' : ''}`}
                      onClick={() => setCalcMode('kg')}
                    >
                      Kilograms (Kg)
                    </button>
                  </div>
                </div>
                <div className="calc-inputs-row">
                  <div className="calc-input-wrap">
                    <label>Harvest Qty ({calcMode === 'qtl' ? 'Quintals' : 'Kg'}):</label>
                    <input
                      type="number"
                      min="1"
                      max="100000"
                      value={calcQty}
                      onChange={(e) => setCalcQty(e.target.value)}
                      className="calc-num-input"
                    />
                  </div>
                  <div className="calc-output-wrap">
                    <label>Estimated Market Value (Gross):</label>
                    <div className="calc-total-val">
                      ₹{Math.round(estimatedEarnings).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: 7-DAY PRICE TRENDS VISUALIZER */}
            <div className="mandi-trend-card">
              <div className="mtc-header">
                <div className="mtc-title-row">
                  <TrendingUp size={16} className="text-emerald" />
                  <h5>7-Day Price Trajectory</h5>
                </div>
                <span className="mtc-updated-text">{activeMandi.lastUpdated}</span>
              </div>

              <div className="mandi-trend-bars-container">
                {activeMandi.sevenDayTrend?.map((pt, idx) => {
                  const maxTrendVal = Math.max(...activeMandi.sevenDayTrend.map((t) => t.price));
                  const minTrendVal = Math.min(...activeMandi.sevenDayTrend.map((t) => t.price));
                  const range = maxTrendVal - minTrendVal;
                  const heightPercent = range > 0
                    ? Math.max(25, Math.round(((pt.price - minTrendVal + (range * 0.1)) / (range * 1.2)) * 100))
                    : 70;
                  const isToday = idx === activeMandi.sevenDayTrend.length - 1;

                  const displayPrice = priceUnit === 'qtl'
                    ? (pt.price >= 10000 ? `₹${(pt.price/1000).toFixed(1)}k` : `₹${pt.price}`)
                    : `₹${(pt.price / 100).toFixed(0)}`;

                  return (
                    <div key={idx} className="trend-bar-col">
                      <span className="tb-price-val">{displayPrice}</span>
                      <div className="tb-track">
                        <div
                          className={`tb-fill ${isToday ? 'tb-fill-today' : ''}`}
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                      </div>
                      <span className={`tb-day-label ${isToday ? 'tb-day-today' : ''}`}>{pt.day}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mtc-footer-advisory">
                <CheckCircle2 size={14} className="text-emerald" style={{ flexShrink: 0 }} />
                <span>
                  Modal rate is running <strong>₹{Math.max(0, activeMandi.modalPrice - activeMandi.mspPrice)} above Government MSP benchmark</strong>. Daily arrival volume: <strong>{activeMandi.arrivalQty}</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 2: NEARBY APMC MARKET YARDS TABLE */}
          <div className="mandi-nearby-markets-section">
            <div className="section-title-row">
              <div className="str-left">
                <Store size={18} className="text-emerald" />
                <h4 className="section-heading">Nearby APMC Markets & Yards ({activeMandi.nearbyMarkets?.length || 0})</h4>
              </div>
              <span className="str-info">
                Sorted by distance from {activeDistrictObj.name} • Verified trade contacts
              </span>
            </div>

            <div className="nearby-markets-table-wrap">
              <table className="nearby-markets-table">
                <thead>
                  <tr>
                    <th>APMC Market Yard</th>
                    <th>GPS Distance</th>
                    <th>Today's Live Rate</th>
                    <th>Arrival Volume</th>
                    <th>Trading Hours</th>
                    <th>Trade Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMandi.nearbyMarkets?.map((market, idx) => (
                    <tr key={idx} className={idx === 0 ? 'row-best-price' : ''}>
                      <td>
                        <div className="market-name-wrap">
                          <strong>{market.name}</strong>
                          {idx === 0 && <span className="tag-nearest">Nearest Yard</span>}
                        </div>
                      </td>
                      <td>
                        <span className="distance-badge">
                          <MapPin size={12} /> {market.distanceKm} km
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <strong className="table-price-val">
                            ₹{market.price.toLocaleString('en-IN')}
                            <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#64748b' }}> / Qtl</span>
                          </strong>
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>
                            ₹{market.priceKg || (market.price / 100).toFixed(2)} / kg
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="arrivals-val">{market.arrivals}</span>
                      </td>
                      <td>
                        <span className="trading-hours-val">
                          <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {market.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <a href={`tel:${market.phone.replace(/ /g, '')}`} className="phone-link" title="Call APMC Yard">
                            <Phone size={12} /> {market.phone}
                          </a>
                          {market.lat && market.lng && (
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${market.lat},${market.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="directions-link"
                              title="Get Google Maps Driving Route"
                            >
                              <Navigation size={12} /> Route
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
