import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthProvider";
import { useDistributorData } from "../../Context/DistributorDataProvider";
import { apiGetasync } from "../../Utils/apiServices";
import Spinner from "../../reusables/Spinner";
import Swal from 'sweetalert2';
import { useQuery } from "@tanstack/react-query";
import "./LuckyDraw.css";
import yaris from "../../assets/images/yaris2x.png";
import gold_1_tola from "../../assets/images/goldbar.png";
import coin from "../../assets/images/coin.png";

const LuckyDraw = () => {
  const { auth } = useAuth();
  const { distributorData: globalDistributorData } = useDistributorData();
  const [selectedTier, setSelectedTier] = useState('Platinum');
  const [selectedGiveaway, setSelectedGiveaway] = useState('');
  const [eligibleParticipants, setEligibleParticipants] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [drawHistory, setDrawHistory] = useState([]);
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  // Fetch dashboard data from API
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: () => apiGetasync('http://localhost:8000/api/customer-dashboard-data')
  });

  const data = dashboardData?.data;

  // Giveaway configuration by tier
  const giveawayConfig = {
    Platinum: [
      { id: 'car', name: 'Car Giveaway', icon: '🚗', description: 'Brand new car for platinum customers' }
    ],
    Gold: [
      { id: 'gold_1_tola', name: '1 Tola Gold', icon: '🥇', description: '1 Tola pure gold' },
      { id: 'gold_5_grams', name: '5 Grams Gold', icon: '🏅', description: '5 grams pure gold' }
    ],
    Silver: [
      { id: 'microwave_oven', name: 'Microwave Oven', icon: '📱', description: 'Microwave Oven - 2 Per Area' },
      { id: 'samsung_a06', name: 'Samsung A06', icon: '📱', description: 'Samsung A06 - 3 Per Area' },
      { id: 'washing_machine', name: 'Washing Machine', icon: '🧺', description: 'Washing Machine - 2 Per Area' },
      { id: 'food_factory', name: 'Food Factory', icon: '🍳', description: 'Food Factory - 2 Per Area' },
      { id: 'daraz_gift_card', name: 'Daraz 10K Gift Card', icon: '🎁', description: 'Daraz 10K Gift Card - 5 Per Area' },
      { id: 'iron', name: 'Iron', icon: '👔', description: 'Iron - 5 Per Area' },
      { id: 'juicer', name: 'Juicer', icon: '🥤', description: 'Juicer - 2 Per Area' }
    ]
  };
  
  console.log(globalDistributorData , 'distributorData from Global ')

  useEffect(() => {
    // Load draw history from localStorage
    const savedHistory = localStorage.getItem('luckyDrawHistory');
    if (savedHistory) {
      setDrawHistory(JSON.parse(savedHistory));
    }
  }, []);


  // Get unique values for dropdowns from API data
  const getUniqueZones = () => {
    if (!data) return [];
    const allCustomers = [
      ...(data.Platinum?.data || []),
      ...(data.Gold?.data || []),
      ...(data.Silver?.data || [])
    ];
    const zones = [...new Set(allCustomers.map(c => c.ZONE).filter(Boolean))];
    return zones.sort();
  };

  const getUniqueRegions = () => {
    if (!data) return [];
    let allCustomers = [
      ...(data.Platinum?.data || []),
      ...(data.Gold?.data || []),
      ...(data.Silver?.data || [])
    ];
    
    if (selectedZone) {
      allCustomers = allCustomers.filter(c => c.ZONE === selectedZone);
    }
    
    const regions = [...new Set(allCustomers.map(c => c.Region).filter(Boolean))];
    return regions.sort();
  };

  const getUniqueAreas = () => {
    if (!data) return [];
    let allCustomers = [
      ...(data.Platinum?.data || []),
      ...(data.Gold?.data || []),
      ...(data.Silver?.data || [])
    ];
    
    if (selectedZone) {
      allCustomers = allCustomers.filter(c => c.ZONE === selectedZone);
    }
    if (selectedRegion) {
      allCustomers = allCustomers.filter(c => c.Region === selectedRegion);
    }
    
    const areas = [...new Set(allCustomers.map(c => c.AREA).filter(Boolean))];
    return areas.sort();
  };

  // Filter participants based on selected criteria
  const filterParticipants = () => {
    if (!data || !data[selectedTier]) return [];
    
    let participants = data[selectedTier].data || [];
    
    // Apply filters
    if (selectedZone) {
      participants = participants.filter(p => p.ZONE === selectedZone);
    }
    
    if (selectedRegion) {
      participants = participants.filter(p => p.Region === selectedRegion);
    }
    
    if (selectedArea) {
      participants = participants.filter(p => p.AREA === selectedArea);
    }
    
    // Calculate entries for weighted selection
    return participants.map(p => {
      let entries = 0;
      if (selectedTier === 'Platinum') {
        entries = p.entries?.platinumEntries || 0;
      } else if (selectedTier === 'Gold') {
        entries = p.entries?.goldEntries || 0;
      } else if (selectedTier === 'Silver') {
        entries = p.entries?.silverEntries || 0;
      }
      return { ...p, drawEntries: entries };
    });
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

    // Create weighted pool based on entries
    const weightedPool = [];
    participants.forEach(participant => {
      const entries = participant.drawEntries || 1; // At least 1 entry
      for (let i = 0; i < entries; i++) {
        weightedPool.push(participant);
      }
    });

    setEligibleParticipants(participants);
    setIsSpinning(true);
    setWinner(null);

    // Simulate spinning animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * weightedPool.length);
      const selectedWinner = weightedPool[randomIndex];
      const giveaway = giveawayConfig[selectedTier].find(g => g.id === selectedGiveaway);
      
      setWinner({ ...selectedWinner, giveaway });
      setIsSpinning(false);

      // Add to history
      const newEntry = {
        id: Date.now(),
        winner: selectedWinner,
        giveaway: giveaway,
        tier: selectedTier,
        date: new Date().toLocaleString(),
        totalParticipants: participants.length
      };
      const updatedHistory = [newEntry, ...drawHistory];
      setDrawHistory(updatedHistory);
      localStorage.setItem('luckyDrawHistory', JSON.stringify(updatedHistory));

      // Show winner announcement
      Swal.fire({
        title: '🎉 Congratulations!',
        html: `
          <div class="winner-announcement">
            <div class="giveaway-icon">${giveaway.icon}</div>
            <h3>${selectedWinner.customerName}</h3>
            <p><strong>Won:</strong> ${giveaway.name}</p>
            <p><strong>Region:</strong> ${selectedWinner.Region}</p>
            <p><strong>Zone:</strong> ${selectedWinner.ZONE}</p>
            <p><strong>Area:</strong> ${selectedWinner.AREA}</p>
            <p><strong>Entries:</strong> ${selectedWinner.drawEntries}</p>
            <p>Tier: <span class="tier-badge tier-${selectedTier}">${selectedTier.toUpperCase()}</span></p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Great!',
        customClass: {
          popup: 'winner-popup'
        }
      });
    }, 3000);
  };

  const resetDraw = () => {
    setWinner(null);
    setIsSpinning(false);
    setEligibleParticipants([]);
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
        setDrawHistory([]);
        localStorage.removeItem('luckyDrawHistory');
        Swal.fire('Cleared!', 'Draw history has been cleared.', 'success');
      }
    });
  };

  const handleTierChange = (tier) => {
    setSelectedTier(tier);
    setSelectedGiveaway('');
    setWinner(null);
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="lucky-draw-container" style={{marginBottom: '80px'}}>
      <div className="uk-container uk-container-xlarge">
        
        {error ? (
          <div className="uk-flex uk-flex-center uk-flex-middle" style={{ height: '100vh' }}>
            <div className="uk-card uk-card-default uk-card-body uk-text-center">
              <h3>Error Loading Data</h3>
              <p>{error?.message || 'Failed to load dashboard data'}</p>
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
          <div className="uk-grid uk-grid-large " uk-grid="" style={{ marginTop: "86px" }}>
            
            {/* Header */}
            

            {/* Tier Selection */}
            <div className="uk-width-1-1 ">
              <div className="uk-card uk-card-default uk-card-body tier-selection-card" style={{backgroundImage: 'url(/src/assets/images/green bg.png)'}}>
                <h3 className="uk-card-title">Select Tier & Giveaway</h3>
                
                <div className="tier-buttons">
                  {Object.keys(giveawayConfig).map((tier) => (
                    <button
                      key={tier}
                      className={`tier-btn tier-${tier} ${selectedTier === tier ? 'active' : ''}`}
                      onClick={() => handleTierChange(tier)}
                    >
                      <span className="tier-name">{tier.toUpperCase()}</span>
                      <span className="tier-count">({giveawayConfig[tier].length} giveaways)</span>
                    </button>
                  ))}
                </div>

                {selectedTier && (
                  <div className="giveaway-selection">
                    <h4>Select {selectedTier.toUpperCase()} Giveaway:</h4>
                    <div className="giveaway-grid">
                      {giveawayConfig[selectedTier].map((giveaway) => (
                        <div
                          key={giveaway.id}
                          className={`giveaway-card ${selectedGiveaway === giveaway.id ? 'selected' : ''}`}
                          onClick={() => handleGiveawayChange(giveaway.id)}
                        >
                          <div className="giveaway-icon"><img style={{width: '40%'}} 
                          
                          
                          src={ giveaway.id === 'car' ? yaris :
                             giveaway.id === 'gold_1_tola' ? gold_1_tola :
                             giveaway.id === 'gold_5_grams' ? coin :
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
                        >
                          <option value="">All Zones</option>
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
                        >
                          <option value="">All Regions</option>
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
                        >
                          <option value="">All Areas</option>
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
              <div className="uk-width-1-1@m">
                <div className="uk-card uk-card-default uk-card-body participants-card">
                  <h3 className="uk-card-title">Eligible Participants</h3>
                  <p className="uk-text-small uk-text-muted">For {selectedTier.toUpperCase()} - {giveawayConfig[selectedTier].find(g => g.id === selectedGiveaway)?.name}</p>
                  
                  <div className="participants-list">
                    {filterParticipants().map((participant, index) => (
                      <div key={participant.customerCode || index} className="participant-item">
                        <div className="participant-info">
                          <h5>{participant.customerName}</h5>
                          <p><strong>Customer Code:</strong> {participant.customerCode}</p>
                          <p><strong>Zone:</strong> {participant.ZONE}</p>
                          <p><strong>Region:</strong> {participant.Region}</p>
                          <p><strong>Area:</strong> {participant.AREA}</p>
                          <p><strong>Distributor:</strong> {participant.DistributorName}</p>
                          <p><strong>Entries:</strong> {participant.drawEntries || 0}</p>
                          <small>Purchase Amount: {participant.totalGrossAmount?.toLocaleString()} PKR</small>
                        </div>
                        <span className={`tier-badge tier-${selectedTier}`}>
                          {selectedTier.toUpperCase()}
                        </span>
                      </div>
                    ))}
                    {filterParticipants().length === 0 && (
                      <p className="uk-text-center uk-text-muted">No eligible participants found</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Draw Section */}
            {selectedGiveaway && (
              <div className="uk-width-1-1@m">
                <div className="uk-card uk-card-default uk-card-body draw-card">
                  <h3 className="uk-card-title">
                    {giveawayConfig[selectedTier].find(g => g.id === selectedGiveaway)?.name} Draw
                  </h3>
                  
                  <div className="draw-wheel-container">
                    <div className={`draw-wheel ${isSpinning ? 'spinning' : ''}`}>
                      {isSpinning ? (
                        <div className="spinning-content">
                          <div className="spinner-icon">🎯</div>
                          <p>Drawing...</p>
                        </div>
                      ) : winner ? (
                        <div className="winner-content">
                          <div className="winner-icon">{winner.giveaway?.icon}</div>
                          <h4>{winner.customerName}</h4>
                          <p>{winner.Region} - {winner.AREA}</p>
                          <p>Entries: {winner.drawEntries}</p>
                          <span className={`tier-badge tier-${selectedTier}`}>
                            {selectedTier.toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <div className="ready-content">
                          <div className="ready-icon">{giveawayConfig[selectedTier].find(g => g.id === selectedGiveaway)?.icon}</div>
                          <p>Ready to Draw</p>
                          {/* <small>{filterParticipants().length} eligible participants</small> */}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="draw-controls">
                    <button 
                      className="uk-button uk-button-primary uk-button-large draw-btn"
                      onClick={startLuckyDraw}
                      disabled={isSpinning}
                    >
                      {isSpinning ? 'Drawing...' : 'Start Lucky Draw'}
                    </button>
                    
                    {winner && (
                      <button 
                        className="uk-button uk-button-secondary reset-btn"
                        onClick={resetDraw}
                      >
                        Reset Draw
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            

            {/* Draw History */}
            <div className="uk-width-1-1">
              <div className="uk-card uk-card-default uk-card-body history-card">
                <div className="uk-flex uk-flex-between uk-flex-middle">
                  <h3 className="uk-card-title">Draw History</h3>
                  {drawHistory.length > 0 && (
                    <button 
                      className="uk-button uk-button-danger uk-button-small"
                      onClick={clearHistory}
                    >
                      Clear History
                    </button>
                  )}
                </div>
                
                {drawHistory.length === 0 ? (
                  <p className="uk-text-center uk-text-muted">No draws conducted yet</p>
                ) : (
                  <div className="uk-overflow-auto">
                    <table className="uk-table uk-table-small uk-table-divider uk-table-hover">
                      <thead>
                        <tr>
                          <th>Date & Time</th>
                          <th>Winner</th>
                          <th>Giveaway</th>
                          <th>Tier</th>
                          <th>Region</th>
                          <th>Participants</th>
                        </tr>
                      </thead>
                      <tbody>
                        {drawHistory.map((entry) => (
                          <tr key={entry.id}>
                            <td>{entry.date}</td>
                            <td>{entry.winner.customerName}</td>
                            <td>{entry.giveaway?.icon} {entry.giveaway?.name}</td>
                            <td>
                              <span className={`tier-badge tier-${entry.tier}`}>
                                {entry?.tier?.toUpperCase()}
                              </span>
                            </td>
                            <td>{entry.winner.Region} - {entry.winner.ZONE}</td>
                            <td>{entry.totalParticipants}</td>
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
