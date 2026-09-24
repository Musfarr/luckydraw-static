import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../Context/AuthProvider";
import Swal from 'sweetalert2';
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import "./LuckyDraw.css";
import yaris from "../../assets/images/yaris2x.png";
import Lottie from 'react-lottie';
import confetti from "../../assets/Confetti.json";
import wheel from "../../assets/Countdownnew.json";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { apiGetasync } from "../../Utils/apiServices";

// Store list — ids match exact Store field values in DB (NFLstores.json)
const GROCERY_STORES = [
  { id: 'al_fatah', name: 'AlFatah' },
  { id: 'rainbow', name: 'Rainbow' },
  { id: 'risen', name: 'Risen' },
  { id: 'rahim', name: 'Rahim' },
  { id: 'euro', name: 'Euro' },
  { id: 'lateef_multan', name: 'Lateef Multan' },
  { id: 'imtiaz', name: 'Imtiaz' },
  { id: 'chase_up', name: 'Chase Up' },
  { id: 'chase_plus', name: 'Chase Plus' },
  { id: 'kifayah', name: 'Kifayah' },
  { id: 'bin_hashim', name: 'Bin Hashim' },
  { id: 'diamond', name: 'Diamond' },
  { id: 'dawood', name: 'Dawood' },
  { id: 'max_bachat', name: 'Max Bachat' },
  { id: 'ideal_mart', name: 'Ideal Mart' },
  { id: 'pcc', name: 'PCC' },
  { id: 'mcc', name: 'MCC' },
  { id: 'asian_mall', name: 'Asian Mall' },
  { id: 'mushtaq_chai', name: 'Mushtaq Chai' },
  { id: 'italian_mall', name: 'Italian Mall' },
  { id: 'hbk', name: 'HBK' },
  { id: 'savemart', name: 'Savemart' },
  { id: 'gelani', name: 'Gelani' },
];

// Store-specific giveaway limits — keys match GROCERY_STORES ids
const STORE_GIVEAWAY_LIMITS = {
  'al_fatah': { '660_cc_car': 1, '1300_cc_car': 0, 'motor_bike': 0, 'mobile_phone': 0, 'led': 0, 'voucher': 100 },
  'rainbow': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 3, 'led': 0, 'voucher': 11 },
  'risen': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 0, 'led': 0, 'voucher': 18 },
  'rahim': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 3, 'led': 0, 'voucher': 28 },
  'euro': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 0, 'mobile_phone': 1, 'led': 3, 'voucher': 12 },
  'lateef_multan': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 2, 'led': 0, 'voucher': 16 },
  'imtiaz': { '660_cc_car': 0, '1300_cc_car': 1, 'motor_bike': 0, 'mobile_phone': 8, 'led': 25, 'voucher': 0 },
  'chase_up': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 0, 'mobile_phone': 0, 'led': 1, 'voucher': 0 },
  'kifayah': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 0, 'mobile_phone': 0, 'led': 2, 'voucher': 0 },
  'bin_hashim': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 0, 'led': 1, 'voucher': 0 },
  'chase_plus': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 0, 'mobile_phone': 0, 'led': 1, 'voucher': 0 },
  'diamond': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 0, 'led': 2, 'voucher': 0 },
  'dawood': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 2, 'led': 1, 'voucher': 0 },
  'max_bachat': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 0, 'mobile_phone': 1, 'led': 1, 'voucher': 0 },
  'ideal_mart': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 2, 'led': 4, 'voucher': 0 },
  'pcc': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 0, 'mobile_phone': 0, 'led': 0, 'voucher': 110 },
  'savemart': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 4, 'mobile_phone': 4, 'led': 6, 'voucher': 16 },
  'gelani': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 0, 'led': 2, 'voucher': 0 },
  'mcc': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 1, 'led': 0, 'voucher': 0 },
  'asian_mall': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 0, 'mobile_phone': 0, 'led': 0, 'voucher': 0 },
  'mushtaq_chai': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 1, 'led': 1, 'voucher': 0 },
  'italian_mall': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 2, 'led': 2, 'voucher': 0 },
  'hbk': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 0, 'led': 0, 'voucher': 0 },
};

const BASE_GIVEAWAY_CONFIG = {
  Car: [
    { id: '1300_cc_car', name: '1300 CC Car (Yaris)', description: 'Per Store Limit', limitType: 'store', limitKey: '1300_cc_car' },
    { id: '660_cc_car', name: '660 CC Car (Alto)', description: 'Per Store Limit', limitType: 'store', limitKey: '660_cc_car' },
  ],
  Platinum: [
    { id: 'motor_bike', name: 'Motor Bike', description: 'Per Store Limit', limitType: 'store', limitKey: 'motor_bike' },
  ],
  Silver: [
    { id: 'led', name: 'Smart LED', description: 'Per Store Limit', limitType: 'store', limitKey: 'led' },
  ],
  Gold: [
    { id: 'mobile_phone', name: 'Smart Phone', description: 'Per Store Limit', limitType: 'store', limitKey: 'mobile_phone' }
  ],
  Bronze: [
    { id: 'voucher', name: 'Voucher', description: 'Per Store Limit', limitType: 'store', limitKey: 'voucher' },
  ]
};

const baseUrl = process.env.REACT_APP_BASEURL;

const LuckyDraw = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const queryClient = useQueryClient();

  const [selectedGiveaway, setSelectedGiveaway] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showWheelModal, setShowWheelModal] = useState(false);
  const [winnerData, setWinnerData] = useState(null);
  const [bulkWinners, setBulkWinners] = useState(null);
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const historyItemsPerPage = 50;
  const role = auth?.user?.role;
  const isAdmin = role === 'admin';

  // Local storage for sales team store-specific tier selections
  const [storeSelectedTier, setStoreSelectedTier] = useState(() => {
    try {
      const saved = localStorage.getItem('unilever_sales_store_tiers');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // React Query — fetch active tier from DB
  const { data: activeTierData } = useQuery({
    queryKey: ['activeTier'],
    queryFn: () => apiGetasync(`${baseUrl}/api/active-tier`),
    staleTime: 5000,
    refetchInterval: 10000,
  });

  const activeTier = (activeTierData?.activeTier || 't1').toLowerCase();
  const completedTiers = activeTierData?.completedTiers || [];

  // Mutation — update active tier (admin only, sequential 1-way)
  const updateTierMutation = useMutation({
    mutationFn: (newTier) => axios.put(`${baseUrl}/api/active-tier`, { activeTier: newTier }, {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    }),
    onSuccess: (res, newTier) => {
      queryClient.invalidateQueries({ queryKey: ['activeTier'] });
      queryClient.invalidateQueries({ queryKey: ['winners'] });
      Swal.fire({
        title: 'Tier Updated',
        text: `Active draw tier is now set to ${String(newTier).toUpperCase()}`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Failed to update active tier';
      Swal.fire({ title: 'Error', text: msg, icon: 'error' });
    }
  });

  // Mutation — complete current tier and advance (admin only)
  const completeTierMutation = useMutation({
    mutationFn: () => axios.post(`${baseUrl}/api/complete-tier`, {}, {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['activeTier'] });
      queryClient.invalidateQueries({ queryKey: ['winners'] });
      Swal.fire({
        title: 'Tier Advanced',
        text: res.data?.message || 'Tier marked completed and advanced successfully',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Failed to advance tier';
      Swal.fire({ title: 'Error', text: msg, icon: 'error' });
    }
  });

  // React Query — fetch all participants (no pagination, full pool for draw)
  const { data: participantsData, isLoading: participantsLoading } = useQuery({
    queryKey: ['allParticipants'],
    queryFn: () => apiGetasync(`${baseUrl}/api/new-customer-data`),
    staleTime: 300000,
  });

  // React Query — fetch winners for exclusion and history
  const { data: winnersData, refetch: refetchWinners } = useQuery({
    queryKey: ['winners'],
    queryFn: () => apiGetasync(`${baseUrl}/api/winners-data`),
    staleTime: 0,
  });

  const participants = participantsData?.data || [];
  const winners = useMemo(() => winnersData || [], [winnersData]);

  // Mutation — persist a winner to DB
  const addWinnerMutation = useMutation({
    mutationFn: (record) => axios.post(`${baseUrl}/api/add-winner`, record, {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['winners'] }),
  });

  // Mutation — clear winners for the active tier
  const clearWinnersMutation = useMutation({
    mutationFn: (tierToClear) => axios.delete(`${baseUrl}/api/clear-winners-data?tier=${tierToClear}`, {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['winners'] }),
  });

  const confettiOptions = {
    loop: true,
    autoplay: true,
    animationData: confetti,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const wheelOptions = {
    loop: false,
    autoplay: true,
    animationData: wheel,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Flatten all giveaways into a single list
  const allGiveaways = useMemo(() => Object.values(BASE_GIVEAWAY_CONFIG).flat(), []);

  // Giveaway id -> image src
  const getGiveawayImage = (id) => ({
    '660_cc_car': 'assets/images/Alto.png',
    '1300_cc_car': yaris,
    'motor_bike': 'assets/images/Bike.png',
    'mobile_phone': 'assets/images/Smart-phone.png',
    'led': 'assets/images/Smart-LED.png',
    'voucher': 'assets/images/voucher.jpeg',
  }[id] || 'assets/images/gift.png');

  // Selected store display name
  const selectedStoreName = useMemo(
    () => GROCERY_STORES.find(s => s.id === selectedStore)?.name || '',
    [selectedStore]
  );

  // Normalize helper for invoice, CNIC, and contact strings
  const normalizeVal = (val) => {
    if (val === null || val === undefined) return '';
    return String(val).trim().toLowerCase();
  };

  // Helper to check if a winner belongs to the specified tier
  const isWinnerInTier = (winner, targetTier) => {
    const wTier = (winner.wonTier || 't1').trim().toLowerCase();
    const tTier = (targetTier || 't1').trim().toLowerCase();
    return wTier === tTier || (tTier === 't1' && wTier === 'n/a');
  };

  // Helper to check if a store has completed all prizes for a tier
  const isTierCompletedForStore = (storeId, tierToCheck, winnersList = winners) => {
    if (!storeId) return false;
    const storeLimits = STORE_GIVEAWAY_LIMITS[storeId] || {};
    const storeObj = GROCERY_STORES.find(s => s.id === storeId);
    const storeName = storeObj?.name || '';

    const activeLimits = Object.entries(storeLimits).filter(([_, limit]) => limit > 0);
    if (activeLimits.length === 0) return false;

    return activeLimits.every(([limitKey, limit]) => {
      const giveaway = allGiveaways.find(g => g.limitKey === limitKey);
      if (!giveaway) return true;
      const count = (winnersList || []).filter(w =>
        w.giveawayId === giveaway.id &&
        (w.parsedOutlet || '').trim().toLowerCase() === storeName.trim().toLowerCase() &&
        isWinnerInTier(w, tierToCheck)
      ).length;
      return count >= limit;
    });
  };

  // Current draw tier: Admin uses global activeTier; Sales team uses store-specific tier
  const currentDrawTier = useMemo(() => {
    if (isAdmin) return activeTier;
    if (!selectedStore) return 't1';

    const saved = storeSelectedTier[selectedStore];
    const t1Done = isTierCompletedForStore(selectedStore, 't1');
    const t2Done = isTierCompletedForStore(selectedStore, 't2');

    if (saved === 't3' && t2Done) return 't3';
    if (saved === 't2' && t1Done) return 't2';
    if (t2Done) return 't3';
    if (t1Done) return 't2';
    return 't1';
  }, [isAdmin, activeTier, selectedStore, storeSelectedTier, winners]);

  // Check if per-store giveaway limit is reached for the current tier
  const isGiveawayLimitReached = (giveaway) => {
    if (!selectedStore) return true;
    const limit = STORE_GIVEAWAY_LIMITS[selectedStore]?.[giveaway.limitKey] || 0;
    if (limit === 0) return true;
    const awarded = winners.filter(w =>
      w.giveawayId === giveaway.id &&
      (w.parsedOutlet || '').trim().toLowerCase() === selectedStoreName.trim().toLowerCase() &&
      isWinnerInTier(w, currentDrawTier)
    ).length;
    return awarded >= limit;
  };

  // Won count for a giveaway at the selected store for the current tier
  const getStoreWonCount = (giveaway) => {
    if (!selectedStore) return 0;
    return winners.filter(w =>
      w.giveawayId === giveaway.id &&
      (w.parsedOutlet || '').trim().toLowerCase() === selectedStoreName.trim().toLowerCase() &&
      isWinnerInTier(w, currentDrawTier)
    ).length;
  };

  // Eligible pool: store match + triple-key not excluded (CNIC, Mobile, Invoice) + deduplicated
  const eligibleParticipantsList = useMemo(() => {
    if (!participants.length || !selectedStore || !selectedGiveaway) return [];
    const giveaway = allGiveaways.find(g => g.id === selectedGiveaway);
    if (!giveaway || isGiveawayLimitReached(giveaway)) return [];

    const winnerInvoices = new Set();
    const winnerCnics = new Set();
    const winnerContacts = new Set();

    winners.forEach(w => {
      const inv = normalizeVal(w.invoice_number);
      const cnic = normalizeVal(w.Cnic);
      const contact = normalizeVal(w.Contact);
      if (inv) winnerInvoices.add(inv);
      if (cnic) winnerCnics.add(cnic);
      if (contact) winnerContacts.add(contact);
    });

    const seenInvoices = new Set();
    const seenCnics = new Set();
    const seenContacts = new Set();
    const result = [];
    const targetStore = selectedStore.trim().toLowerCase();

    for (const p of participants) {
      const inv = normalizeVal(p.invoice_number);
      const cnic = normalizeVal(p.Cnic);
      const contact = normalizeVal(p.Contact);
      const store = (p.Store || '').trim().toLowerCase();

      if (!inv || store !== targetStore) continue;

      // Triple-key exclusion against all existing winners
      if (winnerInvoices.has(inv)) continue;
      if (cnic && winnerCnics.has(cnic)) continue;
      if (contact && winnerContacts.has(contact)) continue;

      // Deduplicate within the eligible pool
      if (seenInvoices.has(inv)) continue;
      if (cnic && seenCnics.has(cnic)) continue;
      if (contact && seenContacts.has(contact)) continue;

      seenInvoices.add(inv);
      if (cnic) seenCnics.add(cnic);
      if (contact) seenContacts.add(contact);

      result.push(p);
    }
    return result;
  }, [participants, selectedStore, selectedGiveaway, winners, selectedStoreName, allGiveaways, currentDrawTier]);


  // History from API: search filtered + paginated
  const filteredHistoryData = useMemo(() => {
    if (!winners.length) return [];
    if (!historySearchQuery.trim()) return winners;
    const q = historySearchQuery.toLowerCase();
    return winners.filter(e =>
      (e.invoice_number || '').toLowerCase().includes(q) ||
      (e.Name || '').toLowerCase().includes(q) ||
      (e.Contact || '').toLowerCase().includes(q) ||
      (e.Cnic || '').toLowerCase().includes(q) ||
      (e.wonGiveaway || '').toLowerCase().includes(q) ||
      (e.wonTier || '').toLowerCase().includes(q) ||
      (e.parsedOutlet || '').toLowerCase().includes(q)
    );
  }, [winners, historySearchQuery]);

  const historyTotalPages = Math.ceil(filteredHistoryData.length / historyItemsPerPage);
  const historyStartIndex = (historyCurrentPage - 1) * historyItemsPerPage;
  const paginatedHistoryData = filteredHistoryData.slice(historyStartIndex, historyStartIndex + historyItemsPerPage);

  useEffect(() => { setHistoryCurrentPage(1); }, [historySearchQuery]);

  // Start the lucky draw — random selection with IMMEDIATE AUTO-SAVE (no reconfirmation / no cheat room)
  const startLuckyDraw = async () => {
    if (isSpinning || showWheelModal || showWinnerModal || bulkWinners) {
      return;
    }
    if (!selectedGiveaway) {
      Swal.fire({ title: 'Select Reward', text: 'Please select a reward before starting', icon: 'warning' });
      return;
    }
    if (!selectedStore) {
      Swal.fire({ title: 'Select Store', text: 'Please select a store before starting', icon: 'warning' });
      return;
    }

    const { data: freshWinners } = await refetchWinners();
    const currentWinners = freshWinners || [];
    const giveaway = allGiveaways.find(g => g.id === selectedGiveaway);
    const storeLimit = STORE_GIVEAWAY_LIMITS[selectedStore]?.[giveaway.limitKey] || 0;
    const wonCount = currentWinners.filter(w =>
      w.giveawayId === selectedGiveaway &&
      (w.parsedOutlet || '').trim().toLowerCase() === selectedStoreName.trim().toLowerCase() &&
      isWinnerInTier(w, currentDrawTier)
    ).length;

    if (storeLimit === 0 || wonCount >= storeLimit) {
      Swal.fire({
        title: 'Limit Reached',
        text: `All ${giveaway.name} prizes for ${selectedStoreName} in Tier ${currentDrawTier.toUpperCase()} have been awarded`,
        icon: 'info'
      });
      return;
    }

    // Build fresh exclusion sets (triple-key: invoice, CNIC, mobile)
    const winnerInvoices = new Set();
    const winnerCnics = new Set();
    const winnerContacts = new Set();

    currentWinners.forEach(w => {
      const inv = normalizeVal(w.invoice_number);
      const cnic = normalizeVal(w.Cnic);
      const contact = normalizeVal(w.Contact);
      if (inv) winnerInvoices.add(inv);
      if (cnic) winnerCnics.add(cnic);
      if (contact) winnerContacts.add(contact);
    });

    const seenInvoices = new Set();
    const seenCnics = new Set();
    const seenContacts = new Set();
    const freshEligible = [];
    const targetStore = selectedStore.trim().toLowerCase();

    for (const p of participants) {
      const inv = normalizeVal(p.invoice_number);
      const cnic = normalizeVal(p.Cnic);
      const contact = normalizeVal(p.Contact);
      const store = (p.Store || '').trim().toLowerCase();

      if (!inv || store !== targetStore) continue;

      if (winnerInvoices.has(inv)) continue;
      if (cnic && winnerCnics.has(cnic)) continue;
      if (contact && winnerContacts.has(contact)) continue;

      if (seenInvoices.has(inv)) continue;
      if (cnic && seenCnics.has(cnic)) continue;
      if (contact && seenContacts.has(contact)) continue;

      seenInvoices.add(inv);
      if (cnic) seenCnics.add(cnic);
      if (contact) seenContacts.add(contact);

      freshEligible.push(p);
    }

    if (freshEligible.length === 0) {
      Swal.fire({ title: 'No Eligible Participants', text: 'No eligible participants found for this store and reward', icon: 'warning' });
      return;
    }

    // Bulk draw for voucher: pick all remaining slots at once & save immediately
    if (giveaway.id === 'voucher') {
      const remaining = Math.min(storeLimit - wonCount, freshEligible.length);
      const shuffled = [...freshEligible];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const picked = shuffled.slice(0, remaining);

      setIsSpinning(true);
      const savedWinners = [];
      try {
        for (const p of picked) {
          const record = {
            invoice_number: String(p.invoice_number || '').trim(),
            Name: p.Name,
            Contact: p.Contact,
            Cnic: p.Cnic,
            City: p.City,
            parsedOutlet: selectedStoreName,
            wonTier: currentDrawTier.toLowerCase(),
            wonGiveaway: giveaway.name,
            wonDate: new Date().toLocaleString(),
            giveawayId: giveaway.id,
            DrawUser: auth?.user?.email || '',
          };
          await addWinnerMutation.mutateAsync(record);
          savedWinners.push(p);
        }
        await refetchWinners();
        setBulkWinners({ winners: savedWinners, giveaway });
      } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to save voucher winners';
        Swal.fire({ title: 'Error', text: msg, icon: 'error' });
      } finally {
        setIsSpinning(false);
      }
      return;
    }

    // Single winner draw: select completely randomly and save immediately
    const selected = freshEligible[Math.floor(Math.random() * freshEligible.length)];
    const record = {
      invoice_number: String(selected.invoice_number || '').trim(),
      Name: selected.Name,
      Contact: selected.Contact,
      Cnic: selected.Cnic,
      City: selected.City,
      parsedOutlet: selectedStoreName,
      wonTier: currentDrawTier.toLowerCase(),
      wonGiveaway: giveaway.name,
      wonDate: new Date().toLocaleString(),
      giveawayId: giveaway.id,
      DrawUser: auth?.user?.email || '',
    };

    try {
      await addWinnerMutation.mutateAsync(record);
      await refetchWinners();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to save winner. Please try again.';
      Swal.fire({ title: 'Draw Failed', text: msg, icon: 'error' });
      return;
    }

    // Winner is now safely persisted in the database — run the animation & show result
    setWinnerData({ winner: selected, giveaway });
    setIsSpinning(true);
    setShowWheelModal(true);

    setTimeout(() => {
      setShowWheelModal(false);
      setIsSpinning(false);
      setShowWinnerModal(true);
    }, 10000);
  };

  // Clear winners for active tier via API (Admin only)
  const clearHistory = () => {
    Swal.fire({
      title: `Clear Tier ${currentDrawTier.toUpperCase()} History?`,
      text: `This will permanently remove all draw results for Tier ${currentDrawTier.toUpperCase()}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Clear',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e71b19',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await clearWinnersMutation.mutateAsync(currentDrawTier);
          Swal.fire({ title: 'Cleared', text: `All draw history for Tier ${currentDrawTier.toUpperCase()} has been removed`, icon: 'success', timer: 1500, showConfirmButton: false });
        } catch {
          Swal.fire({ title: 'Error', text: 'Failed to clear history', icon: 'error' });
        }
      }
    });
  };

  // CSV export — local, from API winners data
  const csvData = winners.map((entry, index) => {
    if (isAdmin) {
      return {
        'S.No': index + 1,
        'Date & Time': entry.wonDate,
        'Tier': (entry.wonTier || 't1').toUpperCase(),
        'Winner Name': entry.Name,
        'CNIC': entry.Cnic || '-',
        'Phone': entry.Contact || '-',
        'Invoice Code': entry.invoice_number,
        'Giveaway': entry.wonGiveaway,
        'City': entry.City || '-',
        'Outlet Name': entry.parsedOutlet || '-',
        'Drawn By': entry.DrawUser || '-',
      };
    }
    return {
      'Name': entry.Name,
      'Tier': (entry.wonTier || 't1').toUpperCase(),
      'wonDate': entry.wonDate,
      'Store': entry.parsedOutlet || entry.Store || '-',
      'Invoice number': entry.invoice_number,
    };
  });

  const csvHeaders = isAdmin
    ? [
      { label: 'S.No', key: 'S.No' },
      { label: 'Date & Time', key: 'Date & Time' },
      { label: 'Tier', key: 'Tier' },
      { label: 'Winner Name', key: 'Winner Name' },
      { label: 'CNIC', key: 'CNIC' },
      { label: 'Phone', key: 'Phone' },
      { label: 'Invoice Code', key: 'Invoice Code' },
      { label: 'Giveaway', key: 'Giveaway' },
      { label: 'City', key: 'City' },
      { label: 'Outlet Name', key: 'Outlet Name' },
      { label: 'Drawn By', key: 'Drawn By' },
    ]
    : [
      { label: 'Name', key: 'Name' },
      { label: 'Tier', key: 'Tier' },
      { label: 'wonDate', key: 'wonDate' },
      { label: 'Store', key: 'Store' },
      { label: 'Invoice number', key: 'Invoice number' },
    ];

  return (
    <div className="lucky-draw-container">
      <div className="uk-container uk-container-large">
        <div className="uk-grid uk-grid-lare" uk-grid="" style={{ marginTop: "16px" }}>

          {/* Wheel Spinning Modal */}
          {showWheelModal && (
            <div className="winner-modal-overlay">
              <div className="winner-modal-content">
                <Lottie options={wheelOptions} width={400} height={400} />
              </div>
            </div>
          )}

          {/* Bulk Voucher Winners Modal (Already Saved) */}
          {bulkWinners && (
            <div className="winner-modal-overlay" style={{ overflowY: 'auto', alignItems: 'flex-start', paddingTop: '40px' }}>
              <div className="bulk-modal-content">
                <h2 style={{ textAlign: 'center', color: '#e2178d', marginBottom: '8px' }}>Voucher Winners (Saved)</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>
                  {selectedStoreName} &mdash; {bulkWinners.winners.length} winners saved for Tier {currentDrawTier.toUpperCase()}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  {bulkWinners.winners.map((w, i) => (
                    <div key={w.invoice_number || i} style={{ background: '#f8f9fa', borderRadius: '12px', padding: '12px', border: '1px solid #e5e5e5' }}>
                      <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>{w.Name}</div>
                      <div style={{ fontSize: '12px', color: '#555' }}><strong>Invoice:</strong> {w.invoice_number}</div>
                      {/* <div style={{ fontSize: '12px', color: '#555' }}><strong>Contact:</strong> {w.Contact}</div> */}
                      {/* <div style={{ fontSize: '12px', color: '#555' }}><strong>CNIC:</strong> {w.Cnic || '-'}</div> */}
                      <div style={{ fontSize: '12px', color: '#555' }}><strong>City:</strong> {w.City}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button className="winner-close-btn" onClick={() => setBulkWinners(null)} style={{ minWidth: '160px' }}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Winner Announcement Modal (Already Saved) */}
          {showWinnerModal && winnerData && (
            <div className="winner-modal-overlay">
              <div className="winner-modal-content">
                <Lottie options={confettiOptions} height={"100%"} width={"100%"} direction={-1} />
                <div className="winner-info-overlay">
                  <div className="winner-announcement">
                    <div className="giveaway-icon">
                      <img style={{ width: '70%', objectFit: 'contain' }} src={getGiveawayImage(winnerData.giveaway.id)} alt={winnerData.giveaway.name} />
                    </div>
                    <div className="winner-header">
                      <h2 className="winner-title">Congratulations!</h2>
                      <h1 className="winner-name">{winnerData.winner.Name}</h1>
                    </div>
                    <div className="prize-info">
                      <div className="prize-won">
                        <span className="info-label">Won:</span>
                        <span className="info-value prize-name">{winnerData.giveaway.name}</span>
                      </div>
                      <div className="winner-details">
                        <div className="detail-row">
                          <span className="info-label">Tier:</span>
                          <span className="info-value" style={{ textTransform: 'uppercase', fontWeight: 'bold', color: '#e2178d' }}>
                            {currentDrawTier}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="info-label">Store:</span>
                          <span className="info-value">{selectedStoreName}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="winner-close-btn"
                      onClick={() => {
                        setShowWinnerModal(false);
                        setWinnerData(null);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="lucky-draw-header-actions uk-width-1-1">
            <button className="header-action-btn" onClick={() => navigate(-1)}>Back</button>
            <button className="header-action-btn logout" onClick={() => { localStorage.clear(); setAuth({ token: null, user: {} }); navigate('/'); }}>
              Logout
            </button>
          </div>

          <div className="uk-width-1-1 uk-flex uk-flex-center main-content-card" style={{ alignItems: 'baseline', padding: '26px 20px' }}>
            <div className="uk-margin-remove">
              <img className="logo-image" src='assets/images/nfllogo.png' alt="NFL Logo" />
            </div>
          </div>

          {/* Store & Reward Selection */}
          <div className="uk-width-1-1" style={{ paddingLeft: '15px' }}>
            <div className="uk-card uk-card-default uk-card-body tier-selection-card">
              <div className="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap" style={{ marginBottom: '20px', gap: '15px' }}>
                <div className="uk-flex uk-flex-middle" style={{ gap: '12px' }}>
                  <h3 className="uk-card-title" style={{ margin: 0 }}>Select Store & Reward</h3>
                  <span
                    style={{
                      background: '#fce4ec',
                      color: '#e2178d',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontWeight: '700',
                      fontSize: '13px',
                      letterSpacing: '0.5px'
                    }}
                  >
                    ACTIVE TIER: {currentDrawTier.toUpperCase()}
                  </span>
                </div>

                <div className="uk-flex uk-flex-middle uk-flex-wrap" style={{ gap: '15px' }}>
                  {/* Tier Selector */}
                  <div className="tier-selector uk-flex uk-flex-middle">
                    <label style={{ marginRight: '8px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Draw Tier:</label>
                    {isAdmin ? (
                      <div className="uk-flex uk-flex-middle" style={{ gap: '8px' }}>
                        <select
                          className="uk-select"
                          style={{
                            width: '140px',
                            padding: '8px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            borderColor: '#e2178d'
                          }}
                          value={activeTier}
                          disabled={updateTierMutation.isPending}
                          onChange={(e) => {
                            const newT = e.target.value;
                            if (newT === activeTier) return;
                            Swal.fire({
                              title: `Switch to ${newT.toUpperCase()}?`,
                              text: `This will change the active draw tier to ${newT.toUpperCase()} for all users. Rewards will track against ${newT.toUpperCase()} counts.`,
                              icon: 'question',
                              showCancelButton: true,
                              confirmButtonText: 'Yes, Switch Tier',
                              cancelButtonText: 'Cancel',
                              confirmButtonColor: '#e2178d'
                            }).then((result) => {
                              if (result.isConfirmed) {
                                updateTierMutation.mutate(newT);
                              }
                            });
                          }}
                        >
                          <option value="t1" disabled={completedTiers.includes('t1') && activeTier !== 't1'}>
                            Tier 1 (T1) {completedTiers.includes('t1') ? '✓' : ''}
                          </option>
                          <option value="t2" disabled={(!completedTiers.includes('t1') && activeTier !== 't2') || (completedTiers.includes('t2') && activeTier !== 't2')}>
                            Tier 2 (T2) {!completedTiers.includes('t1') && activeTier !== 't2' ? '(Locked)' : completedTiers.includes('t2') ? '✓' : ''}
                          </option>
                          <option value="t3" disabled={!completedTiers.includes('t2') && activeTier !== 't3'}>
                            Tier 3 (T3) {!completedTiers.includes('t2') && activeTier !== 't3' ? '(Locked)' : ''}
                          </option>
                        </select>
                        {activeTier !== 't3' && (
                          <button
                            className="uk-button uk-button-small"
                            style={{
                              backgroundColor: '#e2178d',
                              color: '#fff',
                              borderRadius: '4px',
                              fontSize: '11px',
                              padding: '0 8px',
                              fontWeight: '600',
                              whiteSpace: 'nowrap'
                            }}
                            disabled={completeTierMutation.isPending}
                            onClick={() => {
                              Swal.fire({
                                title: `Complete Tier ${activeTier.toUpperCase()}?`,
                                text: `This will mark Tier ${activeTier.toUpperCase()} as completed and advance to the next tier. This cannot be undone.`,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'Yes, Complete & Advance',
                                cancelButtonText: 'Cancel',
                                confirmButtonColor: '#e2178d'
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  completeTierMutation.mutate();
                                }
                              });
                            }}
                          >
                            Mark Tier Complete →
                          </button>
                        )}
                      </div>
                    ) : (
                      <select
                        className="uk-select"
                        style={{
                          width: '150px',
                          padding: '8px',
                          borderRadius: '6px',
                          fontWeight: '600',
                          borderColor: '#e2178d'
                        }}
                        value={currentDrawTier}
                        onChange={(e) => {
                          const newT = e.target.value;
                          if (!selectedStore) {
                            Swal.fire({ title: 'Select Store', text: 'Please select a store first.', icon: 'info' });
                            return;
                          }
                          const updated = { ...storeSelectedTier, [selectedStore]: newT };
                          setStoreSelectedTier(updated);
                          try {
                            localStorage.setItem('unilever_sales_store_tiers', JSON.stringify(updated));
                          } catch (err) { }
                          setSelectedGiveaway('');
                        }}
                      >
                        <option
                          value="t1"
                          disabled={
                            (selectedStore && isTierCompletedForStore(selectedStore, 't1') && (currentDrawTier === 't2' || currentDrawTier === 't3'))
                          }
                        >
                          Tier 1 (T1) {selectedStore && isTierCompletedForStore(selectedStore, 't1') ? '✓' : ''}
                        </option>
                        <option
                          value="t2"
                          disabled={
                            !selectedStore ||
                            !isTierCompletedForStore(selectedStore, 't1') ||
                            (isTierCompletedForStore(selectedStore, 't2') && currentDrawTier === 't3')
                          }
                        >
                          Tier 2 (T2) {!selectedStore || !isTierCompletedForStore(selectedStore, 't1') ? '(Locked)' : isTierCompletedForStore(selectedStore, 't2') ? '✓' : ''}
                        </option>
                        <option
                          value="t3"
                          disabled={
                            !selectedStore ||
                            !isTierCompletedForStore(selectedStore, 't2')
                          }
                        >
                          Tier 3 (T3) {!selectedStore || !isTierCompletedForStore(selectedStore, 't2') ? '(Locked)' : ''}
                        </option>
                      </select>
                    )}
                  </div>

                  <div className="store-selector uk-flex uk-flex-middle">
                    <label style={{ marginRight: '8px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Select Store:</label>
                    <select
                      className="uk-select"
                      style={{ width: '180px', padding: '8px', borderRadius: '4px' }}
                      value={selectedStore}
                      onChange={(e) => { setSelectedStore(e.target.value); setSelectedGiveaway(''); }}
                    >
                      <option value="">-- Select Store --</option>
                      {GROCERY_STORES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="giveaway-selection" style={{ marginTop: '20px' }}>
                <div className="giveaway-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                  {allGiveaways.map((giveaway) => {
                    const storeLimit = selectedStore ? (STORE_GIVEAWAY_LIMITS[selectedStore]?.[giveaway.limitKey] || 0) : 0;
                    const wonCount = getStoreWonCount(giveaway);
                    const remaining = Math.max(0, storeLimit - wonCount);
                    const disabled = !selectedStore || storeLimit === 0 || remaining === 0;
                    return (
                      <div
                        key={giveaway.id}
                        className={`giveaway-card ${selectedGiveaway === giveaway.id ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                        onClick={() => !disabled && setSelectedGiveaway(giveaway.id)}
                        style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}
                      >
                        <div className="giveaway-icon" style={{ marginBottom: '15px' }}>
                          <img style={{ width: '120px', height: '120px', objectFit: 'contain' }} src={getGiveawayImage(giveaway.id)} alt={giveaway.name} />
                        </div>
                        <h5 style={{ margin: '10px 0', fontSize: '16px', fontWeight: '600' }}>{giveaway.name}</h5>
                        <p style={{ margin: 0, fontSize: '14px', color: remaining === 0 ? '#999' : '#e71b19' }}>
                          {selectedStore ? (remaining === 0 ? 'Fully Awarded' : `Remaining: ${remaining} / ${storeLimit}`) : 'Select a store to see limit'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedGiveaway && selectedStore && (
                <div className="filter-section" style={{ marginTop: '20px' }}>
                  <div className="uk-card uk-card-default uk-card-body" style={{ borderRadius: '20px' }}>
                    <div className="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap" style={{ gap: '16px' }}>
                      <div>
                        <div className="uk-text-meta">Selected Store & Tier</div>
                        <div style={{ fontSize: '28px', fontWeight: '700', color: '#e2178d', lineHeight: '1.2' }}>
                          {selectedStoreName} &mdash; {currentDrawTier.toUpperCase()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="uk-text-meta">Eligible Participants</div>
                        <div style={{ fontSize: '32px', fontWeight: '700', color: '#e2178d', lineHeight: '1.2' }}>
                          {participantsLoading ? '...' : eligibleParticipantsList.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Draw Section */}
          {selectedGiveaway && selectedStore && (
            <div className="uk-width-1-1@m" style={{ paddingLeft: '15px' }}>
              <div className="uk-card uk-card-default uk-card-body draw-card">
                <h3 className="uk-card-title">{allGiveaways.find(g => g.id === selectedGiveaway)?.name} Draw {selectedStoreName} ({currentDrawTier.toUpperCase()})</h3>
                <div className="draw-wheel-container">
                  <div className={`draw-wheel ${isSpinning ? 'spinning' : ''}`}>
                    <div className="prize-circle">
                      <img className="prize-circle-image" src={getGiveawayImage(selectedGiveaway)} alt={allGiveaways.find(g => g.id === selectedGiveaway)?.name} />
                    </div>
                  </div>
                </div>
                <div className="draw-controls">
                  <button className="draw-action-btn" onClick={startLuckyDraw} disabled={isSpinning}>
                    {isSpinning ? 'Drawing...' : 'START LUCKY DRAW'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Draw History */}
          <div className="uk-width-1-1" style={{ paddingLeft: '15px' }}>
            <div className="uk-card uk-card-default uk-card-body history-card">
              <div className="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom">
                <h3 className="uk-card-title">Draw History ({winners.length})</h3>
                {winners.length > 0 && (
                  <div className="uk-flex uk-flex-middle" style={{ gap: '10px' }}>
                    {isAdmin && (
                      <>
                        <CSVLink data={csvData} headers={csvHeaders} filename={`lucky-draw-winners-${new Date().toISOString().split('T')[0]}.csv`} className="uk-button uk-button-primary uk-button-small" style={{ textDecoration: 'none', color: 'white' }}>
                          Export CSV
                        </CSVLink>
                        <button className="uk-button uk-button-danger uk-button-small" onClick={clearHistory}>
                          Clear {currentDrawTier.toUpperCase()} History
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {winners.length > 0 && (
                <div className="uk-margin-bottom">
                  <input className="uk-input" type="text" placeholder="Search by name, invoice, giveaway or tier..." value={historySearchQuery} onChange={(e) => setHistorySearchQuery(e.target.value)} style={{ maxWidth: '400px' }} />
                  <div className="uk-margin-small-top uk-text-small uk-text-muted">
                    Showing {paginatedHistoryData.length} of {filteredHistoryData.length} results
                  </div>
                </div>
              )}

              {winners.length === 0 ? (
                <p className="uk-text-center uk-text-muted">No draws conducted yet</p>
              ) : filteredHistoryData.length === 0 ? (
                <p className="uk-text-center uk-text-muted">No results found for "{historySearchQuery}"</p>
              ) : (
                <>
                  <div className="uk-overflow-auto">
                    <table className="uk-table uk-table-small uk-table-divider uk-table-hover">
                      <thead>
                        <tr className="uk-text-center">
                          {isAdmin ? (
                            <>
                              <th className="uk-text-center">Date & Time</th>
                              <th className="uk-text-center">Tier</th>
                              <th className="uk-text-center">Winner</th>
                              <th className="uk-text-center">CNIC</th>
                              <th className="uk-text-center">Phone</th>
                              <th className="uk-text-center">Invoice Code</th>
                              <th className="uk-text-center">Giveaway</th>
                              <th className="uk-text-center">City</th>
                              <th className="uk-text-center">Outlet Name</th>
                              <th className="uk-text-center">Drawn By</th>
                            </>
                          ) : (
                            <>
                              <th className="uk-text-center">Name</th>
                              <th className="uk-text-center">Tier</th>
                              <th className="uk-text-center">wonDate</th>
                              <th className="uk-text-center">Store</th>
                              <th className="uk-text-center">Invoice number</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedHistoryData.map((entry, index) => (
                          <tr key={entry._id || `${entry.invoice_number}-${index}`} className="uk-text-center">
                            {isAdmin ? (
                              <>
                                <td>{entry.wonDate}</td>
                                <td>
                                  <span style={{ fontWeight: '700', textTransform: 'uppercase', color: '#e2178d', background: '#fce4ec', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>
                                    {(entry.wonTier || 't1').toUpperCase()}
                                  </span>
                                </td>
                                <td>{entry.Name}</td>
                                <td>{entry.Cnic || '-'}</td>
                                <td>{entry.Contact || '-'}</td>
                                <td>{entry.invoice_number}</td>
                                <td>{entry.wonGiveaway}</td>
                                <td>{entry.City || '-'}</td>
                                <td>{entry.parsedOutlet || '-'}</td>
                                <td>{entry.DrawUser || '-'}</td>
                              </>
                            ) : (
                              <>
                                <td>{entry.Name}</td>
                                <td>
                                  <span style={{ fontWeight: '700', textTransform: 'uppercase', color: '#e2178d', background: '#fce4ec', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>
                                    {(entry.wonTier || 't1').toUpperCase()}
                                  </span>
                                </td>
                                <td>{entry.wonDate}</td>
                                <td>{entry.parsedOutlet || entry.Store || '-'}</td>
                                <td>{entry.invoice_number}</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {historyTotalPages > 1 && (
                    <div className="uk-flex uk-flex-center uk-flex-middle uk-margin-top" style={{ gap: '10px' }}>
                      <button className="uk-button uk-button-default uk-button-small" onClick={() => setHistoryCurrentPage(1)} disabled={historyCurrentPage === 1}>First</button>
                      <button className="uk-button uk-button-default uk-button-small" onClick={() => setHistoryCurrentPage(p => Math.max(1, p - 1))} disabled={historyCurrentPage === 1}>Previous</button>
                      <span className="uk-text-small">Page {historyCurrentPage} of {historyTotalPages}</span>
                      <button className="uk-button uk-button-default uk-button-small" onClick={() => setHistoryCurrentPage(p => Math.min(historyTotalPages, p + 1))} disabled={historyCurrentPage === historyTotalPages}>Next</button>
                      <button className="uk-button uk-button-default uk-button-small" onClick={() => setHistoryCurrentPage(historyTotalPages)} disabled={historyCurrentPage === historyTotalPages}>Last</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
