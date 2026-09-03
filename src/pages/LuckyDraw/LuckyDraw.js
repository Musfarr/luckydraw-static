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
  'rainbow': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 4, 'led': 0, 'voucher': 27 },
  'risen': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 3, 'led': 0, 'voucher': 29 },
  'rahim': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 0, 'mobile_phone': 4, 'led': 0, 'voucher': 27 },
  'euro': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 2, 'led': 4, 'voucher': 22 },
  'lateef_multan': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 6, 'led': 0, 'voucher': 20 },
  'imtiaz': { '660_cc_car': 0, '1300_cc_car': 2, 'motor_bike': 0, 'mobile_phone': 16, 'led': 50, 'voucher': 0 },
  'chase_up': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 0, 'mobile_phone': 1, 'led': 3, 'voucher': 0 },
  'kifayah': { '660_cc_car': 1, '1300_cc_car': 0, 'motor_bike': 0, 'mobile_phone': 1, 'led': 2, 'voucher': 0 },
  'bin_hashim': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 4, 'mobile_phone': 0, 'led': 1, 'voucher': 0 },
  'chase_plus': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 0, 'mobile_phone': 2, 'led': 1, 'voucher': 0 },
  'diamond': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 1, 'led': 4, 'voucher': 0 },
  'dawood': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 2, 'led': 2, 'voucher': 0 },
  'max_bachat': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 0, 'mobile_phone': 1, 'led': 1, 'voucher': 0 },
  'ideal_mart': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 2, 'led': 4, 'voucher': 0 },
  'pcc': { '660_cc_car': 0, '1300_cc_car': 1, 'motor_bike': 0, 'mobile_phone': 0, 'led': 0, 'voucher': 110 },
  'savemart': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 9, 'mobile_phone': 6, 'led': 6, 'voucher': 23 },
  'gelani': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 2, 'led': 3, 'voucher': 0 },
  'mcc': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 2, 'led': 1, 'voucher': 0 },
  'asian_mall': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 3, 'mobile_phone': 2, 'led': 3, 'voucher': 0 },
  'mushtaq_chai': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 1, 'led': 1, 'voucher': 0 },
  'italian_mall': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 3, 'mobile_phone': 2, 'led': 2, 'voucher': 0 },
  'hbk': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 1, 'led': 0, 'voucher': 0 },
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
  const [isBulkSaving, setIsBulkSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const itemsPerPage = 30;
  const historyItemsPerPage = 50;
  const role = auth?.user?.role;
  const name = auth?.user?.name;
  const isAdmin = role === 'admin';




  console.log(auth, " authhh")


  // React Query â€” fetch all participants (no pagination, full pool for draw)
  const { data: participantsData, isLoading: participantsLoading } = useQuery({
    queryKey: ['allParticipants'],
    queryFn: () => apiGetasync(`${baseUrl}/api/new-customer-data`),
    staleTime: 300000,
  });

  // React Query â€” fetch winners for exclusion and history
  const { data: winnersData, refetch: refetchWinners } = useQuery({
    queryKey: ['winners'],
    queryFn: () => apiGetasync(`${baseUrl}/api/winners-data`),
    staleTime: 0,
  });

  const participants = participantsData?.data || [];
  const winners = winnersData || [];

  // Mutation â€” persist a winner to DB
  const addWinnerMutation = useMutation({
    mutationFn: (record) => axios.post(`${baseUrl}/api/add-winner`, record, {
      headers: { 'x-auth-token': localStorage.getItem('token') },
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['winners'] }),
  });

  // Mutation â€” clear all winners
  const clearWinnersMutation = useMutation({
    mutationFn: () => axios.delete(`${baseUrl}/api/clear-winners-data`, {
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

  // Giveaway id â†’ image src
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

  // Normalize invoice numbers to eliminate discrepancies from whitespace, casing, or data types
  const normalizeInvoice = (val) => {
    if (val === null || val === undefined) return '';
    return String(val).trim().toLowerCase();
  };

  // Check if a participant has already won (by normalized invoice_number)
  const isExcluded = (invoice_number, winnersList = winners) => {
    const clean = normalizeInvoice(invoice_number);
    if (!clean) return true; // Exclude empty/invalid invoices
    return (winnersList || []).some(w => normalizeInvoice(w.invoice_number) === clean);
  };

  // Check if per-store giveaway limit is reached
  const isGiveawayLimitReached = (giveaway) => {
    if (!selectedStore) return true;
    const limit = STORE_GIVEAWAY_LIMITS[selectedStore]?.[giveaway.limitKey] || 0;
    if (limit === 0) return true;
    const awarded = winners.filter(w =>
      w.giveawayId === giveaway.id &&
      (w.parsedOutlet || '').trim().toLowerCase() === selectedStoreName.trim().toLowerCase()
    ).length;
    return awarded >= limit;
  };

  // Won count for a giveaway at the selected store
  const getStoreWonCount = (giveaway) => {
    if (!selectedStore) return 0;
    return winners.filter(w =>
      w.giveawayId === giveaway.id &&
      (w.parsedOutlet || '').trim().toLowerCase() === selectedStoreName.trim().toLowerCase()
    ).length;
  };

  // Eligible pool: store match + not excluded + deduplicated by unique invoice + giveaway limit not reached
  const eligibleParticipantsList = useMemo(() => {
    if (!participants.length || !selectedStore || !selectedGiveaway) return [];
    const giveaway = allGiveaways.find(g => g.id === selectedGiveaway);
    if (!giveaway || isGiveawayLimitReached(giveaway)) return [];

    const winnerInvoices = new Set(
      winners.map(w => normalizeInvoice(w.invoice_number)).filter(Boolean)
    );
    const seenInvoices = new Set();
    const result = [];
    const targetStore = selectedStore.trim().toLowerCase();

    for (const p of participants) {
      const inv = normalizeInvoice(p.invoice_number);
      const store = (p.Store || '').trim().toLowerCase();
      if (inv && store === targetStore && !winnerInvoices.has(inv) && !seenInvoices.has(inv)) {
        seenInvoices.add(inv);
        result.push(p);
      }
    }
    return result;
  }, [participants, selectedStore, selectedGiveaway, winners, selectedStoreName, allGiveaways]);

  // Search filter on eligible list
  const searchFilteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return eligibleParticipantsList;
    const q = searchQuery.toLowerCase();
    return eligibleParticipantsList.filter(p =>
      (p.Name || '').toLowerCase().includes(q) ||
      (p.invoice_number || '').toLowerCase().includes(q) ||
      (p.Contact || '').toLowerCase().includes(q)
    );
  }, [eligibleParticipantsList, searchQuery]);

  const totalPages = Math.ceil(searchFilteredParticipants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedParticipants = searchFilteredParticipants.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [selectedGiveaway, selectedStore, searchQuery]);

  // History from API: search filtered + paginated
  const filteredHistoryData = useMemo(() => {
    if (!winners.length) return [];
    if (!historySearchQuery.trim()) return winners;
    const q = historySearchQuery.toLowerCase();
    return winners.filter(e =>
      (e.invoice_number || '').toLowerCase().includes(q) ||
      (e.Name || '').toLowerCase().includes(q) ||
      (e.wonGiveaway || '').toLowerCase().includes(q)
    );
  }, [winners, historySearchQuery]);

  const historyTotalPages = Math.ceil(filteredHistoryData.length / historyItemsPerPage);
  const historyStartIndex = (historyCurrentPage - 1) * historyItemsPerPage;
  const paginatedHistoryData = filteredHistoryData.slice(historyStartIndex, historyStartIndex + historyItemsPerPage);

  useEffect(() => { setHistoryCurrentPage(1); }, [historySearchQuery]);

  // Start the lucky draw â€” refetches winners first for freshness & ensures strict invoice uniqueness
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
      (w.parsedOutlet || '').trim().toLowerCase() === selectedStoreName.trim().toLowerCase()
    ).length;

    if (storeLimit === 0 || wonCount >= storeLimit) {
      Swal.fire({ title: 'Limit Reached', text: `All ${giveaway.name} prizes for ${selectedStoreName} have been awarded`, icon: 'info' });
      return;
    }

    const winnerInvoices = new Set(
      currentWinners.map(w => normalizeInvoice(w.invoice_number)).filter(Boolean)
    );

    // Filter and strictly deduplicate by invoice so no invoice appears twice in draw pool
    const seenInvoices = new Set();
    const freshEligible = [];
    const targetStore = selectedStore.trim().toLowerCase();

    for (const p of participants) {
      const inv = normalizeInvoice(p.invoice_number);
      const store = (p.Store || '').trim().toLowerCase();
      if (inv && store === targetStore && !winnerInvoices.has(inv) && !seenInvoices.has(inv)) {
        seenInvoices.add(inv);
        freshEligible.push(p);
      }
    }

    if (freshEligible.length === 0) {
      Swal.fire({ title: 'No Eligible Participants', text: 'No eligible participants for this store and reward', icon: 'warning' });
      return;
    }

    // Bulk draw for voucher: pick all remaining slots at once using Fisher-Yates shuffle
    if (giveaway.id === 'voucher') {
      const remaining = Math.min(storeLimit - wonCount, freshEligible.length);
      const shuffled = [...freshEligible];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const picked = shuffled.slice(0, remaining);
      setBulkWinners({ winners: picked, giveaway });
      return;
    }

    const selected = freshEligible[Math.floor(Math.random() * freshEligible.length)];
    setWinnerData({ winner: selected, giveaway });
    setIsSpinning(true);
    setShowWheelModal(true);

    setTimeout(() => {
      setShowWheelModal(false);
      setIsSpinning(false);
      setShowWinnerModal(true);
    }, 10000);
  };

  // Confirm and persist winner to DB with duplicate check
  const handleConfirmWinner = async () => {
    if (!winnerData) return;
    const { winner, giveaway } = winnerData;
    const cleanInv = normalizeInvoice(winner.invoice_number);

    // Double check that invoice hasn't already been recorded
    if (winners.some(w => normalizeInvoice(w.invoice_number) === cleanInv)) {
      Swal.fire({ title: 'Already Won', text: 'This invoice has already won a prize.', icon: 'warning' });
      setShowWinnerModal(false);
      setWinnerData(null);
      return;
    }

    const record = {
      invoice_number: String(winner.invoice_number || '').trim(),
      Name: winner.Name,
      Contact: winner.Contact,
      Cnic: winner.Cnic,
      City: winner.City,
      parsedOutlet: selectedStoreName,
      wonTier: 'N/A',
      wonGiveaway: giveaway.name,
      wonDate: new Date().toLocaleString(),
      giveawayId: giveaway.id,
      DrawUser: auth.user.email,
    };
    try {
      await addWinnerMutation.mutateAsync(record);
      setShowWinnerModal(false);
      setWinnerData(null);
    } catch {
      Swal.fire({ title: 'Error', text: 'Failed to save winner. Please try again.', icon: 'error' });
    }
  };

  // Confirm and persist all bulk (voucher) winners with strict uniqueness
  const handleConfirmBulkWinners = async () => {
    if (!bulkWinners) return;
    setIsBulkSaving(true);
    const { winners: picked, giveaway } = bulkWinners;

    // Deduplicate picked list by invoice
    const uniquePickedMap = new Map();
    picked.forEach(p => {
      const inv = normalizeInvoice(p.invoice_number);
      if (inv && !uniquePickedMap.has(inv)) {
        uniquePickedMap.set(inv, p);
      }
    });
    const uniquePicked = Array.from(uniquePickedMap.values());

    try {
      const { data: latestWinners } = await refetchWinners();
      const existingInvoices = new Set(
        (latestWinners || []).map(w => normalizeInvoice(w.invoice_number)).filter(Boolean)
      );

      const toSave = uniquePicked.filter(w => !existingInvoices.has(normalizeInvoice(w.invoice_number)));

      for (const winner of toSave) {
        const record = {
          invoice_number: String(winner.invoice_number || '').trim(),
          Name: winner.Name,
          Contact: winner.Contact,
          Cnic: winner.Cnic,
          City: winner.City,
          parsedOutlet: selectedStoreName,
          wonTier: 'N/A',
          wonGiveaway: giveaway.name,
          wonDate: new Date().toLocaleString(),
          giveawayId: giveaway.id,
          DrawUser: auth.user.email,
        };
        await addWinnerMutation.mutateAsync(record);
      }
      setBulkWinners(null);
      Swal.fire({ title: 'Done!', text: `${toSave.length} voucher winners saved successfully.`, icon: 'success', timer: 2000, showConfirmButton: false });
    } catch {
      Swal.fire({ title: 'Error', text: 'Failed to save some winners. Please try again.', icon: 'error' });
    } finally {
      setIsBulkSaving(false);
    }
  };

  // Clear all winners via API
  const clearHistory = () => {
    Swal.fire({
      title: 'Clear History?',
      text: 'This will permanently remove all draw results',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Clear',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e71b19',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await clearWinnersMutation.mutateAsync();
          Swal.fire({ title: 'Cleared', text: 'All draw history has been removed', icon: 'success', timer: 1500, showConfirmButton: false });
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
        'Winner Name': entry.Name,
        'Invoice Code': entry.invoice_number,
        'Outlet Name': entry.parsedOutlet || '-',
        'Giveaway': entry.wonGiveaway,
        'Phone': entry.Contact || '-',
        'City': entry.City || '-',
        'CNIC': entry.Cnic || '-',
      };
    }
    return {
      'Name': entry.Name,
      'wonDate': entry.wonDate,
      'Store': entry.parsedOutlet || entry.Store || '-',
      'Invoice number': entry.invoice_number,
    };
  });

  const csvHeaders = isAdmin
    ? [
        { label: 'S.No', key: 'S.No' },
        { label: 'Date & Time', key: 'Date & Time' },
        { label: 'Winner Name', key: 'Winner Name' },
        { label: 'Invoice Code', key: 'Invoice Code' },
        { label: 'Outlet Name', key: 'Outlet Name' },
        { label: 'Giveaway', key: 'Giveaway' },
        { label: 'Phone', key: 'Phone' },
        { label: 'City', key: 'City' },
        { label: 'CNIC', key: 'CNIC' },
      ]
    : [
        { label: 'Name', key: 'Name' },
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

          {/* Bulk Voucher Winners Modal */}
          {bulkWinners && (
            <div className="winner-modal-overlay" style={{ overflowY: 'auto', alignItems: 'flex-start', paddingTop: '40px' }}>
              <div className="bulk-modal-content">
                <h2 style={{ textAlign: 'center', color: '#e2178d', marginBottom: '8px' }}>Voucher Winners</h2>
                <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px' }}>{selectedStoreName} &mdash; {bulkWinners.winners.length} winners selected</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  {bulkWinners.winners.map((w, i) => (
                    <div key={w.invoice_number || i} style={{ background: '#f8f9fa', borderRadius: '12px', padding: '12px', border: '1px solid #e5e5e5' }}>
                      <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>{w.Name}</div>
                      <div style={{ fontSize: '12px', color: '#555' }}><strong>Invoice:</strong> {w.invoice_number}</div>
                      <div style={{ fontSize: '12px', color: '#555' }}><strong>Contact:</strong> {w.Contact}</div>
                      <div style={{ fontSize: '12px', color: '#555' }}><strong>City:</strong> {w.City}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button className="winner-close-btn" onClick={handleConfirmBulkWinners} disabled={isBulkSaving} style={{ minWidth: '160px' }}>
                    {isBulkSaving ? `Saving... (${bulkWinners.winners.length})` : `Confirm & Save All`}
                  </button>
                  <button className="winner-close-btn" onClick={() => setBulkWinners(null)} disabled={isBulkSaving} style={{ minWidth: '120px', background: '#999' }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Winner Announcement Modal */}
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
                        {/* <div className="detail-row">
                          <span className="info-label">Invoice:</span>
                          <span className="info-value">{winnerData.winner.invoice_number || '-'}</span>
                        </div> */}
                        {/* <div className="detail-row">
                          <span className="info-label">Phone:</span>
                          <span className="info-value">{winnerData.winner.Contact || '-'}</span>
                        </div> */}
                        {/* <div className="detail-row">
                          <span className="info-label">City:</span>
                          <span className="info-value">{winnerData.winner.City || '-'}</span>
                        </div> */}
                        <div className="detail-row">
                          <span className="info-label">Store:</span>
                          <span className="info-value">{selectedStoreName}</span>
                        </div>
                      </div>
                    </div>
                    <button className="winner-close-btn" onClick={handleConfirmWinner} disabled={addWinnerMutation.isPending}>
                      {addWinnerMutation.isPending ? 'Saving...' : 'Great!'}
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
              <div className="uk-flex uk-flex-between uk-flex-middle" style={{ marginBottom: '20px' }}>
                <h3 className="uk-card-title" style={{ margin: 0 }}>Select Store & Reward</h3>
                <div className="store-selector">
                  <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Store:</label>
                  <select
                    className="uk-select"
                    style={{ width: '200px', padding: '8px', borderRadius: '4px' }}
                    value={selectedStore}
                    onChange={(e) => { setSelectedStore(e.target.value); setSelectedGiveaway(''); }}
                  >
                    <option value="">-- Select Store --</option>
                    {GROCERY_STORES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="giveaway-selection" style={{ marginTop: '20px' }}>
                <h3 className="uk-card-title" style={{ marginBottom: '20px' }}></h3>
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
                        <div className="uk-text-meta">Selected Store</div>
                        <div style={{ fontSize: '28px', fontWeight: '700', color: '#e2178d', lineHeight: '1.2' }}>{selectedStoreName}</div>
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

          {/* Eligible Participants List */}
          {/* {selectedGiveaway && selectedStore && (
            <div className="uk-width-1-1@m" style={{paddingLeft: '15px'}}>
              <div className="uk-card uk-card-default uk-card-body participants-card">
                <h3 className="uk-card-title">Eligible Participants</h3>
                <p className="uk-text-small uk-text-muted">
                  {selectedStoreName} â€” {allGiveaways.find(g => g.id === selectedGiveaway)?.name}
                  {participantsLoading && ' Â· Loading...'}
                </p>
                <div className="uk-margin" style={{marginBottom: '20px'}}>
                  <div className="uk-inline uk-width-1-1">
                    <span className="uk-form-icon" uk-icon="icon: search"></span>
                    <input className="uk-input" type="text" placeholder="Search by name, invoice or contact..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  {searchQuery && <p className="uk-text-small uk-text-muted" style={{marginTop: '5px'}}>Found {searchFilteredParticipants.length} result(s) matching "{searchQuery}"</p>}
                </div>
                <div className="participants-list" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}}>
                  {paginatedParticipants.map((p, i) => (
                    <div key={p._id || p.invoice_number || i} className="participant-item">
                      <div className="participant-info">
                        <h5>{p.Name}</h5>
                        <p><strong>Invoice:</strong> {p.invoice_number}</p>
                        <p><strong>Contact:</strong> {p.Contact}</p>
                        <p><strong>City:</strong> {p.City}</p>
                        <p><strong>Outlet:</strong> {p.Store}</p>
                      </div>
                    </div>
                  ))}
                  {eligibleParticipantsList.length === 0 && !participantsLoading && (
                    <p className="uk-text-center uk-text-muted">No eligible participants for this store</p>
                  )}
                </div>
                {totalPages > 1 && (
                  <div className="uk-flex uk-flex-between uk-flex-middle" style={{marginTop: '20px', padding: '10px', borderTop: '1px solid #e5e5e5'}}>
                    <div className="uk-text-small uk-text-muted">
                      Showing {startIndex + 1}â€“{Math.min(startIndex + itemsPerPage, searchFilteredParticipants.length)} of {searchFilteredParticipants.length}
                    </div>
                    <div className="uk-flex uk-flex-middle" style={{gap: '10px'}}>
                      <button className="uk-button uk-button-small uk-button-default" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</button>
                      <span className="uk-text-small">Page {currentPage} of {totalPages}</span>
                      <button className="uk-button uk-button-small uk-button-default" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )} */}

          {/* Draw Section */}
          {selectedGiveaway && selectedStore && (
            <div className="uk-width-1-1@m" style={{ paddingLeft: '15px' }}>
              <div className="uk-card uk-card-default uk-card-body draw-card">
                <h3 className="uk-card-title">{allGiveaways.find(g => g.id === selectedGiveaway)?.name} Draw {selectedStoreName}</h3>
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
                    <CSVLink data={csvData} headers={csvHeaders} filename={`lucky-draw-winners-${new Date().toISOString().split('T')[0]}.csv`} className="uk-button uk-button-primary uk-button-small" style={{ textDecoration: 'none', color: 'white' }}>
                      Export CSV
                    </CSVLink>
                    {role === 'admin' && (
                      <button className="uk-button uk-button-danger uk-button-small" onClick={clearHistory}>Clear History</button>
                    )}
                  </div>
                )}
              </div>

              {winners.length > 0 && (
                <div className="uk-margin-bottom">
                  <input className="uk-input" type="text" placeholder="Search by name, invoice or giveaway..." value={historySearchQuery} onChange={(e) => setHistorySearchQuery(e.target.value)} style={{ maxWidth: '400px' }} />
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
                              <th className="uk-text-center">Winner</th>
                              <th className="uk-text-center">Invoice Code</th>
                              <th className="uk-text-center">Giveaway</th>
                              <th className="uk-text-center">Phone</th>
                              <th className="uk-text-center">City</th>
                              <th className="uk-text-center">Outlet Name</th>
                            </>
                          ) : (
                            <>
                              <th className="uk-text-center">Name</th>
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
                                <td>{entry.Name}</td>
                                <td>{entry.invoice_number}</td>
                                <td>{entry.wonGiveaway}</td>
                                <td>{entry.Contact || '-'}</td>
                                <td>{entry.City || '-'}</td>
                                <td>{entry.parsedOutlet || '-'}</td>
                              </>
                            ) : (
                              <>
                                <td>{entry.Name}</td>
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
