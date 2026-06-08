import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../Context/AuthProvider";
import Swal from 'sweetalert2';
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import "./LuckyDraw.css";
import yaris from "../../assets/images/yaris2x.png";
import gold_1_tola from "../../assets/images/barr.png";
import coin from "../../assets/images/ss.png";
import microwave_oven from "../../assets/images/microwave.png";
import tv from "../../assets/images/tv.png";
import samsung_a06 from "../../assets/images/samsung.png";
import iron from "../../assets/images/iron2x.png";
import food_factory from "../../assets/images/foodfactory.png";
import juicer from "../../assets/images/juicer.png";
import washing_machine from "../../assets/images/WASHINGmachine.png";
import daraz_gift_card from "../../assets/images/CARD.png";
import Lottie from 'react-lottie';
import confetti from "../../assets/Confetti.json";
import wheel from "../../assets/Countdownnew.json";

// Store list from the image
const GROCERY_STORES = [
  { id: 'alfatah', name: 'AlFatah' },
  { id: 'rainbow', name: 'Rainbow' },
  { id: 'risen_rahim', name: 'Risen Rahim' },
  { id: 'euro', name: 'Euro' },
  { id: 'lateef', name: 'Lateef' },
  { id: 'imtiaz', name: 'Imtiaz' },
  { id: 'chase_up', name: 'Chase Up' },
  { id: 'kifaya', name: 'Kifaya' },
  { id: 'bin_hashim', name: 'Bin Hashim' },
  { id: 'diamond', name: 'Diamond' },
  { id: 'dawood_mart', name: 'Dawood Mart' },
  { id: 'max_bachat', name: 'Max Bachat' },
  { id: 'ideal', name: 'Ideal' },
  { id: 'pcc', name: 'PCC' },
  { id: 'sm', name: 'SM' },
  { id: 'gm', name: 'GM' },
  { id: 'mcc', name: 'MCC' },
  { id: 'asian', name: 'Asian' },
  { id: 'mushtaq', name: 'Mushtaq' },
  { id: 'italian', name: 'Italian' },
  { id: 'hbk', name: 'HBK' }
];

// Store-specific limits from the table image
const STORE_GIVEAWAY_LIMITS = {
  'alfatah': { '660_cc_car': 0, '1300_cc_car': 1, 'motor_bike': 5, 'mobile_phone': 6, 'led': 6, 'voucher': 100 },
  'rainbow': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 4, 'mobile_phone': 6, 'led': 6, 'voucher': 50 },
  'risen_rahim': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 3, 'mobile_phone': 6, 'led': 6, 'voucher': 50 },
  'euro': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 3, 'mobile_phone': 6, 'led': 6, 'voucher': 50 },
  'lateef': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 6, 'led': 6, 'voucher': 50 },
  'imtiaz': { '660_cc_car': 1, '1300_cc_car': 0, 'motor_bike': 8, 'mobile_phone': 8, 'led': 25, 'voucher': 20 },
  'chase_up': { '660_cc_car': 1, '1300_cc_car': 1, 'motor_bike': 2, 'mobile_phone': 2, 'led': 5, 'voucher': 0 },
  'kifaya': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 4, 'mobile_phone': 4, 'led': 5, 'voucher': 0 },
  'bin_hashim': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 3, 'led': 4, 'voucher': 0 },
  'diamond': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 3, 'led': 4, 'voucher': 0 },
  'dawood_mart': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 4, 'led': 4, 'voucher': 0 },
  'max_bachat': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 2, 'led': 4, 'voucher': 0 },
  'ideal': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 11, 'mobile_phone': 11, 'led': 11, 'voucher': 110 },
  'pcc': { '660_cc_car': 0, '1300_cc_car': 1, 'motor_bike': 6, 'mobile_phone': 6, 'led': 6, 'voucher': 40 },
  'sm': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 4, 'mobile_phone': 4, 'led': 4, 'voucher': 0 },
  'gm': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 3, 'mobile_phone': 3, 'led': 3, 'voucher': 0 },
  'mcc': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 1, 'mobile_phone': 1, 'led': 1, 'voucher': 0 },
  'asian': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 3, 'mobile_phone': 3, 'led': 3, 'voucher': 0 },
  'mushtaq': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 2, 'led': 2, 'voucher': 0 },
  'italian': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 2, 'led': 2, 'voucher': 0 },
  'hbk': { '660_cc_car': 0, '1300_cc_car': 0, 'motor_bike': 2, 'mobile_phone': 2, 'led': 2, 'voucher': 0 }
};

const BASE_GIVEAWAY_CONFIG = {
  Car: [
    { id: '660_cc_car', name: '660 CC Car (Alto)', icon: '🚗', description: 'Per Store Limit', limitType: 'store', limitKey: '660_cc_car' },
    { id: '1300_cc_car', name: '1300 CC Car (Yaris)', icon: '🚙', description: 'Per Store Limit', limitType: 'store', limitKey: '1300_cc_car' },
  ],
  Platinum: [
    { id: 'motor_bike', name: 'Motor Bike', icon: '🏍️', description: 'Per Store Limit', limitType: 'store', limitKey: 'motor_bike' },
  ],
  Gold: [
    { id: 'mobile_phone', name: 'Smart Phone', icon: '📱', description: 'Per Store Limit', limitType: 'store', limitKey: 'mobile_phone' }
  ],
  Silver: [
    { id: 'led', name: 'Smart LED', icon: '📺', description: 'Per Store Limit', limitType: 'store', limitKey: 'led' },
  ],
  Bronze: [
    { id: 'voucher', name: 'Voucher', icon: '�', description: 'Per Store Limit', limitType: 'store', limitKey: 'voucher' },
  ]
};

const baseUrl = process.env.REACT_APP_BASEURL;

const LuckyDraw = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [selectedGiveaway, setSelectedGiveaway] = useState('');
  const [eligibleParticipants, setEligibleParticipants] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [drawHistory, setDrawHistory] = useState([]);
  const [excludedWinners, setExcludedWinners] = useState([]);
  const [awardedGiveaways, setAwardedGiveaways] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showWheelModal, setShowWheelModal] = useState(false);
  const [winnerData, setWinnerData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 30;
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [filteredWinnersData, setFilteredWinnersData] = useState([]);
  const historyItemsPerPage = 50;
  const [selectedStore, setSelectedStore] = useState('');

  const name = auth?.user?.name || '';
  const role = 'admin'; // Static role

  // Static participants data - no API
  const data = [
    { id: 1, cust_name: 'Ahmed Khan', cust_cd: 'OUT001', phone: '0300-1111111', Region: 'Central', Zone: 'Zone1', Area: 'Area1', total_amount: 50000 },
    { id: 2, cust_name: 'Fatima Ali', cust_cd: 'OUT002', phone: '0300-2222222', Region: 'South', Zone: 'Zone2', Area: 'Area2', total_amount: 75000 },
    { id: 3, cust_name: 'Bilal Hussain', cust_cd: 'OUT003', phone: '0300-3333333', Region: 'North', Zone: 'Zone3', Area: 'Area3', total_amount: 45000 },
    { id: 4, cust_name: 'Sara Malik', cust_cd: 'OUT004', phone: '0300-4444444', Region: 'Central', Zone: 'Zone1', Area: 'Area1', total_amount: 60000 },
    { id: 5, cust_name: 'Usman Tariq', cust_cd: 'OUT005', phone: '0300-5555555', Region: 'South', Zone: 'Zone2', Area: 'Area2', total_amount: 80000 },
    { id: 6, cust_name: 'Ayesha Siddiqui', cust_cd: 'OUT006', phone: '0300-6666666', Region: 'North', Zone: 'Zone3', Area: 'Area3', total_amount: 35000 },
    { id: 7, cust_name: 'Hamza Sheikh', cust_cd: 'OUT007', phone: '0300-7777777', Region: 'Central', Zone: 'Zone1', Area: 'Area1', total_amount: 90000 },
    { id: 8, cust_name: 'Zainab Bukhari', cust_cd: 'OUT008', phone: '0300-8888888', Region: 'South', Zone: 'Zone2', Area: 'Area2', total_amount: 55000 },
    { id: 9, cust_name: 'Taimoor Akhtar', cust_cd: 'OUT009', phone: '0300-9999999', Region: 'North', Zone: 'Zone3', Area: 'Area3', total_amount: 42000 },
    { id: 10, cust_name: 'Muhammad Hanif', cust_cd: 'OUT010', phone: '0300-1010101', Region: 'Central', Zone: 'Zone1', Area: 'Area1', total_amount: 68000 },
  ];

  // Static winners data - no API
  const winnersData = [];

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

    // Flattened giveaway configuration - all rewards without tier hierarchy
  const allGiveaways = useMemo(() => {
    // Flatten all tiers into a single array
    return Object.values(BASE_GIVEAWAY_CONFIG).flat();
  }, []);
  



  // region based Winners filtering 
// useEffect(() => {
//   if (!name) return;
 
//   if (name.toLowerCase() === 'admin') {
//     setFilteredWinnersData(winnersData || []);
//     return;
//   }
 
//   const filtered = (winnersData || []).filter(
//     (w) => (w.region || '').toLowerCase().trim() === name.toLowerCase().trim()
//   );
//   setFilteredWinnersData(filtered);
// }, [winnersData, name]);






  useEffect(() => {
    // Load draw history from localStorage
    const savedHistory = localStorage.getItem('luckyDrawHistory');
    if (savedHistory) {
      setDrawHistory(JSON.parse(savedHistory));
    }
   }, []);


  useEffect(() => {
    if (role !== 'admin' && name && selectedRegion !== name) {
      setSelectedRegion(name);
    }
  }, [role, name, selectedRegion]);
 
 
  // Get available zones (excluding those that reached giveaway limits) - Memoized for performance
  const uniqueZones = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    const allCustomers = data;
    let zones = [...new Set(allCustomers.map(c => c.ZoneDesc).filter(Boolean))];
    
    // Filter zones based on user role
    if (name === 'South') {
      zones = zones.filter(zone => zone.toLowerCase() === 'south');
    } else if (name === 'North') {
      zones = zones.filter(zone => zone.toLowerCase() === 'north');
    }

    // else{
    //   winnersData = winnerData?
    // }
    
    // Filter out zones that have reached limits for selected giveaway
    if (selectedGiveaway) {
      const giveaway = allGiveaways.find(g => g.id === selectedGiveaway);
      
      if (giveaway && giveaway.limitType === 'zone') {
        zones = zones.filter(zone => {
          const awardedCount = winnersData?.filter(award => 
            award.giveawayId === selectedGiveaway && award.zone === zone
          ).length;
          return awardedCount < giveaway.limit;
        });
      }
    }
    
    return zones.sort();
  }, [data, selectedGiveaway, winnersData, role]);

  // Auto-clear selectedZone if it's no longer in the available zones list
  useEffect(() => {
    if (selectedZone && !uniqueZones.includes(selectedZone)) {
      setSelectedZone('');
      // setSelectedRegion('');
      setSelectedArea('');
    }
  }, [uniqueZones, selectedZone]);

  const getUniqueZones = () => uniqueZones;

  const uniqueRegions = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    let allCustomers = data;
    
    if (selectedZone) {
      allCustomers = allCustomers.filter(c => c.ZoneDesc === selectedZone);
    }
    
    let regions = [...new Set(allCustomers.map(c => c.Region).filter(Boolean))];
    
    // Filter out regions that have reached limits for selected giveaway
    if (selectedGiveaway) {
      const giveaway = allGiveaways.find(g => g.id === selectedGiveaway);
      
      if (giveaway && giveaway.limitType === 'region') {
        regions = regions.filter(region => {
          const awardedCount = winnersData?.filter(award => 
            award.giveawayId === selectedGiveaway && award.region === region
          ).length;
          return awardedCount < giveaway.limit;
        });
      }
    }
    
    return regions.sort();
  }, [data, selectedZone, selectedGiveaway, winnersData]);

  // Auto-clear selectedRegion if it's no longer in the available regions list
  useEffect(() => {
    if (role === 'admin' && selectedRegion && !uniqueRegions.includes(selectedRegion)) {
      // setSelectedRegion('');
      setSelectedArea('');
    }
  }, [role, uniqueRegions, selectedRegion]);

  const getUniqueRegions = () => uniqueRegions;

  const uniqueAreas = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    let allCustomers = data;
    
    if (selectedZone) {
      allCustomers = allCustomers.filter(c => c.ZoneDesc === selectedZone);
    }
    if (selectedRegion) {
      allCustomers = allCustomers.filter(c => c.Region === selectedRegion);
    }
    
    let areas = [...new Set(allCustomers.map(c => c.Area).filter(Boolean))];
    
    // Filter out areas that have reached limits for selected giveaway
    if (selectedGiveaway) {
      const giveaway = allGiveaways.find(g => g.id === selectedGiveaway);
      
      if (giveaway && giveaway.limitType === 'area') {
        areas = areas.filter(area => {
          const awardedCount = winnersData?.filter(award => 
            award.giveawayId === selectedGiveaway && award.area === area
          ).length;
          return awardedCount < giveaway.limit;
        });
      }
    }
    
    return areas.sort();
  }, [data, selectedZone, selectedRegion, selectedGiveaway, winnersData]);

  // Auto-clear selectedArea if it's no longer in the available areas list
  useEffect(() => {
    if (selectedArea && !uniqueAreas.includes(selectedArea)) {
      setSelectedArea('');
    }
  }, [uniqueAreas, selectedArea]);

  const getUniqueAreas = () => uniqueAreas;


  // Get all customers from the flat array
  const getAllCustomers = () => {
    if (!data || !Array.isArray(data)) return [];
    return data;
  };

  // Check if customer is excluded based on hierarchical rules
  const isCustomerExcluded = (customer, targetTier) => {


    const customerCode = customer['Customer Code'];   
    const excludedEntry = winnersData?.find(w => w.customerCode  === customerCode);
    


    // console.log(winnerData , "winderrdataata")
    // console.log(customerCode , "asdasdsa" , excludedEntry)


    if (!excludedEntry) return false;
    
    // // Hierarchical exclusion logic
    // const tierHierarchy = {'Car' :4 , 'Platinum': 3, 'Gold': 2, 'Silver': 1 };
    // const wonTierLevel = tierHierarchy[excludedEntry.wonTier];
    // const targetTierLevel = tierHierarchy[targetTier];
    
    // // If they won a higher or equal tier, they're excluded from lower/equal tiers
    // return wonTierLevel >= targetTierLevel;

    return true;
  };

  // Check if giveaway limit is reached for a specific area
  const isGiveawayLimitReached = (giveawayId, customer) => {
    const giveaway = allGiveaways.find(g => g.id === giveawayId);
    
    if (!giveaway) return false;
    
    // Count awarded giveaways for this specific giveaway and area
    const awardedCount = winnersData?.filter(award => {
      if (award.giveawayId !== giveawayId) return false;
      
      // Check based on limit type
      if (giveaway.limitType === 'global') {
        // Global limit - count all winners regardless of location
        return true;
      } else if (giveaway.limitType === 'zone') {
        return award.zone === customer.ZoneDesc;
      } else if (giveaway.limitType === 'region') {
        return award.region === customer.Region;
      } else if (giveaway.limitType === 'area') {
        return award.area === customer.Area;
      }
      
      return false;
    }).length;
    
    return awardedCount >= giveaway.limit;
  };

  // Filter participants based on selected criteria - simplified without tier hierarchy
  const eligibleParticipantsList = useMemo(() => {
    if (!data) return [];
    
    // Get all customers from unified pool
    let participants = getAllCustomers();
    
    // Apply geographic filters
    if (selectedRegion) {
      participants = participants.filter(p => p.Region === selectedRegion);
    }
    
    // Check if giveaway limit is reached
    if (selectedGiveaway) {
      participants = participants.filter(p => !isGiveawayLimitReached(selectedGiveaway, p));
    }
    
    // Add default drawEntries for weighted selection
    return participants.map(p => ({ ...p, drawEntries: 1 }));
  }, [data, selectedRegion, selectedGiveaway, winnersData]);

  const filterParticipants = () => eligibleParticipantsList;

  // Search filtering
  const searchFilteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return eligibleParticipantsList;
    
    const query = searchQuery.toLowerCase().trim();
    return eligibleParticipantsList.filter(participant => {
      const custName = (participant["Customer Name"] || participant.customerName || '').toLowerCase();
      const custCode = (participant["Customer Code"] || participant.customerCode || '').toLowerCase();
      return custName.includes(query) || custCode.includes(query);
    });
  }, [eligibleParticipantsList, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(searchFilteredParticipants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedParticipants = searchFilteredParticipants.slice(startIndex, endIndex);



  console.log(paginatedParticipants , " paginatedParticipants")
  // Reset to page 1 when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGiveaway, selectedZone, selectedRegion, selectedArea, searchQuery]);

  // Filter and paginate history data
  const filteredHistoryData = useMemo(() => {
    if (!excludedWinners || excludedWinners.length === 0) return [];
    
    if (!historySearchQuery.trim()) return excludedWinners;
    
    const query = historySearchQuery.toLowerCase().trim();
    return excludedWinners.filter(entry => {
      const customerCode = (entry.customerCode || '').toLowerCase();
      const giveaway = (entry.wonGiveaway || '').toLowerCase();
      return customerCode.includes(query) || giveaway.includes(query);
    });
  }, [excludedWinners, historySearchQuery]);

  const historyTotalPages = Math.ceil(filteredHistoryData.length / historyItemsPerPage);
  const historyStartIndex = (historyCurrentPage - 1) * historyItemsPerPage;
  const historyEndIndex = historyStartIndex + historyItemsPerPage;
  const paginatedHistoryData = filteredHistoryData.slice(historyStartIndex, historyEndIndex);

  // Reset history page when search changes
  useEffect(() => {
    setHistoryCurrentPage(1);
  }, [historySearchQuery]);

  const pickUniqueWeightedWinners = (participants, count) => {
    const pool = [...participants];
    const picked = [];

    while (picked.length < count && pool.length > 0) {
      const totalWeight = pool.reduce((sum, p) => sum + (p.drawEntries || 1), 0);
      let random = Math.random() * totalWeight;
      let selectedIndex = 0;

      for (let i = 0; i < pool.length; i++) {
        random -= pool[i].drawEntries || 1;
        if (random <= 0) {
          selectedIndex = i;
          break;
        }
      }

      picked.push(pool[selectedIndex]);
      pool.splice(selectedIndex, 1);
    }

    return picked;
  };

  const startLuckyDraw = () => {
    if (!selectedGiveaway) {
      Swal.fire({
        title: 'Select Giveaway',
        text: 'Please select a giveaway type before starting the draw',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    const participants = filterParticipants();
    if (participants.length === 0) {
      Swal.fire({
        title: 'No Eligible Participants',
        text: 'No participants found for the selected criteria',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Find giveaway from flat list
    const giveaway = allGiveaways.find(g => g.id === selectedGiveaway);

    // Single draw - pick one random participant
    setEligibleParticipants(participants);
    setIsSpinning(true);
    setWinner(null);

    // Show wheel modal first
    const randomIndex = Math.floor(Math.random() * participants.length);
    const selectedWinner = participants[randomIndex];
    
    // Prepare winner data
    const winnerInfo = {
      winner: selectedWinner,
      giveaway: giveaway,
      tier: 'N/A'
    };

    
    // Show wheel modal
    setWinnerData(winnerInfo);
    setShowWheelModal(true);
    
    // After wheel animation, show winner announcement
    setTimeout(() => {
      setShowWheelModal(false);
      setWinner({ ...selectedWinner, giveaway });
      setIsSpinning(false);
      
      // Add winner to excluded list (local only, no API)
      const excludedWinner = {
        customerCode: selectedWinner.cust_cd || selectedWinner['Customer Code'],
        customerName: selectedWinner.cust_name || selectedWinner['Customer Name'],
        wonTier: 'N/A',
        wonGiveaway: giveaway.name,
        zone: selectedWinner.Zone || selectedWinner['Zone Desc'],
        region: selectedWinner.Region,
        area: selectedWinner.Area,
        giveawayId: selectedGiveaway,
        giveawayName: giveaway.name,
        wonDate: new Date().toLocaleString()
      };

      // Update local state only
      setExcludedWinners(prev => [...prev, excludedWinner]);
      
      // Show winner modal
      setShowWinnerModal(true);
    }, 5000);
  };

 

  const clearHistory = () => {
    Swal.fire({
      title: 'Clear History?',
      text: 'This will remove all previous draw results',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear local state only (no API)
        setExcludedWinners([]);
        localStorage.removeItem('excludedWinners');
        setAwardedGiveaways([]);
        localStorage.removeItem('awardedGiveaways');
        
        // Reset all geographic filters
        setSelectedZone('');
        setSelectedRegion('');
        setSelectedArea('');
        setWinner(null);
        setEligibleParticipants([]);
        
        Swal.fire('Cleared!', 'Draw history and filters have been cleared.', 'success');
      }
    });
  };

  const handleGiveawayChange = (giveawayId) => {
    setSelectedGiveaway(giveawayId);
    setWinner(null);
    setEligibleParticipants([]);
  };

  const handleZoneChange = (zone) => {
    setSelectedZone(zone);
    setSelectedRegion(''); // Reset region when zone changes
    setSelectedArea(''); // Reset area when zone changes
    setWinner(null);
    setEligibleParticipants([]);
  };

  const handleRegionChange = (region) => {
    if (role !== 'admin') {
      setSelectedRegion(name || '');
      return;
    }
    setSelectedRegion(region);
    setSelectedArea(''); // Reset area when region changes
    setWinner(null);
    setEligibleParticipants([]);
  };

  const handleAreaChange = (area) => {
    setSelectedArea(area);
    setWinner(null);
    setEligibleParticipants([]);
  };

  const clearFilters = () => {
    setSelectedZone('');
    if (role === 'admin') {
      setSelectedRegion('');
    } else {
      setSelectedRegion(name || '');
    }
    setSelectedArea('');
    setWinner(null);
    setEligibleParticipants([]);
  };

  const displayedRegion = role !== 'admin' && name ? name : selectedRegion || 'All Regions';

  const displayedParticipantsCount = filterParticipants().length;

  // Prepare CSV data for export
  const csvData = (excludedWinners || []).map((entry, index) => ({
    'S.No': index + 1,
    'Date & Time': entry.wonDate,
    'Winner Name': entry.customerName,
    'Invoice Code': entry.customerCode,
    'Outlet Name': entry.outletName || '-',
    'Giveaway': entry.wonGiveaway,
    'Phone': entry.phone || '-',
    'City': entry.region && entry.area ? `${entry.region} - ${entry.area}` : entry.region || entry.area || '-',
    'Tier': entry.wonTier || '-',
    'Zone': entry.zone || '-'
  }));

  const csvHeaders = [
    { label: 'S.No', key: 'S.No' },
    { label: 'Date & Time', key: 'Date & Time' },
    { label: 'Winner Name', key: 'Winner Name' },
    { label: 'Invoice Code', key: 'Invoice Code' },
    { label: 'Outlet Name', key: 'Outlet Name' },
    { label: 'Giveaway', key: 'Giveaway' },
    { label: 'Phone', key: 'Phone' },
    { label: 'City', key: 'City' },
    { label: 'Tier', key: 'Tier' },
    { label: 'Zone', key: 'Zone' }
  ];

  return (
    <div className="lucky-draw-container" >
      <div className="uk-container uk-container-large">

        {/* Main Lucky Draw Interface */}
        <div className="uk-grid uk-grid-lare " uk-grid="" style={{ marginTop: "16px" }}>
            
            {/* Wheel Spinning Modal */}
            {showWheelModal && (
              <div className="winner-modal-overlay">
                <div className="winner-modal-content">
                  <Lottie options={wheelOptions}  width={400} height={400} />
                </div>
              </div>
            )}

            {/* Winner Modal */}
            {showWinnerModal && winnerData && (
              <div className="winner-modal-overlay">
                <div className="winner-modal-content">
                  <Lottie options={confettiOptions} height={"100%"} width={"100%"} direction={-1} />
                  <div className="winner-info-overlay">
                    <div className="winner-announcement">
                      <>
                        <div className="giveaway-icon">
                            <img 
                              style={{width: '70%', objectFit: 'contain'}} 
                              src={
                                winnerData.giveaway.id === '660_cc_car' ? 'assets/images/Alto.png' :
                                winnerData.giveaway.id === '1300_cc_car' ? yaris :
                                winnerData.giveaway.id === 'motor_bike' ? 'assets/images/Bike.png' :
                                winnerData.giveaway.id === 'mobile_phone' ? 'assets/images/Smart-phone.png' :
                                winnerData.giveaway.id === 'led' ? 'assets/images/Smart-LED.png' :
                                winnerData.giveaway.id === 'voucher' ? 'assets/images/Voucher.png' :
                                '/src/assets/images/gift.png'
                              }
                              alt={winnerData.giveaway.name} 
                            />
                          </div>
                          <div className="winner-header">
                            <h2 className="winner-title">🎉 Congratulations!</h2>
                            <h1 className="winner-name">{winnerData.winner.cust_name || winnerData.winner['Customer Name'] || winnerData.winner.customerName}</h1>
                          </div>
                          
                          <div className="prize-info">
                            <div className="prize-won">
                              <span className="info-label">Won:</span>
                              <span className="info-value prize-name">{winnerData.giveaway.name}</span>
                            </div>
                            
                            <div className="winner-details">
                              <div className="detail-row">
                                <span className="info-label">Winner Name:</span>
                                <span className="info-value">{winnerData.winner.cust_name || winnerData.winner['Customer Name'] || winnerData.winner.customerName || '-'}</span>
                              </div>
                              <div className="detail-row">
                                <span className="info-label">Cust Code:</span>
                                <span className="info-value">{winnerData.winner.cust_cd || winnerData.winner['Customer Code'] || winnerData.winner.customerCode || '-'}</span>
                              </div>
                              <div className="detail-row">
                                <span className="info-label">Phone:</span>
                                <span className="info-value">{winnerData.winner.phone || winnerData.winner.phone_number || '-'}</span>
                              </div>
                              <div className="detail-row">
                                <span className="info-label">Reward:</span>
                                <span className="info-value">{winnerData.giveaway.name || '-'}</span>
                              </div>
                            </div>
                          </div>
                        </>

                      <button 
                        className="winner-close-btn"
                        onClick={() => {
                          // Add winner to the list
                          const winnerRecord = {
                            customerCode: winnerData.winner.cust_cd || winnerData.winner['Customer Code'],
                            customerName: winnerData.winner.cust_name || winnerData.winner['Customer Name'],
                            outletName: winnerData.winner.outlet_name || winnerData.winner['Outlet Name'] || '-',
                            phone: winnerData.winner.phone || winnerData.winner.phone_number || '-',
                            wonGiveaway: winnerData.giveaway.name,
                            giveawayId: winnerData.giveaway.id,
                            wonTier: 'N/A',
                            wonDate: new Date().toLocaleString(),
                            region: winnerData.winner.Region,
                            zone: winnerData.winner.Zone,
                            area: winnerData.winner.Area
                          };
                          setExcludedWinners(prev => [...prev, winnerRecord]);
                          setShowWinnerModal(false);
                        }}
                      >
                        Great! 🎊
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="lucky-draw-header-actions uk-width-1-1">
              <button className="header-action-btn" onClick={() => navigate(-1)}>
                ← Back
              </button>
              <button
                className="header-action-btn logout"
                onClick={() => {
                  localStorage.clear();
                  setAuth({ token: null, user: {} });
                  navigate('/');
                }}
              >
                Logout
              </button>
            </div>
              <div className="  uk-width-1-1 uk-flex uk-flex-center main-content-card " style={{alignItems: 'baseline', padding: '26px 20px'}}> 
                        <div className="uk-margin-remove">
                          <img className="logo-image" src='assets/images/nfllogo.png' alt="Lifeboy Logo" />
                        </div>
                        {/* <div className="uk-margin-remove">
                          <img className="logo-image" src="assets/images/WINTERPLAN.png" alt="Campaign Logo" />
                        </div> */}
                      </div>

            

            {/* Tier Selection */}
            <div className="uk-width-1-1 " style={{paddingLeft: '15px'}}>
              
              <div className="uk-card uk-card-default uk-card-body tier-selection-card" style={{backgroundImage: 'url(/src/assets/images/green bg.png)'}}>
                <div className="uk-flex uk-flex-between uk-flex-middle" style={{marginBottom: '20px'}}>
                  <h3 className="uk-card-title" style={{margin: 0}}>Select Tier & Giveaway</h3>
                  
                  {/* Store Selection Dropdown */}
                  <div className="store-selector">
                    <label style={{marginRight: '10px', fontWeight: 'bold'}}>Select Store:</label>
                    <select 
                      className="uk-select" 
                      style={{width: '200px', padding: '8px', borderRadius: '4px'}}
                      value={selectedStore}
                      onChange={(e) => setSelectedStore(e.target.value)}
                    >
                      <option value="">-- Select Store --</option>
                      {GROCERY_STORES.map(store => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* All Rewards Grid - No Tier Hierarchy */}
                <div className="giveaway-selection" style={{marginTop: '20px'}}>
                  <h3 className="uk-card-title" style={{marginBottom: '20px'}}>Select Reward</h3>
                  <div className="giveaway-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px'}}>
                    {allGiveaways.map((giveaway) => {
                      // Get store-specific limit
                      const storeLimit = selectedStore && STORE_GIVEAWAY_LIMITS[selectedStore] 
                        ? STORE_GIVEAWAY_LIMITS[selectedStore][giveaway.limitKey] || 0 
                        : 0;
                      
                      return (
                        <div
                          key={giveaway.id}
                          className={`giveaway-card ${selectedGiveaway === giveaway.id ? 'selected' : ''} ${storeLimit === 0 ? 'disabled' : ''}`}
                          onClick={() => storeLimit > 0 && handleGiveawayChange(giveaway.id)}
                          style={{ 
                            opacity: storeLimit === 0 ? 0.5 : 1, 
                            cursor: storeLimit === 0 ? 'not-allowed' : 'pointer',
                            padding: '20px',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            textAlign: 'center'
                          }}
                        >
                          <div className="giveaway-icon" style={{marginBottom: '15px'}}>
                            <img 
                              style={{width: '120px', height: '120px', objectFit: 'contain'}} 
                              src={ giveaway.id === '660_cc_car' ? 'assets/images/Alto.png' :
                                 giveaway.id === '1300_cc_car' ? yaris :
                                 giveaway.id === 'motor_bike' ? 'assets/images/Bike.png' :
                                 giveaway.id === 'mobile_phone' ? 'assets/images/Smart-phone.png' :
                                 giveaway.id === 'led' ? 'assets/images/Smart-LED.png' :
                                 giveaway.id === 'voucher' ? 'assets/images/Voucher.png' :
                                 '/src/assets/images/gift.png'}
                              alt={giveaway.name} 
                            />
                          </div>
                          <h5 style={{margin: '10px 0', fontSize: '16px', fontWeight: '600'}}>{giveaway.name}</h5>
                          <p style={{margin: 0, fontSize: '14px', color: storeLimit === 0 ? '#999' : '#e71b19'}}>
                            {selectedStore ? `Limit: ${storeLimit}` : 'Select a store to see limit'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Geographic Filters */}
                {selectedGiveaway && data && (
                  <div className="filter-section">
                    <h4>Filter Participants by Location:</h4>
                    <div className="uk-grid uk-grid-small uk-margin-small-top" uk-grid="">
                      <div className="uk-width-1-1 uk-margin-small-top">
                        <div className="uk-card uk-card-default uk-card-body " style={{ borderRadius:'20px' }} >
                          <div className="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap" style={{ gap: '16px' }}>
                            <div>
                              <div className="uk-text-meta">Draw Region</div>
                              <div style={{ fontSize: '28px', fontWeight: '700', color: '#e2178d', lineHeight: '1.2' }}>
                                {displayedRegion}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div className="uk-text-meta">Eligible Participants</div>
                              <div style={{ fontSize: '32px', fontWeight: '700', color: '#e2178d', lineHeight: '1.2' }}>
                                {displayedParticipantsCount}
                              </div>
                            </div>
                          </div>
                          <div className="filter-summary uk-margin-small-top">
                            <span className="uk-text-small uk-text-muted">
                              {selectedZone && <span className="filter-tag">Zone: {selectedZone}</span>}
                              {displayedRegion && <span className="filter-tag">Region: {displayedRegion}</span>}
                              {selectedArea && <span className="filter-tag">Area: {selectedArea}</span>}
                            </span>
                          </div>
                          {(selectedZone || (role === 'admin' && selectedRegion) || selectedArea) && (
                            <button 
                              className="uk-button uk-button-secondary uk-button-small uk-margin-small-top"
                              onClick={clearFilters}
                            >
                              Clear Filters
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>


            {/* Eligible Participants */}
            {selectedGiveaway && (
              <div className="uk-width-1-1@m" style={{paddingLeft: '15px'}}>
                <div className="uk-card uk-card-default uk-card-body participants-card">
                  <h3 className="uk-card-title">Eligible Participants</h3>
                  <p className="uk-text-small uk-text-muted">For {allGiveaways.find(g => g.id === selectedGiveaway)?.name}</p>
                  
                  {/* Search Input */}
                  <div className="uk-margin" style={{ marginBottom: '20px' }}>
                    <div className="uk-inline uk-width-1-1">
                      <span className="uk-form-icon" uk-icon="icon: search"></span>
                      <input 
                        className="uk-input" 
                        type="text" 
                        placeholder="Search by customer name or code..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button 
                          className="uk-form-icon uk-form-icon-flip" 
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                          onClick={() => setSearchQuery('')}
                          uk-icon="icon: close"
                        ></button>
                      )}
                    </div>
                    {searchQuery && (
                      <p className="uk-text-small uk-text-muted" style={{ marginTop: '5px' }}>
                        Found {searchFilteredParticipants.length} participant(s) matching "{searchQuery}"
                      </p>
                    )}
                  </div>
                  

                  <div className="participants-list">
                    {paginatedParticipants.map((participant, index) => (
                      <div key={participant.cust_cd || participant.customerCode || index} className="participant-item">
                        <div className="participant-info">
                          <h5>{participant.cust_name || participant["Customer Name"]}</h5>
                          <p><strong>Customer Code:</strong> {participant['cust_cd'] || participant.customerCode}</p>
                          <p><strong>Entries:</strong> {participant.drawEntries || 0}</p>
                        </div>
                      </div>
                    ))}
                    {eligibleParticipantsList.length === 0 && (
                      <p className="uk-text-center uk-text-muted">No eligible participants found</p>
                    )}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="uk-flex uk-flex-between uk-flex-middle" style={{ marginTop: '20px', padding: '10px', borderTop: '1px solid #e5e5e5' }}>
                      <div className="uk-text-small uk-text-muted">
                        Showing {startIndex + 1}-{Math.min(endIndex, searchFilteredParticipants.length)} of {searchFilteredParticipants.length} participants
                      </div>
                      <div className="uk-flex uk-flex-middle" style={{ gap: '10px' }}>
                        <button 
                          className="uk-button uk-button-small uk-button-default"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        <span className="uk-text-small">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button 
                          className="uk-button uk-button-small uk-button-default"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}


                </div>
              </div>
            )}

            {/* Draw Section */}
            {selectedGiveaway && (
              <div className="uk-width-1-1@m" style={{paddingLeft: '15px'}}>
                <div className="uk-card uk-card-default uk-card-body draw-card">
                  <h3 className="uk-card-title">
                    {allGiveaways.find(g => g.id === selectedGiveaway)?.name} Draw
                  </h3>
                  
                  <div className="draw-wheel-container">
                    <div className={`draw-wheel ${isSpinning ? 'spinning' : ''}`}>
                      <div className="prize-circle">
                        <img 
                          className="prize-circle-image"
                          src={
                            selectedGiveaway === '660_cc_car' ? "assets/images/Alto.png" :
                            selectedGiveaway === '1300_cc_car' ? yaris :
                            selectedGiveaway === 'motor_bike' ? 'assets/images/Bike.png' :
                            selectedGiveaway === 'mobile_phone' ? 'assets/images/Smart-phone.png' :
                            selectedGiveaway === 'led' ? 'assets/images/Smart-LED.png' :
                            selectedGiveaway === 'voucher' ? 'assets/images/Voucher.png' :
                            '/src/assets/images/gift.png'
                          }
                          alt={allGiveaways.find(g => g.id === selectedGiveaway)?.name} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="draw-controls">
                    <button 
                      className="draw-action-btn"
                      onClick={startLuckyDraw}
                      disabled={isSpinning}
                    >
                      {isSpinning ? 'Drawing...' : 'START LUCKY DRAW'}
                    </button>
                    
                    {/* 
                    {winner && (
                      <button 
                        className="reset-action-btn"
                        onClick={resetDraw}
                      >
                        RESET
                      </button>
                    )}
                       */}
                  </div>
                </div>
              </div>
            )}

            

            {/* Draw History */}
            <div className="uk-width-1-1" style={{paddingLeft: '15px'}}>
              <div className="uk-card uk-card-default uk-card-body history-card">
                <div className="uk-flex uk-flex-between uk-flex-middle uk-margin-bottom">
                  <h3 className="uk-card-title">Draw History</h3>
                  {excludedWinners?.length > 0 && (
                    <div className="uk-flex uk-flex-middle" style={{gap: '10px'}}>
                      <CSVLink
                        data={csvData}
                        headers={csvHeaders}
                        filename={`lucky-draw-winners-${new Date().toISOString().split('T')[0]}.csv`}
                        className="uk-button uk-button-primary uk-button-small"
                        style={{textDecoration: 'none', color: 'white'}}
                      >
                        📊 Export CSV
                      </CSVLink>

                      {role === 'admin' && (
                        <button 
                          className="uk-button uk-button-danger uk-button-small"
                          onClick={clearHistory}
                        >
                          Clear History
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {excludedWinners?.length > 0 && (
                  <div className="uk-margin-bottom">
                    <input
                      type="text"
                      className="uk-input"
                      placeholder="Search by Customer Code or Giveaway..."
                      value={historySearchQuery}
                      onChange={(e) => setHistorySearchQuery(e.target.value)}
                      style={{maxWidth: '400px'}}
                    />
                    <div className="uk-margin-small-top uk-text-small uk-text-muted">
                      Showing {paginatedHistoryData.length} of {filteredHistoryData.length} results
                    </div>
                  </div>
                )}
                
                {excludedWinners?.length === 0 ? (
                  <p className="uk-text-center uk-text-muted">No draws conducted yet</p>
                ) : filteredHistoryData.length === 0 ? (
                  <p className="uk-text-center uk-text-muted">No results found for "{historySearchQuery}"</p>
                ) : (
                  <>
                    <div className="uk-overflow-auto">
                      <table className="uk-table uk-table-small uk-table-divider uk-table-hover">
                        <thead>
                          <tr className="uk-text-center">
                            <th className="uk-text-center">Date & Time</th>
                            <th className="uk-text-center">Winner</th>
                            <th className="uk-text-center">Invoice Code</th>
                            <th className="uk-text-center">Giveaway</th>
                            <th className="uk-text-center">Phone</th>
                            <th className="uk-text-center">City</th>
                            <th className="uk-text-center">Outlet Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedHistoryData?.map((entry, index) => (
                            <tr key={`${entry?.customerCode || 'unknown'}-${entry?.giveawayId || 'giveaway'}-${entry?.wonDate || index}-${index}`} className="uk-text-center">
                              <td>{entry?.wonDate}</td>
                              <td>{entry?.customerName}</td>
                              <td>{entry?.customerCode}</td>
                              <td>{entry?.wonGiveaway}</td>
                              <td>{entry?.phone || '-'}</td>
                              <td>{entry?.area || '-'}</td>
                              <td>{entry?.outletName || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {historyTotalPages > 1 && (
                      <div className="uk-flex uk-flex-center uk-flex-middle uk-margin-top" style={{gap: '10px'}}>
                        <button
                          className="uk-button uk-button-default uk-button-small"
                          onClick={() => setHistoryCurrentPage(1)}
                          disabled={historyCurrentPage === 1}
                        >
                          First
                        </button>
                        <button
                          className="uk-button uk-button-default uk-button-small"
                          onClick={() => setHistoryCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={historyCurrentPage === 1}
                        >
                          Previous
                        </button>
                        <span className="uk-text-small">
                          Page {historyCurrentPage} of {historyTotalPages}
                        </span>
                        <button
                          className="uk-button uk-button-default uk-button-small"
                          onClick={() => setHistoryCurrentPage(prev => Math.min(historyTotalPages, prev + 1))}
                          disabled={historyCurrentPage === historyTotalPages}
                        >
                          Next
                        </button>
                        <button
                          className="uk-button uk-button-default uk-button-small"
                          onClick={() => setHistoryCurrentPage(historyTotalPages)}
                          disabled={historyCurrentPage === historyTotalPages}
                        >
                          Last
                        </button>
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
