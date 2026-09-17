/**
 * CropShield AI - Unified Notification & Alert Hub Service
 * Precision Agri-Vision (Smart Agriculture & Crop Health)
 * 
 * Supports 4 Alert Categories:
 * 1. Crop alerts (Growth stages, nutrition top dressing, irrigation schedule)
 * 2. Disease alerts (Regional outbreak surge within 15-35km, blight warnings)
 * 3. Weather alerts (High humidity spore incubation, rainfall risk, storm warnings)
 * 4. Expert response notifications (KVK agronomist clinical validation ready)
 */

export const INITIAL_NOTIFICATIONS = [
  // 1. EXPERT RESPONSE NOTIFICATIONS
  {
    id: 'NOTIF-EXP-01',
    category: 'expert',
    categoryLabel: 'Expert Response',
    title: 'KVK Agronomist Verification Completed',
    message: 'Dr. K. Ramanjaneyulu (Senior Plant Pathologist, KVK Lam Farm) validated your Tomato scan #SC-8921. Recommended Copper Oxychloride + Streptocycline foliar prescription.',
    timestamp: '15 mins ago',
    date: '2026-09-17',
    read: false,
    severity: 'high',
    actionText: 'View Clinical Prescription',
    actionRoute: '/dashboard',
    spokenText: 'KVK Agronomist Dr. Ramanjaneyulu completed clinical verification for your Tomato scan. Prescription ready on your dashboard.',
  },

  // 2. DISEASE ALERTS
  {
    id: 'NOTIF-DIS-02',
    category: 'disease',
    categoryLabel: 'Disease Alert',
    title: 'Regional Outbreak Warning: Chilli Anthracnose',
    message: 'Surge detected across 14 neighbouring farms in Guntur District within 18 km radius. Spore dispersal risk is HIGH. Inspect undersides of leaves immediately.',
    timestamp: '2 hours ago',
    date: '2026-09-17',
    read: false,
    severity: 'critical',
    actionText: 'View Outbreak Containment Map',
    actionRoute: '/map',
    spokenText: 'Disease alert: Surge in Chilli Anthracnose reported within 18 kilometers of your farm. Inspect foliage today.',
  },

  // 3. WEATHER ALERTS
  {
    id: 'NOTIF-WEA-03',
    category: 'weather',
    categoryLabel: 'Weather Alert',
    title: 'High Humidity & Precipitation Warning',
    message: 'Relative humidity forecasted above 86% with rainfall probability at 65%. Postpone non-systemic foliar chemical spraying to prevent wash-off.',
    timestamp: '4 hours ago',
    date: '2026-09-17',
    read: false,
    severity: 'medium',
    actionText: 'Check Spraying Window',
    actionRoute: '/weather',
    spokenText: 'Weather alert: Relative humidity above 86 percent. Postpone chemical spray until weather clears.',
  },

  // 4. CROP ALERTS
  {
    id: 'NOTIF-CRP-04',
    category: 'crop',
    categoryLabel: 'Crop Alert',
    title: 'Flowering Stage Nutritional Top-Dressing Due',
    message: 'Your Tomato crop entered Day 45 (Peak Flowering). Apply 19:19:19 water soluble fertilizer @ 5 g/L with Micronutrient Boron 20% @ 1.0 g/L for fruit set.',
    timestamp: 'Yesterday',
    date: '2026-09-16',
    read: true,
    severity: 'low',
    actionText: 'Open Crop Advisory',
    actionRoute: '/dashboard',
    spokenText: 'Crop alert: Your tomato crop is at peak flowering. Apply recommended 19 19 19 nutritional spray.',
  },

  // 5. DISEASE ALERT
  {
    id: 'NOTIF-DIS-05',
    category: 'disease',
    categoryLabel: 'Disease Alert',
    title: 'Early Blight (Alternaria) Containment Protocol',
    message: 'Spotting confirmed on lower foliage in Field Sector 2. Remove infected bottom leaves and maintain 65% soil moisture to arrest fungal travel.',
    timestamp: '2 days ago',
    date: '2026-09-15',
    read: true,
    severity: 'high',
    actionText: 'View Treatment Steps',
    actionRoute: '/detect',
    spokenText: 'Disease alert: Early blight spotted on lower foliage. Prune bottom leaves to arrest fungal spread.',
  },

  // 6. CROP ALERT
  {
    id: 'NOTIF-CRP-06',
    category: 'crop',
    categoryLabel: 'Crop Alert',
    title: 'Drip Irrigation Schedule Reminder',
    message: 'Soil moisture is optimal at 68%. Scheduled 45-minute morning drip cycle configured for tomorrow at 06:30 AM.',
    timestamp: '3 days ago',
    date: '2026-09-14',
    read: true,
    severity: 'low',
    actionText: 'View Soil Sensor Log',
    actionRoute: '/dashboard',
    spokenText: 'Crop alert: Scheduled 45 minute drip irrigation cycle for tomorrow morning at 6:30 AM.',
  },
];

const NOTIFICATIONS_STORAGE_KEY = 'cropshield_unified_notifications';

/**
 * Get all notifications with persistent storage synchronization
 */
export const getUnifiedNotifications = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (e) {
    console.warn('Error reading stored notifications:', e);
  }
  return INITIAL_NOTIFICATIONS;
};

/**
 * Get notifications filtered by category
 * @param {'all' | 'crop' | 'disease' | 'weather' | 'expert'} category
 */
export const getNotificationsByCategory = (category = 'all') => {
  const all = getUnifiedNotifications();
  if (!category || category === 'all') return all;
  return all.filter((n) => n.category === category);
};

/**
 * Toggle read/unread state for a notification
 */
export const toggleNotificationRead = (id) => {
  const all = getUnifiedNotifications();
  const updated = all.map((n) => (n.id === id ? { ...n, read: !n.read } : n));
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('cropshield_notifications_updated'));
    }
  } catch (e) {
    console.warn('Error persisting notification state:', e);
  }
  return updated;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = () => {
  const all = getUnifiedNotifications();
  const updated = all.map((n) => ({ ...n, read: true }));
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('cropshield_notifications_updated'));
    }
  } catch (e) {
    console.warn('Error persisting notifications:', e);
  }
  return updated;
};

/**
 * Push a new notification into the stream (e.g. from Expert Validation or Risk Outbreak)
 */
export const dispatchNewNotification = (notificationData) => {
  const all = getUnifiedNotifications();
  const newNotif = {
    id: `NOTIF-${Date.now()}`,
    timestamp: 'Just now',
    date: new Date().toISOString().split('T')[0],
    read: false,
    severity: 'medium',
    ...notificationData,
  };

  const updated = [newNotif, ...all];
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('cropshield_notifications_updated'));
    }
  } catch (e) {
    console.warn('Error adding new notification:', e);
  }
  return updated;
};
