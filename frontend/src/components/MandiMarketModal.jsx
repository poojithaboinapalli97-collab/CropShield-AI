/**
 * CropShield AI - APMC Mandi & Market Intelligence Modal
 * Precision Agri-Vision (Smart Agriculture & Crop Health)
 * 
 * Features:
 * 1. Mandi Prices
 * 2. 7-Day Price Trends
 * 3. Nearby Market Information (Distance, Arrivals, Trading Hours)
 */

import React, { useState } from 'react';
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
} from 'lucide-react';
import { getMandiPrices, getMandiForCrop } from '../services/mandiService.js';
import '../styles/MandiMarketModal.css';

export default function MandiMarketModal({
  isOpen = false,
  onClose = () => {},
  currentCrop = 'Tomato',
  selectedDistrict = 'Guntur',
}) {
  const [selectedCropName, setSelectedCropName] = useState(currentCrop || 'Tomato');
  const [searchFilter, setSearchFilter] = useState('');
  const [qtyQuintals, setQtyQuintals] = useState(15); // for profit calculation

  const allMandiRates = getMandiPrices();
  const activeMandi = getMandiForCrop(selectedCropName);

  if (!isOpen) return null;

  const filteredMandiList = allMandiRates.filter(
    (m) =>
      m.crop.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.district.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.mandi.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const estimatedEarnings = (activeMandi.modalPrice || 2100) * Number(qtyQuintals || 0);

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
                <h3 className="mandi-title">APMC Mandi & Market Intelligence</h3>
                <span className="mandi-live-badge">AGMARKNET LIVE</span>
              </div>
              <p className="mandi-subtitle">
                Real-time commodity prices, 7-day price trajectories, and nearby APMC market yards in {selectedDistrict}.
              </p>
            </div>
          </div>

          <button type="button" className="mandi-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="mandi-modal-body">
          {/* TOP COMMODITY SELECTOR PILLS */}
          <div className="mandi-crop-pills-bar">
            {allMandiRates.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`mandi-crop-chip ${selectedCropName.toLowerCase().includes(m.crop.toLowerCase()) || m.crop.toLowerCase().includes(selectedCropName.toLowerCase()) ? 'mandi-chip-active' : ''}`}
                onClick={() => setSelectedCropName(m.crop)}
              >
                <span>{m.crop}</span>
                <strong className="chip-price">₹{m.modalPrice.toLocaleString('en-IN')}</strong>
              </button>
            ))}
          </div>

          {/* SECTION 1: MANDI PRICES & 7-DAY PRICE TRENDS GRID */}
          <div className="mandi-primary-grid">
            {/* CARD 1: ACTIVE MANDI PRICE CARD */}
            <div className="mandi-hero-price-card">
              <div className="mhc-top-bar">
                <div>
                  <span className="mhc-variety-tag">{activeMandi.variety}</span>
                  <h4 className="mhc-crop-name">{activeMandi.crop}</h4>
                  <span className="mhc-location-text">
                    <MapPin size={13} style={{ display: 'inline' }} /> {activeMandi.mandi}, {activeMandi.district}
                  </span>
                </div>
                <div className={`mhc-trend-badge ${activeMandi.trendType === 'up' ? 'trend-badge-up' : 'trend-badge-down'}`}>
                  {activeMandi.trendType === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{activeMandi.trendPercent} Today</span>
                </div>
              </div>

              <div className="mhc-price-display-row">
                <div>
                  <span className="mhc-label">Today's Modal Price</span>
                  <div className="mhc-big-price">
                    ₹{activeMandi.modalPrice?.toLocaleString('en-IN')}
                    <span className="mhc-unit">/ Quintal</span>
                  </div>
                </div>

                <div className="mhc-range-box">
                  <div className="range-item">
                    <span className="range-lbl">Min Rate</span>
                    <span className="range-val">₹{activeMandi.minPrice?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="range-divider"></div>
                  <div className="range-item">
                    <span className="range-lbl">Max Rate</span>
                    <span className="range-val text-emerald">₹{activeMandi.maxPrice?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="range-divider"></div>
                  <div className="range-item">
                    <span className="range-lbl">Govt. MSP</span>
                    <span className="range-val">₹{activeMandi.mspPrice?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* EARNINGS ESTIMATOR */}
              <div className="mandi-calculator-box">
                <div className="calc-header">
                  <Calculator size={14} className="text-emerald" />
                  <span>Harvest Revenue Estimator:</span>
                </div>
                <div className="calc-inputs-row">
                  <div className="calc-input-wrap">
                    <label>Harvest Qty (Quintals):</label>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={qtyQuintals}
                      onChange={(e) => setQtyQuintals(e.target.value)}
                      className="calc-num-input"
                    />
                  </div>
                  <div className="calc-output-wrap">
                    <label>Estimated Market Value:</label>
                    <div className="calc-total-val">
                      ₹{estimatedEarnings.toLocaleString('en-IN')}
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
                <span className="mtc-updated-text">Updated {activeMandi.lastUpdated}</span>
              </div>

              <div className="mandi-trend-bars-container">
                {activeMandi.sevenDayTrend?.map((pt, idx) => {
                  const maxTrendVal = Math.max(...activeMandi.sevenDayTrend.map((t) => t.price));
                  const minTrendVal = Math.min(...activeMandi.sevenDayTrend.map((t) => t.price));
                  const heightPercent = Math.max(30, Math.round(((pt.price - minTrendVal + 100) / (maxTrendVal - minTrendVal + 150)) * 100));
                  const isToday = idx === activeMandi.sevenDayTrend.length - 1;

                  return (
                    <div key={idx} className="trend-bar-col">
                      <span className="tb-price-val">₹{pt.price >= 10000 ? `${(pt.price/1000).toFixed(1)}k` : pt.price}</span>
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
                <CheckCircle2 size={14} className="text-emerald" />
                <span>
                  Price is running <strong>₹{activeMandi.modalPrice - activeMandi.mspPrice} above Government MSP</strong>. Favorable time for market dispatch.
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
              <span className="str-info">Real-time arrival volume & trade contacts</span>
            </div>

            <div className="nearby-markets-table-wrap">
              <table className="nearby-markets-table">
                <thead>
                  <tr>
                    <th>APMC Market Yard</th>
                    <th>Distance</th>
                    <th>Today's Rate</th>
                    <th>Arrival Volume</th>
                    <th>Trading Hours</th>
                    <th>Contact Phone</th>
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
                        <strong className="table-price-val">₹{market.price.toLocaleString('en-IN')}</strong> / Qtl
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
                        <a href={`tel:${market.phone.replace(/ /g, '')}`} className="phone-link">
                          <Phone size={12} /> {market.phone}
                        </a>
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
