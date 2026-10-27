import samsungA07 from "../assets/images/samsung.png";
import incentiveVoucher from "../assets/images/goldcoin2x.png";

// UI-only mode: when true the backend is bypassed and every screen reads/writes
// the static data in Utils/mockApi.js. Set REACT_APP_USE_MOCK_BACKEND=false to use the API again.
export const USE_MOCK_BACKEND = process.env.REACT_APP_USE_MOCK_BACKEND !== "false";

export const CAMPAIGN_NAME = "Jeet ki Baazi";

// Logout helper - in mock mode the draw results live in localStorage, so only drop the session keys.
export const clearSession = () => {
  if (USE_MOCK_BACKEND) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return;
  }
  localStorage.clear();
};

// 11 Geos - each one has its own login (see mockLogin in Utils/mockApi.js)
export const GEOS = [
  { key: "karachi", name: "Karachi" },
  { key: "hyderabad", name: "Hyderabad" },
  { key: "sukkur", name: "Sukkur" },
  { key: "quetta", name: "Quetta" },
  { key: "lahore", name: "Lahore" },
  { key: "faisalabad", name: "Faisalabad" },
  { key: "gujranwala", name: "Gujranwala" },
  { key: "multan", name: "Multan" },
  { key: "islamabad", name: "Islamabad" },
  { key: "peshawar", name: "Peshawar" },
  { key: "sargodha", name: "Sargodha" },
];

export const DEMO_PASSWORD = "jeet123";

// Slabs and gifts - limits are per Geo
export const GIVEAWAY_CONFIG = {
  Silver: [
    { id: "samsung_a07", name: "Samsung Mobile A07", icon: "📱", description: "", limit: 40, limitType: "region" },
  ],
  Bronze: [
    { id: "invoice_incentive_1k", name: "PKR 1K Off Invoice Incentive", icon: "🎟️", description: "", limit: 400, limitType: "region" },
  ],
};

export const GIVEAWAY_IMAGES = {
  samsung_a07: samsungA07,
  invoice_incentive_1k: incentiveVoucher,
};

export const TIER_IMAGES = {
  Silver: samsungA07,
  Bronze: incentiveVoucher,
};

// How long the wheel / countdown animation plays before the winner is revealed
export const DRAW_ANIMATION_MS = 10000;
