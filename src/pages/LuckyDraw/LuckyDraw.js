import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../Context/AuthProvider";
import { useDistributorData } from "../../Context/DistributorDataProvider";
import { apiGetasync } from "../../Utils/apiServices";
import Spinner from "../../reusables/Spinner";
import Swal from 'sweetalert2';
import { useQuery } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import "./LuckyDraw.css";
import yaris from "../../assets/images/yaris2x.png";
import gold_1_tola from "../../assets/images/barr.png";
import coin from "../../assets/images/ss.png";
import Lottie from 'react-lottie';
import confetti from "../../assets/Confetti.json";
import wheel from "../../assets/Countdownnew.json";
import lifeboylogo from "../../assets/images/lifeboylogo.png";
import campaignlogo from "../../assets/images/campaignlogo.png";


// silver assets

import microwave_oven from "../../assets/images/microwave.png";
import samsung_a06 from "../../assets/images/samsung.png";
import iron from "../../assets/images/iron2x.png";
import food_factory from "../../assets/images/foodfactory.png";
import juicer from "../../assets/images/juicer.png";
import washing_machine from "../../assets/images/WASHINGmachine.png";
import daraz_gift_card from "../../assets/images/CARD.png";
import axios from "axios";

const BASE_GIVEAWAY_CONFIG = {
  Platinum: [
    { id: 'car', name: 'Yaris Giveaway', icon: '🚗', description: '1 Per Zone', limit: 1, limitType: 'zone' }
  ],
  Gold: [
    { id: 'gold_1_tola', name: '1 Tola Gold', icon: '🥇', description: '1 Per Region', limit: 1, limitType: 'region' },
    { id: 'gold_5_grams', name: '5 Grams Gold', icon: '🏅', description: '1 Per Area', limit: 1, limitType: 'area' }
  ],
  Silver: [
    { id: 'microwave_oven', name: 'Microwave Oven', icon: '📱', description: '2 Per Area', limit: 2, limitType: 'area' },
    { id: 'samsung_a06', name: 'Samsung A06', icon: '📱', description: '3 Per Area', limit: 3, limitType: 'area' },
    { id: 'washing_machine', name: 'Washing Machine', icon: '🧺', description: '2 Per Area', limit: 2, limitType: 'area' },
    { id: 'food_factory', name: 'Food Factory', icon: '🍳', description: '2 Per Area', limit: 2, limitType: 'area' },
    { id: 'daraz_gift_card', name: 'Daraz 10K Gift Card', icon: '🎁', description: '5 Per Area', limit: 5, limitType: 'area' },
    { id: 'iron', name: 'Iron', icon: '👔', description: '5 Per Area', limit: 5, limitType: 'area' },
    { id: 'juicer', name: 'Juicer', icon: '🥤', description: '2 Per Area', limit: 2, limitType: 'area' }
  ]
};

const LuckyDraw = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [selectedTier, setSelectedTier] = useState('Platinum');
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


  // Fetch dashboard data from API (fetch all data for lucky draw)
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['luckyDrawData'],
    queryFn: () => {
      const params = new URLSearchParams({
        // page: 1,
        // limit: 10000000 
      });
      return apiGetasync(`http://localhost:8000/api/new-customer-data?${params}`);
      // return apiGetasync(`https://unilever.convexinteractive.com/api/new-customer-data?${params}`);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  });

  const data = dashboardData?.data; // This is now a flat array of all customers
  const role =  auth?.user?.role;

  const { data: winnersData, isLoading: winnersLoading, error: winnersError ,refetch: refetchWinnersData } = useQuery({
    queryKey: ['winnerData'],
    queryFn: () => {
      return apiGetasync(`http://localhost:8000/api/winners-data`);
    },
    // staleTime: 30 * 60 * 1000, // 30 minutes
    // cacheTime: 60 * 60 * 1000, // 1 hour
  });
  console.log(role , "role")

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

    // Giveaway configuration by tier with limits
  const giveawayConfig = useMemo(() => {
    if (role === 'admin') {
      return BASE_GIVEAWAY_CONFIG;
    }
    const { Platinum, ...rest } = BASE_GIVEAWAY_CONFIG;
    return rest;
  }, [role]);
  

  useEffect(() => {
    // Load draw history from localStorage
    const savedHistory = localStorage.getItem('luckyDrawHistory');
    if (savedHistory) {
      setDrawHistory(JSON.parse(savedHistory));
    }
   }, []);

  useEffect(() => {
    const availableTiers = Object.keys(giveawayConfig);
    if (!availableTiers.includes(selectedTier)) {
      setSelectedTier(availableTiers[0] || '');
      setSelectedGiveaway('');
    }
  }, [giveawayConfig, selectedTier]);


  // Get available zones (excluding those that reached giveaway limits) - Memoized for performance
  const uniqueZones = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    const allCustomers = data;
    let zones = [...new Set(allCustomers.map(c => c.GeoData?.[0]?.ZoneDesc).filter(Boolean))];
    
    // Filter out zones that have reached limits for selected giveaway
    if (selectedGiveaway) {
      const giveaway = Object.values(giveawayConfig)
        .flat()
        .find(g => g.id === selectedGiveaway);
      
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
  }, [data, selectedGiveaway, winnersData]);

  // Auto-clear selectedZone if it's no longer in the available zones list
  useEffect(() => {
    if (selectedZone && !uniqueZones.includes(selectedZone)) {
      setSelectedZone('');
      setSelectedRegion('');
      setSelectedArea('');
    }
  }, [uniqueZones, selectedZone]);

  const getUniqueZones = () => uniqueZones;

  const uniqueRegions = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    let allCustomers = data;
    
    if (selectedZone) {
      allCustomers = allCustomers.filter(c => c.GeoData?.[0]?.ZoneDesc === selectedZone);
    }
    
    let regions = [...new Set(allCustomers.map(c => c.GeoData?.[0]?.Region).filter(Boolean))];
    
    // Filter out regions that have reached limits for selected giveaway
    if (selectedGiveaway) {
      const giveaway = Object.values(giveawayConfig)
        .flat()
        .find(g => g.id === selectedGiveaway);
      
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
    if (selectedRegion && !uniqueRegions.includes(selectedRegion)) {
      setSelectedRegion('');
      setSelectedArea('');
    }
  }, [uniqueRegions, selectedRegion]);

  const getUniqueRegions = () => uniqueRegions;

  const uniqueAreas = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    let allCustomers = data;
    
    if (selectedZone) {
      allCustomers = allCustomers.filter(c => c.GeoData?.[0]?.ZoneDesc === selectedZone);
    }
    if (selectedRegion) {
      allCustomers = allCustomers.filter(c => c.GeoData?.[0]?.Region === selectedRegion);
    }
    
    let areas = [...new Set(allCustomers.map(c => c.GeoData?.[0]?.Area).filter(Boolean))];
    
    // Filter out areas that have reached limits for selected giveaway
    if (selectedGiveaway) {
      const giveaway = Object.values(giveawayConfig)
        .flat()
        .find(g => g.id === selectedGiveaway);
      
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

    const customerCode = customer.cust_cd;   
    const excludedEntry = winnersData.find(w => w.customerCode === customerCode);
    
    if (!excludedEntry) return false;
    
    // Hierarchical exclusion logic
    const tierHierarchy = { 'Platinum': 3, 'Gold': 2, 'Silver': 1 };
    const wonTierLevel = tierHierarchy[excludedEntry.wonTier];
    const targetTierLevel = tierHierarchy[targetTier];
    
    // If they won a higher or equal tier, they're excluded from lower/equal tiers
    return wonTierLevel >= targetTierLevel;
  };

  // Check if giveaway limit is reached for a specific area
  const isGiveawayLimitReached = (giveawayId, customer) => {
    const giveaway = Object.values(giveawayConfig)
      .flat()
      .find(g => g.id === giveawayId);
    
    if (!giveaway) return false;
    
    // Count awarded giveaways for this specific giveaway and area
    const awardedCount = winnersData?.filter(award => {
      if (award.giveawayId !== giveawayId) return false;
      
      // Check based on limit type
      if (giveaway.limitType === 'zone') {
        return award.zone === customer.GeoData?.[0]?.ZoneDesc;
      } else if (giveaway.limitType === 'region') {
        return award.region === customer.GeoData?.[0]?.Region;
      } else if (giveaway.limitType === 'area') {
        return award.area === customer.GeoData?.[0]?.Area;
      }
      
      return false;
    }).length;
    
    return awardedCount >= giveaway.limit;
  };

  // Filter participants based on selected criteria with cross-tier eligibility - Memoized
  const eligibleParticipantsList = useMemo(() => {
    if (!data) return [];
    
    // Get all customers from unified pool
    let participants = getAllCustomers();
    
    // Apply geographic filters
    if (selectedZone) {
      participants = participants.filter(p => p.GeoData?.[0]?.ZoneDesc === selectedZone);
    }
    
    if (selectedRegion) {
      participants = participants.filter(p => p.GeoData?.[0]?.Region === selectedRegion);
    }
    
    if (selectedArea) {
      participants = participants.filter(p => p.GeoData?.[0]?.Area === selectedArea);
    }
    
    // Filter by tier-specific entries > 0, exclusion status, and giveaway limits
    participants = participants.filter(p => {
      // Check if excluded based on hierarchical rules
      if (isCustomerExcluded(p, selectedTier)) {
        return false;
      }
      
      // Check if giveaway limit is reached for this customer's area
      if (selectedGiveaway && isGiveawayLimitReached(selectedGiveaway, p)) {
        return false;
      }
      
      // Check if they have entries for this tier
      let entries = 0;
      if (selectedTier === 'Platinum') {
        entries = p.entry_count?.platinum || 0;
      } else if (selectedTier === 'Gold') {
        entries = p.entry_count?.gold || 0;
      } else if (selectedTier === 'Silver') {
        entries = p.entry_count?.silver || 0;
      }
      
      return entries > 0; // Only eligible if they have entries for this tier
    });
    
    // Add drawEntries for weighted selection
    return participants.map(p => {
      let entries = 0;
      if (selectedTier === 'Platinum') {
        entries = p.entry_count?.platinum || 0;
      } else if (selectedTier === 'Gold') {
        entries = p.entry_count?.gold || 0;
      } else if (selectedTier === 'Silver') {
        entries = p.entry_count?.silver || 0;
      }
      return { ...p, drawEntries: entries };
    });
  }, [data, selectedZone, selectedRegion, selectedArea, selectedTier, selectedGiveaway , winnersData]);

  const filterParticipants = () => eligibleParticipantsList;

  // Search filtering
  const searchFilteredParticipants = useMemo(() => {
    if (!searchQuery.trim()) return eligibleParticipantsList;
    
    const query = searchQuery.toLowerCase().trim();
    return eligibleParticipantsList.filter(participant => {
      const custName = (participant.cust_name || participant.customerName || '').toLowerCase();
      const custCode = (participant.cust_cd || participant.customerCode || '').toLowerCase();
      return custName.includes(query) || custCode.includes(query);
    });
  }, [eligibleParticipantsList, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(searchFilteredParticipants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedParticipants = searchFilteredParticipants.slice(startIndex, endIndex);

  // Reset to page 1 when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTier, selectedGiveaway, selectedZone, selectedRegion, selectedArea, searchQuery]);

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

    
    // For car giveaway, filter draw pool to only include participants with at least 66 platinum entries
    let drawPoolParticipants = participants;
    if (selectedGiveaway === 'car') {
      drawPoolParticipants = participants.filter(p => {
        const platinumEntries = p.entry_count?.platinum || 0;
        return platinumEntries >= 66;
      });
      
      // Check if any participants qualify for the draw
      if (drawPoolParticipants.length === 0) {
        Swal.fire({
          title: 'No Qualified Participants',
          text: 'No participants qualified for the car giveaway',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }
      
      console.log(`Car giveaway: ${drawPoolParticipants.length} out of ${participants.length} participants qualify with 66+ platinum entries`);
    }
    
    // Create weighted pool based on entries
    const weightedPool = [];
    drawPoolParticipants.forEach(participant => {
      const entries = participant.drawEntries || 1; // At least 1 entry
      for (let i = 0; i < entries; i++) {
        weightedPool.push(participant);
      }
    });


    setEligibleParticipants(participants);
    setIsSpinning(true);
    setWinner(null);

    // Show wheel modal first
    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    const selectedWinner = weightedPool[randomIndex];
    const giveaway = giveawayConfig[selectedTier].find(g => g.id === selectedGiveaway);
    
    // Prepare winner data
    const winnerInfo = {
      winner: selectedWinner,
      giveaway: giveaway,
      tier: selectedTier
    };
    
    // Show wheel modal
    setWinnerData(winnerInfo);
    setShowWheelModal(true);
    
    // After wheel animation, show winner announcement
    setTimeout(async () => {
      setShowWheelModal(false);
      setWinner({ ...selectedWinner, giveaway });
      setIsSpinning(false);
      

      
      // Add winner to excluded list
      const excludedWinner = {
        customerCode: selectedWinner.cust_cd,
        customerName: selectedWinner.cust_name,
        wonTier: selectedTier,
        wonGiveaway: giveaway.name,
        zone: selectedWinner.GeoData?.[0]?.ZoneDesc,
        region: selectedWinner.GeoData?.[0]?.Region,
        area: selectedWinner.GeoData?.[0]?.Area,
        giveawayId: selectedGiveaway,
        giveawayName: giveaway.name,
        wonDate: new Date().toLocaleString()
      };

      try {
        await axios.post(`http://localhost:8000/api/add-winner`, excludedWinner);
        refetchWinnersData();
      }
      
      
        catch (error) {
        console.error('Error excluding winner:', error);
        Swal.fire({
          title: 'Error Adding Winner',
          text: 'Failed to add winner to draw',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
            
      
            
      // Show winner modal
      setShowWinnerModal(true);
    }, 10000);
  };

 

  const clearHistory = () => {
    Swal.fire({
      title: 'Clear History?',
      text: 'This will remove all previous draw results',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'Cancel'
    }).then( async (result) => {
      if (result.isConfirmed) {

        try {
          await axios.delete(`http://localhost:8000/api/clear-winners-data`);
          refetchWinnersData();
        } catch (error) {
          console.log(error);
          return;
        }

        
        // Also clear excluded winners and awarded giveaways
        setExcludedWinners([]);
        localStorage.removeItem('excludedWinners');
        
        
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

  const handleTierChange = (tier) => {
    setSelectedTier(tier);
    setSelectedGiveaway('');
    setWinner(null);
    
    // Clear disabled fields based on tier
    if (tier === 'Platinum') {
      // Platinum: disable Region and Area
      setSelectedRegion('');
      setSelectedArea('');
    } else if (tier === 'Gold') {
      // Gold: disable Zone
      setSelectedZone('');
    } else if (tier === 'Silver') {
      // Silver: disable Zone and Region
      setSelectedZone('');
      setSelectedRegion('');
    }
    setEligibleParticipants([]);
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
    setSelectedRegion('');
    setSelectedArea('');
    setWinner(null);
    setEligibleParticipants([]);
  };

  // Prepare CSV data for export
  const csvData = drawHistory.map((entry, index) => ({
    'S.No': index + 1,
    'Date & Time': entry.date,
    'Winner Name': entry.winner.cust_name || entry.winner.customerName,
    'Customer Code': entry.winner.cust_cd || entry.winner.customerCode,
    'Giveaway': entry.giveaway?.name,
    'Tier': entry.tier,
    'Region': entry.winner.GeoData?.[0]?.Region || entry.winner.Region,
    'Zone': entry.winner.GeoData?.[0]?.ZoneDesc || entry.winner.ZONE,
    'Area': entry.winner.GeoData?.[0]?.Area || entry.winner.AREA,
    'Total Participants': entry.totalParticipants
  }));

  const csvHeaders = [
    { label: 'S.No', key: 'S.No' },
    { label: 'Date & Time', key: 'Date & Time' },
    { label: 'Winner Name', key: 'Winner Name' },
    { label: 'Customer Code', key: 'Customer Code' },
    { label: 'Giveaway', key: 'Giveaway' },
    { label: 'Tier', key: 'Tier' },
    { label: 'Region', key: 'Region' },
    { label: 'Zone', key: 'Zone' },
    { label: 'Area', key: 'Area' },
    { label: 'Total Participants', key: 'Total Participants' }
  ];

  if (dashboardLoading) {
    return <Spinner />;
  }

  return (
    <div className="lucky-draw-container" >
      <div className="uk-container uk-container-large">

                        
        
        {dashboardError ? (
          <div className="uk-flex uk-flex-center uk-flex-middle" style={{ height: '100vh' }}>
            <div className="uk-card uk-card-default uk-card-body uk-text-center">
              <h3>Error Loading Data Please Refresh</h3>
              {/* <p>{error?.message || 'Failed to load dashboard data'}</p> */}
              <button onClick={() => window.location.reload()} className="uk-button uk-button-primary">
                Retry
              </button>
            </div>
          </div>
        ) : !data ? (
          // Loading Screen
          <div className="uk-flex uk-flex-center uk-flex-middle" style={{ height: '100vh' }}>
            <div className="uk-card uk-card-default uk-card-body uk-text-center">
              <h3>Loading Dashboard Data...</h3>
              <p>Please wait while we load customer data for the lucky draw</p>
              <div uk-spinner="ratio: 2"></div>
            </div>
          </div>
        ) : (
          // Main Lucky Draw Interface
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
                  <Lottie options={confettiOptions} height={"100%"} width={"100%"} />
                  <div className="winner-info-overlay">
                    <div className="winner-announcement">
                      <div className="giveaway-icon">
                        <img 
                          style={{width: '70%', objectFit: 'contain'}} 
                          src={
                            winnerData.giveaway.id === 'car' ? yaris :
                            winnerData.giveaway.id === 'gold_1_tola' ? gold_1_tola :
                            winnerData.giveaway.id === 'gold_5_grams' ? coin :
                            winnerData.giveaway.id === 'microwave_oven' ? microwave_oven :
                            winnerData.giveaway.id === 'samsung_a06' ? samsung_a06 :
                            winnerData.giveaway.id === 'iron' ? iron :
                            winnerData.giveaway.id === 'food_factory' ? food_factory :
                            winnerData.giveaway.id === 'juicer' ? juicer :
                            winnerData.giveaway.id === 'washing_machine' ? washing_machine :
                            winnerData.giveaway.id === 'daraz_gift_card' ? daraz_gift_card :
                            '/src/assets/images/gift.png'
                          }
                          alt={winnerData.giveaway.name} 
                        />
                      </div>
                      <div className="winner-header">
                        <h2 className="winner-title">🎉 Congratulations!</h2>
                        <h1 className="winner-name">{winnerData.winner.cust_name || winnerData.winner.customerName}</h1>
                      </div>
                      
                      <div className="prize-info">
                        <div className="prize-won">
                          <span className="info-label">Won:</span>
                          <span className="info-value prize-name">{winnerData.giveaway.name}</span>
                        </div>
                        
                        <div className="winner-details">
                          <div className="detail-row">
                            <span className="info-label">Region:</span>
                            <span className="info-value">{winnerData.winner.GeoData?.[0]?.Region || winnerData.winner.Region}</span>
                          </div>
                          <div className="detail-row">
                            <span className="info-label">Area:</span>
                            <span className="info-value">{winnerData.winner.GeoData?.[0]?.Area || winnerData.winner.AREA}</span>
                          </div>
                          
                          <div className="detail-row">
                            <span className="info-label">Zone:</span>
                            <span className="info-value">{winnerData.winner.GeoData?.[0]?.ZoneDesc || winnerData.winner.ZONE}</span>
                          </div>
                          
                          
                          <div className="detail-row">
                            <span className="info-label">Customer Code:</span>
                            <span className="info-value ">{winnerData.winner.cust_cd || winnerData.winner.customerCode}</span>
                          </div>

                          {/* <div className="detail-row">
                            <span className="info-label">Entries:</span>
                            <span className="info-value entries-count">{winnerData.winner.drawEntries}</span>
                          </div> */}
                          
                          {/* <div className="detail-row tier-row">
                            <span className="info-label">Tier:</span>
                            <span className={`tier-badge-winner tier-${winnerData.tier.toLowerCase()}`}>
                              {winnerData.tier.toUpperCase()}
                            </span>
                          </div> */}
                        </div>
                      </div>
                      <button 
                        className="winner-close-btn"
                        onClick={() => setShowWinnerModal(false)}
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
              <div className="  uk-width-1-1 uk-flex uk-flex-between main-content-card " style={{alignItems: 'baseline', padding: '16px 50px'}}> 
                        <div className="uk-margin-remove">
                          <img className="logo-image" src={lifeboylogo} alt="Lifeboy Logo" />
                        </div>
                        <div className="uk-margin-remove">
                          <img className="logo-image" src={campaignlogo} alt="Campaign Logo" />
                        </div>
                      </div>

            

            {/* Tier Selection */}
            <div className="uk-width-1-1 " style={{paddingLeft: '15px'}}>
              
              <div className="uk-card uk-card-default uk-card-body tier-selection-card" style={{backgroundImage: 'url(/src/assets/images/green bg.png)'}}>
                <h3 className="uk-card-title">Select Tier & Giveaway</h3>
                
                <div className="tier-buttons-home">
                  {Object.keys(giveawayConfig).map((tier) => (
                    <div
                      key={tier}
                      className={`tier-card-home tier-${tier.toLowerCase()} ${selectedTier === tier ? 'active' : ''}`}
                      onClick={() => handleTierChange(tier)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="tier-icon">
                        {tier === 'Platinum' ? <img style={{width: '100px'}} src={yaris} alt="Yaris" /> : tier === 'Gold' ? <img style={{width: '100px'}} src={gold_1_tola} alt="Gold" /> : <img style={{width: '100px'}} src={samsung_a06} alt="Silver" />}
                      </div>
                      <div className="tier-content">
                        <h4 className="tier-name">{tier.toUpperCase()}</h4>
                        <div className="tier-stats">
                          <span className="tier-value">({giveawayConfig[tier]?.length || 0} giveaways)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedTier && (
                  <div className="giveaway-selection">
                    {/* <h3 className="uk-card-title">Select {selectedTier.toUpperCase()} Giveaway:</h3> */}
                    <div className="giveaway-grid">
                      {(giveawayConfig[selectedTier] || []).map((giveaway) => (
                        <div
                          key={giveaway.id}
                          className={ `giveaway-card ${selectedGiveaway === giveaway.id ? 'selected' : ''}`}
                          onClick={() => handleGiveawayChange(giveaway.id)}
                        >
                          <div className="giveaway-icon"><img style={{width: '40%'}} 
                          
                          
                          src={ giveaway.id === 'car' ? yaris :
                             giveaway.id === 'gold_1_tola' ? gold_1_tola :
                             giveaway.id === 'gold_5_grams' ? coin :
                             giveaway.id === 'microwave_oven' ? microwave_oven :
                             giveaway.id === 'samsung_a06' ? samsung_a06 :
                             giveaway.id === 'iron' ? iron :
                             giveaway.id === 'food_factory' ? food_factory :
                             giveaway.id === 'juicer' ? juicer :
                             giveaway.id === 'washing_machine' ? washing_machine :
                             giveaway.id === 'daraz_gift_card' ? daraz_gift_card :
                             '/src/assets/images/gift.png'}
                          
                          
                          
                          
                          
                          alt={giveaway.name} /></div>
                          <h5>{giveaway.name}</h5>
                          <p>{giveaway.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Geographic Filters */}
                {selectedGiveaway && data && (
                  <div className="filter-section">
                    <h4>Filter Participants by Location:</h4>
                    <div className="uk-grid uk-grid-small uk-margin-small-top" uk-grid="">
                      
                      {/* Zone Filter */}
                      <div className="uk-width-1-3@m">
                        <label className="uk-form-label">Zone:</label>
                        <select 
                          className="uk-select" 
                          value={selectedZone} 
                          onChange={(e) => handleZoneChange(e.target.value)}
                          disabled={selectedTier === 'Gold' || selectedTier === 'Silver'}
                        >
                          <option value="" disabled>Select Zone</option>
                          {getUniqueZones().map(zone => (
                            <option key={zone} value={zone}>{zone}</option>
                          ))}
                        </select>
                      </div>

                      {/* Region Filter */}
                      <div className="uk-width-1-3@m">
                        <label className="uk-form-label">Region:</label>
                        <select 
                          className="uk-select" 
                          value={selectedRegion} 
                          onChange={(e) => handleRegionChange(e.target.value)}
                          disabled={selectedTier === 'Platinum' || selectedTier === 'Silver'}
                        >
                          <option value="" disabled>Select Region</option>
                          {getUniqueRegions().map(region => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>

                      {/* Area Filter */}
                      <div className="uk-width-1-3@m">
                        <label className="uk-form-label">Area:</label>
                        <select 
                          className="uk-select" 
                          value={selectedArea} 
                          onChange={(e) => handleAreaChange(e.target.value)}
                          disabled={selectedTier === 'Platinum'}
                        >
                          <option value="" disabled>Select Area</option>
                          {getUniqueAreas().map(area => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                      </div>

                      {/* Filter Summary and Clear Button */}
                      <div className="uk-width-1-1 uk-margin-small-top">
                        <div className="uk-flex uk-flex-between uk-flex-middle">
                          <div className="filter-summary">
                            <span className="uk-text-small uk-text-muted">
                              Eligible Participants: <strong>{filterParticipants().length}</strong>
                              {selectedZone && <span className="filter-tag">Zone: {selectedZone}</span>}
                              {selectedRegion && <span className="filter-tag">Region: {selectedRegion}</span>}
                              {selectedArea && <span className="filter-tag">Area: {selectedArea}</span>}
                            </span>
                          </div>
                          {(selectedZone || selectedRegion || selectedArea) && (
                            <button 
                              className="uk-button uk-button-secondary uk-button-small"
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
                  <p className="uk-text-small uk-text-muted">For {selectedTier.toUpperCase()} - {giveawayConfig[selectedTier]?.find(g => g.id === selectedGiveaway)?.name}</p>
                  
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
                  
                  {/* <div className="participants-list">
                    {filterParticipants().map((participant, index) => (
                      <div key={participant.cust_cd || participant.customerCode || index} className="participant-item">
                        <div className="participant-info">
                          <h5>{participant.cust_name || participant.customerName}</h5>
                          <p><strong>Customer Code:</strong> {participant.cust_cd || participant.customerCode}</p>
                          <p><strong>Entries:</strong> {participant.drawEntries || 0}</p>
                        </div>
                        <span className={`tier-badge tier-${selectedTier}`}>
                          {selectedTier.toUpperCase()}
                        </span>
                      </div>
                    ))}
                    {filterParticipants().length === 0 && (
                      <p className="uk-text-center uk-text-muted">No eligible participants found</p>
                    )}
                  </div> */}

                  <div className="participants-list">
                    {paginatedParticipants.map((participant, index) => (
                      <div key={participant.cust_cd || participant.customerCode || index} className="participant-item">
                        <div className="participant-info">
                          <h5>{participant.cust_name || participant.customerName}</h5>
                          <p><strong>Customer Code:</strong> {participant.cust_cd || participant.customerCode}</p>
                          <p><strong>Entries:</strong> {participant.drawEntries || 0}</p>
                        </div>
                        <span className={`tier-badge tier-${selectedTier}`}>
                          {selectedTier.toUpperCase()}
                        </span>
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
                    {giveawayConfig[selectedTier]?.find(g => g.id === selectedGiveaway)?.name} Draw
                  </h3>
                  
                  <div className="draw-wheel-container">
                    <div className={`draw-wheel ${isSpinning ? 'spinning' : ''}`}>
                      <div className="prize-circle">
                        <img 
                          className="prize-circle-image"
                          src={
                            selectedGiveaway === 'car' ? yaris :
                            selectedGiveaway === 'gold_1_tola' ? gold_1_tola :
                            selectedGiveaway === 'gold_5_grams' ? coin :
                            selectedGiveaway === 'microwave_oven' ? microwave_oven :
                            selectedGiveaway === 'samsung_a06' ? samsung_a06 :
                            selectedGiveaway === 'iron' ? iron :
                            selectedGiveaway === 'food_factory' ? food_factory :
                            selectedGiveaway === 'juicer' ? juicer :
                            selectedGiveaway === 'washing_machine' ? washing_machine :
                            selectedGiveaway === 'daraz_gift_card' ? daraz_gift_card :
                            '/src/assets/images/gift.png'
                          }
                          alt={giveawayConfig[selectedTier].find(g => g.id === selectedGiveaway)?.name} 
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
                <div className="uk-flex uk-flex-between uk-flex-middle">
                  <h3 className="uk-card-title">Draw History</h3>
                  {winnersData.length > 0 && (
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
                
                {winnersData?.length === 0 ? (
                  <p className="uk-text-center uk-text-muted">No draws conducted yet</p>
                ) : (
                  <div className="uk-overflow-auto">
                    <table className="uk-table uk-table-small uk-table-divider uk-table-hover">
                      <thead>
                        <tr className="uk-text-center">
                          <th className="uk-text-center">Date & Time</th>
                          <th className="uk-text-center">Winner</th>
                          <th className="uk-text-center">Customer Code</th>
                          <th className="uk-text-center">Giveaway</th>
                          <th className="uk-text-center">Tier</th>
                          <th className="uk-text-center">Region</th>
                          {/* <th>Participants</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {winnersData?.map((entry) => (
                          <tr key={entry?.id} className="uk-text-center">
                            <td>{entry?.wonDate}</td>
                            <td>{entry?.customerName}</td>
                            <td>{entry?.customerCode}</td>
                            <td>{entry?.wonGiveaway}</td>
                            <td>
                              <span className={`tier-badge tier-${entry?.wonTier}`}>
                                {entry?.wonTier?.toUpperCase()}
                              </span>
                            </td>
                            <td>{entry?.region || '-'} - {entry?.zone || '-'}</td>
                            {/* <td>{entry.totalParticipants}</td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default LuckyDraw;
