/**
 * CropShield AI - Unified Notification & Alert Center Modal
 * Precision Agri-Vision (Smart Agriculture & Crop Health)
 * 
 * Supports 4 Alert Categories:
 * 1. 🌾 Crop alerts
 * 2. 🦠 Disease alerts
 * 3. 🌧️ Weather alerts
 * 4. 🧑‍🌾 Expert response notifications
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertTriangle,
  CloudRain,
  Sprout,
  ShieldAlert,
  UserCheck,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  Filter,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  getUnifiedNotifications,
  toggleNotificationRead,
  markAllNotificationsRead,
} from '../services/notificationHubService.js';
import '../styles/NotificationCenterModal.css';

export default function NotificationCenterModal({
  isOpen = false,
  onClose = () => {},
}) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(getUnifiedNotifications);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'crop' | 'disease' | 'weather' | 'expert'
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState(null);

  useEffect(() => {
    const refresh = () => setNotifications(getUnifiedNotifications());
    window.addEventListener('cropshield_notifications_updated', refresh);
    return () => {
      window.removeEventListener('cropshield_notifications_updated', refresh);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const handleToggleRead = (id) => {
    const updated = toggleNotificationRead(id);
    setNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = markAllNotificationsRead();
    setNotifications(updated);
  };

  const handleSpeakAlert = (notif) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech audio narration is not supported in this browser.');
      return;
    }

    if (currentlySpeakingId === notif.id) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = notif.spokenText || `${notif.categoryLabel}: ${notif.title}. ${notif.message}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;

    utterance.onstart = () => setCurrentlySpeakingId(notif.id);
    utterance.onend = () => setCurrentlySpeakingId(null);
    utterance.onerror = () => setCurrentlySpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleActionClick = (notif) => {
    if (notif.actionRoute) {
      onClose();
      navigate(notif.actionRoute);
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeCategory === 'all') return true;
    return n.category === activeCategory;
  });

  const unreadTotal = notifications.filter((n) => !n.read).length;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'expert':
        return <UserCheck size={16} className="ic-expert" />;
      case 'disease':
        return <ShieldAlert size={16} className="ic-disease" />;
      case 'weather':
        return <CloudRain size={16} className="ic-weather" />;
      case 'crop':
      default:
        return <Sprout size={16} className="ic-crop" />;
    }
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="modal-content-card notif-modal-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="notif-modal-header">
          <div className="notif-title-group">
            <div className="notif-logo-badge">
              <Bell size={20} className="text-white" />
            </div>
            <div>
              <div className="notif-title-row">
                <h3 className="notif-title">CropShield Notification Hub</h3>
                {unreadTotal > 0 && (
                  <span className="notif-unread-count-badge">
                    {unreadTotal} Unread
                  </span>
                )}
              </div>
              <p className="notif-subtitle">
                Real-time Crop milestones, Regional disease outbreaks, Weather risks, and KVK Expert prescriptions.
              </p>
            </div>
          </div>

          <div className="notif-header-actions">
            {unreadTotal > 0 && (
              <button
                type="button"
                className="notif-mark-all-btn"
                onClick={handleMarkAllRead}
              >
                <CheckCheck size={14} />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              type="button"
              className="notif-close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="notif-filter-tabs-bar">
          <button
            type="button"
            className={`notif-tab-chip ${activeCategory === 'all' ? 'tab-active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <span>All Notifications</span>
            <span className="tab-pill-count">{notifications.length}</span>
          </button>

          <button
            type="button"
            className={`notif-tab-chip ${activeCategory === 'crop' ? 'tab-active' : ''}`}
            onClick={() => setActiveCategory('crop')}
          >
            <Sprout size={14} />
            <span>🌾 Crop Alerts</span>
            <span className="tab-pill-count">
              {notifications.filter((n) => n.category === 'crop').length}
            </span>
          </button>

          <button
            type="button"
            className={`notif-tab-chip ${activeCategory === 'disease' ? 'tab-active' : ''}`}
            onClick={() => setActiveCategory('disease')}
          >
            <ShieldAlert size={14} />
            <span>🦠 Disease Alerts</span>
            <span className="tab-pill-count">
              {notifications.filter((n) => n.category === 'disease').length}
            </span>
          </button>

          <button
            type="button"
            className={`notif-tab-chip ${activeCategory === 'weather' ? 'tab-active' : ''}`}
            onClick={() => setActiveCategory('weather')}
          >
            <CloudRain size={14} />
            <span>🌧️ Weather Alerts</span>
            <span className="tab-pill-count">
              {notifications.filter((n) => n.category === 'weather').length}
            </span>
          </button>

          <button
            type="button"
            className={`notif-tab-chip ${activeCategory === 'expert' ? 'tab-active' : ''}`}
            onClick={() => setActiveCategory('expert')}
          >
            <UserCheck size={14} />
            <span>🧑‍🌾 Expert Responses</span>
            <span className="tab-pill-count">
              {notifications.filter((n) => n.category === 'expert').length}
            </span>
          </button>
        </div>

        {/* NOTIFICATIONS LIST BODY */}
        <div className="notif-list-body">
          {filteredNotifs.length === 0 ? (
            <div className="notif-empty-state">
              <CheckCircle2 size={36} className="text-emerald" />
              <h4>No active notifications in this category</h4>
              <p>Your crops and field diagnostics are running normally.</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => {
              const isSpeaking = currentlySpeakingId === notif.id;

              return (
                <div
                  key={notif.id}
                  className={`notif-item-card notif-cat-${notif.category} ${notif.read ? 'notif-read' : 'notif-unread'}`}
                  onClick={() => handleToggleRead(notif.id)}
                >
                  <div className="notif-item-left-strip">
                    <div className={`notif-cat-icon-wrap cat-bg-${notif.category}`}>
                      {getCategoryIcon(notif.category)}
                    </div>
                  </div>

                  <div className="notif-item-content">
                    <div className="notif-item-meta-row">
                      <div className="notif-tags-group">
                        <span className={`notif-category-tag tag-${notif.category}`}>
                          {notif.categoryLabel}
                        </span>
                        {!notif.read && <span className="notif-new-dot">NEW</span>}
                      </div>

                      <div className="notif-meta-right">
                        <span className="notif-timestamp">
                          <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />
                          {notif.timestamp}
                        </span>
                        <button
                          type="button"
                          className={`notif-speak-icon-btn ${isSpeaking ? 'speaking-active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeakAlert(notif);
                          }}
                          title={isSpeaking ? 'Stop Audio' : 'Listen Voice Narration'}
                        >
                          {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        </button>
                      </div>
                    </div>

                    <h4 className="notif-item-title">{notif.title}</h4>
                    <p className="notif-item-message">{notif.message}</p>

                    <div className="notif-item-footer">
                      <button
                        type="button"
                        className="notif-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(notif);
                        }}
                      >
                        <span>{notif.actionText}</span>
                        <ArrowRight size={13} />
                      </button>

                      <span className="notif-toggle-hint">
                        {notif.read ? 'Click to mark unread' : 'Click to mark read'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
