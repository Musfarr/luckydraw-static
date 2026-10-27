import { GEOS, DEMO_PASSWORD } from "./appConfig";

// Static stand-in for the backend (UI-only mode). Mirrors the shape of the real API responses
// used by Login, Home and LuckyDraw so the API code can be switched back on without touching the pages.

const WINNERS_KEY = "jkbMockWinners";
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------- deterministic outlet generator ----------
const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const NAME_PREFIX = ["Al-Madina", "Bismillah", "Rehman", "New Star", "Shaheen", "Noor", "Haji Ali", "Lucky", "Pak", "Gul", "Mian", "Fazal", "City", "Royal", "Sadiq", "Zam Zam", "Usman", "Hassan", "Khan", "Madni"];
const NAME_SUFFIX = ["General Store", "Kiryana Store", "Mart", "Traders", "Departmental Store", "Super Store", "Cash & Carry", "Brothers", "Enterprises", "Corner Shop", "Wholesale"];
const AREA_SUFFIX = ["Central", "North", "South", "East", "West", "Cantt"];

const cache = {};

const getGeoCustomers = (geoName) => {
  if (cache[geoName]) return cache[geoName];
  const geoIdx = GEOS.findIndex((g) => g.name === geoName);
  const rand = mulberry32(7919 * (geoIdx + 1));
  const total = 650 + Math.floor(rand() * 300);
  const customers = [];

  for (let i = 0; i < total; i++) {
    const gsv = Math.round((12000 + rand() * rand() * 900000) / 100) * 100;
    const area = `${geoName} ${AREA_SUFFIX[Math.floor(rand() * AREA_SUFFIX.length)]}`;
    customers.push({
      _id: `${geoIdx}-${i}`,
      Region: geoName,
      Area: area,
      ZoneDesc: geoName,
      "Zone Desc": geoName,
      "Customer Name": `${NAME_PREFIX[Math.floor(rand() * NAME_PREFIX.length)]} ${NAME_SUFFIX[Math.floor(rand() * NAME_SUFFIX.length)]}`,
      "Customer Code": String(5100000 + geoIdx * 10000 + i),
      "Invoice - Value (GSV)": gsv,
      Silver: Math.min(10, Math.floor(gsv / 60000)),
      Bronze: Math.min(15, Math.floor(gsv / 15000)),
    });
  }
  cache[geoName] = customers;
  return customers;
};

// ---------- auth ----------
// Any credentials work. If the email mentions a geo (e.g. "lahore@jeetkibaazi.com") that geo is used, otherwise Karachi.
export const mockLogin = async (email = "") => {
  await delay(400);
  const typed = String(email).toLowerCase();
  const geo = GEOS.find((g) => typed.includes(g.key)) || GEOS[0];
  return {
    status: 200,
    data: {
      token: `mock-token-${geo.key}`,
      userData: { name: geo.name, email: email || `${geo.key}@jeetkibaazi.com`, role: "geo" },
    },
  };
};

export const getDemoLogin = (geo) => ({ email: `${geo.key}@jeetkibaazi.com`, password: DEMO_PASSWORD });

// ---------- outlet data ----------
export const mockGetCustomerData = async ({ region, page, limit = 100, search } = {}) => {
  await delay();
  let rows = getGeoCustomers(region && GEOS.some((g) => g.name === region) ? region : GEOS[0].name);

  if (search) {
    const q = String(search).toLowerCase().trim();
    rows = rows.filter(
      (c) => c["Customer Name"].toLowerCase().includes(q) || c["Customer Code"].includes(q)
    );
  }

  // LuckyDraw asks for the whole geo (no page), Home asks page by page
  if (!page) return { data: rows };

  const totalPages = Math.max(1, Math.ceil(rows.length / limit));
  const current = Math.min(Number(page), totalPages);
  return {
    data: rows.slice((current - 1) * limit, current * limit),
    pagination: {
      page: current,
      limit,
      total: rows.length,
      totalPages,
      hasPrevPage: current > 1,
      hasNextPage: current < totalPages,
    },
  };
};

// ---------- winners ----------
const readWinners = () => {
  try {
    return JSON.parse(localStorage.getItem(WINNERS_KEY)) || [];
  } catch (e) {
    return [];
  }
};

export const mockGetWinners = async () => {
  await delay(150);
  return readWinners();
};

export const mockAddWinner = async (payload) => {
  const winners = readWinners();
  winners.unshift({ ...payload, id: `${Date.now()}-${winners.length}-${Math.random().toString(36).slice(2, 7)}` });
  localStorage.setItem(WINNERS_KEY, JSON.stringify(winners));
  return { status: 200 };
};

export const mockAddWinners = async (payloads) => {
  const winners = readWinners();
  const stamped = payloads.map((p, i) => ({ ...p, id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}` }));
  localStorage.setItem(WINNERS_KEY, JSON.stringify([...stamped.reverse(), ...winners]));
  return { status: 200 };
};

export const mockClearWinners = async () => {
  await delay(150);
  localStorage.removeItem(WINNERS_KEY);
  return { status: 200 };
};
