/**
 * CropShield AI - APMC Mandi & Market Intelligence Service
 * Precision Agri-Vision (Smart Agriculture & Crop Health)
 * 
 * Features:
 * - Mandi Prices (Live & Modal rates per Quintal)
 * - 7-Day Price Trends & Percentage Trajectory
 * - Nearby APMC Market Information (Distance, Arrivals, Trading Hours, Contact)
 */

export const INITIAL_MANDI_PRICES = [
  {
    id: 'm-tomato',
    crop: 'Tomato',
    variety: 'Hybrid F1 / Vaishnavi',
    mandi: 'Guntur Main APMC Yard',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    modalPrice: 2150,
    minPrice: 1850,
    maxPrice: 2450,
    unit: '₹ / Quintal',
    trend: '+150',
    trendPercent: '+7.5%',
    trendType: 'up',
    arrivalQty: '1,450 Qtl',
    lastUpdated: 'Today, 07:30 AM',
    mspPrice: 1900,
    sevenDayTrend: [
      { day: 'Day -6', price: 1850 },
      { day: 'Day -5', price: 1900 },
      { day: 'Day -4', price: 1920 },
      { day: 'Day -3', price: 1980 },
      { day: 'Day -2', price: 2050 },
      { day: 'Yesterday', price: 2000 },
      { day: 'Today', price: 2150 },
    ],
    nearbyMarkets: [
      { name: 'Guntur Main APMC Yard', distanceKm: 4.2, price: 2150, arrivals: '1,450 Qtl', status: 'Open (06:00 AM - 02:00 PM)', phone: '+91 863 2234500' },
      { name: 'Tenali Sub-Market Yard', distanceKm: 18.5, price: 2080, arrivals: '620 Qtl', status: 'Open (07:00 AM - 01:00 PM)', phone: '+91 864 4221190' },
      { name: 'Vijayawada Commercial APMC', distanceKm: 34.0, price: 2220, arrivals: '2,900 Qtl', status: 'Open (05:30 AM - 03:00 PM)', phone: '+91 866 2548900' },
      { name: 'Narasaraopet Market Yard', distanceKm: 48.0, price: 2020, arrivals: '410 Qtl', status: 'Open (07:30 AM - 12:30 PM)', phone: '+91 864 7220040' },
    ],
  },
  {
    id: 'm-chilli',
    crop: 'Chilli / Pepper',
    variety: 'Teja / Byadagi / G4',
    mandi: 'Guntur Asia Mirchi Yard',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    modalPrice: 15200,
    minPrice: 13800,
    maxPrice: 16800,
    unit: '₹ / Quintal',
    trend: '+450',
    trendPercent: '+3.1%',
    trendType: 'up',
    arrivalQty: '980 Qtl',
    lastUpdated: 'Today, 08:15 AM',
    mspPrice: 12000,
    sevenDayTrend: [
      { day: 'Day -6', price: 14200 },
      { day: 'Day -5', price: 14500 },
      { day: 'Day -4', price: 14400 },
      { day: 'Day -3', price: 14800 },
      { day: 'Day -2', price: 14950 },
      { day: 'Yesterday', price: 14750 },
      { day: 'Today', price: 15200 },
    ],
    nearbyMarkets: [
      { name: 'Guntur Asia Mirchi Yard', distanceKm: 5.0, price: 15200, arrivals: '980 Qtl', status: 'Open (06:00 AM - 04:00 PM)', phone: '+91 863 2299881' },
      { name: 'Khammam Chilli Mandi', distanceKm: 110.0, price: 14900, arrivals: '750 Qtl', status: 'Open (07:00 AM - 02:00 PM)', phone: '+91 874 2234100' },
      { name: 'Warangal Enmamula Yard', distanceKm: 185.0, price: 15400, arrivals: '1,200 Qtl', status: 'Open (06:30 AM - 03:00 PM)', phone: '+91 870 2450011' },
    ],
  },
  {
    id: 'm-cotton',
    crop: 'Cotton',
    variety: 'Bt Cotton / Medium Staple',
    mandi: 'Adilabad / Guntur Cotton Yard',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    modalPrice: 7600,
    minPrice: 7100,
    maxPrice: 8050,
    unit: '₹ / Quintal',
    trend: '+220',
    trendPercent: '+2.9%',
    trendType: 'up',
    arrivalQty: '1,320 Qtl',
    lastUpdated: 'Today, 09:00 AM',
    mspPrice: 7122,
    sevenDayTrend: [
      { day: 'Day -6', price: 7200 },
      { day: 'Day -5', price: 7300 },
      { day: 'Day -4', price: 7350 },
      { day: 'Day -3', price: 7420 },
      { day: 'Day -2', price: 7480 },
      { day: 'Yesterday', price: 7380 },
      { day: 'Today', price: 7600 },
    ],
    nearbyMarkets: [
      { name: 'Guntur Cotton Yard', distanceKm: 6.8, price: 7600, arrivals: '1,320 Qtl', status: 'Open (08:00 AM - 03:00 PM)', phone: '+91 863 2211440' },
      { name: 'Warangal Cotton APMC', distanceKm: 178.0, price: 7550, arrivals: '2,100 Qtl', status: 'Open (07:30 AM - 04:00 PM)', phone: '+91 870 2445520' },
    ],
  },
  {
    id: 'm-rice',
    crop: 'Rice / Paddy',
    variety: 'BPT 5204 (Samba Mahsuri)',
    mandi: 'Krishna APMC Grain Yard',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    modalPrice: 2350,
    minPrice: 2200,
    maxPrice: 2480,
    unit: '₹ / Quintal',
    trend: '+50',
    trendPercent: '+2.1%',
    trendType: 'up',
    arrivalQty: '5,800 Qtl',
    lastUpdated: 'Today, 08:45 AM',
    mspPrice: 2300,
    sevenDayTrend: [
      { day: 'Day -6', price: 2250 },
      { day: 'Day -5', price: 2260 },
      { day: 'Day -4', price: 2280 },
      { day: 'Day -3', price: 2310 },
      { day: 'Day -2', price: 2320 },
      { day: 'Yesterday', price: 2300 },
      { day: 'Today', price: 2350 },
    ],
    nearbyMarkets: [
      { name: 'Gudivada Paddy Mandi', distanceKm: 14.0, price: 2350, arrivals: '5,800 Qtl', status: 'Open (06:00 AM - 05:00 PM)', phone: '+91 867 4242100' },
      { name: 'Vijayawada Grain Yard', distanceKm: 28.0, price: 2380, arrivals: '4,200 Qtl', status: 'Open (06:00 AM - 04:00 PM)', phone: '+91 866 2488120' },
    ],
  },
  {
    id: 'm-maize',
    crop: 'Corn / Maize',
    variety: 'Yellow Hybrid Feed Quality',
    mandi: 'Warangal Grain Market',
    district: 'Warangal',
    state: 'Telangana',
    modalPrice: 2280,
    minPrice: 2050,
    maxPrice: 2420,
    unit: '₹ / Quintal',
    trend: '-30',
    trendPercent: '-1.3%',
    trendType: 'down',
    arrivalQty: '3,200 Qtl',
    lastUpdated: 'Today, 07:15 AM',
    mspPrice: 2090,
    sevenDayTrend: [
      { day: 'Day -6', price: 2340 },
      { day: 'Day -5', price: 2330 },
      { day: 'Day -4', price: 2310 },
      { day: 'Day -3', price: 2300 },
      { day: 'Day -2', price: 2290 },
      { day: 'Yesterday', price: 2310 },
      { day: 'Today', price: 2280 },
    ],
    nearbyMarkets: [
      { name: 'Warangal Enmamula Yard', distanceKm: 8.5, price: 2280, arrivals: '3,200 Qtl', status: 'Open (07:00 AM - 03:00 PM)', phone: '+91 870 2450011' },
      { name: 'Karimnagar APMC Market', distanceKm: 72.0, price: 2260, arrivals: '1,800 Qtl', status: 'Open (08:00 AM - 02:00 PM)', phone: '+91 878 2244100' },
    ],
  },
  {
    id: 'm-potato',
    crop: 'Potato',
    variety: 'Kufri Jyoti / Pukhraj',
    mandi: 'Kurnool / Agra APMC Yard',
    district: 'Kurnool',
    state: 'Andhra Pradesh',
    modalPrice: 1480,
    minPrice: 1250,
    maxPrice: 1680,
    unit: '₹ / Quintal',
    trend: '+60',
    trendPercent: '+4.2%',
    trendType: 'up',
    arrivalQty: '2,900 Qtl',
    lastUpdated: 'Today, 08:00 AM',
    mspPrice: 1200,
    sevenDayTrend: [
      { day: 'Day -6', price: 1350 },
      { day: 'Day -5', price: 1380 },
      { day: 'Day -4', price: 1400 },
      { day: 'Day -3', price: 1420 },
      { day: 'Day -2', price: 1450 },
      { day: 'Yesterday', price: 1420 },
      { day: 'Today', price: 1480 },
    ],
    nearbyMarkets: [
      { name: 'Kurnool Vegetable Yard', distanceKm: 5.4, price: 1480, arrivals: '2,900 Qtl', status: 'Open (05:00 AM - 01:00 PM)', phone: '+91 851 8223300' },
      { name: 'Nandyal APMC Mandi', distanceKm: 68.0, price: 1440, arrivals: '1,100 Qtl', status: 'Open (06:00 AM - 12:00 PM)', phone: '+91 851 4241020' },
    ],
  },
];

const MANDI_STORAGE_KEY = 'cropshield_mandi_rates_full';

/**
 * Get all Mandi Market rates
 */
export const getMandiPrices = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(MANDI_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (e) {
    console.warn('Error reading stored mandi rates:', e);
  }
  return INITIAL_MANDI_PRICES;
};

/**
 * Get Mandi Intelligence for a specific crop
 */
export const getMandiForCrop = (cropName = 'Tomato') => {
  const allMandi = getMandiPrices();
  const clean = (cropName || 'Tomato').toLowerCase();

  const found = allMandi.find(
    (m) => m.crop.toLowerCase().includes(clean) || clean.includes(m.crop.toLowerCase())
  );

  return found || allMandi[0];
};
